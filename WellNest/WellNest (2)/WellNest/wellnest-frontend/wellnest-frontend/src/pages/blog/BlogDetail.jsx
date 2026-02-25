import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaComment, FaCalendar, FaUser, FaFlag, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import blogService from '../../api/blogService';
import { useAuth } from '../../context/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await blogService.getPostById(id);
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post:', error);
            navigate('/blog');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            await blogService.toggleLike(id);
            fetchPost(); // Refresh post to get new like count and status
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        try {
            await blogService.addComment(id, commentContent);
            setCommentContent('');
            fetchPost(); // Refresh comments
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleReport = async (e) => {
        e.preventDefault();
        try {
            await blogService.reportPost(id, reportReason);
            setShowReportModal(false);
            setReportReason('');
            alert('Post reported successfully.');
        } catch (error) {
            console.error('Error reporting post:', error);
        }
    };

    const handleModerate = async (status) => {
        try {
            if (status === 'APPROVED') {
                await blogService.approvePost(id);
            } else if (status === 'REJECTED') {
                await blogService.rejectPost(id);
            }
            fetchPost();
        } catch (error) {
            console.error('Error moderating post:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await blogService.deletePost(id);
                navigate('/blog');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    if (loading) return <div className="main-container py-20 text-center font-black text-primary">LOADING INTEL...</div>;
    if (!post) return <div className="main-container py-20 text-center">Post not found.</div>;

    const isAuthor = user && user.id === post.authorId;
    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="main-container animate-slide-up pb-20">
            <div className="max-w-4xl mx-auto">
                <Link to="/blog" className="join-btn-outline mb-8 gap-2">
                    ← BACK TO FEED
                </Link>

                {/* Admin/Author Moderation Banner */}
                {(isAdmin || (isAuthor && post.status !== 'APPROVED')) && (
                    <div className={`card mb-8 flex justify-between items-center ${post.status === 'PENDING' ? 'bg-warning/10 border-warning/20' : post.status === 'REJECTED' ? 'bg-error/10 border-error/20' : 'bg-success/10 border-success/20'}`}>
                        <div>
                            <span className="font-bold uppercase tracking-widest text-sm">Status: {post.status}</span>
                            <p className="text-sm opacity-70">
                                {post.status === 'PENDING' ? 'This post is awaiting administrator approval.' :
                                    post.status === 'REJECTED' ? 'This post has been rejected and is not public.' :
                                        'This post is live and visible to the community.'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {isAdmin && post.status === 'PENDING' && (
                                <>
                                    <button onClick={() => handleModerate('APPROVED')} className="join-btn-fill bg-success hover:bg-success/80 !px-4"><FaCheck /> APPROVE</button>
                                    <button onClick={() => handleModerate('REJECTED')} className="join-btn-fill bg-error hover:bg-error/80 !px-4 text-white"><FaTimes /> REJECT</button>
                                </>
                            )}
                            {isAuthor && (
                                <>
                                    <Link to={`/blog/edit/${post.id}`} className="join-btn-outline !px-4"><FaEdit /> EDIT</Link>
                                    <button onClick={handleDelete} className="join-btn-outline border-error text-error hover:bg-error hover:text-white !px-4"><FaTrash /> DELETE</button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">{post.title}</h1>

                <div className="flex items-center gap-6 mb-8 text-[#aaa] border-b border-white/10 pb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {post.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <span className="block text-white font-bold">{post.authorName}</span>
                            <span className="text-xs uppercase tracking-widest">Post Author</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="text-xs uppercase tracking-widest">Published On</span>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="flex flex-col">
                        <span className="text-white font-bold">{post.category ? post.category.name : 'Uncategorized'}</span>
                        <span className="text-xs uppercase tracking-widest">Category</span>
                    </div>
                </div>

                {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mb-12 rounded-3xl overflow-hidden shadow-primary/20 shadow-2xl">
                        <img src={post.imageUrls[0]} alt={post.title} className="w-full object-cover" />
                    </div>
                )}

                <div
                    className="prose prose-invert max-w-none text-lg leading-relaxed mb-12"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {post.tags && (
                    <div className="flex gap-2 mb-12">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-[#888]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Engagement Section */}
                <div className="flex justify-between items-center py-6 border-y border-white/10 mb-12">
                    <div className="flex gap-8">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 text-lg font-bold transition-all hover:scale-110 ${post.isLikedByCurrentUser ? 'text-error' : 'text-[#aaa]'}`}
                        >
                            <FaHeart /> {post.likeCount} Likes
                        </button>
                        <div className="flex items-center gap-2 text-lg font-bold text-[#aaa]">
                            <FaComment /> {post.commentCount} Comments
                        </div>
                    </div>
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-2 text-xs font-bold text-[#555] hover:text-error transition-all"
                    >
                        <FaFlag /> REPORT POST
                    </button>
                </div>

                {/* Comments Section */}
                <div className="mb-20">
                    <h3 className="text-2xl font-black mb-8 tracking-tight">COMMENTS</h3>

                    {user && (
                        <form onSubmit={handleComment} className="mb-12">
                            <textarea
                                className="input-field min-h-[100px] mb-4"
                                placeholder="Join the discussion..."
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end">
                                <button type="submit" className="join-btn-fill">POST COMMENT</button>
                            </div>
                        </form>
                    )}

                    <div className="flex flex-col gap-6">
                        {(post.comments || []).length > 0 ? (
                            post.comments.map(comment => (
                                <div key={comment.id} className="card glass-card">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                {comment.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-sm">{comment.authorName}</span>
                                                <span className="text-[10px] uppercase text-[#666]">{new Date(comment.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <button className="text-error opacity-50 hover:opacity-100 transition-all"><FaTrash size={12} /></button>
                                        )}
                                    </div>
                                    <p className="text-[#bbb]">{comment.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 italic">No comments yet. Be the first to join the conversation!</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
                    <div className="card glass-card max-w-md w-full animate-slide-up">
                        <h2 className="text-2xl font-black mb-6 tracking-tight">REPORT CONTENT</h2>
                        <form onSubmit={handleReport}>
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#aaa] mb-2">Reason for reporting</label>
                                <textarea
                                    className="input-field min-h-[120px]"
                                    placeholder="Explain why this post should be reviewed..."
                                    required
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="join-btn-fill flex-1 bg-error border-none text-white">SUBMIT REPORT</button>
                                <button type="button" onClick={() => setShowReportModal(false)} className="join-btn-outline flex-1">CANCEL</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
