import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AboutSection from './AboutSection';

const API_BASE_URL = 'http://localhost:5000';

const ArabianHorseHome = () => {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    // حالة جديدة لتشغيل الأنيميشن عند تحميل الصفحة
    const [isLoaded, setIsLoaded] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        fetch('/api/Home/page-content')
            .then(res => res.json())
            .then(json => {
                setData(json);
                // تشغيل الأنيميشن بعد تحميل الداتا بجزء من الثانية
                setTimeout(() => setIsLoaded(true), 100);
            })
            .catch(err => console.error(err));

        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
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

    if (!data) return <div className="text-center p-20 text-green-600 font-bold">جاري التحميل...</div>;

    // كلاسات الأنيميشن الثابتة لتسهيل استخدامها
    const animationClass = `transition-all duration-1000 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`;

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-300" dir="rtl">
            <Navbar />

            {/* HERO SECTION */}
            <section className="container mx-auto px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-16">
                <div className={`w-full md:w-1/2 space-y-8 delay-100 ${animationClass}`}>
                    <span className="bg-[#E9F9E5] text-[#48B02C] px-4 py-1.5 rounded-full text-xs font-black">
                        اللغة العربية
                    </span>
                    <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.15]">
                        {data.hero.title.split('،').map((part, i) => (
                            <React.Fragment key={i}>
                                <span className={i === 1 ? "text-[#76E05B]" : ""}>
                                    {part}{i === 0 ? "،" : ""}
                                </span>
                                {i === 0 && <br />}
                            </React.Fragment>
                        ))}
                    </h1>
                    {/* تعديل لون الوصف ليكون text-gray-300 في الدارك مود علشان يبان */}
                    <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed max-w-xl">
                        {data.hero.description}
                    </p>

                    <div className="flex flex-col space-y-4 max-w-xs">
                        {/* تعديل لون الزر الثانوي في الدارك مود */}
                        <a
                            href="#about"
                            className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-center"
                        >
                            {data.hero.secondaryBtn}
                        </a>
                        <Link
                            to="/auctions"
                            className="bg-[#76E05B] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 transition text-center"
                        >
                            {data.hero.primaryBtn}
                        </Link>
                    </div>
                </div>

                <div className={`w-full md:w-1/2 delay-300 ${animationClass}`}>
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                        <img
                            src="/hero-horse.png"
                            alt="Horse"
                            className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-24 px-16 bg-gray-50 dark:bg-gray-900/30">
                <div className={`container mx-auto delay-200 ${animationClass}`}>
                    <div className="text-center mb-16 space-y-3">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                            الميزات الأساسية
                        </h2>
                        {/* تعديل اللون للدارك مود */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            نظام متكامل لدعم كل جانب من جوانب ملكية وتجارة الخيل العربية
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {data.features.map((f, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="bg-[#F4FDF2] dark:bg-green-900/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                    <i className={`fas fa-${f.icon} text-[#76E05B] text-2xl`}></i>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-3">
                                    {f.title}
                                </h3>
                                {/* تعديل اللون للدارك مود */}
                                <p className="text-gray-600 dark:text-gray-300">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <div className={`delay-300 ${animationClass}`}>
                <AboutSection />
            </div>

            {/* NEWS SECTION */}
            <section className="container mx-auto px-16 py-20">
                <div className={`flex flex-col md:flex-row items-center gap-20 delay-500 ${animationClass}`}>
                    <div className="w-full md:w-1/2">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src="/article-horse.png"
                                alt="News"
                                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <span className="text-[#76E05B] font-black text-sm">
                            أحدث الأخبار
                        </span>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white">
                            الأخبار والمقالات
                        </h2>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                            {data.mainArticle.title}
                        </h3>
                        {/* تعديل اللون للدارك مود */}
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            {data.mainArticle.description}
                        </p>
                        <Link
                            to="/news"
                            className="bg-[#76E05B] text-white px-8 py-3 rounded-full font-bold hover:bg-green-500 transition inline-flex items-center space-x-reverse space-x-2"
                        >
                            <span>{data.mainArticle.buttonText}</span>
                            <i className="fas fa-arrow-left text-xs"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CARDS SECTION */}
            <section className="container mx-auto px-16 py-20">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 delay-700 ${animationClass}`}>
                    {data.cards.map((c, i) => (
                        <Link to={c.url} key={i} className="group block">
                            <div className="rounded-3xl overflow-hidden shadow-xl mb-6 h-64 relative">
                                <img
                                    src={`/${c.image}`}
                                    alt={c.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="space-y-2">
                                <span className="text-[#76E05B] text-sm font-black uppercase">{c.category}</span>
                                <h4 className="text-2xl font-black text-gray-800 dark:text-white">{c.title}</h4>
                                {/* تعديل اللون للدارك مود */}
                                <p className="text-gray-600 dark:text-gray-300 text-base">
                                    {c.shortDescription || "وصف مختصر للمقال أو الخبر."}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ArabianHorseHome;