import { useState } from 'react';
import { createDeposit } from '../services/api';

function DepositForm({ onDepositAdded, onClose }) {
    const [formData, setFormData] = useState({
        amount: '',
        deposit_date: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const depositData = {
                amount: parseFloat(formData.amount),
                deposit_date: formData.deposit_date,
                notes: formData.notes || null
            };

            await createDeposit(depositData);
            onDepositAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to add deposit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Deposit</h2>
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">Amount (USD) *</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                step="0.01"
                                placeholder="1000.00"
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Date *</label>
                            <input
                                type="date"
                                name="deposit_date"
                                value={formData.deposit_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Initial deposit, added funds, etc..."
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
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
                            {loading ? 'Adding...' : 'Add Deposit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepositForm;