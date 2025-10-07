import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-init";

export default function ProfileSetup() {
    const [profilePic, setProfilePic] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        try {
            await updateDoc(doc(db, "users", user.uid), {
                profilePic,
                bio,
                dateJoined: Date.now(),
                followers: [],
                following: []
            });
            navigate("/profile");
        } catch (err) {
            setError("Failed to update profile. Try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-center mb-8 font-black text-3xl text-blue-700">Setup Your Profile</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                    type="url"
                    placeholder="Profile Picture URL"
                    value={profilePic}
                    onChange={e => setProfilePic(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 text-base"
                />
                <textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 text-base"
                />
                <button type="submit" className="py-3 rounded-lg bg-gradient-to-r from-orange-400 to-pink-600 text-white font-bold text-lg tracking-wide shadow hover:from-orange-500 hover:to-pink-700 transition">Save Profile</button>
                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
            </form>
        </div>
    );
}
