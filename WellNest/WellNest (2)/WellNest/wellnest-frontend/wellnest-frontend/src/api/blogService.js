import api from './axios';

const blogService = {
    getAllPosts: (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') => {
        return api.get(`/api/blog?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`);
    },

    getPostById: (id) => {
        return api.get(`/api/blog/${id}`);
    },

    createPost: (postData) => {
        return api.post('/api/blog', postData);
    },

    updatePost: (id, postData) => {
        return api.put(`/api/blog/${id}`, postData);
    },

    deletePost: (id) => {
        return api.delete(`/api/blog/${id}`);
    },

    searchPosts: (query, page = 0, size = 10) => {
        return api.get(`/api/blog/search?query=${query}&page=${page}&size=${size}`);
    },

    toggleLike: (id) => {
        return api.post(`/api/blog/${id}/like`);
    },

    addComment: (id, content) => {
        return api.post(`/api/blog/${id}/comment`, { content });
    },

    reportPost: (id, reason) => {
        return api.post(`/api/blog/${id}/report`, { reason });
    },

    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/blog/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getAnalytics: () => {
        return api.get('/api/blog/analytics');
    },

    approvePost: (id) => {
        return api.put(`/api/blog/admin/${id}/approve`);
    },

    rejectPost: (id) => {
        return api.put(`/api/blog/admin/${id}/reject`);
    },

    getCategories: () => {
        // We could add an endpoint for categories if needed, for now we might hardcode or seed
        return api.get('/api/blog/categories'); // I'll need to add this endpoint to the backend
    }
};

export default blogService;
