import { useEffect, useState } from "react";
import UserBlogs from "./UserBlogs";
import LikedBlogs from "./LikedBlogs";
import { FaUserFriends, FaUserPlus, FaPen, FaBlog, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../firebase-init";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useLocation } from "react-router-dom";

export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [blogCount, setBlogCount] = useState(0);
    const [editing, setEditing] = useState(false);
    const [profilePic, setProfilePic] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [profileUid, setProfileUid] = useState(null);
    const auth = getAuth();
    const user = auth.currentUser;
    const locationHook = useLocation();

    // Determine which profile to show (self or another user)
    useEffect(() => {
        // If a query param like ?uid=... is present, show that user's profile
        const params = new URLSearchParams(locationHook.search);
        const uid = params.get("uid") || (user && user.uid);
        setProfileUid(uid);
    }, [locationHook, user]);

    useEffect(() => {
        async function fetchProfile() {
            if (profileUid) {
                const userDoc = await getDoc(doc(db, "users", profileUid));
                if (userDoc.exists()) {
                    setUserInfo(userDoc.data());
                    setProfilePic(userDoc.data().profilePic || "");
                    setBio(userDoc.data().bio || "");
                    setLocation(userDoc.data().location || "");
                    // Check if current user is following this profile
                    if (user && user.uid !== profileUid) {
                        setIsFollowing(userDoc.data().followers?.includes(user.uid));
                    }
                }
                const q = query(collection(db, "blogs"), where("authorId", "==", profileUid));
                const blogsSnap = await getDocs(q);
                setBlogCount(blogsSnap.size);
            }
        }
        fetchProfile();
    }, [profileUid, user]);

    const handleFollow = async () => {
        if (!user || !profileUid || user.uid === profileUid) return;
        await updateDoc(doc(db, "users", profileUid), {
            followers: arrayUnion(user.uid)
        });
        await updateDoc(doc(db, "users", user.uid), {
            following: arrayUnion(profileUid)
        });
        setIsFollowing(true);
        setUserInfo((info) => ({ ...info, followers: [...(info.followers || []), user.uid] }));
    };

    const handleUnfollow = async () => {
        if (!user || !profileUid || user.uid === profileUid) return;
        await updateDoc(doc(db, "users", profileUid), {
            followers: arrayRemove(user.uid)
        });
        await updateDoc(doc(db, "users", user.uid), {
            following: arrayRemove(profileUid)
        });
        setIsFollowing(false);
        setUserInfo((info) => ({ ...info, followers: (info.followers || []).filter(f => f !== user.uid) }));
    };

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await (await import("firebase/firestore")).updateDoc(doc(db, "users", user.uid), {
                profilePic,
                bio,
                location
            });
            setUserInfo({ ...userInfo, profilePic, bio, location });
            setEditing(false);
        } catch (err) {
            setError("Failed to update profile. Try again.");
        }
    };

    if (!user) {
        return <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-xl shadow-sm text-center border border-gray-200">Please log in to view your profile.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto my-10 p-0 bg-transparent flex flex-col gap-8">
            {userInfo && !editing && (
                <section className="bg-white border border-neutral-100 rounded-xl shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start px-8 py-8 relative">
                    {/* Edit Profile Icon Button (top right) */}
                    {user && profileUid === user.uid && (
                        <button
                            onClick={handleEdit}
                            className="absolute top-4 right-4 p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition shadow-none"
                            title="Edit Profile"
                            style={{ zIndex: 1 }}
                        >
                            <FaEdit className="w-4 h-4" />
                        </button>
                    )}
                    {/* Left: Profile Picture & Upload */}
                    <div className="flex flex-col items-center min-w-[120px]">
                        <div className="w-24 h-24 rounded-full border-2 border-blue-300 shadow-sm flex items-center justify-center bg-white mb-2">
                            <img
                                src={userInfo.profilePic || "https://ui-avatars.com/api/?name=" + encodeURIComponent(userInfo.name || "User") + "&background=ff9800&color=fff&size=128"}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        </div>
                        {/* Upload profile picture option (only for own profile) */}
                        {user && profileUid === user.uid && (
                            <>
                                <label htmlFor="profilePicUpload" className="cursor-pointer px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition mb-1">Upload Photo</label>
                                <input
                                    id="profilePicUpload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
                                                const storage = getStorage();
                                                const storageRef = ref(storage, `profilePics/${user.uid}`);
                                                await uploadBytes(storageRef, file);
                                                const url = await getDownloadURL(storageRef);
                                                setProfilePic(url);
                                                await (await import("firebase/firestore")).updateDoc(doc(db, "users", user.uid), { profilePic: url });
                                                setUserInfo({ ...userInfo, profilePic: url });
                                            } catch (err) {
                                                setError("Failed to upload profile picture.");
                                            }
                                        }
                                    }}
                                />
                            </>
                        )}
                    </div>
                    {/* Right: Profile Info */}
                    <div className="flex-1 flex flex-col gap-2 justify-center">
                        <p className="text-2xl font-bold text-neutral-800 flex items-center gap-2"><FaUserPlus className="text-blue-600" /> {userInfo.name}</p>
                        {userInfo.bio && <p className="text-neutral-600 mt-1 flex items-center gap-2"><FaPen className="text-blue-400" /> {userInfo.bio}</p>}
                        {userInfo.location && <p className="text-neutral-500 mt-1 flex items-center gap-2"><FaMapMarkerAlt className="text-blue-400" /> {userInfo.location}</p>}
                        <div className="flex gap-8 mt-4">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-base flex items-center gap-1"><FaUserFriends className="text-blue-600" /> {userInfo.followers ? userInfo.followers.length : 0}</span>
                                <span className="text-neutral-400 text-xs">Followers</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-base flex items-center gap-1"><FaUserPlus className="text-blue-400" /> {userInfo.following ? userInfo.following.length : 0}</span>
                                <span className="text-neutral-400 text-xs">Following</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-base flex items-center gap-1"><FaBlog className="text-blue-600" /> {blogCount}</span>
                                <span className="text-neutral-400 text-xs">Blogs</span>
                            </div>
                        </div>
                        {/* Follow/Unfollow button, only if not viewing own profile */}
                        {user && profileUid && user.uid !== profileUid && (
                            isFollowing ? (
                                <button onClick={handleUnfollow} className="mt-4 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 font-semibold hover:bg-neutral-200 transition shadow">Unfollow</button>
                            ) : (
                                <button onClick={handleFollow} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow">Follow</button>
                            )
                        )}
                    </div>
                </section>
            )}
            {editing && (
                <form onSubmit={handleSave} className="flex flex-col gap-4 w-full max-w-xs mx-auto mt-4">
                    <input
                        type="url"
                        placeholder="Profile Picture URL"
                        value={profilePic}
                        onChange={e => setProfilePic(e.target.value)}
                        className="py-2 px-3 rounded-lg border border-gray-300 text-base focus:border-blue-400 transition bg-gray-50 shadow-sm"
                    />
                    <textarea
                        placeholder="Bio"
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        className="py-2 px-3 rounded-lg border border-gray-300 text-base focus:border-blue-400 transition bg-gray-50 shadow-sm"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="py-2 px-3 rounded-lg border border-gray-300 text-base focus:border-blue-400 transition bg-gray-50 shadow-sm"
                    />
                    <div className="flex gap-3">
                        <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition">Save</button>
                        <button type="button" onClick={handleCancel} className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold shadow hover:bg-gray-300 transition">Cancel</button>
                    </div>
                    {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
                </form>
            )}
            {/* User's Blogs Section */}
            <section className="bg-white border border-neutral-100 rounded-xl shadow-sm px-8 py-6 mt-2">
                <h2 className="text-lg font-semibold text-neutral-800 mb-3">Blogs by {userInfo?.name || "User"}</h2>
                <UserBlogs authorId={profileUid} />
            </section>
            {/* Liked Posts Section */}
            <section className="bg-white border border-blue-100 rounded-xl shadow-sm px-8 py-6 mt-2">
                <h2 className="text-lg font-semibold text-blue-700 mb-3">Liked Posts</h2>
                <LikedBlogs userId={profileUid} />
            </section>
        </div>
    );
}
