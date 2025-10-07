import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase-init";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function UserBlogs({ authorId }) {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        if (!authorId) return;
        const q = query(collection(db, "blogs"), where("authorId", "==", authorId));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [authorId]);

    if (!authorId) return null;
    if (blogs.length === 0) return <p className="text-gray-500">No blogs yet.</p>;

    return (
        <div className="flex flex-col gap-6">
            {blogs.map(blog => (
                <div key={blog.id} className="p-6 rounded-xl shadow bg-white flex flex-col gap-2">
                    <h3 className="font-black text-xl text-orange-600">{blog.title}</h3>
                    <p className="text-gray-700">{blog.content.length > 200 ? blog.content.slice(0, 200) + "..." : blog.content}</p>
                    <span className="text-sm text-pink-500 font-semibold">Category: {blog.category}</span>
                    <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline text-sm font-semibold">Read Full Blog</Link>
                </div>
            ))}
        </div>
    );
}