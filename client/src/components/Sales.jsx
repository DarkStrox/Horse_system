import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const Sales = () => {
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('الكل');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    // Placeholder for real data fetch later
    const [horses, setHorses] = useState([
        { id: 104, name: 'وردة الصحراء', type: 'فرس', age: '6 سنوات', breed: 'صقلاوي جدراني', father: 'مروان الشقب', price: '240,000 ج.م', img: '/auctions/card-1.png', category: 'أفراس' },
        { id: 185, name: 'فجر العرب', type: 'فحل', age: '4 سنوات', breed: 'كحيلان', father: 'العديد الشقب', price: '150,000 ج.م', img: '/auctions/card-2.png', category: 'فحول' },
        { id: 216, name: 'أميرة الوادي', type: 'مهرة', age: 'سنتان', breed: 'عبية الشراك', father: 'سنان إني', price: '80,000 ج.م', img: '/auctions/hero.png', category: 'مواليد جدد' },
    ]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user:", err));
        }

        // Fetch Real Horses
        axios.get('http://localhost:5000/api/horse/sales')
            .then(res => {
                // Map backend 'imageUrl' to frontend 'img'
                const mappedHorses = res.data.map(h => ({
                    ...h,
                    img: h.imageUrl,
                    id: h.microchipId // Ensure ID is consistent if needed
                }));
                setHorses(mappedHorses);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching horses:", err);
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

    const [searchTerm, setSearchTerm] = useState('');

    const filteredHorses = horses.filter(horse => {
        const matchesCategory = activeFilter === 'الكل' || horse.category === activeFilter;
        const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-4 md:px-16 py-12">
                {/* Hero Section */}
                <div className="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative group mb-20">
                    <div className="w-full lg:w-1/2 relative h-[400px]">
                        <img src="/auctions/hero.png" alt="Main Horse" className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" />
                        <div className="absolute top-8 right-8 bg-green-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black flex items-center space-x-reverse space-x-2">
                            <span>متاح للبيع</span>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8 bg-gradient-to-l from-white/10 dark:from-black/10 to-transparent">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">سوق الخيل العربية الأصيلة</h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                اكتشف نخبة الخيل العربية المعروضة للبيع مباشرة من الملاك. سلالات نادرة وأسعار مميزة.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {(user?.role === 'Seller' || user?.role === 'Admin') && (
                                <Link to="/add-horse" className="bg-[#76E05B] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 dark:shadow-green-900/10 hover:bg-green-500 transition flex items-center space-x-reverse space-x-3">
                                    <i className="fas fa-plus-circle"></i>
                                    <span>أضف خيل للبيع</span>
                                </Link>
                            )}
                            <button onClick={() => document.getElementById('sales-grid').scrollIntoView({ behavior: 'smooth' })} className="border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                تصفح المعروض
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div id="sales-grid" className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-4 px-10 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-800">
                    <div className="flex items-center space-x-reverse space-x-4 shrink-0">
                        <i className="fas fa-filter text-green-500"></i>
                        <span className="font-black text-gray-800 dark:text-white">تصفية حسب:</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {['الكل', 'فحول', 'أفراس', 'أمهر', 'مواليد جدد'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeFilter === filter ? 'bg-gray-900 text-white dark:bg-green-500' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-600'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="mr-auto relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="ابحث باسم الخيل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-3 pr-10 rounded-xl outline-none border border-transparent focus:border-green-100 transition text-sm"
                        />
                        <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                    </div>
                </div>

                {/* Sales Grid */}
                <div className="mt-16 space-y-10">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">الخيل المعروضة</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredHorses.map((item) => (
                            <div key={item.microchipId} className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-50 dark:border-gray-800 group hover:-translate-y-2 transition duration-500">
                                <Link to={`/horse/${item.microchipId}`} className="relative h-64 overflow-hidden block">
                                    <img src={item.img?.startsWith('http') || item.img?.startsWith('/') ? item.img : `${API_BASE_URL}${item.img || '/horses/default.png'}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <button className="absolute top-5 left-5 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition">
                                        <i className="far fa-heart"></i>
                                    </button>
                                </Link>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Link to={`/horse/${item.microchipId}`} className="text-2xl font-black text-gray-900 dark:text-white hover:text-green-500 transition">{item.name}</Link>
                                            <p className="text-xs text-gray-400 font-bold mt-1">
                                                <i className="fas fa-tag text-green-500 mr-1"></i>
                                                للبيع
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl">
                                            <p className="text-[10px] text-gray-400 font-bold mb-1">السلالة</p>
                                            <p className="text-xs font-black text-gray-900 dark:text-white truncate">{item.breed}</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl">
                                            <p className="text-[10px] text-gray-400 font-bold mb-1">الأب</p>
                                            <p className="text-xs font-black text-gray-900 dark:text-white truncate">{item.father}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold">السعر المطلوب</p>
                                            <p className="text-xl font-black text-green-500">{item.price}</p>
                                        </div>
                                        <Link to={`/horse/${item.microchipId}`} className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                                            التفاصيل
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredHorses.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-xl font-bold">لا توجد خيل معروضة في هذا التصنيف حالياً.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Sales;
