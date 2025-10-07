import { useState, useEffect } from 'react';
import { createTrade, updateTrade } from '../services/api';

function TradeForm({ trade, onTradeAdded, onClose }) {
    const [formData, setFormData] = useState({
        symbol: '',
        entry_date: '',
        exit_date: '',
        entry_price: '',
        exit_price: '',
        shares: '',
        brokerage_fee: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (trade) {
            setFormData({
                symbol: trade.symbol || '',
                entry_date: trade.entry_date || '',
                exit_date: trade.exit_date || '',
                entry_price: trade.entry_price || '',
                exit_price: trade.exit_price || '',
                shares: trade.shares || '',
                brokerage_fee: trade.brokerage_fee || '',
                notes: trade.notes || ''
            });
        }
    }, [trade]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const tradeData = {
                symbol: formData.symbol,
                entry_date: formData.entry_date,
                exit_date: formData.exit_date || null,
                entry_price: parseFloat(formData.entry_price),
                exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
                shares: parseFloat(formData.shares),
                brokerage_fee: formData.brokerage_fee ? parseFloat(formData.brokerage_fee) : null,
                notes: formData.notes || null
            };

            if (trade) {
                await updateTrade(trade.id, tradeData);
            } else {
                await createTrade(tradeData);
            }

            onTradeAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || `Failed to ${trade ? 'update' : 'add'} trade`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {trade ? 'Edit Trade' : 'Add New Trade'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Symbol *</label>
                            <input
                                type="text"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                placeholder="AAPL"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Shares *</label>
                            <input
                                type="number"
                                name="shares"
                                value={formData.shares}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="10"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Entry Date *</label>
                            <input
                                type="date"
                                name="entry_date"
                                value={formData.entry_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Exit Date</label>
                            <input
                                type="date"
                                name="exit_date"
                                value={formData.exit_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Entry Price *</label>
                            <input
                                type="number"
                                name="entry_price"
                                value={formData.entry_price}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="150.00"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Exit Price</label>
                            <input
                                type="number"
                                name="exit_price"
                                value={formData.exit_price}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="155.00"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Brokerage Fee</label>
                            <input
                                type="number"
                                name="brokerage_fee"
                                value={formData.brokerage_fee}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="0.00"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-gray-300 mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Trade notes, lessons learned..."
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition disabled:opacity-50"
                        >
                            {loading ? (trade ? 'Updating...' : 'Adding...') : (trade ? 'Update Trade' : 'Add Trade')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TradeForm;