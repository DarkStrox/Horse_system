import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/account/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-gray-950 font-sans text-right transition-colors duration-300" dir="rtl">
            <Navbar />

            <main className="container mx-auto px-16 py-12 flex flex-col md:flex-row items-center justify-center gap-20">
                <div className="w-full md:w-[450px] bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-100 dark:shadow-none border border-gray-50 dark:border-gray-800 transition-colors duration-300">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">تسجيل الدخول</h1>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">مرحباً بك مجدداً في نظام الخيل العربية</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mr-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"><i className="far fa-envelope"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className="w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-100 transition text-left text-gray-900 dark:text-white"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mr-2 flex justify-between">
                                <span>كلمة المرور</span>
                                <Link to="/forgot-password" className="text-xs text-green-500 font-bold cursor-pointer hover:text-green-600 transition">نسيت كلمة المرور؟</Link>
                            </label>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"><i className="fas fa-lock text-sm"></i></span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-100 transition text-left text-gray-900 dark:text-white"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#82D616] text-white p-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-green-600 transition flex items-center justify-center space-x-reverse space-x-3 group"
                        >
                            <span>{loading ? 'جاري التحميل...' : 'دخول'}</span>
                            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition"></i>
                        </button>
                    </form>


                    <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        ليس لديك حساب؟ <Link to="/register" className="text-green-500 font-bold underline hover:text-green-600 transition">إنشاء حساب جديد</Link>
                    </p>
                </div>

                <div className="hidden lg:block w-full max-w-[600px]">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <img src="/register-horse.png" alt="Horse" className="w-full h-[600px] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-16 right-12 left-12 text-white">
                            <h2 className="text-4xl font-black leading-tight mb-2">مرحباً بك مجدداً</h2>
                            <p className="text-gray-200">المنصة الشاملة لإدارة وتجارة الخيل العربية.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
