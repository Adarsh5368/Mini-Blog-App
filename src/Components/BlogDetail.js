import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase-init";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchBlog() {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      }
    }
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(collection(db, "blogs", id, "comments"), (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [id]);

  if (!blog) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <button
        className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        onClick={() => navigate("/")}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Feed
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-6">{blog.content}</p>
      <h2 className="text-lg font-semibold text-blue-700 mb-2">Comments</h2>
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map(c => (
            <div key={c.id} className="bg-gray-50 rounded p-2">
              <span className="font-semibold text-blue-600 text-sm">{c.authorName}</span>
              <span className="ml-2 text-gray-700 text-sm">{c.text}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
