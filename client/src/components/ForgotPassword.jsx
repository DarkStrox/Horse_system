import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/api';
import Navbar from './Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await userApi.forgotPassword(email);
            setSuccess(true);
            if (res.data.token) {
                sessionStorage.setItem('resetToken', res.data.token);
                sessionStorage.setItem('resetEmail', email);
            }
            setTimeout(() => {
                navigate('/verify-email', { state: { email } });
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الرابط. تأكد من صحة البريد الإلكتروني.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                /* أنيميشن الكارد الرئيسي */
                @keyframes fadeUpHeavy {
                    0% { opacity: 0; transform: translateY(100px) scale(0.9); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                
                /* أنيميشن العناصر الداخلية */
                @keyframes contentFadeUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes scaleIn {
                    0% { opacity: 0; transform: scale(0.5); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .animate-card-heavy {
                    animation: fadeUpHeavy 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }

                .animate-item {
                    opacity: 0;
                    animation: contentFadeUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }

                .animate-icon {
                    opacity: 0;
                    animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .main-bg {
                    background-image: url('/forgot-password-horse.png');
                    background-size: cover;
                    background-position: center center;
                    background-attachment: fixed;
                    background-repeat: no-repeat;
                    width: 100%;
                    min-height: 100vh;
                }

                .glass-card {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
            `}</style>

            <div className="main-bg min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500" dir="rtl">

                <div className="absolute inset-0 bg-white/20 dark:bg-black/70 backdrop-blur-[1px] transition-colors duration-500"></div>

                <Navbar />

                <div className="flex-1 flex items-center justify-center p-6 relative z-10">

                    <div className="bg-white/85 dark:bg-[#121814]/90 backdrop-blur-2xl w-full max-w-xl rounded-[3.5rem] p-10 md:p-16 glass-card animate-card-heavy">

                        <div className="space-y-10">
                            {/* الرأس: أيقونة + عنوان */}
                            <div className="text-center space-y-4">
                                <div
                                    className="w-24 h-24 bg-green-500/10 dark:bg-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-inner group transition-all duration-500 hover:rotate-12 animate-icon"
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>

                                <h1 className="text-4xl font-black text-gray-900 dark:text-white transition-colors animate-item" style={{ animationDelay: '0.6s' }}>
                                    نسيت كلمة المرور؟
                                </h1>

                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium animate-item" style={{ animationDelay: '0.7s' }}>
                                    أدخل بريدك الإلكتروني لنتمكن من إرسال رابط إعادة تعيين كلمة المرور إليك.
                                </p>
                            </div>

                            {/* رسائل التنبيه مع أنيميشن */}
                            {(error || success) && (
                                <div className="animate-item" style={{ animationDelay: '0.2s' }}>
                                    {error && (
                                        <div className="bg-red-500/10 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-3xl text-sm font-black text-center border border-red-500/20 animate-pulse">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="bg-green-500/10 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-5 rounded-3xl text-sm font-black text-center border border-green-500/20">
                                            جاري إرسال الرابط.. تفقد بريدك الوارد
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* حقل الإدخال */}
                                <div className="space-y-3 animate-item" style={{ animationDelay: '0.8s' }}>
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2 block">البريد الإلكتروني</label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-5 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all text-left text-gray-900 dark:text-white placeholder:text-gray-400 font-medium"
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* زر الإرسال */}
                                <div className="animate-item" style={{ animationDelay: '0.9s' }}>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-green-500/30 hover:shadow-green-500/50 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                جاري الإرسال..
                                            </div>
                                        ) : (
                                            'إرسال الرابط'
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* التذييل */}
                            <div className="text-center space-y-8 pt-4 animate-item" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center justify-center gap-4 text-gray-400 dark:text-gray-600">
                                    <div className="h-[1px] flex-1 bg-current opacity-20"></div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">العودة</span>
                                    <div className="h-[1px] flex-1 bg-current opacity-20"></div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400 font-bold">
                                        تذكرت كلمة المرور؟ <Link to="/login" className="text-green-600 dark:text-green-400 font-black hover:underline transition-colors ml-1">تسجيل الدخول</Link>
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-500 text-sm font-medium">
                                        ليس لديك حساب؟ <Link to="/register" className="text-green-600 dark:text-green-400 font-black hover:underline transition-colors ml-1">إنشاء حساب جديد</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;