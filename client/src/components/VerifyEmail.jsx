import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const VerifyEmail = () => {
    const location = useLocation();
    const email = location.state?.email || 'user@example.com';

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

                {/* طبقة التظليل للتحكم في الدارك مود الكامل */}
                <div className="absolute inset-0 bg-white/20 dark:bg-black/70 backdrop-blur-[1px] transition-colors duration-500"></div>

                <Navbar />

                <div className="flex-1 flex items-center justify-center p-6 relative z-10">

                    {/* الكارد الزجاجي الموسط بالأنيميشن الثقيل */}
                    <div className="bg-white/85 dark:bg-[#121814]/90 backdrop-blur-2xl w-full max-w-xl rounded-[3.5rem] p-10 md:p-16 glass-card animate-card-heavy">

                        <div className="space-y-10">
                            {/* الأيقونة العلوية */}
                            <div className="text-center space-y-4">
                                <div
                                    className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner group transition-all duration-500 hover:rotate-12 animate-icon"
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                    </svg>
                                </div>

                                <h1 className="text-4xl font-black text-gray-900 dark:text-white transition-colors animate-item" style={{ animationDelay: '0.6s' }}>
                                    تحقق من بريدك
                                </h1>

                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-medium animate-item" style={{ animationDelay: '0.7s' }}>
                                    لقد أرسلنا رابط التحقق إلى <br />
                                    <span className="text-emerald-600 dark:text-emerald-400 font-black break-all">{email}</span>
                                </p>
                            </div>

                            {/* صندوق التنبيه الأزرق الزجاجي */}
                            <div className="animate-item" style={{ animationDelay: '0.8s' }}>
                                <div className="bg-blue-500/10 dark:bg-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 p-5 rounded-3xl flex items-start gap-4 text-right">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed font-bold">
                                        إذا لم تجد الرسالة، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).
                                    </p>
                                </div>
                            </div>

                            {/* الأزرار والروابط */}
                            <div className="space-y-4 animate-item" style={{ animationDelay: '0.9s' }}>
                                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 active:scale-95">
                                    إعادة إرسال البريد
                                </button>

                                <Link to="/reset-password" name="demo-link" className="block w-full bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 py-4 rounded-2xl font-bold text-center border border-gray-200 dark:border-gray-800 hover:bg-white/80 dark:hover:bg-white/10 transition-all">
                                    (وضع تجريبي) إعادة تعيين كلمة المرور
                                </Link>

                                <Link to="/login" className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors pt-2">
                                    <span>العودة لتسجيل الدخول</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                            </div>

                            {/* التذييل الصغير */}
                            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest gap-4 animate-item" style={{ animationDelay: '1.1s' }}>
                                <span>عنوان البريد خاطئ؟</span>
                                <Link to="/forgot-password" className="text-emerald-600 dark:text-emerald-500 hover:underline">تغيير البريد</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;