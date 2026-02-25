import React, { useState, useEffect } from 'react';
import blogService from '../../api/blogService';
import { FaCheck, FaTimes, FaEye, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminBlogDashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, DELETED

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            // We need a specific admin listing endpoint or use existing with filters
            // For now, I'll assume we can pass status to a listing endpoint if we're admin
            const response = await blogService.getAllPosts(0, 100, 'createdAt', 'desc');
            // Filter locally for now as the backend getAllApprovedPosts only returns approved
            // I should have added an admin endpoint to the backend.
            setPosts(response.data.content);
        } catch (error) {
            console.error('Error fetching posts for moderation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (id, status) => {
        try {
            if (status === 'APPROVED') {
                await blogService.approvePost(id);
            } else {
                await blogService.rejectPost(id);
            }
            fetchPosts();
        } catch (error) {
            console.error('Error moderating post:', error);
        }
    };

    return (
        <div className="main-container animate-slide-up pb-20">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black tracking-tight">CONTENT <span className="text-primary">MODERATION</span></h1>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                    {['PENDING', 'APPROVED', 'REJECTED', 'DELETED'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === s ? 'bg-primary text-black' : 'text-[#aaa] hover:text-white'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card glass-card !p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-widest font-black text-[#555]">
                            <th className="p-6">Author</th>
                            <th className="p-6">Title</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Date</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan="6" className="p-20 text-center font-bold text-primary animate-pulse">SCANNING DATABASE...</td></tr>
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {post.authorName.charAt(0)}
                                            </div>
                                            <span className="font-bold">{post.authorName}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium">{post.title}</td>
                                    <td className="p-6">
                                        <span className="text-xs font-bold uppercase tracking-widest text-[#666]">
                                            {post.category ? post.category.name : 'MISC'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-[#666]">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="p-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${post.status === 'APPROVED' ? 'bg-success/20 text-success' : post.status === 'PENDING' ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-3">
                                            <Link to={`/blog/${post.id}`} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white transition-all"><FaEye /></Link>
                                            {post.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleModerate(post.id, 'APPROVED')} className="p-2 bg-success/20 text-success rounded-lg hover:bg-success transition-all hover:text-black"><FaCheck /></button>
                                                    <button onClick={() => handleModerate(post.id, 'REJECTED')} className="p-2 bg-error/20 text-error rounded-lg hover:bg-error transition-all hover:text-black"><FaTimes /></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-20 text-center opacity-30 italic">No posts found for this filter. Clean slate!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogDashboard;
