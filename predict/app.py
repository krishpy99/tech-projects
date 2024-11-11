from flask import Flask, render_template
import yfinance as yf
import pandas as pd

app = Flask(__name__)

def get_trending_stocks():
    # Get list of S&P 500 stocks
    sp500 = pd.read_html('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies')[0]
    symbols = sp500['Symbol'].tolist()

    # Get stock data
    data = yf.download(symbols, period="1d")
    
    # Sort by volume and get top 10
    if isinstance(data.index, pd.MultiIndex):
        volume_data = data['Volume'].iloc[-1]  # Get the most recent day's data
    else:
        volume_data = data['Volume']
    
    top_10 = volume_data.head(10)
    
    trending_stocks = []
    for symbol in top_10.index:
        stock = yf.Ticker(symbol)
        info = stock.info
        trending_stocks.append({
            'symbol': symbol,
            'name': info.get('longName', 'N/A'),
            'price': info.get('currentPrice', 'N/A'),
            'volume': int(top_10[symbol])  # Use the volume from our sorted data
        })
    
    return trending_stocks

@app.route('/')
def home():
    stocks = get_trending_stocks()
    return render_template('index.html', stocks=stocks)

if __name__ == '__main__':
    app.run(debug=True, port=8000)