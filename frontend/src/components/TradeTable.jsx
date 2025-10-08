/**
 * Table component for displaying trade history
 * @param {Array} trades - Array of trade objects
 * @param {Function} onEdit - Callback when edit button is clicked
 * @param {Function} onDelete - Callback when delete button is clicked
 * @param {boolean} compact - Whether to show compact view (fewer columns)
 */
function TradeTable({ trades, onEdit, onDelete, compact = false }) {
    if (trades.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No trades yet</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                        <th className="pb-3 font-semibold">Symbol</th>
                        <th className="pb-3 font-semibold">Entry Date</th>
                        {!compact && <th className="pb-3 font-semibold">Exit Date</th>}
                        {!compact && <th className="pb-3 font-semibold">Entry Price</th>}
                        {!compact && <th className="pb-3 font-semibold">Exit Price</th>}
                        {!compact && <th className="pb-3 font-semibold">Shares</th>}
                        <th className="pb-3 font-semibold">P&L</th>
                        {!compact && <th className="pb-3 font-semibold">P&L %</th>}
                        <th className="pb-3 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr key={trade.id} className="border-b border-gray-700 text-white hover:bg-gray-750 transition">
                            <td className="py-3 font-semibold">{trade.symbol}</td>
                            <td className="py-3 text-gray-300">{trade.entry_date}</td>
                            {!compact && (
                                <td className="py-3 text-gray-300">{trade.exit_date || '-'}</td>
                            )}
                            {!compact && (
                                <td className="py-3 text-gray-300">${trade.entry_price.toFixed(2)}</td>
                            )}
                            {!compact && (
                                <td className="py-3 text-gray-300">
                                    {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '-'}
                                </td>
                            )}
                            {!compact && (
                                <td className="py-3 text-gray-300">{trade.shares.toFixed(2)}</td>
                            )}
                            <td className={`py-3 font-bold ${trade.profit_loss === null
                                    ? 'text-gray-500'
                                    : trade.profit_loss >= 0
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}>
                                {trade.profit_loss !== null ? `$${trade.profit_loss.toFixed(2)}` : '-'}
                            </td>
                            {!compact && (
                                <td className={`py-3 font-semibold ${trade.profit_loss_percent === null
                                        ? 'text-gray-500'
                                        : trade.profit_loss_percent >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }`}>
                                    {trade.profit_loss_percent !== null
                                        ? `${trade.profit_loss_percent.toFixed(2)}%`
                                        : '-'}
                                </td>
                            )}
                            <td className="py-3">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => onEdit(trade)}
                                        className="text-blue-400 hover:text-blue-300 font-semibold transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(trade.id)}
                                        className="text-red-400 hover:text-red-300 font-semibold transition"
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
    );
}

export default TradeTable;