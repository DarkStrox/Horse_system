import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const navigate = useNavigate();
    const location = useLocation();

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/api/message/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUnreadCount(res.data.count))
                .catch(console.error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error("Error fetching user:", err);
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                    }
                });

            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [location.pathname]);

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
        return `${API_BASE_URL}${url}`;
    };

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'ملفات الخيل', path: '/horses' },
        { name: 'المبيعات', path: '/sales' },
        { name: 'المزادات', path: '/auctions' },
        { name: 'تحديد نوع الحصان', path: '/classify' },
        { name: 'الأخبار', path: '/news' },
        { name: 'من نحن', path: '/about' },
        { name: 'انضم إلينا', path: '/join' },
    ];

    if (user?.role === 'Admin') {
        navLinks.push({ name: 'الطلبات', path: '/notifications' });
    }

    return (
        <nav className="flex items-center justify-between px-8 md:px-16 py-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-900 transition-colors duration-300">
            <div className="flex items-center space-x-reverse space-x-3">
                <Link to="/" className="flex items-center space-x-reverse space-x-3">
                    <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    <span className="font-black text-2xl text-gray-800 dark:text-gray-100 tracking-tight hidden sm:block">نظام الخيل العربية</span>
                </Link>
            </div>


            <div className="hidden lg:flex items-center space-x-reverse space-x-8 text-gray-500 dark:text-gray-400 font-bold">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`${location.pathname === link.path ? 'text-green-500 border-b-2 border-green-500 pb-1' : 'hover:text-green-500 transition'}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center space-x-reverse space-x-5">
                {user && (
                    <Link to="/messages" className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition">
                        <i className="far fa-envelope text-xl"></i>
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/4 -translate-y-1/4 border-2 border-white dark:border-gray-950">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                )}
                <button onClick={toggleDarkMode} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg bg-gray-50 dark:bg-gray-900 transition flex items-center justify-center">
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
                </button>
                {user ? (
                    <Link to="/profile" className="flex items-center space-x-reverse space-x-3 group">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-gray-800 dark:text-white">{user.fullName}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500">{user.role || "عضو"}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm group-hover:scale-105 transition">
                            <img src={getProfilePicUrl(user.profilePictureUrl)} alt="User" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center space-x-reverse space-x-4">
                        <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-bold text-sm">
                            تسجيل الدخول
                        </Link>
                        <Link to="/register" className="bg-[#76E05B] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100 dark:shadow-none">
                            إنشاء حساب
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
