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

                    {/* Centered Video Button Under Text */}
                    <div className="flex justify-center items-center max-w-xl pt-2">
                        <button className="flex items-center space-x-reverse space-x-4 text-gray-600 dark:text-gray-300 font-bold hover:text-green-500 transition group bg-gray-50 dark:bg-gray-900/50 px-8 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-green-500 transition bg-white dark:bg-gray-800">
                                <i className="fas fa-play text-xs"></i>
                            </div>
                            <span className="text-lg">شاهد الفيديو التعريفي</span>
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
            <section className="py-20 bg-gray-50/50 dark:bg-gray-900/20 mb-10">
                <div className="container mx-auto px-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'خيل مسجل', value: '5,000' },
                            { label: 'مرابط', value: '1,200' },
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

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutUs;