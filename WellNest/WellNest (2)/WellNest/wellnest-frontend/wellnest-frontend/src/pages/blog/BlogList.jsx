import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../api/blogService';
import BlogCard from './BlogCard';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [page, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await blogService.getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let response;
            if (searchQuery) {
                response = await blogService.searchPosts(searchQuery, page);
            } else {
                response = await blogService.getAllPosts(page);
            }
            setPosts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPosts();
    };

    return (
        <div className="main-container animate-slide-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">WELLNEST <span className="text-primary">BLOG</span></h1>
                    <p className="text-[#aaa]">Insights, tips, and stories from our community.</p>
                </div>
                <Link to="/blog/create" className="join-btn-fill">
                    CREATE POST
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {/* Filters and Search */}
                <div className="md:col-span-1">
                    <div className="card glass-card mb-6">
                        <h3 className="font-bold mb-4 uppercase tracking-wide">Search</h3>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="card glass-card">
                        <h3 className="font-bold mb-4 uppercase tracking-wide">Categories</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === '' ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Post Grid */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 4].map((n) => (
                                <div key={n} className="card glass-card h-80 animate-pulse bg-white/5"></div>
                            ))}
                        </div>
                    ) : posts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {posts.map((post) => (
                                    <BlogCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 gap-4">
                                    <button
                                        disabled={page === 0}
                                        onClick={() => setPage(page - 1)}
                                        className="join-btn-outline disabled:opacity-50"
                                    >
                                        PREVIOUS
                                    </button>
                                    <span className="flex items-center font-bold">
                                        PAGE {page + 1} OF {totalPages}
                                    </span>
                                    <button
                                        disabled={page === totalPages - 1}
                                        onClick={() => setPage(page + 1)}
                                        className="join-btn-outline disabled:opacity-50"
                                    >
                                        NEXT
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 card glass-card">
                            <h2 className="text-2xl font-bold mb-2">No blogs found.</h2>
                            <p className="text-[#aaa]">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
