import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { userApi } from '../api/api';

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
            // Reusing axios instance from api if needed, or just call /api/...
            axios.get('/api/message/unread-count', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUnreadCount(res.data))
                .catch(console.error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            userApi.getProfile()
                .then(res => {
                    const userData = res.data;
                    setUser(userData);
                    const role = userData.Role || userData.role;
                    if (role) localStorage.setItem('userRole', role);
                })
                .catch(err => {
                    console.error("Error fetching user:", err);
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                });

            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Pol every 30s
            return () => clearInterval(interval);
        } else {
            setUser(null);
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
        const fullName = user?.FullName || user?.fullName || "User";
        if (!url) return "https://ui-avatars.com/api/?name=" + fullName;
        if (url.startsWith('http')) return url;
        // Assuming backend serves files from /api or we proxy the root if needed.
        // For now, use relative path which will be proxied if it starts with /api
        // Otherwise, the user might need to proxy the uploads folder.
        return url; 
    };

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'ملفات الخيل', path: '/horses' },
        { name: 'المرابط', path: '/studs' },
        { name: 'المزادات', path: '/auctions' },
        { name: 'تحديد الحصان', path: '/classify' },
        { name: 'الأخبار', path: '/news' },
    ];

    const userRole = user?.Role || user?.role;
    if (userRole === 'Admin') {
        navLinks.push({ name: 'لوحة التحكم', path: '/admin' });
        navLinks.push({ name: 'الطلبات', path: '/notifications' });
    }

    return (
        <nav className="flex items-center justify-between px-8 md:px-16 py-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-900 transition-colors duration-300 shadow-sm" dir="rtl">
            <div className="flex items-center space-x-reverse space-x-3">
                <Link to="/" className="flex items-center space-x-reverse space-x-3 group">
                    <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12">
                        <i className="fas fa-horse-head text-2xl"></i>
                    </div>
                    <span className="font-black text-2xl text-gray-900 dark:text-gray-100 tracking-tight hidden sm:block">نظام الخيل</span>
                </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-reverse space-x-8 text-gray-500 dark:text-gray-400 font-bold">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`relative py-2 transition-all hover:text-emerald-600 ${location.pathname === link.path ? 'text-emerald-700' : ''}`}
                    >
                        {link.name}
                        {location.pathname === link.path && (
                            <span className="absolute bottom-0 right-0 left-0 h-1 bg-emerald-600 rounded-full"></span>
                        )}
                    </Link>
                ))}
            </div>

            <div className="flex items-center space-x-reverse space-x-5">
                {user && (
                    <Link to="/messages" className="relative p-3 text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <i className="far fa-envelope text-xl"></i>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-950">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                )}
                
                <button onClick={toggleDarkMode} className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 transition flex items-center justify-center">
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
                </button>

                {user ? (
                    <div className="flex items-center space-x-reverse space-x-4">
                        <Link to="/profile" className="flex items-center space-x-reverse space-x-3 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-gray-900 dark:text-white group-hover:text-emerald-700 transition-colors">{user.FullName || user.fullName}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">{user.Role || user.role}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-50 content-center dark:border-gray-800 shadow-md group-hover:scale-110 transition-transform">
                                <img src={getProfilePicUrl(user.ProfilePictureUrl || user.profilePictureUrl)} alt="User" className="w-full h-full object-cover" />
                            </div>
                        </Link>
                        <button 
                            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                            className="p-3 text-gray-400 hover:text-red-500 transition"
                            title="تسجيل الخروج"
                        >
                            <i className="fas fa-sign-out-alt text-xl"></i>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-reverse space-x-4">
                        <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 font-black text-sm px-4">
                            دخول
                        </Link>
                        <Link to="/register" className="bg-emerald-700 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-emerald-800 transition shadow-xl shadow-emerald-900/20 text-sm">
                            حساب جديد
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;