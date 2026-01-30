import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const NewsDetails = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/News/${id}`);
                setArticle(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching article:", err);
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    );

    if (!article) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 font-sans">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">الخبر غير موجود</h2>
            <Link to="/news" className="text-green-500 hover:underline">العودة للأخبار</Link>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <article className="container mx-auto px-4 md:px-16 py-12 max-w-4xl">
                {/* Header info */}
                <div className="mb-8 text-center space-y-4">
                    <div className="flex items-center justify-center space-x-reverse space-x-4 text-sm text-gray-400 dark:text-gray-500 mb-4">
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">{article.sourceName || 'News'}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight" dir="ltr">
                        {article.title}
                    </h1>
                    {article.author && <p className="text-gray-500 dark:text-gray-400 font-medium">بقلم: {article.author}</p>}
                </div>

                {/* Hero Image */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white dark:border-gray-800">
                    <img
                        src={article.urlToImage?.startsWith('http') ? article.urlToImage : (article.urlToImage ? `${API_BASE_URL}${article.urlToImage}` : 'https://images.unsplash.com/photo-1534073737927-85f1df9605d2?q=80&w=1000&auto=format&fit=crop')}
                        alt={article.title}
                        className="w-full h-auto max-h-[600px] object-cover"
                    />
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-loose" dir="ltr">
                    <p className="text-xl font-medium mb-8 text-gray-800 dark:text-gray-100">{article.description}</p>
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 mb-8">
                        {/* Render HTML content if available (from SmartReader), otherwise text */}
                        <div className="news-content" dangerouslySetInnerHTML={{ __html: article.content || 'لا يوجد محتوى إضافي متاح.' }} />
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center border-t border-gray-100 dark:border-gray-900 pt-12">
                    <p className="text-gray-500 mb-6 font-medium">لقراءة المقال كاملاً، يرجى زيارة المصدر الأصلي:</p>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-reverse space-x-3 bg-[#76E05B] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 dark:shadow-green-900/20 hover:bg-green-600 transition transform hover:-translate-y-1"
                    >
                        <span>زيارة المصدر</span>
                        <i className="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </article>
            <Footer />
        </div>
    );
};

export default NewsDetails;
