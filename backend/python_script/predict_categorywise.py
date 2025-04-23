import mysql.connector
import pandas as pd
import numpy as np
import json
import sys
from sklearn.linear_model import LinearRegression

def generate_monthly_trend_data(user_id, cid):
    try:
        connection = mysql.connector.connect(
            host='mysql-3d445f85-patelshiv0804-8aa7.j.aivencloud.com',
            user='avnadmin',
            password='AVNS_AVfanxh_rb3NhsjWKZo',
            database='xpensa',
            port=24414,
        )
        cursor = connection.cursor(dictionary=True)
        query = "SELECT amount, date FROM expense_record WHERE user_id = %s AND category_id = %s"
        cursor.execute(query, (user_id, cid))
        rows = cursor.fetchall()
    except mysql.connector.Error as err:
        print(json.dumps({"error": str(err)}))
        sys.exit(1)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

    if not rows:
        print(json.dumps({"error": "No data found"}))
        sys.exit(0)

    # Convert to DataFrame
    df = pd.DataFrame(rows)
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.dropna(subset=['date'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df = df.dropna(subset=['amount'])

    # Create month-year column for grouping
    df['month_year'] = df['date'].dt.strftime('%Y-%m')

    # Group by month and sum the expenses
    monthly_data = df.groupby('month_year')['amount'].sum().reset_index()

    # Sort by month-year to ensure chronological order
    monthly_data = monthly_data.sort_values('month_year')

    # Create numerical feature for modeling (months since the first month)
    monthly_data['month_index'] = range(len(monthly_data))

    # Train linear regression model
    X = monthly_data['month_index'].values.reshape(-1, 1)
    y = monthly_data['amount'].values
    model = LinearRegression()
    model.fit(X, y)

    # Predict next 6 months
    last_month_index = monthly_data['month_index'].max()
    future_indices = np.array([last_month_index + i + 1 for i in range(6)])
    future_amounts = model.predict(future_indices.reshape(-1, 1))

    # Generate future month-year labels
    last_date = pd.to_datetime(monthly_data['month_year'].iloc[-1] + '-01')
    future_dates = [
        (last_date + pd.DateOffset(months=i)).strftime('%Y-%m') for i in range(1, 7)
    ]

    # Round predicted amounts
    future_amounts = [round(amount, 2) for amount in future_amounts]

    # Prepare output
    output = {
        "historical_months": monthly_data['month_year'].tolist(),
        "historical_amounts": monthly_data['amount'].tolist(),
        "predicted_months": future_dates,
        "predicted_amounts": future_amounts
    }

    # Print as JSON
    print(json.dumps(output))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: script.py <user_id> <category_id>"}))
        sys.exit(1)

    user_id = sys.argv[1]
    cid = sys.argv[2]
    generate_monthly_trend_data(user_id, cid)
