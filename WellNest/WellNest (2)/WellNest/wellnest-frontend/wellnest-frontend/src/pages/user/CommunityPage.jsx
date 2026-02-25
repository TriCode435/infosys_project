import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, MessageSquare, ChevronRight, User,
    Heart, Search, Filter, Plus, X, MoreHorizontal, Send, Flag
} from 'lucide-react';
import { getTrainerSuggestions, getBlogPosts, assignTrainer, getProfile } from '../../api/userApi';
import blogService from '../../api/blogService';

const CommunityPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');
    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("All");
    const [currentUser, setCurrentUser] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [postToReport, setPostToReport] = useState(null);
    const [reportReason, setReportReason] = useState("");

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const profileRes = await getProfile();
                setCurrentUser(profileRes.data);
                const goal = profileRes.data?.fitnessGoal || '';
                const [trainerRes, blogRes] = await Promise.all([
                    getTrainerSuggestions(goal),
                    blogService.getAllPosts(0, 20)
                ]);

                const postsData = blogRes.data.content || [];
                const initialLikes = {};
                postsData.forEach(p => { initialLikes[p.id] = p.isLikedByCurrentUser; });

                setLikedPosts(initialLikes);
                setTrainers(trainerRes.data || []);
                setPosts(postsData);
            } catch (err) {
                console.error("Failed to fetch community data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const toggleLike = async (id) => {
        try {
            await blogService.toggleLike(id);
            setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === id) {
                    const currentlyLiked = likedPosts[id];
                    return { ...p, likeCount: currentlyLiked ? p.likeCount - 1 : p.likeCount + 1 };
                }
                return p;
            }));
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await blogService.addComment(selectedPost.id, commentText);
            setCommentText("");
            // Refresh comments logic could go here
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handlePublishPost = async (e) => {
        e.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim()) return;
        setIsSubmitting(true);
        try {
            await blogService.createPost({
                title: newPost.title,
                content: newPost.content,
                imageUrls: newPost.imageUrl ? [newPost.imageUrl] : []
            });
            alert("Your post has been submitted and is pending admin approval.");
            setIsPublishModalOpen(false);
            setNewPost({ title: '', content: '', imageUrl: '' });
        } catch (err) {
            console.error("Failed to publish post", err);
            alert("Failed to publish post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportPost = async (e) => {
        e.preventDefault();
        if (!reportReason.trim() || !postToReport) return;
        try {
            await blogService.reportPost(postToReport.id, reportReason);
            alert("Post reported successfully. Our admin team will review it.");
            setReportModalOpen(false);
            setPostToReport(null);
            setReportReason("");
        } catch (err) {
            console.error("Failed to report post", err);
            alert("Failed to submit report. Please try again.");
        }
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());

        if (filterBy === "Trainers") return matchesSearch && post.authorRole === "TRAINER";
        if (filterBy === "Users") return matchesSearch && post.authorRole === "USER";
        if (filterBy === "My Posts" && currentUser) return matchesSearch && post.authorName === currentUser.username;
        return matchesSearch;
    });

    if (loading) return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', padding: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ height: '400px', background: '#f1f5f9', borderRadius: '16px', animate: 'pulse 1.5s infinite' }} />
            ))}
        </div>
    );

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>

            {/* --- TOP SECTION --- */}
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: '#0f172a' }}>
                        Community
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPublishModalOpen(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#14b8a6', color: 'white', border: 'none',
                            padding: '10px 20px', borderRadius: '12px', fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)'
                        }}
                    >
                        <Plus size={18} /> Publish Post
                    </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search discussions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px',
                                border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px',
                                transition: '0.2s', background: '#f8fafc'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                            style={{
                                padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                background: '#f8fafc', fontSize: '14px', color: '#64748b',
                                outline: 'none', cursor: 'pointer', appearance: 'none',
                                minWidth: '120px'
                            }}
                        >
                            <option>All</option>
                            <option>My Posts</option>
                            <option>Trainers</option>
                            <option>Users</option>
                            <option>Recent</option>
                        </select>
                        <Filter size={14} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#94a3b8' }} />
                    </div>
                </div>
            </header>

            {/* --- FEED --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {filteredPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                        <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>No posts yet</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Be the first one to share something with the community!</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'white', borderRadius: '16px', overflow: 'hidden',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9'
                            }}
                        >
                            {/* Card Header */}
                            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {post.authorProfileImage ? (
                                            <img src={post.authorProfileImage} alt={post.authorName} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                                        ) : (
                                            <User size={20} color="#94a3b8" />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{post.authorName || 'Guest'}</span>
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                                                borderRadius: '20px', background: post.authorRole === 'TRAINER' ? '#f0fdf4' : '#eff6ff',
                                                color: post.authorRole === 'TRAINER' ? '#166534' : '#1e40af',
                                                textTransform: 'uppercase'
                                            }}>
                                                {post.authorRole || 'User'}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setPostToReport(post); setReportModalOpen(true); }}
                                    style={{ border: 'none', background: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, transition: '0.2s' }}
                                >
                                    <Flag size={14} /> Report
                                </button>
                            </div>

                            {/* Card Media (if available) */}
                            {(post.imageUrls && post.imageUrls.length > 0) && (
                                <div style={{ width: '100%', maxHeight: '500px', background: '#f8fafc', overflow: 'hidden' }}>
                                    <img src={post.imageUrls[0]} alt="post" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                            )}

                            {/* Card Content */}
                            <div style={{ padding: '1rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{post.title}</h3>
                                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                                    {post.content?.length > 150 ? (
                                        <>
                                            {post.content.substring(0, 150)}...
                                            <button style={{ border: 'none', background: 'none', color: '#14b8a6', fontWeight: 600, padding: '0 4px', cursor: 'pointer' }}>Read more</button>
                                        </>
                                    ) : post.content}
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div style={{ padding: '0.5rem 1rem 1rem 1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid #f8fafc' }}>
                                <button
                                    onClick={() => toggleLike(post.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', border: 'none',
                                        background: 'transparent', cursor: 'pointer', color: likedPosts[post.id] ? '#f43f5e' : '#64748b',
                                        transition: '0.2s'
                                    }}
                                >
                                    <Heart size={20} fill={likedPosts[post.id] ? '#f43f5e' : 'none'} />
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{post.likeCount || 0}</span>
                                </button>
                                <button
                                    onClick={() => setSelectedPost(post)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', border: 'none',
                                        background: 'transparent', cursor: 'pointer', color: '#64748b'
                                    }}
                                >
                                    <MessageSquare size={20} />
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{post.commentCount || 0}</span>
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* --- COMMENT MODAL --- */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', padding: '1rem'
                        }}
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                background: 'white', width: '100%', maxWidth: '600px',
                                borderRadius: '24px', overflow: 'hidden', display: 'flex',
                                flexDirection: 'column', maxHeight: '90vh'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Comments</span>
                                <button onClick={() => setSelectedPost(null)} style={{ border: 'none', background: '#f1f5f9', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Post Preview (Mini) */}
                            <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#14b8a6' }}>@{selectedPost.authorName}</div>
                                    <div style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{selectedPost.title}</div>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {selectedPost.comments?.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem 0' }}>
                                        No comments yet. Start the conversation!
                                    </div>
                                ) : (
                                    selectedPost.comments?.map((comment, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <User size={16} color="#94a3b8" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{comment.authorName || 'User'}</div>
                                                <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>{comment.content}</div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{new Date(comment.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Comment Input */}
                            <form
                                onSubmit={handleComment}
                                style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}
                            >
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    style={{
                                        flex: 1, padding: '12px 16px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        background: '#14b8a6', color: 'white', border: 'none',
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: '0.2s'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- PUBLISH POST MODAL --- */}
            <AnimatePresence>
                {isPublishModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', padding: '1rem'
                        }}
                        onClick={() => setIsPublishModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: 'white', width: '100%', maxWidth: '500px',
                                borderRadius: '24px', overflow: 'hidden', padding: '2rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Create Post</h2>
                            <form onSubmit={handlePublishPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="text"
                                    placeholder="Post Title"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    required
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc'
                                    }}
                                />
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                    required
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
                                        minHeight: '150px', resize: 'vertical'
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL (optional)"
                                    value={newPost.imageUrl}
                                    onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsPublishModalOpen(false)}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '12px',
                                            border: 'none', background: '#f1f5f9', fontWeight: 700,
                                            cursor: 'pointer', color: '#64748b'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '12px',
                                            border: 'none', background: '#14b8a6', color: 'white',
                                            fontWeight: 700, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1,
                                            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.2)'
                                        }}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Share Post'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- REPORT POST MODAL --- */}
            <AnimatePresence>
                {reportModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', padding: '1rem'
                        }}
                        onClick={() => setReportModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            style={{
                                background: 'white', width: '100%', maxWidth: '400px',
                                borderRadius: '24px', overflow: 'hidden', padding: '2rem',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', color: '#ef4444' }}>
                                <Flag size={24} />
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Report Post</h2>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                                Please let us know why you are reporting this post. Our admin team will review it immediately.
                            </p>
                            <form onSubmit={handleReportPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <textarea
                                    placeholder="Reason for reporting..."
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    required
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px',
                                        border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
                                        minHeight: '100px', resize: 'vertical'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setReportModalOpen(false)}
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '12px',
                                            border: 'none', background: '#f1f5f9', fontWeight: 700,
                                            cursor: 'pointer', color: '#64748b'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1, padding: '12px', borderRadius: '12px',
                                            border: 'none', background: '#ef4444', color: 'white',
                                            fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                                        }}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: .5; }
                    }
                `}
            </style>
        </div>
    );
};

export default CommunityPage;
