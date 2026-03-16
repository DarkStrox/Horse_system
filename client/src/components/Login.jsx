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
        <div className="relative min-h-screen font-sans text-right selection:bg-[#82D616]/30 transition-colors duration-300" dir="rtl">

            {/* --- أنيميشن فخمة --- */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slowZoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.15); }
                }
                @keyframes floatGlow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                .animate-fade-in-up { 
                    opacity: 0; 
                    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
                }
                .animate-slow-zoom { 
                    animation: slowZoom 30s infinite alternate ease-in-out; 
                }
                .animate-glow {
                    animation: floatGlow 6s infinite ease-in-out;
                }
                
                /* تأخيرات الدخول */
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
            `}</style>

            {/* --- الخلفية (صورة مع تدرج لوني عميق متناسق مع الأخضر) --- */}
            <div className="fixed inset-0 z-0 bg-[#060907] overflow-hidden">
                {/* يمكنك تغيير مسار الصورة هنا لصورة تناسب شاشة الدخول (مثل حصان عربي أصيل في الصحراء أو خلفية ليلية) */}
                <img
                    src="/register-horse.png"
                    alt="Background"
                    className="w-full h-full object-cover object-center opacity-60 animate-slow-zoom"
                />
                {/* تدرج لوني (Overlay) يدمج الأسود مع الأخضر الداكن جداً ليعطي عمقاً وتناسقاً */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#0a150d]/80 to-black/95 backdrop-blur-[1px]"></div>

                {/* دائرة توهج خفيفة في الخلفية لكسر الملل (Glow) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#82D616]/10 rounded-full blur-[120px] animate-glow pointer-events-none"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* --- محتوى الصفحة --- */}
                <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">

                    {/* --- الكارت الزجاجي الفخم (Glassmorphism) --- */}
                    <div className="w-full max-w-[480px] bg-white/95 dark:bg-[#0f1712]/80 backdrop-blur-xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(130,214,22,0.05)] border border-white/40 dark:border-white/10 transition-colors duration-300 animate-fade-in-up">

                        <div className="text-center mb-10 animate-fade-in-up delay-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#82D616]/20 to-[#82D616]/5 text-[#82D616] rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl shadow-inner border border-[#82D616]/20 transform rotate-3 hover:rotate-0 transition-all duration-300">
                                <i className="fas fa-sign-in-alt"></i>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">تسجيل الدخول</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">مرحباً بك مجدداً في منصة الخيل العربية</p>
                        </div>

                        {error && (
                            <div className="bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center animate-fade-in-up">
                                <i className="fas fa-exclamation-circle ml-3 text-lg"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* حقل الإيميل */}
                            <div className="space-y-2 animate-fade-in-up delay-200 group">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mr-1 transition-colors group-focus-within:text-[#82D616]">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative text-gray-400 dark:text-gray-500 focus-within:text-[#82D616] transition-colors">
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <i className="far fa-envelope text-lg"></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        className="w-full bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 focus:border-[#82D616] dark:focus:border-[#82D616] focus:bg-white dark:focus:bg-[#0b110e] p-4 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-[#82D616]/10 transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder-gray-400/70"
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* حقل الباسورد */}
                            <div className="space-y-2 animate-fade-in-up delay-300 group">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mr-1 flex justify-between transition-colors group-focus-within:text-[#82D616]">
                                    <span>كلمة المرور</span>
                                    <Link to="/forgot-password" className="text-xs text-[#82D616] font-bold cursor-pointer hover:text-green-600 transition-colors">
                                        نسيت كلمة المرور؟
                                    </Link>
                                </label>
                                <div className="relative text-gray-400 dark:text-gray-500 focus-within:text-[#82D616] transition-colors">
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <i className="fas fa-lock text-lg"></i>
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50/50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 focus:border-[#82D616] dark:focus:border-[#82D616] focus:bg-white dark:focus:bg-[#0b110e] p-4 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-[#82D616]/10 transition-all duration-300 text-gray-900 dark:text-white font-medium tracking-widest placeholder:tracking-normal placeholder-gray-400/70"
                                        onChange={handleChange}
                                        required
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* زر الدخول */}
                            <div className="animate-fade-in-up delay-400 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative overflow-hidden bg-gradient-to-l from-[#82D616] to-[#6BB50B] text-white p-4 rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(130,214,22,0.3)] hover:shadow-[0_15px_40px_rgba(130,214,22,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-3 group disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {/* لمعة تتحرك عند الوقوف على الزر */}
                                    <div className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></div>

                                    {loading ? (
                                        <i className="fas fa-circle-notch fa-spin text-xl relative z-10"></i>
                                    ) : (
                                        <>
                                            <span className="relative z-10">دخول</span>
                                            <i className="fas fa-arrow-left relative z-10 group-hover:-translate-x-1 transition-transform"></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium animate-fade-in-up delay-500">
                            ليس لديك حساب؟
                            <Link to="/register" className="text-[#82D616] font-black underline decoration-2 decoration-transparent hover:decoration-[#82D616] transition-all duration-300 ml-1">
                                إنشاء حساب جديد
                            </Link>
                        </p>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Login;