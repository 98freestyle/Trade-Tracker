import { NavLink, useNavigate } from 'react-router-dom';

/**
 * Main navigation bar component
 * Displays app branding, navigation links, and user actions
 */
function Navbar({ user }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/analytics', label: 'Analytics' },
    ];

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Branding */}
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-white">Trade Tracker</h1>

                        {/* Navigation Links */}
                        <div className="hidden md:flex gap-6">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `font-semibold transition ${isActive
                                            ? 'text-blue-500'
                                            : 'text-gray-400 hover:text-gray-300'
                                        }`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 hidden sm:block">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex gap-4 mt-4">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `font-semibold transition ${isActive
                                    ? 'text-blue-500'
                                    : 'text-gray-400 hover:text-gray-300'
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;