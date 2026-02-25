import React, { useState, useEffect } from 'react';
import { FaChartLine, FaHeart, FaComment, FaNewspaper, FaEye } from 'react-icons/fa';
import blogService from '../../api/blogService';
import BlogCard from './BlogCard';

const BlogAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await blogService.getAnalytics();
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="main-container py-20 text-center font-black text-primary">ANALYZING PERFORMANCE...</div>;
    if (!analytics) return <div className="main-container py-20 text-center">No analytics data available. Start writing to see your impact!</div>;

    return (
        <div className="main-container animate-slide-up pb-20">
            <h1 className="text-4xl font-black tracking-tight mb-2">BLOG <span className="text-primary">ANALYTICS</span></h1>
            <p className="text-[#aaa] mb-12 border-b border-white/10 pb-4">Track your reach and engagement across the WellNest community.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="card glass-card flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FaNewspaper size={24} />
                    </div>
                    <span className="text-3xl font-black">{analytics.totalPosts}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Total Posts</span>
                </div>

                <div className="card glass-card flex flex-col items-center justify-center p-8 text-center border-b-4 border-b-error/30">
                    <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error mb-4">
                        <FaHeart size={24} />
                    </div>
                    <span className="text-3xl font-black">{analytics.totalLikes}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Total Likes</span>
                </div>

                <div className="card glass-card flex flex-col items-center justify-center p-8 text-center border-b-4 border-b-secondary/30">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                        <FaComment size={24} />
                    </div>
                    <span className="text-3xl font-black">{analytics.totalComments}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Comments</span>
                </div>

                <div className="card glass-card flex flex-col items-center justify-center p-8 text-center border-b-4 border-b-primary/30">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <FaChartLine size={24} />
                    </div>
                    <span className="text-3xl font-black">{(analytics.engagementRate || 0).toFixed(1)}%</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Engagement Rate</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-3">
                        TOP <span className="text-primary">PERFORMER</span>
                    </h3>
                    {analytics.mostPopularPost ? (
                        <BlogCard post={analytics.mostPopularPost} />
                    ) : (
                        <div className="card glass-card h-64 flex items-center justify-center opacity-30 italic">
                            Grow your audience to see top performing content.
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-2xl font-black mb-6 tracking-tight">RECENT <span className="text-primary">ACTIVITY</span></h3>
                    <div className="flex flex-col gap-4">
                        {/* If we had recent activity logs, we'd map them here */}
                        {analytics.recentPosts && analytics.recentPosts.length > 0 ? (
                            analytics.recentPosts.map(post => (
                                <div key={post.id} className="card glass-card !p-4 flex justify-between items-center group">
                                    <div className="flex flex-col">
                                        <span className="font-bold group-hover:text-primary transition-all">{post.title}</span>
                                        <span className="text-[10px] uppercase text-[#555]">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs font-bold">
                                        <span className="flex items-center gap-1"><FaHeart className="text-error" /> {post.likeCount}</span>
                                        <span className="flex items-center gap-1"><FaComment className="text-secondary" /> {post.commentCount}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card glass-card p-12 text-center opacity-30 italic">No recent activity detected.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogAnalytics;
