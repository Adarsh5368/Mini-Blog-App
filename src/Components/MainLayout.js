import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import { useState } from "react";

export default function MainLayout({ user }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
  <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-xl">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 glass-card mx-4 mt-4 rounded-xl">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-2xl font-display text-white text-shadow">Blogify</h1>
        <div className="w-10"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <div 
            className="w-80 h-full glass-card animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-display text-white text-shadow">Blogify</h1>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Navbar user={user} vertical />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-80 min-h-screen bg-white border-r border-neutral-100 flex-col p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-1 tracking-tight">Blogify</h1>
          <p className="text-neutral-400 text-xs">Share your thoughts with the world</p>
        </div>
        <Navbar user={user} vertical />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto scrollbar-hide" style={{maxHeight: '100vh'}}>
          <div className="max-w-6xl mx-auto">
            <Outlet context={{ selectedCategory }} />
          </div>
        </div>
      </main>

      {/* Right Sidebar Search - Desktop Only */}
      <aside className="hidden xl:flex w-96 min-h-screen bg-white border-l border-neutral-100 flex-col p-8 pt-10 items-start">
        <SearchSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </aside>

      {/* Mobile Search - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-card rounded-t-3xl p-6 animate-fade-in-up">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        <SearchSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
}
