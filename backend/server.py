from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timedelta
import random
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Data Models
class StockData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: int
    market_cap: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class HistoricalPrice(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class PortfolioMetrics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    portfolio_name: str
    total_value: float
    roi: float  # Return on Investment
    sharpe_ratio: float
    volatility: float
    daily_return: float
    ytd_return: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AssetAllocation(BaseModel):
    asset_type: str
    percentage: float
    value: float
    color: str

class MLInsight(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    insight_type: str  # 'risk_analysis', 'prediction', 'optimization'
    title: str
    description: str
    confidence: float
    recommendation: str
    impact: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class RiskAnalysis(BaseModel):
    risk_score: float  # 0-100
    risk_level: str  # Low, Medium, High
    var_95: float  # Value at Risk 95%
    beta: float
    correlation_sp500: float

class PredictionModel(BaseModel):
    symbol: str
    current_price: float
    predicted_price_1d: float
    predicted_price_7d: float
    predicted_price_30d: float
    confidence_1d: float
    confidence_7d: float
    confidence_30d: float

# Utility functions for generating sample data
def generate_stock_data():
    stocks = [
        {"symbol": "AAPL", "name": "Apple Inc.", "base_price": 180},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "base_price": 140},
        {"symbol": "MSFT", "name": "Microsoft Corp.", "base_price": 400},
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "base_price": 150},
        {"symbol": "TSLA", "name": "Tesla Inc.", "base_price": 250},
        {"symbol": "NVDA", "name": "NVIDIA Corp.", "base_price": 800},
        {"symbol": "META", "name": "Meta Platforms Inc.", "base_price": 350},
        {"symbol": "NFLX", "name": "Netflix Inc.", "base_price": 500}
    ]
    
    stock_list = []
    for stock in stocks:
        change = random.uniform(-5, 5)
        change_percent = (change / stock["base_price"]) * 100
        current_price = stock["base_price"] + change
        
        stock_data = StockData(
            symbol=stock["symbol"],
            name=stock["name"],
            price=round(current_price, 2),
            change=round(change, 2),
            change_percent=round(change_percent, 2),
            volume=random.randint(1000000, 50000000),
            market_cap=round(current_price * random.randint(1000000000, 3000000000), 2)
        )
        stock_list.append(stock_data)
    
    return stock_list

def generate_historical_data(days=30):
    base_price = 100
    historical_data = []
    
    for i in range(days):
        date = (datetime.utcnow() - timedelta(days=days-i)).strftime("%Y-%m-%d")
        
        # Generate realistic OHLC data
        daily_change = random.uniform(-2, 2)
        open_price = base_price + daily_change
        high_price = open_price + random.uniform(0, 3)
        low_price = open_price - random.uniform(0, 3)
        close_price = open_price + random.uniform(-2, 2)
        
        historical_data.append(HistoricalPrice(
            date=date,
            open=round(open_price, 2),
            high=round(high_price, 2),
            low=round(low_price, 2),
            close=round(close_price, 2),
            volume=random.randint(1000000, 10000000)
        ))
        
        base_price = close_price
    
    return historical_data

def generate_portfolio_metrics():
    portfolios = ["Conservative", "Balanced", "Aggressive", "Tech Focus", "ESG Portfolio"]
    portfolio_data = []
    
    for portfolio in portfolios:
        roi = random.uniform(-5, 25)
        volatility = random.uniform(5, 30)
        sharpe_ratio = roi / volatility if volatility > 0 else 0
        
        metrics = PortfolioMetrics(
            portfolio_name=portfolio,
            total_value=random.uniform(100000, 1000000),
            roi=round(roi, 2),
            sharpe_ratio=round(sharpe_ratio, 2),
            volatility=round(volatility, 2),
            daily_return=round(random.uniform(-2, 2), 2),
            ytd_return=round(random.uniform(-10, 30), 2)
        )
        portfolio_data.append(metrics)
    
    return portfolio_data

