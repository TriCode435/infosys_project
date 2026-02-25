import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, User, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstagramCard = ({ post, onLike, onCommentOpen, currentUserId }) => {
    const [liked, setLiked] = useState(post.isLikedByCurrentUser || false);
    const [likesCount, setLikesCount] = useState(post.likeCount || 0);
    const [showHeartPop, setShowHeartPop] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const postImage = (post.imageUrls && post.imageUrls.length > 0)
        ? post.imageUrls[0]
        : `https://picsum.photos/seed/${post.id}/600/600`;

    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
        onLike && onLike(post.id);
    };

    const handleDoubleTap = () => {
        if (!liked) {
            handleLike();
        }
        setShowHeartPop(true);
        setTimeout(() => setShowHeartPop(false), 800);
    };

    const getTimeAgo = (date) => {
        if (!date) return "Just now";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '0px', // Instagram cards are often square edges on mobile, but let's use small radius for web
            border: '1px solid #efefef',
            marginBottom: '16px',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto 24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>
            {/* Header */}
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
                        background: '#efefef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <User size={18} color="#8e8e8e" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px', color: '#262626' }}>
                            {post.authorName || 'User'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#8e8e8e' }}>
                            {post.category?.name || 'Wellness'}
                        </span>
                    </div>
                </div>
                <MoreHorizontal size={20} color="#262626" cursor="pointer" />
            </div>

            {/* Post Image */}
            <div
                style={{ width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#fafafa' }}
                onDoubleClick={handleDoubleTap}
            >
                <img
                    src={postImage}
                    alt={post.title}
                    onLoad={() => setImageLoaded(true)}
                    style={{
                        width: '100%',
                        display: 'block',
                        objectFit: 'cover',
                        aspectRatio: '1 / 1',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                />
                {!imageLoaded && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#f0f2f5' }} />
                )}
                {showHeartPop && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        animation: 'heartPop 0.8s ease-out forwards'
                    }}>
                        <Heart size={80} fill="white" color="white" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ padding: '12px 16px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <MessageCircle
                            size={24}
                            color="#262626"
                            style={{ cursor: 'pointer' }}
                            onClick={() => onCommentOpen && onCommentOpen(post)}
                        />
                    </div>
                </div>

                {/* Caption */}
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#262626' }}>
                    <span style={{ fontWeight: '600', marginRight: '8px' }}>{post.authorName}</span>
                    <span style={{ fontWeight: '700' }}>{post.title}</span> — {expanded ? post.content : (
                        <>
                            <span dangerouslySetInnerHTML={{ __html: post.content?.substring(0, 100) }} />
                            {post.content?.length > 100 && (
                                <button
                                    onClick={() => setExpanded(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#8e8e8e',
                                        cursor: 'pointer',
                                        padding: 0,
                                        fontSize: '14px',
                                        marginLeft: '4px'
                                    }}
                                >
                                    ... more
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* View Comments */}
                {post.commentCount > 0 && (
                    <div
                        onClick={() => onCommentOpen && onCommentOpen(post)}
                        style={{
                            marginTop: '8px',
                            fontSize: '14px',
                            color: '#8e8e8e',
                            cursor: 'pointer'
                        }}
                    >
                        View all {post.commentCount} comments
                    </div>
                )}

                {/* Time ago */}
                <div style={{ marginTop: '8px', fontSize: '10px', color: '#8e8e8e', textTransform: 'uppercase' }}>
                    {getTimeAgo(post.createdAt)}
                </div>
            </div>

            <style>{`
                @keyframes heartPop {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default InstagramCard;
