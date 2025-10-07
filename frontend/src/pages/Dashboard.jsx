import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrades, getCurrentUser, deleteTrade, getDeposits, deleteDeposit } from '../services/api';
import TradeForm from '../components/TradeForm';
import DepositForm from '../components/DepositForm';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [trades, setTrades] = useState([]);
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTradeForm, setShowTradeForm] = useState(false);
    const [showDepositForm, setShowDepositForm] = useState(false);
    const [editingTrade, setEditingTrade] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddTrade = () => {
        setEditingTrade(null);
        setShowTradeForm(true);
    };

    const handleEditTrade = (trade) => {
        setEditingTrade(trade);
        setShowTradeForm(true);
    };

    const handleDeleteTrade = async (tradeId) => {
        if (!confirm('Are you sure you want to delete this trade?')) return;

        try {
            await deleteTrade(tradeId);
            await loadData();
        } catch (err) {
            console.error('Failed to delete trade:', err);
            alert('Failed to delete trade');
        }
    };

    const handleDeleteDeposit = async (depositId) => {
        if (!confirm('Are you sure you want to delete this deposit?')) return;

        try {
            await deleteDeposit(depositId);
            await loadData();
        } catch (err) {
            console.error('Failed to delete deposit:', err);
            alert('Failed to delete deposit');
        }
    };

    const handleTradeFormClose = () => {
        setShowTradeForm(false);
        setEditingTrade(null);
    };

    const handleDataAdded = async () => {
        await loadData();
    };

    // Calculate stats
    const totalPL = trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);
    const accountValue = totalDeposited + totalPL;
    const roi = totalDeposited > 0 ? (totalPL / totalDeposited) * 100 : 0;

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
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDepositForm(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            + Add Deposit
                        </button>
                        <button
                            onClick={handleAddTrade}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            + Add Trade
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Total Deposited</h3>
                        <p className="text-4xl font-bold text-white">
                            ${totalDeposited.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Total P&L</h3>
                        <p className={`text-4xl font-bold ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${totalPL.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">Account Value</h3>
                        <p className="text-4xl font-bold text-blue-500">
                            ${accountValue.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-gray-400 text-sm mb-2">ROI</h3>
                        <p className={`text-4xl font-bold ${roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {roi.toFixed(2)}%
                        </p>
                    </div>
                </div>

                {/* Deposits Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Deposits</h3>

                    {deposits.length === 0 ? (
                        <p className="text-gray-400">No deposits yet. Add your first deposit!</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="pb-2">Date</th>
                                        <th className="pb-2">Amount (USD)</th>
                                        <th className="pb-2">Notes</th>
                                        <th className="pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.map((deposit) => (
                                        <tr key={deposit.id} className="border-b border-gray-700 text-white">
                                            <td className="py-3">{deposit.deposit_date}</td>
                                            <td className="py-3 font-semibold text-green-500">
                                                ${deposit.amount.toFixed(2)}
                                            </td>
                                            <td className="py-3 text-gray-400">{deposit.notes || '-'}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleDeleteDeposit(deposit.id)}
                                                    className="text-red-400 hover:text-red-300 font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Trades Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>

                    {trades.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg mb-4">No trades yet. Add your first trade!</p>
                            <button
                                onClick={handleAddTrade}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                + Add Trade
                            </button>
                        </div>
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
                                        <th className="pb-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="border-b border-gray-700 text-white">
                                            <td className="py-3 font-semibold">{trade.symbol}</td>
                                            <td className="py-3">{trade.entry_date}</td>
                                            <td className="py-3">{trade.exit_date || '-'}</td>
                                            <td className="py-3">${trade.entry_price}</td>
                                            <td className="py-3">${trade.exit_price || '-'}</td>
                                            <td className="py-3">{trade.shares}</td>
                                            <td className={`py-3 font-bold ${trade.profit_loss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                ${trade.profit_loss?.toFixed(2) || '-'}
                                            </td>
                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditTrade(trade)}
                                                        className="text-blue-400 hover:text-blue-300 font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTrade(trade.id)}
                                                        className="text-red-400 hover:text-red-300 font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showTradeForm && (
                <TradeForm
                    trade={editingTrade}
                    onTradeAdded={handleDataAdded}
                    onClose={handleTradeFormClose}
                />
            )}

            {showDepositForm && (
                <DepositForm
                    onDepositAdded={handleDataAdded}
                    onClose={() => setShowDepositForm(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;