import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { horseApi, userApi } from '../api/api';

const Sales = () => {
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('الكل');
    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userApi.getProfile()
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error("Error fetching user:", err);
                    setUser(null);
                });
        } else {
            setUser(null);
        }

        fetchSalesHorses();
    }, [location.pathname]);

    const fetchSalesHorses = async () => {
        try {
            setLoading(true);
            const res = await horseApi.getSales();
            setHorses(res.data);
        } catch (err) {
            console.error("Error fetching sales horses:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHorses = horses.filter(horse => {
        const matchesCategory = activeFilter === 'الكل' || horse.gender === activeFilter;
        const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-4 md:px-16 py-12">
                {/* Premium Hero Section */}
                <div className="bg-white dark:bg-gray-900 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:row-reverse lg:flex-row relative group mb-24 border border-gray-100 dark:border-gray-800">
                    <div className="w-full lg:w-1/2 relative h-[500px] overflow-hidden">
                        <img src="/auctions/hero.png" alt="Purebred Arabian" className="w-full h-full object-cover group-hover:scale-110 transition duration-[3s]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-900 via-transparent to-transparent hidden lg:block"></div>
                        <div className="absolute top-10 right-10 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-2xl uppercase tracking-widest text-sm border border-white/20">
                            سوق النخبة ELITE MARKET
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center space-y-10 z-10">
                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                               سوق الخيل <br /> <span className="text-emerald-700">العربية الأصيلة</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-xl font-bold leading-relaxed max-w-xl">
                                منصة حصرية لبيع وشراء أرقى سلالات الخيل العربية مباشرة من المربين الموثوقين.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                            {(user?.role === 'Seller' || user?.role === 'Admin') && (
                                <Link to="/add-horse" className="bg-emerald-800 text-white px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all hover:-translate-y-2 flex items-center gap-4">
                                    <i className="fas fa-plus-circle"></i>
                                    <span>اعرض خيلك للبيع</span>
                                </Link>
                            )}
                            <button onClick={() => document.getElementById('sales-grid').scrollIntoView({ behavior: 'smooth' })} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-gray-50 transition-all">
                                تصفح الخيل المتاحة
                            </button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div id="sales-grid" className="flex flex-col lg:flex-row items-center gap-10 bg-white dark:bg-gray-900 p-8 md:px-12 rounded-[3rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 mb-20 sticky top-28 z-30">
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-700">
                           <i className="fas fa-filter"></i>
                        </div>
                        <span className="font-black text-gray-900 dark:text-white text-lg">تصفية:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 flex-1">
                        {['الكل', 'Male', 'Female'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-8 py-3 rounded-2xl text-base font-black transition-all duration-500 border-2 ${activeFilter === filter ? 'bg-emerald-800 text-white border-emerald-800 shadow-xl' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-transparent hover:border-emerald-200'}`}
                            >
                                {filter === 'الكل' ? 'الكل' : filter === 'Male' ? 'فحول' : 'أفراس'}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-96 group">
                        <input
                            type="text"
                            placeholder="ابحث باسم الخيل أو السلالة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-5 pr-14 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white shadow-inner"
                        />
                        <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-600 transition-colors"></i>
                    </div>
                </div>

                {/* Dynamic Sales Grid */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white underline decoration-emerald-500 decoration-8 underline-offset-8">المعروض حالياً</h2>
                        <span className="text-gray-400 font-bold uppercase tracking-widest">{filteredHorses.length} خيل متاح</span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="bg-white dark:bg-gray-900 rounded-[3.5rem] h-[600px] animate-pulse shadow-sm border border-gray-100 dark:border-gray-800"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {filteredHorses.map((horse) => (
                                <div key={horse.id} className="group bg-white dark:bg-gray-900 rounded-[3.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-50 dark:border-gray-800 hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4">
                                    <Link to={`/horse/${horse.id}`} className="relative h-80 overflow-hidden block">
                                        <img src={horse.imageUrl || '/horses/default.png'} alt={horse.name} className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="absolute top-6 left-6 bg-emerald-600/90 text-white px-5 py-2 rounded-2xl text-xs font-black shadow-xl backdrop-blur-md">
                                            {horse.isApproved ? 'موثق VERIFIED' : 'قيد المراجعة'}
                                        </div>
                                    </Link>
                                    
                                    <div className="p-10 space-y-8">
                                        <div className="text-center">
                                            <Link to={`/horse/${horse.id}`} className="text-3xl font-black text-gray-900 dark:text-white hover:text-emerald-700 transition-colors uppercase tracking-tight leading-tight block mb-2">{horse.name}</Link>
                                            <p className="text-emerald-700 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-900/30 px-5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800 inline-block text-xs uppercase tracking-widest">
                                                {horse.gender === 'Male' ? 'فحل' : 'فرس'} - {horse.breed}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-gray-50 dark:border-gray-700">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">الأب</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{horse.breeder || 'غير مسجل'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">العمر</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white">{horse.age} سنوات</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">السعر النهائي</p>
                                                <p className="text-2xl font-black text-emerald-700">{horse.price?.toLocaleString()} ج.م</p>
                                            </div>
                                            <Link to={`/horse/${horse.id}`} className="bg-gray-900 dark:bg-emerald-800 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-emerald-950 transition-all shadow-xl shadow-gray-900/20">
                                                عرض التفاصيل
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredHorses.length === 0 && (
                        <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <i className="fas fa-search-minus text-8xl text-gray-100 mb-8"></i>
                            <h3 className="text-3xl font-black text-gray-400">لا يوجد خيل معروض حالياً</h3>
                            <p className="text-gray-400 font-bold mt-2">جرب البحث بكلمات مختلفة أو تحقق لاحقاً من المعروض الجديد.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Sales;
