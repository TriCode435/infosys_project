import React, { useState } from 'react';
import { X, User, Heart, Send } from 'lucide-react';

const CommentModal = ({ post, onClose, onAddComment }) => {
    const [comment, setComment] = useState('');
    // Mock comments as they might not be in the initial post object
    const [comments, setComments] = useState(post.comments || [
        { id: 1, user: 'FitnessGal', text: 'This is exactly what I needed today! 🔥', liked: true, time: '1h' },
        { id: 2, user: 'TrainerJoe', text: 'Focus on form over weight always. Great post.', liked: false, time: '3h' },
        { id: 3, user: 'HealthyEats', text: 'Does this work for beginners too?', liked: false, time: '5h' }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        const newComment = {
            id: Date.now(),
            user: 'You',
            text: comment,
            liked: false,
            time: 'now'
        };

        setComments([newComment, ...comments]);
        setComment('');
        onAddComment && onAddComment(post.id, comment);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 2000,
            padding: '1rem'
        }} onClick={onClose}>
            <div
                className="animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    height: '80vh',
                    backgroundColor: '#fff',
                    display: 'flex',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Left: Image Preview (Hidden on mobile for simplicity, but making it visible here as requested) */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid #efefef'
                }} className="hide-mobile">
                    <img
                        src={post.imageUrl || `https://picsum.photos/seed/${post.id}/600/600`}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>

                {/* Right: Comments Section */}
                <div style={{ width: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', color: '#262626' }}>
                    {/* Header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #efefef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fafafa', border: '1px solid #efefef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="#8e8e8e" />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{post.author?.username || 'Trainer'}</span>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#262626" />
                        </button>
                    </div>

                    {/* Comments List */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                        {/* Post Caption as first comment */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, backgroundColor: '#fafafa', border: '1px solid #efefef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color="#8e8e8e" />
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                <strong style={{ marginRight: '8px' }}>{post.author?.username || 'Trainer'}</strong>
                                {post.content}
                                <div style={{ color: '#8e8e8e', fontSize: '12px', marginTop: '8px' }}>1d</div>
                            </div>
                        </div>

                        {/* Real Comments */}
                        {comments.map(c => (
                            <div key={c.id} style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, backgroundColor: '#fafafa', border: '1px solid #efefef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={18} color="#8e8e8e" />
                                </div>
                                <div style={{ flex: 1, fontSize: '14px' }}>
                                    <strong style={{ marginRight: '8px' }}>{c.user}</strong>
                                    {c.text}
                                    <div style={{ color: '#8e8e8e', fontSize: '12px', marginTop: '8px', display: 'flex', gap: '12px' }}>
                                        <span>{c.time}</span>
                                        <span style={{ fontWeight: 600, cursor: 'pointer' }}>Reply</span>
                                    </div>
                                </div>
                                <button style={{ background: 'none', border: 'none', padding: 0 }}>
                                    <Heart size={12} color={c.liked ? '#ed4956' : '#262626'} fill={c.liked ? '#ed4956' : 'none'} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} style={{ padding: '12px 16px', borderTop: '1px solid #efefef', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', padding: '4px 0' }}
                        />
                        <button
                            type="submit"
                            disabled={!comment.trim()}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: comment.trim() ? '#0095f6' : '#b2dffc',
                                fontWeight: 600,
                                cursor: comment.trim() ? 'pointer' : 'default'
                            }}
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
            <style>
                {`
                    @media (max-width: 768px) {
                        .hide-mobile { display: none !important; }
                        div[style*="maxWidth: '900px'"] { height: 95vh !important; }
                        div[style*="width: '400px'"] { width: 100% !important; }
                    }
                `}
            </style>
        </div>
    );
};

export default CommentModal;
