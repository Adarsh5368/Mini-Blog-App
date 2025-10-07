import { useState } from "react";
import { FaSearch, FaTimes, FaHashtag } from "react-icons/fa";

export default function SearchSidebar({ selectedCategory, setSelectedCategory }) {
  const [search, setSearch] = useState("");
  const categories = [
    { label: "Fashion & Style", value: "fashion", icon: "👗" },
    { label: "Technology", value: "tech", icon: "💻" },
    { label: "Travel & Adventure", value: "travel", icon: "✈️" },
    { label: "Food & Cooking", value: "food", icon: "🍳" },
    { label: "Photography", value: "photography", icon: "📸" },
    { label: "Lifestyle", value: "lifestyle", icon: "🌟" },
    { label: "Business", value: "business", icon: "💼" },
    { label: "Education", value: "education", icon: "📚" },
  ];

  return (
  <div className="h-full flex flex-col bg-white border border-neutral-100 rounded-xl p-6 min-w-[220px] shadow-none">
      {/* Search Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
          <FaSearch className="text-blue-500" />
          Discover Content
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for stories..."
            value={selectedCategory ? categories.find(c => c.value === selectedCategory)?.label || "" : search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full py-2 px-3 border border-neutral-200 rounded focus:outline-none focus:border-blue-400 text-neutral-800 bg-white pr-10 ${selectedCategory ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}`}
            readOnly={!!selectedCategory}
          />
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <FaSearch className="text-neutral-300" />
          </span>
          {selectedCategory && (
            <button
              className="absolute right-10 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-blue-500 transition-colors"
              onClick={() => setSelectedCategory("")}
              aria-label="Clear category"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-500 mb-2 flex items-center gap-2 uppercase tracking-wide">
          <FaHashtag className="text-blue-500" />
          Categories
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat, index) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`p-3 rounded border text-neutral-700 text-xs font-normal flex flex-col items-center gap-1 transition-colors duration-100 ${
                selectedCategory === cat.value 
                  ? 'bg-blue-50 border-blue-400 text-blue-700' 
                  : 'bg-white border-neutral-200 hover:border-blue-200 hover:bg-neutral-50'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="text-lg mb-0.5">{cat.icon}</span>
              <span className="leading-tight text-center">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
