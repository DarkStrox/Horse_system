import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsSearchModal from './NewsSearchModal';
import Navbar from './Navbar';
import Footer from './Footer';
import { newsApi, userApi } from '../api/api';
import api from '../api/api';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScraping, setIsScraping] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userApi.getProfile()
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
            const response = await newsApi.getNews();
            setNews(response.data);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id, e) => {
        e.preventDefault();
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            try {
                await api.delete(`/News/${id}`);
                setNews(news.filter(n => n.id !== id));
            } catch (err) {
                alert('فشل الحذف');
            }
        }
    };

    const handleManualScrape = async () => {
        setIsScraping(true);
        try {
            await api.post('/News/scrape', {});
            alert('تم بدء تحديث الأخبار بنجاح! قد يستغرق الأمر دقيقة لتحديث القائمة.');
            setTimeout(fetchNews, 5000);
        } catch (err) {
            console.error("Scrape error:", err);
            alert('فشل تحديث الأخبار: ' + (err.response?.data?.error || 'خطأ غير معروف'));
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
            <Navbar />

            <header className="px-8 md:px-16 py-28 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/5 rounded-full blur-[150px] -z-10"></div>
                <span className="inline-block py-2 px-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black mb-8 tracking-widest uppercase border border-emerald-100 dark:border-emerald-800">عالم الفروسية والأصالة</span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tighter">
                   أخبار الفروسية <br /> <span className="text-emerald-700">اليومية</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-xl font-bold leading-relaxed mb-12">
                   استكشف أحدث المقالات، التحليلات، وأخبار سباقات الخيل العربية حول العالم في منصة موحدة.
                </p>

                {isAdmin && (
                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="bg-emerald-800 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition flex items-center gap-4"
                        >
                            <i className="fas fa-plus-circle text-xl"></i>
                            <span>إضافة خبر يدوي</span>
                        </button>
                        <button
                            onClick={handleManualScrape}
                            disabled={isScraping}
                            className={`px-10 py-4 rounded-2xl font-black shadow-xl flex items-center gap-4 transition ${isScraping ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/10'}`}
                        >
                            <i className={`fas ${isScraping ? 'fa-sync fa-spin' : 'fa-bolt'}`}></i>
                            <span>{isScraping ? 'جاري التحديث...' : 'سحب أخبار تلقائي'}</span>
                        </button>
                    </div>
                )}
            </header>

            <main className="px-8 md:px-16 pb-32 container mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white dark:bg-gray-900 rounded-[3rem] h-[550px] animate-pulse border border-gray-100 dark:border-gray-800 shadow-sm"></div>
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {news.map((item) => (
                            <article key={item.id} className="group bg-white dark:bg-gray-900 rounded-[3rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-700 border border-gray-100 dark:border-gray-800 flex flex-col relative transform hover:-translate-y-4">
                                
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="absolute top-8 left-8 z-20 bg-red-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                )}

                                <div className="relative h-72 mb-8 overflow-hidden rounded-[2.5rem]">
                                    <img
                                        src={item.urlToImage || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1000&auto=format&fit=crop'}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-[2s]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-emerald-900/80 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-black text-gray-900 dark:text-emerald-50 shadow-xl tracking-widest border border-white/20">
                                        {new Date(item.publishedAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-1.5 rounded-xl uppercase tracking-widest">{item.sourceName || 'GLOBAL'}</span>
                                        {item.author && <span className="text-xs text-gray-400 font-bold line-clamp-1 max-w-[50%]">بواسطة: {item.author}</span>}
                                    </div>

                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 uppercase tracking-tight">
                                        {item.title}
                                    </h2>

                                    <p className="text-gray-500 dark:text-gray-400 text-base mb-10 line-clamp-3 leading-relaxed font-medium">
                                        {item.description}
                                    </p>

                                    <Link
                                        to={`/news/${item.id}`}
                                        className="mt-auto flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-white px-8 py-4 rounded-[2rem] font-black hover:bg-emerald-700 hover:text-white transition-all duration-500 shadow-inner group/btn"
                                    >
                                        <span>اقرأ التفاصيل الكاملة</span>
                                        <i className="fas fa-chevron-left text-xs transition-transform group-hover/btn:-translate-x-2"></i>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <i className="fas fa-newspaper text-8xl text-gray-100 mb-8"></i>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">لا توجد أخبار للمزامنة حالياً</h3>
                        <p className="text-gray-400 font-bold text-lg">نقوم بتحديث مصادرنا كل 24 ساعة، عد إلينا لاحقاً.</p>
                    </div>
                )}
            </main>

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