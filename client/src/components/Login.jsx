import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { userApi } from '../api/api';

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
            const res = await userApi.login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('userRole', res.data.user.role);
            window.location.href = '/';
        } catch (err) {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen font-sans text-right selection:bg-emerald-500/30 transition-colors duration-500" dir="rtl">

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slowZoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15); }
                }
                .animate-fade-in-up { 
                    opacity: 0; 
                    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
                }
                .animate-slow-zoom { 
                    animation: slowZoom 30s infinite alternate ease-in-out; 
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>

            <div className="fixed inset-0 z-0 bg-[#060907] overflow-hidden">
                <img
                    src="/register-horse.png"
                    alt="Arabian Horse"
                    className="w-full h-full object-cover object-center opacity-40 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#061a10]/80 to-black/95 backdrop-blur-[2px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="w-full max-w-[480px] bg-white/95 dark:bg-[#0f1712]/90 backdrop-blur-3xl p-12 rounded-[3.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-white/20 dark:border-emerald-900/10 transition-all duration-500 animate-fade-in-up">

                        <div className="text-center mb-12 animate-fade-in-up delay-100">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner border border-emerald-100 dark:border-emerald-800 transform hover:scale-110 transition-transform">
                                <i className="fas fa-key"></i>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase">دخول النظام</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px]">Purebred Arabian Horse System</p>
                        </div>

                        {error && (
                            <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 p-5 rounded-[1.5rem] mb-8 text-sm font-black flex items-center animate-shake">
                                <i className="fas fa-exclamation-triangle ml-4 text-lg"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3 animate-fade-in-up delay-200">
                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 block mr-2 uppercase tracking-widest">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative group">
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                        <i className="far fa-envelope text-xl"></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        className="w-full bg-gray-50 dark:bg-black/40 border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-black p-5 pr-16 rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white font-black"
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 animate-fade-in-up delay-300">
                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 block mr-2 flex justify-between uppercase tracking-widest">
                                    <span>كلمة المرور</span>
                                    <Link to="/forgot-password" size="tiny" className="text-emerald-600 font-black hover:underline underline-offset-4">
                                        نسيت؟
                                    </Link>
                                </label>
                                <div className="relative group">
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                        <i className="fas fa-lock text-xl"></i>
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 dark:bg-black/40 border-2 border-transparent focus:border-emerald-600 focus:bg-white dark:focus:bg-black p-5 pr-16 rounded-2xl outline-none transition-all duration-300 text-gray-900 dark:text-white font-black"
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-black py-5 rounded-[2rem] text-xl shadow-2xl shadow-emerald-900/30 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <span className="flex items-center justify-center gap-4">
                                    {loading ? 'جاري التحقق...' : 'دخول آمن'}
                                    <i className="fas fa-arrow-left text-sm group-hover:-translate-x-2 transition-transform"></i>
                                </span>
                            </button>
                        </form>

                        <div className="mt-12 text-center animate-fade-in-up delay-[400ms]">
                            <p className="text-gray-400 font-bold mb-4">ليس لديك حساب بعد؟</p>
                            <Link
                                to="/register"
                                className="inline-block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 px-10 py-4 rounded-2xl font-black text-sm border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 transition-all duration-300"
                            >
                                سجل الآن في المنصة
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Login;