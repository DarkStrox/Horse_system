import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { horseApi } from '../api/api';

const HorseList = () => {
    const navigate = useNavigate();
    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('الكل');

    useEffect(() => {
        fetchHorses();
    }, []);

    const fetchHorses = async () => {
        try {
            setLoading(true);
            const res = await horseApi.getHorses();
            setHorses(res.data);
        } catch (err) {
            console.error("Error fetching horses:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHorses = horses.filter(horse => {
        const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'الكل' || horse.gender === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right font-sans transition-colors duration-500" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 md:px-16 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="relative group">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 underline decoration-emerald-500 decoration-8 underline-offset-[12px]">قائمة الخيل</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-4">استكشف نخبة الخيول العربية الأصيلة في نظامنا</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <Link
                            to="/add-horse"
                            className="bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <i className="fas fa-plus-circle text-2xl"></i> 
                            <span>إضافة خيل جديد</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-16 border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-8 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fas fa-search absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors"></i>
                        <input
                            type="text"
                            placeholder="ابحث بالاسم أو السلالة..."
                            className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-emerald-500 rounded-2xl py-5 pr-16 pl-6 outline-none transition-all dark:text-white font-bold text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        {['الكل', 'Male', 'Female'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-10 py-4 rounded-2xl font-black transition-all whitespace-nowrap border-2 text-base ${filterType === type ? 'bg-emerald-800 text-white border-emerald-800 shadow-lg shadow-emerald-900/20' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-emerald-200'}`}
                            >
                                {type === 'الكل' ? 'الكل' : type === 'Male' ? 'فحل' : 'فرس'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-32 bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mx-auto mb-8 shadow-lg shadow-emerald-900/10"></div>
                        <p className="text-2xl font-black text-emerald-900 dark:text-emerald-400">جاري تحميل سجلات الخيل...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                        {filteredHorses.length > 0 ? (
                            filteredHorses.map((horse) => (
                                <Link
                                    key={horse.id}
                                    to={`/horse/${horse.id}`}
                                    className="group bg-white dark:bg-gray-800 rounded-[3rem] border border-gray-50 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col h-full transform hover:-translate-y-4"
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={horse.imageUrl || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500'}
                                            alt={horse.name}
                                            className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                                        <div className={`absolute top-6 left-6 backdrop-blur-md rounded-2xl px-5 py-2.5 border border-white/30 text-white text-xs font-black shadow-xl tracking-widest uppercase ${horse.isApproved ? 'bg-emerald-600/90' : 'bg-red-500/90'}`}>
                                            {horse.isApproved ? 'نشط بالنظام' : 'قيد المراجعة'}
                                        </div>
                                    </div>

                                    <div className="p-10 flex flex-col flex-grow text-center relative mt-[-20px] bg-white dark:bg-gray-800 rounded-t-[3rem] z-10">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-emerald-700 transition-colors uppercase tracking-tight leading-tight">{horse.name}</h3>
                                        <p className="text-emerald-800 dark:text-emerald-400 font-bold mb-8 bg-emerald-50 dark:bg-emerald-900/30 inline-block px-5 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800 self-center text-sm">
                                            {horse.gender === 'Male' ? 'فحل (S)' : 'فرس (M)'} - {horse.breed}
                                        </p>

                                        <div className="grid grid-cols-2 gap-6 mb-8 pt-8 border-t-2 border-gray-50 dark:border-gray-700">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">المالك الحالي</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{horse.owner}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-widest">المربط / الفرع</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white truncate">{horse.studName || 'الفرع الرئيسي'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-6 flex items-center justify-center text-emerald-800 dark:text-emerald-400 font-black transition-all group-hover:gap-6 gap-3">
                                            <span className="text-base uppercase tracking-wider">عرض الملف</span>
                                            <i className="fas fa-arrow-left group-hover:-translate-x-2 transition-transform"></i>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                                <i className="fas fa-search text-7xl text-gray-100 mb-8"></i>
                                <h4 className="text-2xl font-black text-gray-400">لا توجد نتائج تطابق بحثك</h4>
                                <p className="text-gray-400 font-bold mt-2">حاول البحث بكلمات أخرى أو تغيير خيارات الفلترة</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default HorseList;