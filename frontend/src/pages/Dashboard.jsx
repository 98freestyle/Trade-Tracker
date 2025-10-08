import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrades, getCurrentUser, deleteTrade, getDeposits, deleteDeposit } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TradeTable from '../components/TradeTable';
import TradeForm from '../components/TradeForm';
import DepositForm from '../components/DepositForm';

/**
 * Dashboard page - Main hub for account overview
 * Displays key metrics, recent trades, and deposits
 */
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
     * Open trade form for adding new trade
     */
    const handleAddTrade = () => {
        setEditingTrade(null);
        setShowTradeForm(true);
    };

    /**
     * Open trade form for editing existing trade
     */
    const handleEditTrade = (trade) => {
        setEditingTrade(trade);
        setShowTradeForm(true);
    };

    /**
     * Delete a trade after confirmation
     */
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

    /**
     * Delete a deposit after confirmation
     */
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

    /**
     * Close trade form modal
     */
    const handleTradeFormClose = () => {
        setShowTradeForm(false);
        setEditingTrade(null);
    };

    /**
     * Reload data after adding/editing trade or deposit
     */
    const handleDataAdded = async () => {
        await loadData();
    };

    // Calculate metrics
    const totalPL = trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);
    const accountValue = totalDeposited + totalPL;
    const roi = totalDeposited > 0 ? (totalPL / totalDeposited) * 100 : 0;

    const closedTrades = trades.filter(t => t.profit_loss !== null);
    const winningTrades = closedTrades.filter(t => t.profit_loss > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar user={user} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                    <p className="text-gray-400">Overview of your trading performance</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Deposited"
                        value={`$${totalDeposited.toFixed(2)}`}
                        valueColor="text-white"
                    />
                    <StatCard
                        title="Total P&L"
                        value={`$${totalPL.toFixed(2)}`}
                        valueColor={totalPL >= 0 ? 'text-green-500' : 'text-red-500'}
                    />
                    <StatCard
                        title="Account Value"
                        value={`$${accountValue.toFixed(2)}`}
                        valueColor="text-blue-500"
                    />
                    <StatCard
                        title="ROI"
                        value={`${roi.toFixed(2)}%`}
                        valueColor={roi >= 0 ? 'text-green-500' : 'text-red-500'}
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Total Trades"
                        value={trades.length}
                        valueColor="text-white"
                    />
                    <StatCard
                        title="Win Rate"
                        value={`${winRate.toFixed(1)}%`}
                        valueColor="text-white"
                        subtitle={`${winningTrades.length} wins / ${closedTrades.length} closed`}
                    />
                    <StatCard
                        title="Open Positions"
                        value={trades.length - closedTrades.length}
                        valueColor="text-yellow-500"
                    />
                </div>

                {/* Trades Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">Trades</h3>
                        <button
                            onClick={handleAddTrade}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            + Add Trade
                        </button>
                    </div>

                    <TradeTable
                        trades={trades}
                        onEdit={handleEditTrade}
                        onDelete={handleDeleteTrade}
                    />
                </div>

                {/* Deposits Section */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">Deposits</h3>
                        <button
                            onClick={() => setShowDepositForm(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            + Add Deposit
                        </button>
                    </div>

                    {deposits.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No deposits yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-700">
                                        <th className="pb-3 font-semibold">Date</th>
                                        <th className="pb-3 font-semibold">Amount (USD)</th>
                                        <th className="pb-3 font-semibold">Notes</th>
                                        <th className="pb-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.map((deposit) => (
                                        <tr key={deposit.id} className="border-b border-gray-700 text-white hover:bg-gray-750 transition">
                                            <td className="py-3 text-gray-300">{deposit.deposit_date}</td>
                                            <td className="py-3 font-semibold text-green-500">
                                                ${deposit.amount.toFixed(2)}
                                            </td>
                                            <td className="py-3 text-gray-400">{deposit.notes || '-'}</td>
                                            <td className="py-3">
                                                <button
                                                    onClick={() => handleDeleteDeposit(deposit.id)}
                                                    className="text-red-400 hover:text-red-300 font-semibold transition"
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