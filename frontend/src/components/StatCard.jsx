/**
 * Reusable stat card component for displaying metrics
 * @param {string} title - The metric label
 * @param {string|number} value - The metric value to display
 * @param {string} valueColor - Tailwind color class for the value (e.g., 'text-green-500')
 * @param {string} subtitle - Optional subtitle text
 */
function StatCard({ title, value, valueColor = 'text-white', subtitle }) {
    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
            <p className={`text-4xl font-bold ${valueColor}`}>
                {value}
            </p>
            {subtitle && (
                <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
            )}
        </div>
    );
}

export default StatCard;