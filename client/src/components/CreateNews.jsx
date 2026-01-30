import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:5000';

const CreateNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${API_BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.role !== 'Admin') {
                    navigate('/news');
                }
            })
            .catch(() => navigate('/news'));
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('content', formData.content);
            if (imageFile) {
                data.append('image', imageFile);
            }

            await axios.post(`${API_BASE_URL}/api/News/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/news');
        } catch (err) {
            console.error('Error creating news:', err);
            if (err.response && err.response.status === 403) {
                alert('عذراً، يجب أن تكون مسؤولاً (Admin) للقيام بذلك. يرجى تسجيل الخروج والدخول مجدداً لتحديث الصلاحيات.');
            } else if (err.response && err.response.data && err.response.data.error) {
                alert(`فشل في إنشاء الخبر: ${err.response.data.error}`);
            } else {
                alert('فشل في إنشاء الخبر. يرجى المحاولة لاحقاً.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FDFDFD] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <main className="container mx-auto px-8 md:px-16 py-12 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">عنوان الخبر</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                            placeholder="اكتب عنواناً جذاباً..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">وصف قصير</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                            placeholder="ملخص الخبر الذي يظهر في البطاقة..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">صورة الخبر</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                        />
                        {imageFile && (
                            <p className="mt-2 text-xs text-gray-500">الملف المختار: {imageFile.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">المحتوى الكامل (يدعم HTML)</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="10"
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
                            placeholder="اكتب تفاصيل الخبر هنا..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#76E05B] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'جاري الحفظ...' : 'نشر الخبر'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateNews;
