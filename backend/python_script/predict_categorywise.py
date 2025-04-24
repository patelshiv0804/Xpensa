import mysql.connector
import pandas as pd
import numpy as np
import json
import sys
import xgboost as xgb
from sklearn.metrics import mean_squared_error

def generate_monthly_trend_data(user_id, cid):
    # 1. Generate sample data for training (5 years: Jan 2020 - Dec 2023)
    np.random.seed(42)
    date_range = pd.date_range(start='2020-01-01', end='2023-12-01', freq='MS')
    amounts = np.random.normal(loc=2500, scale=300, size=len(date_range)).round(2)
    train_df = pd.DataFrame({'date': date_range, 'amount': amounts})
    train_df.set_index('date', inplace=True)
    
    # 2. Feature creation for training data
    train_df = create_features(train_df)
    
    # 3. Fetch real data from MySQL for testing
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
    
    # If no MySQL data, use generated test data but only for model training
    if not rows:
        print(json.dumps({"error": "No data found for this user and category"}))
        sys.exit(0)
    
    # Process real MySQL data
    test_df = pd.DataFrame(rows)
    test_df['date'] = pd.to_datetime(test_df['date'], errors='coerce')
    test_df = test_df.dropna(subset=['date'])
    test_df['amount'] = pd.to_numeric(test_df['amount'], errors='coerce')
    test_df = test_df.dropna(subset=['amount'])
    
    # Group MySQL data by month to get monthly totals
    test_df['month_year'] = test_df['date'].dt.strftime('%Y-%m')
    monthly_data = test_df.groupby('month_year')['amount'].sum().reset_index()
    monthly_data = monthly_data.sort_values('month_year')
    
    # Create a proper datetime index for feature creation
    mysql_df = pd.DataFrame()
    mysql_df['amount'] = monthly_data.set_index('month_year')['amount']
    mysql_df.index = pd.to_datetime(mysql_df.index + '-01')
    mysql_df = create_features(mysql_df)
    
    # 4. Train XGBoost model on generated data
    FEATURES = ['month', 'year', 'dayofyear', 'quarter']
    TARGET = 'amount'
    
    X_train = train_df[FEATURES]
    y_train = train_df[TARGET]
    
    # Train the model
    reg = xgb.XGBRegressor(n_estimators=500, learning_rate=0.05)
    reg.fit(X_train, y_train)
    
    # 5. Generate predictions for the next 6 months
    if not mysql_df.empty:
        last_date = mysql_df.index.max()
    else:
        last_date = pd.to_datetime('today')
    
    future_dates = [(last_date + pd.DateOffset(months=i+1)) for i in range(6)]
    future_months = [date.strftime('%Y-%m') for date in future_dates]
    
    # Create features for future dates
    future_df = pd.DataFrame(index=future_dates)
    future_df = create_features(future_df)
    
    # Make predictions
    future_features = future_df[FEATURES]
    future_preds = reg.predict(future_features)
    future_preds = [round(float(val), 2) for val in future_preds]
    
    # 6. Prepare output (only MySQL data + predictions)
    output = {
        "historical_months": monthly_data['month_year'].tolist(),
        "historical_amounts": monthly_data['amount'].tolist(),
        "predicted_months": future_months,
        "predicted_amounts": future_preds
    }
    
    return output

def create_features(df):
    df = df.copy()
    df['month'] = df.index.month
    df['year'] = df.index.year 
    df['dayofyear'] = df.index.dayofyear
    df['quarter'] = df.index.quarter
    return df

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: script.py <user_id> <category_id>"}))
        sys.exit(1)
    
    user_id = sys.argv[1]
    cid = sys.argv[2]
    result = generate_monthly_trend_data(user_id, cid)
    print(json.dumps(result))