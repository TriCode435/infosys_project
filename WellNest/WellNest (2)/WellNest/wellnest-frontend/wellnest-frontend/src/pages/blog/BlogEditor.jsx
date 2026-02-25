import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon, X, Plus, ChevronLeft } from 'lucide-react';
import api from '../../api/axios';

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryId: '',
        tags: '',
        imageUrls: []
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchPost();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/blog/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPost = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/blog/${id}`);
            const post = response.data;
            setFormData({
                title: post.title,
                content: post.content,
                categoryId: post.category ? post.category.id : '',
                tags: post.tags ? post.tags.join(', ') : '',
                imageUrls: post.imageUrls || []
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            navigate('/community');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        // For demo purposes, we'll just use a placeholder since the direct upload might need a complex backend setup
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setTimeout(() => {
            const mockUrl = `https://picsum.photos/seed/${Math.random()}/1200/800`;
            setFormData(prev => ({
                ...prev,
                imageUrls: [...prev.imageUrls, mockUrl]
            }));
            setUploading(false);
        }, 1000);
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };

        try {
            if (isEditMode) {
                await api.put(`/api/blog/${id}`, data);
            } else {
                await api.post('/api/blog', data);
            }
            alert(`Post ${isEditMode ? 'updated' : 'published'} successfully!`);
            navigate('/community');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post. Please check the content for inappropriate language.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #dbdbdb',
        backgroundColor: '#fafafa',
        fontSize: '14px',
        color: '#262626',
        outline: 'none',
        marginBottom: '20px'
    };

    if (loading && isEditMode) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#0095f6', fontWeight: 'bold' }}>
            LOADING CONTENT...
        </div>
    );

    return (
        <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', padding: '40px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', color: '#8e8e8e' }} onClick={() => navigate('/community')}>
                    <ChevronLeft size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Back to Community</span>
                </div>

                <div style={{ background: '#fff', border: '1px solid #efefef', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 32px 0', borderBottom: '2px solid #0095f6', display: 'inline-block', paddingBottom: '8px' }}>
                        {isEditMode ? 'EDIT' : 'NEW'} <span style={{ color: '#0095f6' }}>INSIGHT</span>
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#8e8e8e', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Inspiration Title</label>
                            <input
                                type="text"
                                required
                                style={{ ...inputStyle, fontSize: '18px', fontWeight: '700' }}
                                placeholder="What's on your mind?"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#8e8e8e', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Category</label>
                            <select
                                required
                                style={inputStyle}
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#8e8e8e', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>The Story</label>
                            <textarea
                                required
                                style={{ ...inputStyle, minHeight: '200px', lineHeight: '1.6' }}
                                placeholder="Share your fitness journey or expert tips here..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            ></textarea>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#8e8e8e', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.5px' }}>Visuals</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
                                {formData.imageUrls.map((url, index) => (
                                    <div key={index} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #efefef' }}>
                                        <img src={url} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ed4956', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {formData.imageUrls.length < 4 && (
                                    <label style={{ aspectRatio: '1/1', borderRadius: '8px', border: '2px dashed #dbdbdb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fafafa', color: '#8e8e8e' }}>
                                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                                        {uploading ? <div className="animate-spin">●</div> : <><Plus size={24} /> <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: '700' }}>ADD PHOTO</span></>}
                                    </label>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#0095f6',
                                color: 'white',
                                fontWeight: '700',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease',
                                opacity: (loading || uploading) ? 0.7 : 1
                            }}
                        >
                            {isEditMode ? 'SAVE CHANGES' : 'PUBLISH TO COMMUNITY'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
