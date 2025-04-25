# import mysql.connector
# import pandas as pd
# import numpy as np
# import json
# import sys
# from sklearn.linear_model import LinearRegression

# def generate_trend_data(user_id):
  
#     try:
#         connection = mysql.connector.connect(
#             host='localhost',        
#             user='root',  
#             password='',
#             database='xpensa', 
#             port=3307,
#         )
#         cursor = connection.cursor(dictionary=True)
#         query = "SELECT amount, date FROM expense_record WHERE user_id = %s"
#         cursor.execute(query, (user_id,))
#         rows = cursor.fetchall()
#     except mysql.connector.Error as err:
#         print(json.dumps({"error": str(err)}))
#         sys.exit(1)
#     finally:
#         if cursor:
#             cursor.close()
#         if connection:
#             connection.close()
            
#     if not rows:
#         print(json.dumps({"error": "No data found"}))
#         sys.exit(0)
        
#     df = pd.DataFrame(rows)
#     df['date'] = pd.to_datetime(df['date'], errors='coerce')
#     df = df.dropna(subset=['date'])
#     df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
#     df = df.dropna(subset=['amount'])
    
#     df['timestamp'] = df['date'].astype(np.int64) // 10**9  
#     X = df['timestamp'].values.reshape(-1, 1)
#     y = df['amount'].values
#     model = LinearRegression()
#     model.fit(X, y)
    
#     #Predict next 6 months (approximately 180 days)
#     last_timestamp = df['timestamp'].max()
    
#     #Create future timestamps for 6 months (using 30 days as approximate month length)
#     future_timestamps = []
#     for month in range(6):
#         #Add approximately 30 days per month (2,592,000 seconds = 30 days)
#         future_timestamps.append(last_timestamp + (2592000 * (month + 1)))
    
#     future_timestamps = np.array(future_timestamps)
#     future_amounts = model.predict(future_timestamps.reshape(-1, 1))
#     future_dates = pd.to_datetime(future_timestamps, unit='s').strftime('%Y-%m-%d').tolist()
#     future_amounts = [round(amount, 2) for amount in future_amounts]  # Round amounts
    
#     #Final output
#     output = {
#         "dates": df['date'].dt.strftime('%Y-%m-%d').tolist(),
#         "amounts": df['amount'].tolist(),
#         "predicted_dates": future_dates,
#         "predicted_amounts": future_amounts
#     }
    
#     # Print as JSON
#     print(json.dumps(output))

# if __name__ == "__main__":
#     if len(sys.argv) != 2:
#         print(json.dumps({"error": "Usage: script.py <user_id>"}))
#         sys.exit(1)
    
#     user_id = sys.argv[1]
#     generate_trend_data(user_id)

import mysql.connector
import pandas as pd
import numpy as np
import json
import sys
import xgboost as xgb
from sklearn.metrics import mean_squared_error

def generate_monthly_trend_data(user_id):
    connection = None
    cursor = None
    # 1. Fetch real data from MySQL
    try:
        connection = mysql.connector.connect(
            host='mysql-3d445f85-patelshiv0804-8aa7.j.aivencloud.com',
            user='avnadmin',
            password='AVNS_AVfanxh_rb3NhsjWKZo',
            database='xpensa',
            port=24414,
        )
        cursor = connection.cursor(dictionary=True)
        query = "SELECT amount, date FROM expense_record WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()
    except mysql.connector.Error as err:
        print(json.dumps({"error": str(err)}))
        sys.exit(1)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    
    # Check if we got MySQL data
    if not rows:
        print(json.dumps({"error": "No data found for this user and category"}))
        sys.exit(0)
    
    # Process MySQL data
    mysql_df = pd.DataFrame(rows)
    mysql_df['date'] = pd.to_datetime(mysql_df['date'], errors='coerce')
    mysql_df = mysql_df.dropna(subset=['date'])
    mysql_df['amount'] = pd.to_numeric(mysql_df['amount'], errors='coerce')
    mysql_df = mysql_df.dropna(subset=['amount'])
    
    # Group by month to get monthly totals
    mysql_df['month_year'] = mysql_df['date'].dt.strftime('%Y-%m')
    monthly_data = mysql_df.groupby('month_year')['amount'].sum().reset_index()
    monthly_data = monthly_data.sort_values('month_year')
    
    # Create proper datetime index dataframe
    mysql_monthly_df = pd.DataFrame()
    mysql_monthly_df['amount'] = monthly_data.set_index('month_year')['amount']
    mysql_monthly_df.index = pd.to_datetime(mysql_monthly_df.index + '-01')
    
    # 2. Generate random data to augment MySQL data (fill gaps in history)
    # Get min and max dates from MySQL data
    min_date = mysql_monthly_df.index.min()
    
    # Generate random data for historical periods (2020-01 until first MySQL record)
    start_date = pd.Timestamp('2020-01-01')
    if min_date > start_date:
        # Create date range from 2020-01 to one month before first MySQL record
        random_dates = pd.date_range(start=start_date, end=min_date - pd.DateOffset(months=1), freq='MS')
        random_amounts = np.random.normal(loc=mysql_monthly_df['amount'].mean(), 
                                         scale=mysql_monthly_df['amount'].std() if len(mysql_monthly_df) > 1 else 300, 
                                         size=len(random_dates)).round(2)
        random_df = pd.DataFrame({'date': random_dates, 'amount': random_amounts})
        random_df.set_index('date', inplace=True)
        
        # Combine random and MySQL data
        combined_df = pd.concat([random_df, mysql_monthly_df])
    else:
        combined_df = mysql_monthly_df.copy()
    
    # Sort by date
    combined_df = combined_df.sort_index()
    
    # Add features
    combined_df = create_features(combined_df)
    
    # 3. Train/Test Split (use 2024-01-01 as cutoff)
    train = combined_df.loc[combined_df.index < '2024-01-01']
    test = combined_df.loc[combined_df.index >= '2024-01-01']
    
    # If test set is empty (no 2024 data), we'll use the last 20% of data as test
    if len(test) == 0:
        split_idx = int(len(combined_df) * 0.8)
        train = combined_df.iloc[:split_idx]
        test = combined_df.iloc[split_idx:]
    
    # 4. Train XGBoost model
    FEATURES = ['month', 'year', 'dayofyear', 'quarter']
    TARGET = 'amount'
    
    X_train = train[FEATURES]
    y_train = train[TARGET]
    X_test = test[FEATURES]
    y_test = test[TARGET]
    
    # Train the model
    reg = xgb.XGBRegressor(n_estimators=500, early_stopping_rounds=50, learning_rate=0.05)
    reg.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    
    # 5. Generate predictions for the next 6 months
    last_date = combined_df.index.max()
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
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: script.py <user_id>"}))
        sys.exit(1)
    
    user_id = sys.argv[1]
    result = generate_monthly_trend_data(user_id)
    print(json.dumps(result))