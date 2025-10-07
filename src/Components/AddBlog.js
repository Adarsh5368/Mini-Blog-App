import { useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-init";
import { useNavigate } from "react-router-dom";

export default function AddBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (user) {
            await addDoc(collection(db, "blogs"), {
                title,
                content,
                category,
                authorId: user.uid,
                createdAt: new Date(),
            });
            navigate("/my-blogs");
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-gray-200 flex items-center justify-center border border-gray-300">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Share Your Story
                </h1>
                <p className="text-gray-500 text-base max-w-2xl mx-auto">
                    Create something amazing and inspire others
                </p>
            </div>

            {/* Create Blog Form */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Title Field */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-base font-semibold text-gray-700">
                                Blog Title
                            </label>
                            <div className="relative">
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="What's your story about?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Content Field */}
                        <div className="space-y-2">
                            <label htmlFor="content" className="block text-base font-semibold text-gray-700">
                                Your Story
                            </label>
                            <textarea
                                id="content"
                                placeholder="Share your thoughts, experiences, and insights..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={8}
                                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50 resize-none"
                            ></textarea>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>Express yourself freely</span>
                                <span>{content.length} characters</span>
                            </div>
                        </div>

                        {/* Category Field */}
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-base font-semibold text-gray-700">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="category"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    required
                                    className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 bg-gray-50 appearance-none"
                                >
                                    <option value="">Choose a category</option>
                                    <option value="fashion">Fashion & Style</option>
                                    <option value="tech">Technology</option>
                                    <option value="travel">Travel & Adventure</option>
                                    <option value="food">Food & Cooking</option>
                                    <option value="photography">Photography</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="business">Business</option>
                                    <option value="education">Education</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-100">
                        <button 
                            type="submit" 
                            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Publish Your Story
                            </div>
                        </button>
                    </div>
                </form>

                {/* Tips */}
                <div className="mt-6 p-5 rounded-xl bg-gray-100 border border-gray-200">
                    <h3 className="text-base font-semibold text-blue-700 mb-2">💡 Writing Tips</h3>
                    <ul className="space-y-1 text-xs text-blue-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Start with a compelling title that captures attention</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Share personal experiences and insights</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>Use clear, engaging language that connects with readers</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
