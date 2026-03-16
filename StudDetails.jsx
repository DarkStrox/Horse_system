import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// البيانات المؤقتة
// No static data here anymore

// --- القوائم الشاملة الثابتة للفلاتر ---
const STANDARD_BREEDS = ['صقلاوي', 'صقلاوي جدراني', 'كحيلان', 'عبيان', 'عبية الشراك', 'حمداني', 'هدبان', 'شويمان', 'معنقي', 'أخرى'];
const STANDARD_COLORS = ['أشقر', 'رمادي', 'أشعل (رمادي)', 'بني', 'كميت (بني)', 'أدهم (أسود)', 'أبيض', 'أحمر', 'أبرش'];
const STANDARD_TYPES = ['فحل', 'فرس', 'مهر', 'مهرة', 'خصي'];

// توليد السنوات من 2010 حتى السنة الحالية (مثلاً 2026)
const currentYear = new Date().getFullYear();
const STANDARD_YEARS = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

const StudDetails = () => {
    const { studName } = useParams();
    const navigate = useNavigate();
    const formattedName = studName ? studName.replace(/-/g, ' ') : 'اسم المربط';
    const [stud, setStud] = useState(null);
    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [filters, setFilters] = useState({ breed: '', color: '', year: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchStudAndHorses = async () => {
            setLoading(true);
            try {
                // 1. Fetch Stud Info by Name/Slug
                const studRes = await axios.get(`http://localhost:5000/api/stud/by-name/${studName}`);
                setStud(studRes.data);

                // 2. Fetch Horses for this Stud
                const horsesRes = await axios.get(`http://localhost:5000/api/horse/stud/${studRes.data.studId}`);
                setHorses(horsesRes.data);

                // Initialize branch logic if needed
                if (horsesRes.data.length > 0) {
                    const branchesArr = [...new Set(horsesRes.data.map(h => h.branch))];
                    if (branchesArr.length === 1) {
                        setSelectedBranch(branchesArr[0]);
                        setIsModalOpen(false);
                    } else if (branchesArr.length > 1) {
                        setIsModalOpen(true);
                    }
                } else {
                    // No horses, just show the page
                    setSelectedBranch("الفرع الرئيسي");
                    setIsModalOpen(false);
                }
            } catch (error) {
                console.error("Error fetching stud details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (studName) {
            fetchStudAndHorses();
        }
    }, [studName]);

    const allStudHorses = horses;
    const branches = [...new Set(allStudHorses.map(h => h.branch))];

    const handleDeleteHorse = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        const confirmDelete = window.confirm('هل أنت متأكد من رغبتك في حذف هذا الحصان من سجلات المربط؟');
        if (confirmDelete) {
            setHorses(horses.filter(horse => horse.id !== id));
        }
    };

    const handleCloseModal = () => {
        if (selectedBranch) {
            setIsModalOpen(false);
        } else {
            navigate(-1);
        }
    };

    const currentHorsesList = allStudHorses.filter(h => h.branch === selectedBranch);

    // تطبيق الفلاتر على الخيول
    const displayHorses = currentHorsesList
        .filter(h => (filters.breed ? h.breed === filters.breed : true))
        .filter(h => (filters.color ? h.color === filters.color : true))
        .filter(h => (filters.year ? h.birth === filters.year : true))
        .filter(h => (filters.type ? h.type === filters.type : true));

    // دمج القوائم الشاملة مع أي بيانات جديدة قد تضاف مستقبلاً (لضمان عدم اختفاء أي خيار)
    const filterOptions = {
        breeds: [...new Set([...STANDARD_BREEDS, ...currentHorsesList.map(h => h.breed)])],
        colors: [...new Set([...STANDARD_COLORS, ...currentHorsesList.map(h => h.color)])],
        years: [...new Set([...STANDARD_YEARS, ...currentHorsesList.map(h => h.birth)])].sort((a, b) => b - a), // ترتيب تنازلي للسنوات
        types: [...new Set([...STANDARD_TYPES, ...currentHorsesList.map(h => h.type)])],
    };

    return (
        <>
            <style>{`
                @keyframes fadeUpHeavy { from { opacity: 0; transform: translateY(60px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes modalBounce { 0% { opacity: 0; transform: scale(0.85) translateY(30px); } 50% { opacity: 1; transform: scale(1.02) translateY(-5px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-fade-heavy { animation: fadeUpHeavy 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
                .animate-modal { animation: modalBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>

            <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen text-right font-sans transition-colors duration-500 selection:bg-teal-100 overflow-x-hidden" dir="rtl">
                <Navbar />

                <div className="relative bg-teal-800 dark:bg-gray-900 text-white pt-28 pb-16 px-8 flex flex-col items-center justify-center overflow-hidden animate-fade-heavy">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
                    <div className="relative z-10 text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg mb-2">
                            <img src="https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200" alt="Logo" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white">{stud?.nameArabic || formattedName}</h1>
                        <p className="text-teal-100 dark:text-teal-400 text-lg font-black bg-teal-900/50 dark:bg-teal-900/30 px-6 py-2 rounded-full border border-teal-700/50">
                            إجمالي الخيل المسجلة: {allStudHorses.length} حصان
                        </p>
                    </div>
                </div>

                {/* --- نافذة اختيار الفرع --- */}
                {isModalOpen && branches.length > 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-opacity duration-300">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-modal relative border border-white/20 dark:border-gray-700">

                            <button
                                onClick={handleCloseModal}
                                className="absolute top-6 left-6 p-2 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-full transition-colors z-10"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <div className="bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900/30 p-10 text-center">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">مرحباً بك في {formattedName}</h2>
                                <p className="text-teal-700 dark:text-teal-400 font-bold text-lg">يرجى اختيار الفرع لعرض الخيل المتواجدة به</p>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {branches.map((branch, index) => {
                                        const horsesInBranch = allStudHorses.filter(h => h.branch === branch).length;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSelectedBranch(branch);
                                                    setFilters({ breed: '', color: '', year: '', type: '' });
                                                    setIsModalOpen(false);
                                                }}
                                                className="flex items-center p-5 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-[2rem] hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-300 group text-right"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 text-gray-400 rounded-full flex items-center justify-center ml-4 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400">{branch}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1">{horsesInBranch} رأس خيل</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 lg:px-16 py-12">
                    {loading ? (
                        <div className="text-center py-20 font-bold text-gray-400 flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            جاري تحميل البيانات...
                        </div>
                    ) : (selectedBranch || horses.length === 0) && !isModalOpen && (
                        <div className="animate-fade-heavy">

                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedBranch}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">عرض الخيل المتواجدة بهذا الفرع</p>
                                    </div>
                                </div>
                                {branches.length > 1 && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-teal-700 hover:text-white text-gray-700 dark:text-gray-200 font-black rounded-2xl transition-all border border-gray-200 dark:border-gray-600"
                                    >
                                        تغيير الفرع
                                    </button>
                                )}
                            </div>

                            {/* --- منطقة الفلاتر (تعدلت لتصبح شاملة) --- */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center mb-12">
                                <div className="flex items-center gap-2 font-black text-gray-800 dark:text-gray-200 ml-4">
                                    <i className="fas fa-filter text-teal-600"></i> تصفية الخيل:
                                </div>

                                <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 dark:text-white focus:border-teal-500 outline-none font-bold text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                                    <option value="">كل الأنواع</option>
                                    {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>

                                <select value={filters.breed} onChange={e => setFilters({ ...filters, breed: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 dark:text-white focus:border-teal-500 outline-none font-bold text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                                    <option value="">كل السلالات</option>
                                    {filterOptions.breeds.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>

                                <select value={filters.color} onChange={e => setFilters({ ...filters, color: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 dark:text-white focus:border-teal-500 outline-none font-bold text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                                    <option value="">كل الألوان</option>
                                    {filterOptions.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>

                                <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border-2 border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 dark:text-white focus:border-teal-500 outline-none font-bold text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                                    <option value="">سنة الميلاد</option>
                                    {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>

                                <button
                                    onClick={() => setFilters({ breed: '', color: '', year: '', type: '' })}
                                    className="px-8 py-4 rounded-2xl font-black bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-700 hover:text-white transition-all w-full sm:w-auto mt-2 sm:mt-0"
                                >
                                    إلغاء التصفية
                                </button>
                            </div>

                            {/* --- شبكة الخيول المعروضة --- */}
                            {displayHorses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {displayHorses.map((horse, idx) => (
                                        <Link
                                            key={horse.id}
                                            to={`/horse/${horse.id}`}
                                            className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group transform hover:-translate-y-2 relative block"
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <button
                                                onClick={(e) => handleDeleteHorse(horse.id, e)}
                                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0"
                                                title="حذف الحصان"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>

                                            <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                <img src={horse.img} alt={horse.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm text-gray-800 dark:text-white group-hover:opacity-0 transition-opacity">#{horse.id}</div>
                                                <div className="absolute top-4 left-4 bg-teal-800/90 dark:bg-teal-600/90 text-white backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">{horse.type}</div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow text-center">
                                                <h3 className="font-black text-xl text-gray-900 dark:text-white mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{horse.name}</h3>
                                                <p className="text-sm text-teal-700 dark:text-teal-500 font-bold mb-6">{horse.breed}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 rounded-2xl mt-auto border border-gray-100 dark:border-gray-700">
                                                    <span className="flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>{horse.color}</span>
                                                    <span className="font-black border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">مواليد: {horse.birth}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-gray-600">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">لا توجد خيول مطابقة</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold">حاول تغيير خيارات التصفية للعثور على ما تبحث عنه.</p>
                                    <button onClick={() => setFilters({ breed: '', color: '', year: '', type: '' })} className="mt-6 px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                                        إزالة التصفية
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </>
    );
};

export default StudDetails;