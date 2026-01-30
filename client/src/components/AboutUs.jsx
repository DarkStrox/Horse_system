import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const AboutUs = () => {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user:", err));
        }
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
        if (!url) return "https://ui-avatars.com/api/?name=" + (user?.fullName || "User");
        if (url.startsWith('http')) return url;
        return API_BASE_URL + url;
    };

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-16 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    <div>
                        <span className="bg-[#E9F9E5] text-[#48B02C] px-4 py-1.5 rounded-full text-xs font-black mb-6 inline-block tracking-wider">عن المنصة</span>
                        <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8">
                            إرث الخيل العربية،<br />
                            <span className="text-[#76E05B]">بمنظور رقمي متجدد.</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-xl">
                            نحن أول منصة عربية متكاملة تهدف إلى رقمنة تاريخ وسلالات الخيل العربية الأصيلة، وتوفير بيئة موثوقة للمربين والهواة لتوثيق، تداول، والاحتفاء بهذا الإرث العظيم.
                        </p>
                    </div>

                    <div className="flex items-center space-x-reverse space-x-6">
                        <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-black transition shadow-xl">
                            تعرف على رسالتنا
                        </button>
                        <button className="flex items-center space-x-reverse space-x-3 text-gray-600 dark:text-gray-300 font-bold hover:text-green-500 transition group">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-green-500 transition">
                                <i className="fas fa-play text-xs"></i>
                            </div>
                            <span>تشاهد الفيديو التعريفي</span>
                        </button>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 relative animate-in fade-in zoom-in duration-1000">
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900">
                        <img src="/about/hero.png" alt="Majestic Arabian Horse" className="w-full h-[600px] object-cover" />
                    </div>
                    {/* Floating Info Card */}
                    <div className="absolute -bottom-6 -right-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 z-20 flex items-center space-x-reverse space-x-4 animate-bounce-subtle">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold">موثوقية البيانات</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white">سجلات معتمدة 100%</p>
                        </div>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-100/50 dark:bg-green-900/20 rounded-full blur-3xl -z-10"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50/50 dark:bg-gray-900/20">
                <div className="container mx-auto px-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'خيل مسجل', value: '5,000' },
                            { label: 'مدرب ومالك', value: '1,200' },
                            { label: 'مزاد ناجح', value: '350' },
                            { label: 'دعم فني', value: '24/7' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2">
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                                <p className="text-gray-400 font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-32 container mx-auto px-16">
                <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white">جوهر النظام</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        نجمع بين أصالة الماضي وتقنيات المستقبل لخدمة مجتمع الخيل العربية.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            title: 'رسالتنا',
                            icon: 'flag',
                            color: 'bg-green-50 text-green-500',
                            desc: 'تمكين ملاك ومربي الخيل العربية من خلال توفير منصة رقمية شاملة تسهل إدارة السجلات، التوثيق، وعمليات البيع والشراء بأعلى معايير الشفافية.'
                        },
                        {
                            title: 'رؤيتنا',
                            icon: 'eye',
                            color: 'bg-blue-50 text-blue-500',
                            desc: 'أن نكون المرجع العالمي الأول والموثوق لكل ما يتعلق بالخيل العربية، وواجهة حضارية تعكس عراقة هذا الموروث للعالم أجمع.'
                        },
                        {
                            title: 'قيمنا',
                            icon: 'gem',
                            color: 'bg-yellow-50 text-yellow-500',
                            desc: 'الأصالة في المحتوى، الشفافية في التعاملات، والابتكار المستمر في الحلول التقنية لتلبية احتياجات مجتمعنا.'
                        }
                    ].map((card, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center space-y-8">
                            <div className={`${card.color} w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shadow-inner`}>
                                <i className={`fas fa-${card.icon}`}></i>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{card.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-bold">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-32 container mx-auto px-16">
                <div className="flex flex-col lg:flex-row items-center gap-24">
                    <div className="w-full lg:w-1/2 space-y-12">
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">لماذا نظام الخيل العربية؟</h2>

                        <div className="space-y-10">
                            {[
                                { title: 'هوية رقمية لكل خيل', desc: 'ملف تعريفي شامل يشمل النسب الصور، والجوائز لكل خيل بشكل مفصل.', icon: 'id-card', color: 'bg-green-100 text-green-600' },
                                { title: 'مزادات إلكترونية آمنة', desc: 'نظام مزايدة حي ومباشر يضمن حقوق البائع والمشتري مع توثيق مالي متكامل.', icon: 'gavel', color: 'bg-blue-100 text-blue-600' },
                                { title: 'مجتمع متخصص', desc: 'تواصل مع كبار المربين والخبراء في مجال الخيل العربية من جميع أنحاء العالم.', icon: 'users', color: 'bg-purple-100 text-purple-600' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-reverse space-x-6 group">
                                    <div className={`${item.color} w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                                        <i className={`fas fa-${item.icon}`}></i>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-green-500 transition">{item.title}</h4>
                                        <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <div className="rounded-[4rem] overflow-hidden shadow-2xl relative">
                            <img src="/about/why_us.png" alt="Why Us Highlight" className="w-full h-[550px] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-16 py-20 pb-40">
                <div className="bg-gray-900 rounded-[4rem] p-20 relative overflow-hidden text-center space-y-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                    <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                        <h2 className="text-5xl font-black text-white leading-tight">كن جزءاً من مستقبل الخيل العربية</h2>
                        <p className="text-gray-400 text-xl leading-relaxed">
                            انضم الآن إلى أكبر تجمع رقمي لملاك ومحبي الخيل العربية، وثق خيلك وشارك شغفك.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to={user ? "/auctions" : "/register"} className="bg-[#76E05B] text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-green-500 transition shadow-xl shadow-green-900/20 w-full sm:w-auto">
                            ابدأ رحلتك الآن
                        </Link>
                        <Link to="/contact" className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-12 py-5 rounded-3xl font-black text-xl hover:bg-white/20 transition w-full sm:w-auto">
                            تواصل معنا
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutUs;
