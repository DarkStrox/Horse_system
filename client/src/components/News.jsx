import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NewsSearchModal from './NewsSearchModal';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (res.data.role === 'Admin') {
                        setIsAdmin(true);
                    }
                })
                .catch(() => setIsAdmin(false));
        }
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/News`);
            setNews(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching news:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id, e) => {
        e.preventDefault(); // Prevent link click
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/api/News/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNews(news.filter(n => n.id !== id));
            } catch (err) {
                alert('فشل الحذف');
            }
        }
    };

    return (
        <div className="bg-[#FDFDFD] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            {/* Header Section */}
            <header className="px-8 md:px-16 py-20 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] -z-10"></div>
                <span className="inline-block py-1 px-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold mb-6 tracking-wide uppercase">عالم الفروسية</span>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                    أحدث الأخبار والمقالات اليومية
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    ابق على اطلاع بكل ما هو جديد في عالم الخيل العربية، من سباقات، مزادات، وأخبار عالمية.
                </p>

                {/* Admin Add Button */}
                {isAdmin && (
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="mt-8 bg-[#76E05B] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 transition flex items-center gap-2 mx-auto"
                    >
                        <i className="fas fa-plus"></i>
                        <span>إضافة خبر جديد</span>
                    </button>
                )}
            </header>

            {/* News Grid */}
            <main className="px-8 md:px-16 pb-24 container mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white dark:bg-gray-900 rounded-[2rem] h-[500px] animate-pulse"></div>
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <article key={item.id} className="group bg-white dark:bg-gray-900 rounded-[2rem] p-4 shadow-xl shadow-gray-100/50 dark:shadow-none hover:shadow-2xl hover:shadow-green-100/50 dark:hover:shadow-green-900/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col relative">

                                {/* Admin Delete Button */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="absolute top-6 left-6 z-20 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                                    >
                                        <i className="fas fa-trash text-xs"></i>
                                    </button>
                                )}

                                {/* Image Wrapper */}
                                <div className="relative h-64 mb-6 overflow-hidden rounded-[1.5rem]">
                                    <img
                                        src={item.urlToImage?.startsWith('http') ? item.urlToImage : (item.urlToImage ? `${API_BASE_URL}${item.urlToImage}` : 'https://images.unsplash.com/photo-1534073737927-85f1df9605d2?q=80&w=1000&auto=format&fit=crop')}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-white shadow-sm">
                                        {new Date(item.publishedAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col px-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-green-500 uppercase tracking-wider">{item.sourceName || 'NEWS'}</span>
                                        {item.author && <span className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[50%]">{item.author}</span>}
                                    </div>

                                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-green-500 transition-colors line-clamp-2">
                                        {item.title}
                                    </h2>

                                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed" dir="ltr">
                                        {item.description}
                                    </p>

                                    <Link
                                        to={`/news/${item.id}`}
                                        className="mt-auto flex items-center justify-center space-x-reverse space-x-3 bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-500 hover:text-white transition duration-300 w-full"
                                    >
                                        <span>اقرأ المزيد</span>
                                        <i className="fas fa-arrow-left text-xs"></i>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">لا توجد أخبار حالياً</h3>
                        <p className="text-gray-500">عد لاحقاً، نقوم بتحديث الأخبار يومياً.</p>
                    </div>
                )}
            </main>

            {/* Admin Modal */}
            <NewsSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onNewsAdded={() => { setIsSearchOpen(false); fetchNews(); }}
            />
            <Footer />
        </div>
    );
};

export default News;
