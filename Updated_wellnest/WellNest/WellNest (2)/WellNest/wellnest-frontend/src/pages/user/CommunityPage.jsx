import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, BookOpen, MessageSquare, ChevronRight, User, 
    Award, Star, Search, Heart, Share2, Bookmark, 
    Zap, Sparkles, ShieldCheck, Plus, X 
} from 'lucide-react';
import { 
    getTrainerSuggestions, 
    getBlogPosts, 
    assignTrainer, 
    getProfile, 
    likeBlogPost, 
    addBlogComment, 
    createBlogPost 
} from '../../api/userApi';

const CommunityPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('blog'); 
    const [likedPosts, setLikedPosts] = useState({});
    
    // New States for Create Post Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const profileRes = await getProfile();
            const goal = profileRes.data?.fitnessGoal || '';
            const [trainerRes, blogRes] = await Promise.all([
                getTrainerSuggestions(goal),
                getBlogPosts()
            ]);
            setTrainers(trainerRes.data || []);
            setPosts(blogRes.data || []);
        } catch (err) {
            console.error("Failed to fetch community data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const payload = {
            title: newPost.title,
            content: newPost.content
        };
            await createBlogPost(newPost);
            alert("Post submitted successfully! It will appear on the feed once approved by the admin.");
            setIsModalOpen(false);
            setNewPost({ title: '', content: '' });
            fetchInitialData(); 
        } catch (err) {
            alert("Failed to create post. Please try again.");
        }
    };

    const handleLike = async (postId) => {
        try {
            await likeBlogPost(postId);
            setPosts(posts.map(post => 
                post.id === postId ? { ...post, likesCount: (post.likesCount || 0) + 1 } : post
            ));
            setLikedPosts(prev => ({ ...prev, [postId]: true }));
        } catch (err) {
            console.error("Failed to like post", err);
        }
    };

    const handleCommentSubmit = async (postId) => {
        const commentText = window.prompt("Enter your comment:");
        if (!commentText) return;
        try {
            await addBlogComment(postId, commentText);
            alert("Comment submitted! Pending moderation.");
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    const handleAssign = async (trainerId) => {
        if (!window.confirm("Do you want to select this trainer as your mentor?")) return;
        try {
            await assignTrainer(trainerId);
            alert("Coach assigned! Your journey starts now.");
            window.location.reload();
        } catch (err) {
            alert("Failed to assign trainer");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, border: '4px solid #f3f3f3', borderTop: '4px solid #14b8a6', borderRadius: '50%' }} />
        </div>
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
            
            {/* --- HERO SECTION --- */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <motion.h1 initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>
                        WellNest <span style={{ color: '#14b8a6', fontStyle: 'italic' }}>Community</span>
                    </motion.h1>
                    <p style={{ color: '#64748b', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '5px' }}>
                        Expert advice & Pro mentorship
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* CREATE POST BUTTON */}
                    {activeTab === 'blog' && (
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#14b8a6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)' }}
                        >
                            <Plus size={18} /> CREATE POST
                        </button>
                    )}

                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '6px', borderRadius: '20px' }}>
                        <button 
                            onClick={() => setActiveTab('blog')}
                            style={{ padding: '10px 24px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '12px', transition: '0.3s', background: activeTab === 'blog' ? 'white' : 'transparent', boxShadow: activeTab === 'blog' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', color: activeTab === 'blog' ? '#0f172a' : '#94a3b8' }}
                        > EXPERT FEED </button>
                        <button 
                            onClick={() => setActiveTab('trainers')}
                            style={{ padding: '10px 24px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '12px', transition: '0.3s', background: activeTab === 'trainers' ? 'white' : 'transparent', boxShadow: activeTab === 'trainers' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', color: activeTab === 'trainers' ? '#0f172a' : '#94a3b8' }}
                        > PRO TRAINERS </button>
                    </div>
                </div>
            </header>

            {/* --- CREATE POST MODAL --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: 'white', padding: '2rem', borderRadius: '30px', width: '100%', maxWidth: '500px', position: 'relative' }}>
                            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
                            <h2 style={{ fontWeight: 900, marginBottom: '1.5rem' }}>Share Your Progress</h2>
                            <form onSubmit={handleCreatePost}>
                                <input 
                                    placeholder="Post Title" 
                                    required
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}
                                />
                                <textarea 
                                    placeholder="Write your fitness tips or questions here..." 
                                    required
                                    rows="5"
                                    value={newPost.content}
                                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', fontFamily: 'inherit' }}
                                />
                                <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#0f172a', color: 'white', fontWeight: 800, cursor: 'pointer' }}>PUBLISH POST</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {activeTab === 'blog' ? (
                    <motion.div key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {posts.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', border: '2px dashed #e2e8f0', borderRadius: '30px' }}>
                                <BookOpen size={40} color="#cbd5e1" />
                                <h3 style={{ color: '#94a3b8', marginTop: '1rem' }}>No approved articles published yet</h3>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    key={post.id}
                                    style={{ background: 'white', borderRadius: '30px', padding: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="#64748b"/></div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 900 }}>{post.author?.username || 'User'}</div>
                                            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem', color: '#0f172a' }}>{post.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>{post.content?.substring(0, 120)}...</p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f8fafc', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <button onClick={() => handleLike(post.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: likedPosts[post.id] ? '#f43f5e' : '#94a3b8' }}>
                                                <Heart size={18} fill={likedPosts[post.id] ? "#f43f5e" : "none"} />
                                                <span style={{ fontSize: '12px', fontWeight: 800 }}>{post.likesCount || 0}</span>
                                            </button>
                                            <button onClick={() => handleCommentSubmit(post.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}><MessageSquare size={18} /></button>
                                        </div>
                                        <button style={{ border: 'none', background: 'none', color: '#14b8a6', fontWeight: 900, fontSize: '10px', letterSpacing: '1px', cursor: 'pointer' }}>READ MORE <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div key="trainers" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {trainers.map((trainer) => (
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                key={trainer.id}
                                style={{ background: '#0f172a', borderRadius: '35px', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}><Sparkles size={120} /></div>
                                
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                    <div style={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={30} color="#14b8a6" />
                                    </div>
                                    <div style={{ background: '#14b8a6', padding: '5px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <ShieldCheck size={12} /> VERIFIED
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '5px' }}>{trainer.username}</h3>
                                <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>{trainer.specialization || 'Master Coach'}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 900 }}>EXP</div>
                                        <div style={{ fontWeight: 900 }}>{trainer.experienceYears || 5}+ Years</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 900 }}>RATING</div>
                                        <div style={{ fontWeight: 900, color: '#f59e0b' }}>★ 4.9</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleAssign(trainer.id)}
                                    style={{ width: '100%', padding: '15px', borderRadius: '18px', border: 'none', background: 'white', color: '#0f172a', fontWeight: 900, fontSize: '12px', letterSpacing: '1px', cursor: 'pointer', transition: '0.3s' }}
                                >
                                    HIRE THIS MENTOR
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommunityPage;