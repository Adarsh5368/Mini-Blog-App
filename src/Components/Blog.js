//Blogging App with Firebase
import { useState, useRef, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useOutletContext } from "react-router-dom";

//Import fireStore reference from frebaseInit file
import {db} from "../firebase-init";

//Import all the required functions from fireStore
import { collection, doc, getDocs, onSnapshot, setDoc, query, orderBy } from "firebase/firestore"; 

export default function Blog(){

    const [formData, setformData] = useState({title:"", content:""})
    const [blogs, setBlogs] =  useState([]);
    const [user, setUser] = useState(null);
    const [expanded, setExpanded] = useState([]); // track expanded blogs by index
    const [shareMsg, setShareMsg] = useState("");

    function handleShare(blog) {
        const url = window.location.origin + "/blog/" + blog.id;
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.content.slice(0, 100) + (blog.content.length > 100 ? "..." : ""),
                url
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(url);
            setShareMsg("Link copied!");
            setTimeout(() => setShareMsg(""), 1500);
        }
    }

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    // Removed titleRef and focus logic since input is not rendered

    useEffect(() => {
        
        /*********************************************************************** */
        /** get all the documents from the fireStore using getDocs() */ 
        /*********************************************************************** */
        // async function fetchData(){
        //     const snapShot =await getDocs(collection(db, "blogs"));
        //     console.log(snapShot);

        //     const blogs = snapShot.docs.map((doc) => {
        //         return{
        //             id: doc.id,
        //             ...doc.data()
        //         }
        //     })
        //     console.log(blogs);
        //     setBlogs(blogs);

        // }

        // fetchData();
        /*********************************************************************** */


        /*********************************************************************** */
        /** Get RealTime Updates from the databse using onSnapshot() */ 
        /*********************************************************************** */

    const blogsQuery = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(blogsQuery, async (snapShot) => {
            let blogs = snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            // For blogs with missing authorName, fetch from Firestore
            const blogsWithNames = await Promise.all(blogs.map(async (blog) => {
                if ((!blog.authorName || blog.authorName === "") && blog.authorId) {
                    const { getDoc, doc: docFn } = await import("firebase/firestore");
                    const { db } = await import("../firebase-init");
                    const userDoc = await getDoc(docFn(db, "users", blog.authorId));
                    if (userDoc.exists()) {
                        return { ...blog, authorName: userDoc.data().name || "Unknown" };
                    }
                }
                return blog;
            }));
            setBlogs(blogsWithNames);
        })

        /*********************************************************************** */
    },[]);

    // Removed handleSubmit and form for feed section

    async function removeBlog(i){
        const blogToDelete = blogs[i];
        if (blogToDelete && blogToDelete.id) {
            // Remove from Firestore
            try {
                await import("firebase/firestore").then(({ doc, deleteDoc }) =>
                    deleteDoc(doc(db, "blogs", blogToDelete.id))
                );
            } catch (error) {
                console.error("Error deleting blog from Firestore:", error);
            }
        }
    }

    async function handleLike(blogId, likedBy) {
        if (!user) return;
        const alreadyLiked = likedBy && likedBy.includes(user.uid);
        const newLikedBy = alreadyLiked
            ? likedBy.filter((id) => id !== user.uid)
            : [...(likedBy || []), user.uid];
        try {
            await import("firebase/firestore").then(({ doc, updateDoc }) =>
                updateDoc(doc(db, "blogs", blogId), { likedBy: newLikedBy })
            );
        } catch (error) {
            console.error("Error updating likes:", error);
        }
    }

    const { selectedCategory } = useOutletContext() || {};
    // Filter blogs by selectedCategory if set
    const filteredBlogs = selectedCategory
      ? blogs.filter(blog => blog.category === selectedCategory)
      : blogs;
    return (
        <div className="w-full max-w-3xl mx-auto h-full flex flex-col px-2 sm:px-0">
            {/* Header */}
            <div className="text-center mb-8 flex-shrink-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 mb-2 tracking-tight">
                    Feed
                </h1>
                <p className="text-neutral-500 text-base max-w-xl mx-auto">
                    Stories from our community
                </p>
            </div>

            {/* Blog Feed */}
            <div className="flex-1">
                {filteredBlogs.length > 0 ? (
                    <div className="flex flex-col gap-6 pb-8">
                        {filteredBlogs.map((blog, i) => {
                            const likedBy = blog.likedBy || [];
                            const isLiked = user && likedBy.includes(user.uid);
                            const showFull = expanded[i] || false;
                            const profilePic = blog.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.authorName || "User")}&background=ededed&color=222&size=128`;
                            const previewContent = blog.content.length > 200 && !showFull ? blog.content.slice(0, 200) + "..." : blog.content;
                            return (
                                <article 
                                    key={blog.id} 
                                    className="bg-white border border-neutral-100 rounded-lg p-6 flex flex-col md:flex-row gap-6 items-start shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Author Section */}
                                    <div className="flex flex-col items-center md:items-start md:w-36 flex-shrink-0">
                                        <img 
                                            src={profilePic} 
                                            alt="Profile" 
                                            className="w-14 h-14 rounded-lg object-cover border border-neutral-200" 
                                        />
                                        <Link 
                                            to={`/profile?uid=${blog.authorId}`} 
                                            className="text-blue-600 hover:underline font-medium text-center mt-2"
                                        >
                                            {blog.authorName || "Unknown"}
                                        </Link>
                                        <span className="text-xs text-neutral-400 mt-1">{blog.category || "General"}</span>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 w-full">
                                        <div className="mb-2">
                                            <h2 className="text-xl font-semibold text-neutral-800 mb-1 leading-tight">
                                              <Link to={`/blog/${blog.id}`} className="hover:underline text-inherit">
                                                {blog.title}
                                              </Link>
                                            </h2>
                                            <div className="flex items-center gap-3 text-xs text-neutral-400 mb-1">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {new Date(blog.createdAt?.toDate?.() || blog.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="max-w-none">
                                            <p className="text-neutral-700 leading-relaxed mb-3">
                                                {previewContent}
                                                {blog.content.length > 200 && !showFull && (
                                                    <button 
                                                        className="ml-2 text-blue-600 font-medium hover:underline" 
                                                        onClick={() => setExpanded(exp => { const arr = [...exp]; arr[i] = true; return arr; })}
                                                    >
                                                        Read More
                                                    </button>
                                                )}
                                                {showFull && (
                                                    <button 
                                                        className="ml-2 text-blue-600 font-medium hover:underline" 
                                                        onClick={() => setExpanded(exp => { const arr = [...exp]; arr[i] = false; return arr; })}
                                                    >
                                                        Show Less
                                                    </button>
                                                )}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-2">
                                            <button
                                                onClick={() => handleLike(blog.id, likedBy)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all duration-200 border ${
                                                    isLiked 
                                                        ? 'bg-blue-500 text-white border-blue-500' 
                                                        : 'bg-white text-blue-500 border-blue-100 hover:bg-blue-50'
                                                }`}
                                                aria-label="Like"
                                            >
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    fill={isLiked ? "#fff" : "none"} 
                                                    viewBox="0 0 24 24" 
                                                    stroke={isLiked ? "#fff" : "#2563eb"} 
                                                    className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current'}`}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                                </svg>
                                                <span>{likedBy.length} {likedBy.length === 1 ? 'Like' : 'Likes'}</span>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button 
                                                    className="p-2 rounded-md bg-neutral-100 hover:bg-neutral-200 transition-colors" 
                                                    title="Share"
                                                    onClick={() => handleShare(blog)}
                                                >
                                                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                    </svg>
                                                </button>
            {shareMsg && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded bg-blue-600 text-white text-sm shadow">
                    {shareMsg}
                </div>
            )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-700 mb-1">No Stories Yet</h3>
                        <p className="text-neutral-400 mb-6">Be the first to share your amazing story!</p>
                        <button className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors">Start Writing</button>
                    </div>
                )}
            </div>
        </div>
    )
    }

//Row component to introduce a new row section in the form
function Row(props){
    const { label } = props;
    return (
        <div className="flex flex-col gap-2 mb-4">
            <label className="font-semibold text-lg mb-1">{label}</label>
            {props.children}
        </div>
    )
}
