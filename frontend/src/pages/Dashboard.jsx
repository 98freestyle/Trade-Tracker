import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrades, getCurrentUser } from '../services/api';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [userRes, tradesRes] = await Promise.all([
                getCurrentUser(),
                getTrades()
            ]);
            setUser(userRes.data);
            setTrades(tradesRes.data);
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Navbar */}
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Trade Tracker</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-white mb-8">Dashboard</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Total Trades</h3>
                        <p className="text-4xl font-bold text-white">{trades.length}</p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Total P&L</h3>
                        <p className="text-4xl font-bold text-green-500">
                            ${trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Win Rate</h3>
                        <p className="text-4xl font-bold text-blue-500">
                            {trades.length > 0
                                ? ((trades.filter(t => t.profit_loss > 0).length / trades.length) * 100).toFixed(1)
                                : 0
                            }%
                        </p>
                    </div>
                </div>

                {/* Recent Trades */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>

                    {trades.length === 0 ? (
                        <p className="text-gray-400">No trades yet. Add your first trade!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="pb-2">Symbol</th>
                                        <th className="pb-2">Entry Date</th>
                                        <th className="pb-2">Exit Date</th>
                                        <th className="pb-2">Entry Price</th>
                                        <th className="pb-2">Exit Price</th>
                                        <th className="pb-2">Shares</th>
                                        <th className="pb-2">P&L</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="border-b border-gray-700 text-white">
                                            <td className="py-3">{trade.symbol}</td>
                                            <td className="py-3">{trade.entry_date}</td>
                                            <td className="py-3">{trade.exit_date || '-'}</td>
                                            <td className="py-3">${trade.entry_price}</td>
                                            <td className="py-3">${trade.exit_price || '-'}</td>
                                            <td className="py-3">{trade.shares}</td>
                                            <td className={`py-3 font-bold ${trade.profit_loss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${trade.profit_loss?.toFixed(2) || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;