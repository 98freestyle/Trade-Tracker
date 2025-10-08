import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrades, getCurrentUser, getDeposits } from '../services/api';
import Navbar from '../components/Navbar';

/**
 * Analytics page - Deep dive into trading performance
 * Displays charts, breakdowns, and advanced metrics
 */
function Analytics() {
    const [user, setUser] = useState(null);
    const [trades, setTrades] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    /**
     * Fetch all data from API
     */
    const loadData = async () => {
        try {
            const [userRes, tradesRes, depositsRes] = await Promise.all([
                getCurrentUser(),
                getTrades(),
                getDeposits()
            ]);
            setUser(userRes.data);
            setTrades(tradesRes.data);
            setDeposits(depositsRes.data);
        } catch (err) {
            console.error('Failed to load data:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate P&L breakdown by ticker symbol
     */
    const calculatePLByTicker = () => {
        const plByTicker = {};

        trades.forEach(trade => {
            if (trade.profit_loss !== null) {
                if (!plByTicker[trade.symbol]) {
                    plByTicker[trade.symbol] = {
                        symbol: trade.symbol,
                        totalPL: 0,
                        tradeCount: 0,
                        wins: 0,
                        losses: 0
                    };
                }

                plByTicker[trade.symbol].totalPL += trade.profit_loss;
                plByTicker[trade.symbol].tradeCount += 1;

                if (trade.profit_loss > 0) {
                    plByTicker[trade.symbol].wins += 1;
                } else {
                    plByTicker[trade.symbol].losses += 1;
                }
            }
        });

        return Object.values(plByTicker).sort((a, b) => b.totalPL - a.totalPL);
    };

    /**
     * Find best and worst trades
     */
    const getBestWorstTrades = () => {
        const closedTrades = trades.filter(t => t.profit_loss !== null);

        const sorted = [...closedTrades].sort((a, b) => b.profit_loss - a.profit_loss);

        return {
            best: sorted.slice(0, 5),
            worst: sorted.slice(-5).reverse()
        };
    };

    /**
     * Calculate average win/loss
     */
    const calculateAvgWinLoss = () => {
        const closedTrades = trades.filter(t => t.profit_loss !== null);
        const wins = closedTrades.filter(t => t.profit_loss > 0);
        const losses = closedTrades.filter(t => t.profit_loss < 0);

        const avgWin = wins.length > 0
            ? wins.reduce((sum, t) => sum + t.profit_loss, 0) / wins.length
            : 0;

        const avgLoss = losses.length > 0
            ? losses.reduce((sum, t) => sum + t.profit_loss, 0) / losses.length
            : 0;

        return { avgWin, avgLoss };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    const plByTicker = calculatePLByTicker();
    const { best, worst } = getBestWorstTrades();
    const { avgWin, avgLoss } = calculateAvgWinLoss();
    const closedTrades = trades.filter(t => t.profit_loss !== null);

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
                    <p className="text-gray-400">Deep dive into your trading performance</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Average Win</h3>
                        <p className="text-3xl font-bold text-green-500">
                            ${avgWin.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Average Loss</h3>
                        <p className="text-3xl font-bold text-red-500">
                            ${avgLoss.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Win/Loss Ratio</h3>
                        <p className="text-3xl font-bold text-white">
                            {avgLoss !== 0 ? Math.abs(avgWin / avgLoss).toFixed(2) : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* P&L by Ticker */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-6">P&L by Ticker</h3>

                    {plByTicker.length === 0 ? (
                        <p className="text-gray-400">No closed trades yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="pb-3 font-semibold">Symbol</th>
                                        <th className="pb-3 font-semibold">Total P&L</th>
                                        <th className="pb-3 font-semibold">Trades</th>
                                        <th className="pb-3 font-semibold">Wins</th>
                                        <th className="pb-3 font-semibold">Losses</th>
                                        <th className="pb-3 font-semibold">Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plByTicker.map((ticker) => {
                                        const winRate = (ticker.wins / ticker.tradeCount) * 100;
                                        return (
                                            <tr key={ticker.symbol} className="border-b border-gray-700 text-white hover:bg-gray-750 transition">
                                                <td className="py-3 font-semibold">{ticker.symbol}</td>
                                                <td className={`py-3 font-bold ${ticker.totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    ${ticker.totalPL.toFixed(2)}
                                                </td>
                                                <td className="py-3 text-gray-300">{ticker.tradeCount}</td>
                                                <td className="py-3 text-green-400">{ticker.wins}</td>
                                                <td className="py-3 text-red-400">{ticker.losses}</td>
                                                <td className="py-3 text-gray-300">{winRate.toFixed(1)}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Best Trades */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Best Trades</h3>

                    {best.length === 0 ? (
                        <p className="text-gray-400">No trades yet</p>
                    ) : (
                        <div className="space-y-4">
                            {best.map((trade, index) => (
                                <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                                        <div>
                                            <p className="font-semibold text-white">{trade.symbol}</p>
                                            <p className="text-sm text-gray-400">
                                                {trade.entry_date} → {trade.exit_date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-500">
                                            ${trade.profit_loss.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {trade.profit_loss_percent.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Worst Trades */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-white mb-6">Worst Trades</h3>

                    {worst.length === 0 ? (
                        <p className="text-gray-400">No trades yet</p>
                    ) : (
                        <div className="space-y-4">
                            {worst.map((trade, index) => (
                                <div key={trade.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                                        <div>
                                            <p className="font-semibold text-white">{trade.symbol}</p>
                                            <p className="text-sm text-gray-400">
                                                {trade.entry_date} → {trade.exit_date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-red-500">
                                            ${trade.profit_loss.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {trade.profit_loss_percent.toFixed(2)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analytics;