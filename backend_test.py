import requests
import sys
from datetime import datetime
import json

class CappyAIAPITester:
    def __init__(self, base_url="https://0ebd2d5e-9456-49b2-81af-10cfbb3c7a1f.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, expected_fields=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            
            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Try to parse JSON response
                try:
                    json_data = response.json()
                    print(f"   Response Type: {type(json_data)}")
                    
                    if isinstance(json_data, list):
                        print(f"   Array Length: {len(json_data)}")
                        if len(json_data) > 0:
                            print(f"   First Item Keys: {list(json_data[0].keys()) if isinstance(json_data[0], dict) else 'Not a dict'}")
                    elif isinstance(json_data, dict):
                        print(f"   Response Keys: {list(json_data.keys())}")
                    
                    # Check for expected fields if provided
                    if expected_fields:
                        if isinstance(json_data, list) and len(json_data) > 0:
                            missing_fields = [field for field in expected_fields if field not in json_data[0]]
                        elif isinstance(json_data, dict):
                            missing_fields = [field for field in expected_fields if field not in json_data]
                        else:
                            missing_fields = expected_fields
                            
                        if missing_fields:
                            print(f"⚠️  Missing expected fields: {missing_fields}")
                        else:
                            print(f"✅ All expected fields present: {expected_fields}")
                    
                    return True, json_data
                    
                except json.JSONDecodeError:
                    print(f"⚠️  Response is not valid JSON")
                    print(f"   Raw Response: {response.text[:200]}...")
                    return True, response.text
                    
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200,
            expected_fields=["message"]
        )

    def test_portfolio_metrics(self):
        """Test portfolio metrics endpoint"""
        return self.run_test(
            "Portfolio Metrics",
            "GET", 
            "portfolio/metrics",
            200,
            expected_fields=["portfolio_name", "total_value", "roi", "sharpe_ratio", "volatility"]
        )

    def test_asset_allocation(self):
        """Test asset allocation endpoint"""
        return self.run_test(
            "Asset Allocation",
            "GET",
            "portfolio/allocation", 
            200,
            expected_fields=["asset_type", "percentage", "value", "color"]
        )

    def test_historical_data(self):
        """Test historical data endpoint"""
        return self.run_test(
            "Historical Data (AAPL)",
            "GET",
            "historical/AAPL?days=30",
            200,
            expected_fields=["date", "open", "high", "low", "close", "volume"]
        )

    def test_ml_insights(self):
        """Test ML insights endpoint"""
        return self.run_test(
            "ML Insights",
            "GET",
            "ml/insights",
            200,
            expected_fields=["insight_type", "title", "description", "confidence", "recommendation"]
        )

    def test_risk_analysis(self):
        """Test risk analysis endpoint"""
        return self.run_test(
            "Risk Analysis",
            "GET",
            "ml/risk-analysis",
            200,
            expected_fields=["risk_score", "risk_level", "var_95", "beta", "correlation_sp500"]
        )

    def test_predictions(self):
        """Test predictions endpoint"""
        return self.run_test(
            "ML Predictions",
            "GET",
            "ml/predictions",
            200,
            expected_fields=["symbol", "current_price", "predicted_price_1d", "predicted_price_7d", "predicted_price_30d"]
        )

    def test_dashboard_summary(self):
        """Test dashboard summary endpoint"""
        return self.run_test(
            "Dashboard Summary",
            "GET",
            "dashboard/summary",
            200,
            expected_fields=["total_portfolio_value", "daily_pnl", "daily_pnl_percent", "ytd_return", "active_positions"]
        )

def main():
    print("🚀 Starting Cappy AI Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = CappyAIAPITester()
    
    # Run all tests
    test_results = []
    
    test_results.append(tester.test_root_endpoint())
    test_results.append(tester.test_portfolio_metrics())
    test_results.append(tester.test_asset_allocation())
    test_results.append(tester.test_historical_data())
    test_results.append(tester.test_ml_insights())
    test_results.append(tester.test_risk_analysis())
    test_results.append(tester.test_predictions())
    test_results.append(tester.test_dashboard_summary())

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend API tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())