def generate_asset_allocation():
    allocations = [
        {"asset_type": "Stocks", "percentage": 60, "color": "#0ea5e9"},
        {"asset_type": "Bonds", "percentage": 25, "color": "#14b8a6"},
        {"asset_type": "Real Estate", "percentage": 10, "color": "#8b5cf6"},
        {"asset_type": "Commodities", "percentage": 3, "color": "#f59e0b"},
        {"asset_type": "Cash", "percentage": 2, "color": "#ef4444"}
    ]
    
    total_value = 500000
    allocation_data = []
    
    for allocation in allocations:
        value = (allocation["percentage"] / 100) * total_value
        allocation_data.append(AssetAllocation(
            asset_type=allocation["asset_type"],
            percentage=allocation["percentage"],
            value=value,
            color=allocation["color"]
        ))
    
    return allocation_data

def generate_ml_insights():
    insights = [
        {
            "insight_type": "risk_analysis",
            "title": "Portfolio Risk Assessment",
            "description": "Current portfolio shows moderate risk with well-diversified assets",
            "confidence": 0.87,
            "recommendation": "Consider reducing tech sector exposure by 5%",
            "impact": "Medium"
        },
        {
            "insight_type": "prediction",
            "title": "Q2 Market Forecast",
            "description": "AI models predict 8-12% growth in tech sector over next quarter",
            "confidence": 0.73,
            "recommendation": "Increase allocation to semiconductor stocks",
            "impact": "High"
        },
        {
            "insight_type": "optimization",
            "title": "Portfolio Rebalancing",
            "description": "Optimal allocation suggests shifting 3% from bonds to equities",
            "confidence": 0.91,
            "recommendation": "Execute rebalancing within next 2 weeks",
            "impact": "Medium"
        }
    ]
    
    ml_insights = []
    for insight in insights:
        ml_insights.append(MLInsight(**insight))
    
    return ml_insights

def generate_risk_analysis():
    return RiskAnalysis(
        risk_score=round(random.uniform(20, 80), 1),
        risk_level=random.choice(["Low", "Medium", "High"]),
        var_95=round(random.uniform(-5, -15), 2),
        beta=round(random.uniform(0.5, 1.5), 2),
        correlation_sp500=round(random.uniform(0.3, 0.9), 2)
    )

def generate_predictions():
    stocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "NVDA"]
    predictions = []
    
    for symbol in stocks:
        current = random.uniform(100, 500)
        pred_1d = current * random.uniform(0.98, 1.02)
        pred_7d = current * random.uniform(0.95, 1.05)
        pred_30d = current * random.uniform(0.90, 1.10)
        
        predictions.append(PredictionModel(
            symbol=symbol,
            current_price=round(current, 2),
            predicted_price_1d=round(pred_1d, 2),
            predicted_price_7d=round(pred_7d, 2),
            predicted_price_30d=round(pred_30d, 2),
            confidence_1d=round(random.uniform(0.7, 0.95), 2),
            confidence_7d=round(random.uniform(0.6, 0.85), 2),
            confidence_30d=round(random.uniform(0.5, 0.75), 2)
        ))
    
    return predictions

# API Endpoints
@api_router.get("/")
async def root():
    return {"message": "Cappy AI Fintech Platform API"}

@api_router.get("/stocks", response_model=List[StockData])
async def get_stocks():
    return generate_stock_data()

@api_router.get("/historical/{symbol}")
async def get_historical_data(symbol: str, days: int = 30):
    return generate_historical_data(days)

@api_router.get("/portfolio/metrics", response_model=List[PortfolioMetrics])
async def get_portfolio_metrics():
    return generate_portfolio_metrics()

@api_router.get("/portfolio/allocation", response_model=List[AssetAllocation])
async def get_asset_allocation():
    return generate_asset_allocation()

@api_router.get("/ml/insights", response_model=List[MLInsight])
async def get_ml_insights():
    return generate_ml_insights()

@api_router.get("/ml/risk-analysis", response_model=RiskAnalysis)
async def get_risk_analysis():
    return generate_risk_analysis()

@api_router.get("/ml/predictions", response_model=List[PredictionModel])
async def get_predictions():
    return generate_predictions()

@api_router.get("/dashboard/summary")
async def get_dashboard_summary():
    return {
        "total_portfolio_value": round(random.uniform(800000, 1200000), 2),
        "daily_pnl": round(random.uniform(-5000, 15000), 2),
        "daily_pnl_percent": round(random.uniform(-1.5, 2.5), 2),
        "ytd_return": round(random.uniform(5, 25), 2),
        "active_positions": random.randint(15, 35),
        "cash_balance": round(random.uniform(50000, 150000), 2),
        "margin_used": round(random.uniform(0, 30), 1)
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()