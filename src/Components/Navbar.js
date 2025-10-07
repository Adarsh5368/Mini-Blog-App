import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaHome, FaPlus, FaListAlt, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaRocket, FaHeart } from "react-icons/fa";

export default function Navbar({ user, vertical }) {
    const navItems = user ? [
        { to: "/", icon: FaHome, label: "Feed", color: "text-cyan-400" },
        { to: "/add-blog", icon: FaPlus, label: "Create", color: "text-emerald-400" },
        { to: "/my-blogs", icon: FaListAlt, label: "My Posts", color: "text-violet-400" },
        { to: "/profile", icon: FaUser, label: "Profile", color: "text-rose-400" }
    ] : [
        { to: "/login", icon: FaSignInAlt, label: "Login", color: "text-cyan-400" },
        { to: "/signup", icon: FaUserPlus, label: "Sign Up", color: "text-emerald-400" }
    ];
    const auth = getAuth();

    const handleLogout = () => {
        signOut(auth);
        localStorage.removeItem("jwt");
        localStorage.removeItem("jwt_expiry");
    };

    return (
        <nav className={vertical ? "flex flex-col gap-6 w-full bg-white px-0 py-0" : "flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100"}>
            {vertical && (
                <div className="mb-4 px-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center border border-blue-100">
                            <FaRocket className="text-blue-600 text-base" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-neutral-800">Welcome!</h3>
                            <p className="text-xs text-neutral-400">Ready to create?</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full">
                {vertical && (
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-4 text-neutral-400">
                        Navigation
                    </h3>
                )}
                <ul className={vertical ? "flex flex-col gap-1 list-none m-0 p-0" : "flex gap-4 list-none m-0 p-0 items-center"}>
                    {navItems.map((item, index) => (
                        <li key={item.to} className="w-full">
                            <Link 
                                to={item.to} 
                                className="flex items-center gap-2 px-4 py-2 rounded transition-colors text-neutral-700 font-medium hover:bg-blue-50"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <item.icon className={`text-base transition-all duration-300 text-blue-500`} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                    {user && (
                        <li className="w-full mt-3">
                            <button 
                                onClick={handleLogout} 
                                className="flex items-center gap-2 px-4 py-2 rounded bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors w-full"
                            >
                                <FaSignOutAlt className="text-base" />
                                <span>Logout</span>
                            </button>
                        </li>
                    )}
                </ul>
                {vertical && user && (
                    <div className="mt-6 p-3 rounded bg-blue-50 border border-blue-100 mx-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-100">
                                <FaHeart className="text-blue-600 text-xs" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-blue-700">Pro Tip</p>
                                <p className="text-xs text-neutral-500">Share your thoughts and connect with others!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
