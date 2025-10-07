import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-init";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function LikedBlogs({ userId }) {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, "blogs"), where("likedBy", "array-contains", userId));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [userId]);

    if (!userId) return null;
    if (blogs.length === 0) return <p className="text-neutral-400 text-sm">No liked posts yet.</p>;

    return (
        <div className="flex flex-col gap-6">
            {blogs.map(blog => (
                <div key={blog.id} className="p-6 rounded-xl shadow bg-white flex flex-col gap-2 border border-blue-50">
                    <h3 className="font-semibold text-base text-blue-700">{blog.title}</h3>
                    <p className="text-neutral-700">{blog.content.length > 200 ? blog.content.slice(0, 200) + "..." : blog.content}</p>
                    <span className="text-xs text-neutral-400">Category: {blog.category}</span>
                    <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline text-xs font-medium">Read Full Blog</Link>
                </div>
            ))}
        </div>
    );
}
