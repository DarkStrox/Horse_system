import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const ArabianHorseHome = () => {
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        fetch('/api/Home/page-content')
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error("Error fetching data:", err));

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

    if (!data) return <div className="text-center p-20 font-sans text-green-600">Loading...</div>;

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="w-full md:w-1/2 space-y-8">
                    <div>
                        <span className="bg-[#E9F9E5] dark:bg-green-900/20 text-[#48B02C] dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-black mb-6 inline-block tracking-wider underline">اللغة العربية</span>
                        <h1 className="text-6xl font-black text-gray-900 dark:text-white leading-[1.15] mb-6">
                            {data.hero.title.split('،').map((part, i) => (
                                <React.Fragment key={i}>
                                    <span className={i === 1 ? "text-[#76E05B]" : ""}>{part}{i === 0 ? "،" : ""}</span>
                                    {i === 0 && <br />}
                                </React.Fragment>
                            ))}
                        </h1>
                        <p className="text-gray-400 dark:text-gray-500 text-xl leading-relaxed max-w-xl">
                            {data.hero.description}
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4 max-w-xs">
                        <Link to="/about" className="border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition text-center">
                            {data.hero.secondaryBtn}
                        </Link>
                        <Link to="/auctions" className="bg-[#76E05B] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-green-100 dark:shadow-green-900/20 hover:bg-green-500 transition text-center">
                            {data.hero.primaryBtn}
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900 transition-colors duration-300">
                        <img src="/hero-horse.png" alt="Hero Horse" className="w-full h-[500px] object-cover" />
                    </div>
                </div>
            </section>

            <section className="py-24 px-16">
                <div className="container mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white">الميزات الأساسية</h2>
                        <p className="text-gray-400 dark:text-gray-500 text-lg">نظام متكامل لدعم كل جانب من جوانب ملكية وتجارة الخيل العربية</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {data.features.map((f, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl shadow-gray-100/50 dark:shadow-black/20 border border-gray-50 dark:border-gray-800 hover:border-green-100 dark:hover:border-green-900 transition-all duration-300 group relative overflow-hidden">
                                <div className="bg-[#F4FDF2] dark:bg-green-900/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition duration-300 absolute top-8 left-8">
                                    <i className={`fas fa-${f.icon} text-[#76E05B] text-2xl`}></i>
                                </div>
                                <div className="mt-16">
                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">{f.title}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 leading-relaxed text-base">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-16 py-20">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    <div className="w-full md:w-1/2">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src="/article-horse.png" alt="News" className="w-full h-[450px] object-cover" />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <span className="text-[#76E05B] font-black text-sm tracking-wider">أحدث الأخبار</span>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">الأخبار والمقالات</h2>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 leading-snug">{data.mainArticle.title}</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-lg leading-loose">
                            {data.mainArticle.description}
                        </p>
                        <Link to="/news" className="flex items-center space-x-reverse space-x-3 bg-[#76E05B] text-white px-8 py-3 rounded-full font-bold hover:bg-green-500 transition group w-fit">
                            <span>{data.mainArticle.buttonText}</span>
                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-green-500 transition">
                                <i className="fas fa-arrow-left text-[10px]"></i>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-16 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {data.cards.map((c, i) => (
                        <Link to={c.url} key={i} className="group cursor-pointer block">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-xl mb-6 relative h-64">
                                <img src={`/${c.image}`} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition duration-500"></div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[#76E05B] text-sm font-black underline uppercase">{c.category}</span>
                                <h4 className="text-2xl font-black text-gray-800 dark:text-white">{c.title}</h4>
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
