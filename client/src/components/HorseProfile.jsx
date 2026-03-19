import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { horseApi } from '../api/api';

const HorseProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('السجلات الصحية');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/account/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setUser(res.data)).catch(console.error);
        }

        fetchHorseData();
    }, [id]);

    const fetchHorseData = async () => {
        try {
            setLoading(true);
            const res = await horseApi.getHorse(id);
            setHorse(res.data);
        } catch (err) {
            console.error("Error fetching horse details:", err);
            setHorse(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الخيل؟ لا يمكن التراجع عن هذا الإجراء.")) return;
        try {
           await axios.delete(`/api/horse/${id}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           alert("تم حذف الخيل بنجاح.");
           navigate('/horses');
        } catch (err) {
           console.error("Error deleting horse:", err);
           alert("حدث خطأ أثناء الحذف.");
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'السجلات الصحية':
                return (
                    <div className="space-y-12 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'الحالة الصحية', value: horse.healthStatus || 'غير محدد', icon: 'shield-heart', color: 'bg-emerald-50 text-emerald-700' },
                                { label: 'التطعيمات', value: horse.vaccinated ? 'مكتملة' : 'غير مكتملة', icon: 'syringe', color: 'bg-emerald-50 text-emerald-800' },
                                { label: 'السجل الطبي', value: horse.healthReportUrl ? 'متاح للتحميل' : 'غير متوفر', icon: 'file-medical', color: 'bg-emerald-50 text-emerald-600' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 hover:border-emerald-200 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                                            <i className={`fas fa-${stat.icon}`}></i>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white uppercase">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {horse.healthReportUrl && (
                             <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-3xl text-emerald-600">
                                        <i className="fas fa-file-pdf"></i>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">التقرير المرفق</h3>
                                        <p className="text-gray-500 font-bold">يمكنك تحميل التقرير الطبي الكامل PDF</p>
                                    </div>
                                </div>
                                <a href={horse.healthReportUrl} target="_blank" rel="noopener noreferrer" className="bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black shadow-lg transition-all hover:-translate-y-1">تحميل التقرير</a>
                             </div>
                        )}
                    </div>
                );

            case 'النسب والسلالة':
                return (
                    <div className="animate-fade-in-up max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-10">شجرة النسب والسلالة</h3>
                            {horse.pedigreeImageUrl ? (
                                <img src={horse.pedigreeImageUrl} alt="Pedigree" className="w-full rounded-2xl shadow-xl border-4 border-emerald-50" />
                            ) : (
                                <div className="py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200">
                                   <i className="fas fa-sitemap text-6xl text-gray-200 mb-4"></i>
                                   <p className="text-gray-400 font-bold">لا توجد صورة شجرة نسب مرفقة لهذا الحصان</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'تاريخ السباقات':
                return (
                    <div className="animate-fade-in-up">
                        <div className="bg-white dark:bg-gray-800 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-b-4 border-emerald-700 inline-block pb-2">تاريخ السباقات والإنجازات</h3>
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100">
                               <p className="text-lg font-bold text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{horse.racingHistory || 'لا يوجد سجل سباقات مسجل.'}</p>
                            </div>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-900 font-sans" dir="rtl">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-emerald-700 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl font-black text-gray-500 animate-pulse">جاري إحضار سجلات الخيل...</p>
        </div>
    );

    if (!horse) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-900 font-sans px-4" dir="rtl">
            <i className="fas fa-horse-head text-8xl text-red-100 mb-8"></i>
            <p className="text-3xl font-black text-red-500 mb-6 uppercase tracking-widest">عذراً، الخيل غير موجود بالنظام</p>
            <button onClick={() => navigate(-1)} className="bg-emerald-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl">عودة للخلف</button>
        </div>
    );

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen font-sans text-right transition-all duration-500 overflow-x-hidden" dir="rtl">

            <Navbar />

            <main className="container mx-auto px-4 lg:px-16 py-32">
                <section className="flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-[45%] space-y-6">
                        <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[8px] border-white dark:border-gray-800 h-[650px] relative group">
                            <img src={horse.imageUrl || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200'} alt={horse.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                            {horse.isForSale && (
                                <div className="absolute top-10 right-10 bg-red-600 text-white px-8 py-3 rounded-2xl font-black shadow-2xl uppercase tracking-widest text-lg">
                                    للبيع FOR SALE
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{horse.name}</h1>
                            <div className="flex items-center gap-4">
                               <p className="text-xl text-emerald-800 dark:text-emerald-400 font-black bg-emerald-50 dark:bg-emerald-900/40 px-6 py-2 rounded-2xl border border-emerald-100 uppercase">
                                   خيل {horse.gender === 'Male' ? 'فحل (STALLION)' : 'فرس (MARE)'}
                               </p>
                               <span className="text-gray-300 font-black">|</span>
                               <p className="text-gray-500 font-bold uppercase tracking-widest">ID: {horse.microchipId}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'السلالة (STRAIN)', value: horse.breed, icon: 'dna' },
                                { label: 'العمر (AGE)', value: `${horse.age} سنوات`, icon: 'calendar-alt' },
                                { label: 'السعر (PRICE)', value: horse.price ? `${horse.price.toLocaleString()} ج.م` : 'غير محدد', icon: 'tag' },
                                { label: 'الموقع (LOCATION)', value: horse.claimLocation || 'غير محدد', icon: 'map-marker-alt' },
                                { label: 'المربي (BREEDER)', value: horse.breeder || 'غير محدد', icon: 'crown' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-50 dark:border-gray-700 shadow-sm flex items-center gap-5 hover:border-emerald-500 transition-all group">
                                    <div className="w-14 h-14 bg-emerald-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-emerald-600 text-xl group-hover:scale-110 transition-transform">
                                        <i className={`fas fa-${item.icon}`}></i>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-base font-black text-gray-900 dark:text-white uppercase">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-6">
                            <button className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-emerald-900/30 transition-all hover:-translate-y-2 uppercase tracking-widest">
                                {horse.isForSale ? 'تواصل للشراء CONTACT FOR BUY' : 'تواصل مع المالك CONTACT OWNER'}
                            </button>

                            {user && (user.role === 'Admin' || user.id === horse.ownerId) && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-50 text-red-500 border-2 border-red-100 w-full sm:w-24 py-6 sm:py-0 rounded-[2.5rem] font-black text-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-32">
                    <div className="flex items-center justify-center gap-12 border-b-2 border-gray-100 dark:border-gray-800 mb-16 overflow-x-auto pb-4 hide-scrollbar">
                        {['السجلات الصحية', 'النسب والسلالة', 'تاريخ السباقات'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-xl font-black transition-all relative pb-6 whitespace-nowrap ${activeTab === tab ? 'text-emerald-800 dark:text-emerald-400' : 'text-gray-400 hover:text-gray-900'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-[-3px] left-0 right-0 h-2 bg-emerald-700 rounded-full"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {renderTabContent()}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HorseProfile;