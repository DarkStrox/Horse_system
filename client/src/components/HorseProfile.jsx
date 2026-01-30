import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:5000';

const HorseProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('السجلات الصحية');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setUser(res.data)).catch(console.error);
        }

        // Fetch Horse Details
        axios.get(`http://localhost:5000/api/horse/${id}`)
            .then(res => {
                const data = res.data;
                // Map API data to UI structure
                setHorse({
                    id: data.microchipId,
                    name: data.name,
                    title: `خيل ${data.gender === 'Male' ? 'ذكر' : 'أنثى'} - ${data.breed}`,
                    regNo: data.microchipId,
                    breed: data.breed,
                    birth: `${data.age} سنوات`,
                    color: data.colour?.name || 'غير محدد',
                    img: data.imageUrl || '/horses/profile_main.png',
                    thumbnails: ['/auctions/hero.png', '/about/hero.png'], // Mock thumbnails
                    owner: data.owner ? (data.owner.user ? data.owner.user.fullName : 'Unknown') : 'Unknown',
                    healthStatus: data.healthStatus || 'غير محدد',
                    weight: 'غير محدد', // Not in DB yet
                    vaccinations: data.vaccinated ? 'مكتملة' : 'غير مكتملة',
                    nextCheck: '2024',
                    price: data.price,
                    isForSale: data.isForSale,
                    claimLocation: data.claimLocation,
                    racingHistory: data.racingHistory
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching horse:", err);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الخيل؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/horse/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
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
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Health Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'الحالة العامة', value: horse.healthStatus, icon: 'shield-heart', color: 'bg-green-50 text-green-500', detail: 'آخر تحديث: اليوم' },
                                { label: 'الوزن الحالي', value: horse.weight, icon: 'weight-hanging', color: 'bg-blue-50 text-blue-500', detail: 'ضمن المعدل الطبيعي' },
                                { label: 'التطعيمات', value: horse.vaccinations, icon: 'crutch', color: 'bg-purple-50 text-purple-500', detail: 'تم تحديث السجل الشهر الماضي' },
                                { label: 'الفحص الدوري', value: horse.nextCheck, icon: 'calendar-check', color: 'bg-orange-50 text-orange-500', detail: 'موعد الفحص القادم' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}>
                                            <i className={`fas fa-${stat.icon}`}></i>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold">{stat.label}</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold border-t border-gray-50 dark:border-gray-800 pt-4 truncate">{stat.detail}</p>
                                </div>
                            ))}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden relative">
                            <div className="flex items-center space-x-reverse space-x-4 mb-10">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <i className="fas fa-notes-medical"></i>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">سجل التطعيمات والزيارات</h3>
                            </div>

                            <div className="relative space-y-12">
                                {/* Vertical Line */}
                                <div className="absolute top-0 bottom-0 right-5 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

                                {[
                                    { title: 'تطعيم الانفلونزا والتيتانوس', doctor: 'د.أحمد البخاري - عيادة الوادي', date: 'JAN 2024', status: 'مكتمل', desc: 'تم إعطاء الجرعة السنوية المعتادة، استجابة طبيعية ولا توجد أعراض جانبية.', icon: 'check-circle', iconColor: 'text-green-500' },
                                    { title: 'فحص الأسنان الدوري', doctor: 'د.سارة التميمي', date: 'DEC 2023', status: 'روتيني', desc: 'فحص شامل للأسنان، برد خفيف للأسنان الطاحنة العلوية اليسرى.', icon: 'search', iconColor: 'text-blue-500' },
                                    { title: 'تحاليل الدم الشاملة', doctor: 'مختبرات الخيالة', date: 'NOV 2023', status: 'مختبر', desc: 'فحص الهيموجلوبين ووظائف الكبد والكلى، النتائج جميعها ضمن المعدل الطبيعي.', icon: 'flask', iconColor: 'text-purple-500' }
                                ].map((item, i) => (
                                    <div key={i} className="relative pr-16 group">
                                        <div className="absolute right-3.5 top-0 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-green-500 z-10 group-hover:scale-125 transition"></div>
                                        <div className="bg-gray-50/50 dark:bg-gray-800/30 p-8 rounded-3xl border border-transparent hover:border-green-100 dark:hover:border-green-900/30 transition-all duration-300">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center space-x-reverse space-x-4">
                                                    <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center text-xl ${item.iconColor}`}>
                                                        <i className={`fas fa-${item.icon}`}></i>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 dark:text-white">{item.title}</h4>
                                                        <p className="text-xs text-gray-400 font-bold">{item.doctor}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-reverse space-x-4">
                                                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black">{item.status}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold">{item.date}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-12 py-4 bg-gray-50 dark:bg-gray-800 text-gray-400 font-black rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                                عرض المزيد من السجلات
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="py-20 text-center animate-in fade-in zoom-in">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-gray-300">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">قليلاً من الصبر...</h3>
                        <p className="text-gray-400 font-bold">هذا القسم قيد التطوير حالياً لتقديم أفضل تجربة ممكنة.</p>
                    </div>
                );
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFBF9] dark:bg-gray-950 font-sans"><p className="text-xl font-bold text-gray-400">جاري تحميل بيانات الخيل...</p></div>;

    if (!horse) return <div className="min-h-screen flex items-center justify-center bg-[#FAFBF9] dark:bg-gray-950 font-sans"><p className="text-xl font-bold text-red-400">الخيل غير موجود.</p></div>;

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <main className="container mx-auto px-16 py-12">
                {/* Header Profile Section */}
                <section className="flex flex-col lg:flex-row gap-16 animate-in fade-in slide-in-from-top-8 duration-700">
                    {/* Image Gallery */}
                    <div className="w-full lg:w-[45%] space-y-6">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900 h-[600px] relative group">
                            <img src={horse.img} alt={horse.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                            {horse.isForSale && (
                                <div className="absolute top-6 right-6 bg-red-500 text-white px-6 py-2 rounded-xl font-black shadow-lg">
                                    للبيع
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {horse.thumbnails.map((thumb, i) => (
                                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-105 transition">
                                    <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info & Stats */}
                    <div className="flex-1 space-y-10 py-6">
                        <div className="space-y-2">
                            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tight">{horse.name}</h1>
                            <p className="text-xl text-gray-400 font-bold">{horse.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'رقم التسجيل', value: horse.regNo, icon: 'id-card' },
                                { label: 'السلالة', value: horse.breed, icon: 'dna' },
                                { label: 'تاريخ الميلاد', value: horse.birth, icon: 'calendar-alt' },
                                { label: 'اللون', value: horse.color, icon: 'palette' },
                                { label: 'السعر', value: horse.price ? `${horse.price.toLocaleString()} ج.م` : 'على السوم', icon: 'tag' },
                                { label: 'الموقع', value: horse.claimLocation || 'غير محدد', icon: 'map-marker-alt' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-reverse space-x-4">
                                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                        <i className={`fas fa-${item.icon}`}></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-gray-800 dark:text-white">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                            <div className="flex items-center space-x-reverse space-x-4">
                                <div className="w-14 h-14 rounded-full bg-[#E9F9E5] flex items-center justify-center text-[#48B02C] text-xl shadow-inner">
                                    <i className="fas fa-user-tie"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold mb-1">المالك الحالي</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">{horse.owner}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to={`/contact-seller/${horse.id}`} className="flex-1 bg-[#76E05B] text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-green-100 dark:shadow-green-900/20 hover:bg-green-500 transition flex items-center justify-center space-x-reverse space-x-4">
                                <i className="fas fa-phone-alt"></i>
                                <span>{horse.isForSale ? 'تواصل للشراء' : 'تواصل مع المالك'}</span>
                            </Link>

                            {user && user.role === 'Admin' && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white w-20 rounded-3xl font-black text-xl shadow-xl shadow-red-100 dark:shadow-red-900/20 hover:bg-red-600 transition flex items-center justify-center"
                                    title="حذف الخيل"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="mt-32">
                    <div className="flex items-center justify-center space-x-reverse space-x-12 mb-16 border-b border-gray-100 dark:border-gray-900 overflow-x-auto pb-4">
                        {['النسب والسلالة', 'تاريخ العرض', 'السجلات الصحية', 'تحليل الذكاء الاصطناعي'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-lg font-black transition-all duration-300 relative pb-4 whitespace-nowrap ${activeTab === tab ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-green-500 rounded-full animate-in zoom-in duration-300"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {renderTabContent()}
                    </div>
                </section>
            </main>

            {/* Sticky Action Footer for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-4 border-t border-gray-100 dark:border-gray-900 z-50 flex gap-4">
                <button className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black text-sm shadow-lg">تواصل</button>
                <button className="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center text-gray-400"><i className="far fa-heart"></i></button>
            </div>
        </div>
    );
};

export default HorseProfile;
