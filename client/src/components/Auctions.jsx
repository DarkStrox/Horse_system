import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const Auctions = () => {
    const [user, setUser] = useState(null);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Fetch User
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user:", err));
        }

        // Fetch Auctions
        axios.get(`${API_BASE_URL}/api/auction`)
            .then(res => {
                setAuctions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching auctions:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const getProfilePicUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return API_BASE_URL + url;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذا المزاد؟")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/auction/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAuctions(auctions.filter(a => a.auctionId !== id));
            alert("تم الحذف بنجاح");
        } catch (err) {
            console.error(err);
            alert("فشل الحذف");
        }
    };

    if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

    const liveAuctions = auctions.filter(a => a.status === 'Live');
    const upcomingAuctions = auctions.filter(a => a.status === 'Upcoming');

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-16 py-12">

                {/* Header / Hero */}
                {/* Hero Auction */}
                {(() => {
                    const featuredAuction = liveAuctions[0] || upcomingAuctions[0];
                    return featuredAuction ? (
                        <div className="mb-20 bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative group">
                            <div className="w-full lg:w-1/2 relative h-[500px]">
                                <img src={getProfilePicUrl(featuredAuction.imageUrl || featuredAuction.horseImage) || '/auctions/hero.png'} alt="Main Auction" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
                                {featuredAuction.status === 'Live' && (
                                    <div className="absolute top-8 right-8 bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center space-x-reverse space-x-2 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full"></span>
                                        <span>مباشر الآن</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8 bg-gradient-to-l from-white/10 dark:from-black/10 to-transparent">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">{featuredAuction.name}</h1>
                                        {user?.role === 'Admin' && (
                                            <button onClick={() => handleDelete(featuredAuction.auctionId)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-lg leading-relaxed">
                                        {featuredAuction.status === 'Live'
                                            ? `المزاد جارٍ الآن! السعر الحالي: ${featuredAuction.currentBid.toLocaleString()} ج.م`
                                            : `يبدأ قريباً في ${new Date(featuredAuction.startTime).toLocaleString('ar-EG')}`
                                        }
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-3xl font-black text-[#76E05B]">{featuredAuction.bidCount}</p>
                                        <p className="text-xs text-gray-400 font-bold">عدد المزايدات</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900 dark:text-white">
                                            {featuredAuction.status === 'Live'
                                                ? Math.ceil((new Date(featuredAuction.endTime) - new Date()) / (1000 * 60 * 60)) + 'س'
                                                : '--'}
                                        </p>
                                        <p className="text-xs text-gray-400 font-bold">الوقت المتبقي</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link to={`/auction/${featuredAuction.auctionId}`} className="bg-[#76E05B] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 dark:shadow-green-900/10 hover:bg-green-500 transition flex items-center space-x-reverse space-x-3">
                                        <i className="fas fa-gavel"></i>
                                        <span>تصفح المزاد</span>
                                    </Link>
                                    <Link to={`/auction/${featuredAuction.auctionId}`} className="border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                        شاهد التفاصيل
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center mb-10">
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white">المزادات</h1>
                        </div>
                    );
                })()}

                {/* Create Button (only if no hero or explicitly wanted below) */}
                <div className="flex justify-end mb-8">
                    {user && (user.role === 'Admin' || user.role === 'Seller') && (
                        <Link to="/auction/create" className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition">
                            <i className="fas fa-plus ml-2"></i>
                            إنشاء مزاد جديد
                        </Link>
                    )}
                </div>

                {/* Live Auctions */}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 border-b pb-4 border-gray-100 dark:border-gray-800 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    المزادات المباشرة
                </h2>

                {liveAuctions.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 mb-12">
                        <p className="text-gray-400 font-bold text-xl">لا يوجد مزادات مباشرة الآن</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                        {liveAuctions.map((item) => (
                            <div key={item.auctionId} className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50 dark:border-gray-800 group hover:-translate-y-2 transition duration-500 relative">
                                {user?.role === 'Admin' && (
                                    <button onClick={(e) => { e.preventDefault(); handleDelete(item.auctionId); }} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full text-red-500 hover:bg-red-100 transition">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                                <Link to={`/auction/${item.auctionId}`} className="relative h-64 overflow-hidden block">
                                    <img src={getProfilePicUrl(item.imageUrl || item.horseImage) || '/horses/default.png'} alt={item.horseName} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <div className="absolute top-5 right-5 bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-sm animate-pulse">
                                        LIVE
                                    </div>
                                </Link>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">عن الخيل: <span className="font-bold text-gray-800 dark:text-gray-300">{item.horseName}</span></p>

                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                                        <div>
                                            <p className="text-xs text-gray-400">السعر الحالي</p>
                                            <p className="text-xl font-black text-green-500">{item.currentBid.toLocaleString()} ج.م</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">المزايدات</p>
                                            <p className="text-lg font-bold text-gray-800 dark:text-white">{item.bidCount}</p>
                                        </div>
                                    </div>

                                    <Link to={`/auction/${item.auctionId}`} className="block text-center bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition">
                                        زايد الآن
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upcoming Auctions */}
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 border-b pb-4 border-gray-100 dark:border-gray-800">
                    مزادات قادمة
                </h2>

                {upcomingAuctions.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                        <p className="text-gray-400 font-bold text-xl">لا يوجد مزادات قادمة مجدولة</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {upcomingAuctions.map((item) => (
                            <div key={item.auctionId} className="bg-white dark:bg-gray-900 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-50 dark:border-gray-800 shadow-sm relative group">
                                {user?.role === 'Admin' && (
                                    <button onClick={(e) => { e.preventDefault(); handleDelete(item.auctionId); }} className="absolute top-4 left-4 md:static text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )}
                                <img src={getProfilePicUrl(item.imageUrl || item.horseImage) || '/horses/default.png'} alt={item.horseName} className="w-24 h-24 rounded-2xl object-cover" />
                                <div className="flex-1 text-center md:text-right">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">يبدأ في: {new Date(item.startTime).toLocaleString('ar-EG')}</p>
                                </div>
                                <Link to={`/auction/${item.auctionId}`} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                    التفاصيل
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

            </section>
            <Footer />
        </div>
    );
};

export default Auctions;
