import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AboutSection from './AboutSection';
import { userApi } from '../api/api';

const ArabianHorseHome = () => {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // جلب البيانات
        fetch('/api/Home/page-content')
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err));

        const token = localStorage.getItem('token');
        if (token) {
            userApi.getProfile()
                .then(res => setUser(res.data))
                .catch(err => console.error(err));
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

    // ملاحظة: تم إزالة شرط "if (!data) return..." لمنع الفلاش الأبيض

    return (
        <>
            <style>{`
        @keyframes fadeInUpCustom {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .reveal-item { 
          animation: fadeInUpCustom 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>

            <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
                <Navbar />

                {data ? (
                    <>
                        {/* HERO SECTION */}
                        <section className="container mx-auto px-4 lg:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-16">
                            <div className="w-full md:w-1/2 space-y-8 reveal-item delay-100">
                                <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-100 dark:border-emerald-800">
                                    اللغة العربية
                                </span>
                                <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.15]">
                                    {data.hero.title.split('،').map((part, i) => (
                                        <React.Fragment key={i}>
                                            <span className={i === 1 ? "text-emerald-700 dark:text-emerald-500" : ""}>
                                                {part}{i === 0 ? "،" : ""}
                                            </span>
                                            {i === 0 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed max-w-xl">
                                    {data.hero.description}
                                </p>

                                <div className="flex flex-col space-y-4 max-w-xs">
                                    <a href="#about" className="border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white dark:hover:bg-gray-800 transition text-center shadow-sm">
                                        {data.hero.secondaryBtn}
                                    </a>
                                    <Link to="/auctions" className="bg-emerald-800 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition text-center shadow-lg shadow-emerald-900/20">
                                        {data.hero.primaryBtn}
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 reveal-item delay-300">
                                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                                    <img src="/hero-horse.png" alt="Horse" className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </section>

                        {/* FEATURES SECTION */}
                        <section className="py-24 px-4 lg:px-16 bg-white dark:bg-gray-800/40 reveal-item delay-200">
                            <div className="container mx-auto">
                                <div className="text-center mb-16 space-y-3">
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white">الميزات الأساسية</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">نظام متكامل لدعم كل جانب من جوانب ملكية وتجارة الخيل العربية</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {data.features.map((f, i) => (
                                        <div key={i} className="bg-[#FAF9F6] dark:bg-gray-900 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-2">
                                            <div className="bg-white dark:bg-emerald-900/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                                <i className={`fas fa-${f.icon} text-emerald-600 text-2xl`}></i>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-3">{f.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{f.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* ABOUT SECTION */}
                        <div className="reveal-item delay-300">
                            <AboutSection />
                        </div>

                        {/* NEWS SECTION */}
                        <section className="container mx-auto px-4 lg:px-16 py-20">
                            <div className="flex flex-col md:flex-row items-center gap-20 reveal-item delay-500">
                                <div className="w-full md:w-1/2">
                                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
                                        <img src="/article-horse.png" alt="News" className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest">أحدث الأخبار</span>
                                    <h2 className="text-5xl font-black text-gray-900 dark:text-white">الأخبار والمقالات</h2>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{data.mainArticle.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-lg">{data.mainArticle.description}</p>
                                    <Link to="/news" className="bg-emerald-800 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-900 transition inline-flex items-center space-x-reverse space-x-2 shadow-lg shadow-emerald-900/20">
                                        <span>{data.mainArticle.buttonText}</span>
                                        <i className="fas fa-arrow-left text-xs"></i>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* CARDS SECTION */}
                        <section className="container mx-auto px-4 lg:px-16 py-20 reveal-item delay-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {data.cards.map((c, i) => (
                                    <Link to={c.url} key={i} className="group block">
                                        <div className="rounded-3xl overflow-hidden shadow-xl mb-6 h-64 relative border border-gray-100 dark:border-gray-700">
                                            <img src={`/${c.image}`} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-emerald-600 text-sm font-black uppercase tracking-wider">{c.category}</span>
                                            <h4 className="text-2xl font-black text-gray-800 dark:text-white group-hover:text-emerald-700 transition-colors">{c.title}</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-base">{c.shortDescription || "وصف مختصر للمقال أو الخبر."}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </>
                ) : (
                    /* حالة التحميل الصامتة (Skeleton خفيف) بنفس لون الخلفية لمنع الفلاش */
                    <div className="container mx-auto px-16 py-20 text-center text-emerald-800/20 font-bold">
                        <i className="fas fa-circle-notch animate-spin text-4xl"></i>
                    </div>
                )}

                <Footer />
            </div>
        </>
    );
};

export default ArabianHorseHome;