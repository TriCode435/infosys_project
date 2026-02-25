import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import blogService from '../../api/blogService';

const BlogCard = ({ post: initialPost }) => {
    const [post, setPost] = useState(initialPost);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const handleLike = async () => {
        try {
            await blogService.toggleLike(post.id);
            setPost(prev => ({
                ...prev,
                isLikedByCurrentUser: !prev.isLikedByCurrentUser,
                likeCount: prev.isLikedByCurrentUser ? prev.likeCount - 1 : prev.likeCount + 1
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;
        try {
            const res = await blogService.addComment(post.id, commentContent);
            setPost(prev => ({
                ...prev,
                commentCount: prev.commentCount + 1,
                comments: [...(prev.comments || []), res.data]
            }));
            setCommentContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #efefef',
            marginBottom: '24px',
            width: '100%',
            maxWidth: '600px',
            margin: '20px auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            {/* Top Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        padding: '2px'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#262626'
                        }}>
                            {post.authorName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#262626' }}>{post.authorName}</span>
                        <span style={{ fontSize: '12px', color: '#8e8e8e', marginLeft: '8px' }}>• {post.category ? post.category.name : 'Wellness'}</span>
                    </div>
                </div>
                <MoreHorizontal size={20} color="#262626" style={{ cursor: 'pointer' }} />
            </div>

            {/* Image */}
            <div style={{ width: '100%', backgroundColor: '#fafafa', position: 'relative' }}>
                {post.imageUrls && post.imageUrls.length > 0 ? (
                    <img
                        src={post.imageUrls[0]}
                        alt={post.title}
                        style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '600px' }}
                    />
                ) : (
                    <div style={{
                        height: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                        color: '#6366f1',
                    }}>
                        <h2 style={{ fontSize: '40px', fontWeight: '900', opacity: 0.3, letterSpacing: '4px' }}>WELLNEST</h2>
                        <p style={{ opacity: 0.5, fontWeight: '600' }}>INSPIRATION</p>
                    </div>
                )}
            </div>

            {/* Interaction Buttons */}
            <div style={{ padding: '12px 16px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Heart size={24} color={post.isLikedByCurrentUser ? '#ed4956' : '#262626'} fill={post.isLikedByCurrentUser ? '#ed4956' : 'none'} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={handleLike} />
                        <MessageCircle size={24} color="#262626" style={{ cursor: 'pointer' }} onClick={() => setShowCommentInput(!showCommentInput)} />
                        <Share2 size={24} color="#262626" style={{ cursor: 'pointer' }} />
                    </div>
                    <Bookmark size={24} color="#262626" style={{ cursor: 'pointer' }} />
                </div>

                {/* Likes Count */}
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#262626', marginBottom: '8px' }}>
                    {post.likeCount} likes
                </div>

                {/* Title and Caption */}
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#262626' }}>
                    <span style={{ fontWeight: '600', marginRight: '8px' }}>{post.authorName}</span>
                    <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none', color: '#262626', fontWeight: '700' }}>
                        {post.title}
                    </Link>
                    <div style={{ marginTop: '4px', color: '#444' }} dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
                </div>

                {/* Comments Link */}
                <Link to={`/blog/${post.id}`} style={{
                    display: 'block',
                    marginTop: '8px',
                    fontSize: '14px',
                    color: '#8e8e8e',
                    textDecoration: 'none'
                }}>
                    View all {post.commentCount} comments
                </Link>

                {/* Inline Comments */}
                {(post.comments || []).slice(-2).map((comment, idx) => (
                    <div key={idx} style={{ fontSize: '14px', lineHeight: '1.5', color: '#262626', marginTop: '4px' }}>
                        <span style={{ fontWeight: '600', marginRight: '8px' }}>{comment.authorName}</span>
                        <span>{comment.content}</span>
                    </div>
                ))}

                {/* Comment Input */}
                {showCommentInput && (
                    <form onSubmit={handleCommentSubmit} style={{ marginTop: '12px', display: 'flex', borderTop: '1px solid #efefef', paddingTop: '12px' }}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px' }}
                        />
                        <button type="submit" disabled={!commentContent.trim()} style={{ background: 'none', border: 'none', color: commentContent.trim() ? '#0095f6' : '#8e8e8e', fontWeight: '600', cursor: commentContent.trim() ? 'pointer' : 'default' }}>
                            Post
                        </button>
                    </form>
                )}

                {/* Date */}
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#8e8e8e', textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                    {formatDate(post.createdAt)}
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
