import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { studApi } from '../api/api';

const STANDARD_BREEDS = ['صقلاوي', 'صقلاوي جدراني', 'كحيلان', 'عبيان', 'عبية الشراك', 'حمداني', 'هدبان', 'شويمان', 'معنقي', 'أخرى'];
const STANDARD_COLORS = ['أشقر', 'رمادي', 'أشعل (رمادي)', 'بني', 'كميت (بني)', 'أدهم (أسود)', 'أبيض', 'أحمر', 'أبرش'];
const STANDARD_TYPES = ['فحل', 'فرس', 'مهر', 'مهرة', 'خصي'];

const currentYear = new Date().getFullYear();
const STANDARD_YEARS = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

const StudDetails = () => {
    const { studName } = useParams();
    const navigate = useNavigate();

    const [currentStud, setCurrentStud] = useState(null);
    const [horses, setHorses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [filters, setFilters] = useState({ breed: '', color: '', year: '', type: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- السر هنا: فك تشفير الرابط العربي باستخدام decodeURIComponent ---
    const decodedStudName = studName ? decodeURIComponent(studName) : '';

    const fetchStudDetails = async () => {
        try {
            setLoading(true);
            const res = await studApi.getByName(decodedStudName);
            const stud = res.data;
            setCurrentStud({
                id: stud.studId,
                name: stud.nameArabic || stud.nameEnglish,
                type: stud.studType,
                img: stud.imageUrl,
                city: stud.location?.city || 'Unknown',
                email: stud.email,
                phone: stud.phones?.[0]?.phoneNumber || 'N/A',
                description: stud.description,
                facebookUrl: stud.facebookUrl,
                instagramUrl: stud.instagramUrl,
                twitterUrl: stud.twitterUrl,
                websiteUrl: stud.websiteUrl
            });
            
            // Map horses if available
            if (stud.horses) {
                setHorses(stud.horses.map(h => ({
                    id: h.horseId,
                    name: h.nameArabic || h.nameEnglish,
                    type: h.horseType,
                    breed: h.breed,
                    color: h.color,
                    birth: h.birthDate ? new Date(h.birthDate).getFullYear().toString() : 'N/A',
                    img: h.imageUrl,
                    owner: stud.nameArabic || stud.nameEnglish,
                    branch: h.branch || 'الفرع الرئيسي'
                })));
            }
        } catch (err) {
            console.error("Error fetching stud details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudDetails();
    }, [decodedStudName]);

    const allStudHorses = horses;
    const branches = [...new Set(allStudHorses.map(h => h.branch))];

    useEffect(() => {
        if (branches.length === 1 && !selectedBranch) {
            setSelectedBranch(branches[0]);
            setIsModalOpen(false);
        } else if (branches.length > 1 && !selectedBranch) {
            setIsModalOpen(true);
        }
    }, [branches, selectedBranch]);

    const handleDeleteHorse = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الحصان من سجلات المربط؟')) {
            // TODO: Implement actual delete horse API call
            setHorses(horses.filter(horse => horse.id !== id));
        }
    };

    const handleCloseModal = () => {
        if (selectedBranch) { setIsModalOpen(false); } else { navigate(-1); }
    };

    const currentHorsesList = allStudHorses.filter(h => h.branch === selectedBranch);

    const displayHorses = currentHorsesList
        .filter(h => (filters.breed ? h.breed === filters.breed : true))
        .filter(h => (filters.color ? h.color === filters.color : true))
        .filter(h => (filters.year ? h.birth === filters.year : true))
        .filter(h => (filters.type ? h.type === filters.type : true));

    const filterOptions = {
        breeds: [...new Set([...STANDARD_BREEDS, ...currentHorsesList.map(h => h.breed)])],
        colors: [...new Set([...STANDARD_COLORS, ...currentHorsesList.map(h => h.color)])],
        years: [...new Set([...STANDARD_YEARS, ...currentHorsesList.map(h => h.birth)])].sort((a, b) => b - a),
        types: [...new Set([...STANDARD_TYPES, ...currentHorsesList.map(h => h.type)])],
    };

    const getImageUrl = (url) => {
        if (!url) return "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200";
        if (url.startsWith('http')) return url;
        return url;
    };

    if (loading) {
        return (
            <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-800"></div>
            </div>
        );
    }

    if (!currentStud && allStudHorses.length === 0) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen text-right font-sans selection:bg-emerald-200/50" dir="rtl">
                <Navbar />
                <div className="flex flex-col items-center justify-center pt-40 pb-20">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-800">
                        <i className="fas fa-exclamation-triangle text-4xl"></i>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">عذراً، لم نتمكن من العثور على المربط!</h1>
                    <p className="text-gray-500 font-bold mb-8">قد يكون الاسم غير صحيح أو لا توجد خيول مسجلة باسم "{decodedStudName.replace(/-/g, ' ')}".</p>
                    <button onClick={() => navigate('/studs')} className="px-8 py-3 bg-emerald-800 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/30 hover:-translate-y-1 transition-all">
                        العودة لدليل المرابط
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <style>{`
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes modalEntry { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-modal { animation: modalEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(6, 78, 59, 0.2); border-radius: 10px; }
            `}</style>

            <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right font-sans transition-colors duration-500 selection:bg-emerald-200/50 overflow-x-hidden" dir="rtl">
                <Navbar />

                {/* --- الهيرو سيكشن --- */}
                <div className="relative bg-gradient-to-b from-emerald-900 to-emerald-800 text-white pt-32 pb-16 px-8 flex flex-col items-center justify-center overflow-hidden animate-fade-in-up">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>
                    <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">

                        {/* لوجو المربط */}
                        <div className="w-28 h-28 mx-auto bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-xl mb-2 border-2 border-emerald-100 dark:border-gray-700">
                            <img src={getImageUrl(currentStud?.img)} alt={currentStud?.name} className="w-full h-full object-cover rounded-full" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white">{currentStud?.name}</h1>

                        {/* بيانات الاتصال الخاصة بالمربط */}
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-emerald-50 dark:text-gray-300 pt-2">
                            {currentStud?.city && <span className="bg-black/20 px-4 py-1.5 rounded-full"><i className="fas fa-map-marker-alt text-emerald-400 ml-2"></i>{currentStud.city}</span>}
                            {currentStud?.email && <span className="bg-black/20 px-4 py-1.5 rounded-full"><i className="fas fa-envelope text-emerald-400 ml-2"></i>{currentStud.email}</span>}
                            {currentStud?.phone && <span className="bg-black/20 px-4 py-1.5 rounded-full" dir="ltr"><i className="fas fa-phone text-emerald-400 mr-2"></i>{currentStud.phone}</span>}
                        </div>

                        <div className="pt-4">
                            <span className="text-white dark:text-emerald-400 text-lg font-bold bg-white/20 dark:bg-gray-800/60 px-8 py-2.5 rounded-full border border-white/30 dark:border-gray-600 inline-block shadow-sm">
                                إجمالي الخيل المسجلة: {allStudHorses.length} حصان
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- نافذة اختيار الفرع (المودال) --- */}
                {isModalOpen && branches.length > 1 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 transition-opacity duration-300">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-modal relative border border-white/20 dark:border-gray-700">
                            <button onClick={handleCloseModal} className="absolute top-6 left-6 p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 rounded-full transition-colors z-10">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>

                            <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 p-10 text-center">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">مرحباً بك في {currentStud?.name}</h2>
                                <p className="text-emerald-800 dark:text-emerald-400 font-bold text-lg">يرجى اختيار الفرع لعرض الخيل المتواجدة به</p>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {branches.map((branch, index) => {
                                        const horsesInBranch = allStudHorses.filter(h => h.branch === branch).length;
                                        return (
                                            <button key={index} onClick={() => { setSelectedBranch(branch); setFilters({ breed: '', color: '', year: '', type: '' }); setIsModalOpen(false); }} className="flex items-center p-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2rem] hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group text-right shadow-sm">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center ml-4 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-400">{branch}</h3>
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
                    {selectedBranch && !isModalOpen && (
                        <div className="animate-fade-in-up">

                            {/* --- هيدر الفرع --- */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-gray-700 text-emerald-800 dark:text-emerald-400 rounded-full flex items-center justify-center border border-emerald-100 dark:border-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedBranch}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">عرض الخيل المتواجدة بهذا الفرع</p>
                                    </div>
                                </div>
                                {branches.length > 1 && (
                                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-emerald-800 dark:hover:bg-emerald-700 hover:text-white text-gray-700 dark:text-gray-200 font-black rounded-2xl transition-all border border-gray-200 dark:border-gray-600">تغيير الفرع</button>
                                )}
                            </div>

                            {/* --- منطقة الفلاتر --- */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-lg shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center mb-12">
                                <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white ml-4">
                                    <i className="fas fa-filter text-emerald-800 dark:text-emerald-400"></i> تصفية الخيل:
                                </div>

                                <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm transition-all hover:bg-white dark:hover:bg-gray-600 cursor-pointer">
                                    <option value="">كل الأنواع</option>
                                    {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select value={filters.breed} onChange={e => setFilters({ ...filters, breed: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm transition-all hover:bg-white dark:hover:bg-gray-600 cursor-pointer">
                                    <option value="">كل السلالات</option>
                                    {filterOptions.breeds.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select value={filters.color} onChange={e => setFilters({ ...filters, color: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm transition-all hover:bg-white dark:hover:bg-gray-600 cursor-pointer">
                                    <option value="">كل الألوان</option>
                                    {filterOptions.colors.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })} className="flex-1 min-w-[140px] p-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-sm transition-all hover:bg-white dark:hover:bg-gray-600 cursor-pointer">
                                    <option value="">سنة الميلاد</option>
                                    {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>

                                <button onClick={() => setFilters({ breed: '', color: '', year: '', type: '' })} className="px-8 py-4 rounded-2xl font-black bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-all w-full sm:w-auto mt-2 sm:mt-0">
                                    إلغاء التصفية
                                </button>
                            </div>

                            {/* --- شبكة الخيول المعروضة --- */}
                            {displayHorses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {displayHorses.map((horse, idx) => (
                                        <div key={horse.id} className="animate-fade-in-up opacity-0 h-full" style={{ animationDelay: `${idx * 0.15}s` }}>
                                            <Link to={`/horse/${horse.id}`} className="block h-full bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(26,71,49,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden flex flex-col relative group transform hover:-translate-y-2">

                                                <button onClick={(e) => handleDeleteHorse(horse.id, e)} className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-red-500 hover:text-white text-red-500 dark:text-red-400 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0" title="حذف الحصان">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>

                                                <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                    <img src={getImageUrl(horse.img)} alt={horse.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm text-gray-900 dark:text-white group-hover:opacity-0 transition-opacity border border-gray-100 dark:border-gray-700">#{horse.id}</div>
                                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">{horse.type}</div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-grow text-center">
                                                    <h3 className="font-black text-xl text-gray-900 dark:text-white mb-1 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">{horse.name}</h3>
                                                    <p className="text-sm text-emerald-800 dark:text-emerald-400 font-bold mb-6">{horse.breed}</p>

                                                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-2xl mt-auto border border-gray-100 dark:border-gray-600">
                                                        <span className="flex items-center gap-2 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{horse.color}</span>
                                                        <span className="font-black border-r border-gray-200 dark:border-gray-600 pr-3 mr-3 text-gray-900 dark:text-white">مواليد: {horse.birth}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in-up">
                                    <div className="w-24 h-24 bg-emerald-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-800 dark:text-emerald-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">لا توجد خيول مطابقة</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold">حاول تغيير خيارات التصفية للعثور على ما تبحث عنه.</p>
                                    <button onClick={() => setFilters({ breed: '', color: '', year: '', type: '' })} className="mt-8 px-10 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:-translate-y-1 transition-all">
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