import mysql.connector
import pandas as pd
import numpy as np
import json
import sys
import xgboost as xgb

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

    # Group by month
    df['month_year'] = df['date'].dt.to_period('M').astype(str)
    monthly_data = df.groupby('month_year')['amount'].sum().reset_index()
    monthly_data = monthly_data.sort_values('month_year').reset_index(drop=True)

    # Feature engineering
    monthly_data['month_index'] = range(len(monthly_data))
    monthly_data['year'] = pd.to_datetime(monthly_data['month_year']).dt.year
    monthly_data['month'] = pd.to_datetime(monthly_data['month_year']).dt.month

    # Prepare X and y
    X = monthly_data[['month_index', 'year', 'month']]
    y = monthly_data['amount']

    # Fit model
    model = xgb.XGBRegressor(n_estimators=500, learning_rate=0.05)
    model.fit(X, y)

    # Predict for next 6 months
    last_month_index = monthly_data['month_index'].iloc[-1]
    last_date = pd.to_datetime(monthly_data['month_year'].iloc[-1] + '-01')

    future_indices = [last_month_index + i + 1 for i in range(6)]
    future_dates = [(last_date + pd.DateOffset(months=i)).strftime('%Y-%m') for i in range(1, 7)]
    future_years = [(last_date + pd.DateOffset(months=i)).year for i in range(1, 7)]
    future_months = [(last_date + pd.DateOffset(months=i)).month for i in range(1, 7)]

    future_df = pd.DataFrame({
        'month_index': future_indices,
        'year': future_years,
        'month': future_months
    })

    future_preds = model.predict(future_df)
    future_preds = [round(float(val), 2) for val in future_preds]

    # Final output
    output = {
        "historical_months": monthly_data['month_year'].tolist(),
        "historical_amounts": monthly_data['amount'].tolist(),
        "predicted_months": future_dates,
        "predicted_amounts": future_preds
    }

    print(json.dumps(output))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: script.py <user_id> <category_id>"}))
        sys.exit(1)

    user_id = sys.argv[1]
    cid = sys.argv[2]
    generate_monthly_trend_data(user_id, cid)
