import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaRocket, FaUser, FaEnvelope, FaLock, FaMapMarkerAlt, FaCheck } from "react-icons/fa";

export default function Signup() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Store user info in Firestore users collection
            const { setDoc, doc } = await import("firebase/firestore");
            const { db } = await import("../firebase-init");
            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                location
            });
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-200 flex items-center justify-center border border-gray-300">
                        <FaRocket className="text-blue-600 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">Create your account</h1>
                    <p className="text-gray-500">Start your creative journey today</p>
                </div>

                {/* Signup Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-3">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Location (optional)"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 pr-10 w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                            <p className="text-gray-700 text-sm font-medium mb-1">Password Requirements:</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    At least 6 characters
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    Mix of letters and numbers
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{" "}
                            <Link 
                                to="/login" 
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-xs">
                        By creating an account, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
