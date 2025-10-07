import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-init";

export default function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "blogs"), where("authorId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const userBlogs = [];
                querySnapshot.forEach((doc) => {
                    userBlogs.push({ id: doc.id, ...doc.data() });
                });
                setBlogs(userBlogs);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "blogs", id));
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-6 rounded-xl shadow-sm bg-white border border-gray-200">
            {blogs.length > 0 ? (
                <div className="flex flex-col gap-6 items-center">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="w-full rounded-lg shadow-sm p-5 bg-gray-50 border border-gray-200">
                            <div className="flex flex-row items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-800 tracking-tight">{blog.title}</h3>
                                <button
                                    onClick={() => handleDelete(blog.id)}
                                    className="p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center justify-center"
                                    title="Delete Blog"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                            <hr className="mb-3 border-gray-200" />
                            <p className="text-base text-gray-700 leading-relaxed mb-1">{blog.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">You haven't written any blogs yet.</p>
            )}
        </div>
    );
}
