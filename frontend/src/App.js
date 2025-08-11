import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { 
  TrendingUp, 
  Shield, 
  Brain, 
  Target, 
  Activity,
  PieChart,
  BarChart3,
  Zap,
  ArrowUpRight,
  DollarSign,
  Globe,
  Lock
} from 'lucide-react';
import axios from 'axios';
import './App.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [portfolioMetrics, setPortfolioMetrics] = useState([]);
  const [assetAllocation, setAssetAllocation] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [mlInsights, setMlInsights] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        metricsRes,
        allocationRes,
        historicalRes,
        insightsRes,
        riskRes,
        predictionsRes,
        summaryRes
      ] = await Promise.all([
        axios.get(`${API}/portfolio/metrics`),
        axios.get(`${API}/portfolio/allocation`),
        axios.get(`${API}/historical/AAPL?days=30`),
        axios.get(`${API}/ml/insights`),
        axios.get(`${API}/ml/risk-analysis`),
        axios.get(`${API}/ml/predictions`),
        axios.get(`${API}/dashboard/summary`)
      ]);

      setPortfolioMetrics(metricsRes.data);
      setAssetAllocation(allocationRes.data);
      setHistoricalData(historicalRes.data);
      setMlInsights(insightsRes.data);
      setRiskAnalysis(riskRes.data);
      setPredictions(predictionsRes.data);
      setDashboardSummary(summaryRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Chart configurations
  const lineChartData = {
    labels: historicalData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Portfolio Performance',
        data: historicalData.map(item => item.close),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: assetAllocation.map(item => item.asset_type),
    datasets: [
      {
        data: assetAllocation.map(item => item.percentage),
        backgroundColor: assetAllocation.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };

  const barChartData = {
    labels: portfolioMetrics.map(item => item.portfolio_name),
    datasets: [
      {
        label: 'ROI (%)',
        data: portfolioMetrics.map(item => item.roi),
        backgroundColor: 'rgba(20, 184, 166, 0.8)',
        borderColor: '#14b8a6',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          padding: 20,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-teal-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-6">
                Cappy AI Landing Page
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Landing page showcasing a sophisticated fintech platform featuring sleek navy and teal 
                visuals with interactive data visualizations that showcase its ML-powered equity portfolio 
                optimization technology through elegant animations
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg transition-shadow"
                >
                  <span>Start Optimizing</span>
                  <ArrowUpRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-teal-500 px-8 py-3 rounded-lg font-semibold hover:bg-teal-500/10 transition-colors"
                >
                  View Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Summary */}
      {dashboardSummary && (
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-xl border border-blue-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Portfolio</p>
                    <p className="text-2xl font-bold text-blue-400">
                      ${dashboardSummary.total_portfolio_value?.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-teal-900/30 to-teal-800/30 p-6 rounded-xl border border-teal-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Daily P&L</p>
                    <p className={`text-2xl font-bold ${dashboardSummary.daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${dashboardSummary.daily_pnl?.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">YTD Return</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {dashboardSummary.ytd_return}%
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-400" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-900/30 to-green-800/30 p-6 rounded-xl border border-green-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Positions</p>
                    <p className="text-2xl font-bold text-green-400">
                      {dashboardSummary.active_positions}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-green-400" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Data Visualizations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Interactive Data Visualizations</h2>
            <p className="text-gray-300 text-lg">Real-time insights powered by advanced ML algorithms</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Line Chart - Historical Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-teal-400" />
                Historical Performance
              </h3>
              <Line data={lineChartData} options={chartOptions} />
            </motion.div>

            {/* Pie Chart - Asset Allocation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-400" />
                Asset Allocation
              </h3>
              <Pie data={pieChartData} options={pieOptions} />
            </motion.div>
          </div>

          {/* Bar Chart - Portfolio Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-12"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
              Portfolio Performance Comparison
            </h3>
            <Bar data={barChartData} options={chartOptions} />
          </motion.div>
        </div>
      </section>

      {/* ML Features Showcase */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">ML-Powered Features</h2>
            <p className="text-gray-300 text-lg">Advanced artificial intelligence driving portfolio optimization</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Risk Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-red-900/20 to-orange-900/20 p-6 rounded-xl border border-red-500/20"
            >
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-xl font-semibold">Risk Analysis</h3>
              </div>
              {riskAnalysis && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Risk Score:</span>
                    <span className="text-red-400 font-semibold">{riskAnalysis.risk_score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Risk Level:</span>
                    <span className="text-red-400 font-semibold">{riskAnalysis.risk_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Beta:</span>
                    <span className="text-red-400 font-semibold">{riskAnalysis.beta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">VaR (95%):</span>
                    <span className="text-red-400 font-semibold">{riskAnalysis.var_95}%</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Prediction Models */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-500/20"
            >
              <div className="flex items-center mb-4">
                <Brain className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-xl font-semibold">AI Predictions</h3>
              </div>
              <div className="space-y-3">
                {predictions.slice(0, 3).map((pred, index) => (
                  <div key={index} className="bg-slate-800/30 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-400 font-semibold">{pred.symbol}</span>
                      <span className="text-gray-300">${pred.current_price}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      7D: ${pred.predicted_price_7d} ({Math.round(pred.confidence_7d * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Optimization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-900/20 to-teal-900/20 p-6 rounded-xl border border-green-500/20"
            >
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-xl font-semibold">Optimization</h3>
              </div>
              <div className="space-y-3">
                {mlInsights.map((insight, index) => (
                  <div key={index} className="bg-slate-800/30 p-3 rounded-lg">
                    <div className="text-sm font-semibold text-green-400 mb-1">
                      {insight.title}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">
                      {insight.description}
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Confidence:</span>
                      <span className="text-green-400">{Math.round(insight.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Key Financial Metrics</h2>
            <p className="text-gray-300 text-lg">Essential KPIs for portfolio performance tracking</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-4 text-teal-400">{metric.portfolio_name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI:</span>
                    <span className={`font-semibold ${metric.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metric.roi}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sharpe Ratio:</span>
                    <span className="text-blue-400 font-semibold">{metric.sharpe_ratio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volatility:</span>
                    <span className="text-purple-400 font-semibold">{metric.volatility}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Value:</span>
                    <span className="text-gray-300 font-semibold">
                      ${Math.round(metric.total_value).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
              Cappy AI
            </h3>
            <p className="text-gray-400 mb-6">
              Sophisticated fintech platform powered by ML-driven portfolio optimization
            </p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Zap className="w-4 h-4" />
                <span>Real-time Data</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Brain className="w-4 h-4" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;