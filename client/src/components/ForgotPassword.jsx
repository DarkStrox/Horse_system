import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await axios.post('/api/Account/forgot-password', { email });
            // For demo purposes, we store the token in session storage to use in reset page
            if (res.data.token) {
                sessionStorage.setItem('resetToken', res.data.token);
                sessionStorage.setItem('resetEmail', email);
            }
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError('حدث خطأ أثناء إرسال الرابط. تأكد من صحة البريد الإلكتروني.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
            {/* Navbar */}
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Form Side */}
                    <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full space-y-10">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-black text-gray-900">نسيت كلمة المرور؟</h1>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    لا تقلق. أدخل بريدك الإلكتروني وسنرسل لك تعليمات إعادة تعيين كلمة المرور.
                                </p>
                            </div>

                            {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold text-center">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-gray-700 mr-2 flex justify-between items-center">
                                        <span>البريد الإلكتروني</span>
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full bg-gray-50 border border-gray-100 p-5 pr-14 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-100 transition-all text-left placeholder:text-gray-300"
                                        />
                                        <i className="far fa-envelope absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition"></i>
                                    </div>
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#76E05B] to-[#48B02C] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 hover:shadow-green-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'جاري الإرسال...' : 'إرسال رابط التحقق'}
                                </button>
                            </form>

                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center space-x-reverse space-x-2 text-gray-400">
                                    <div className="h-[1px] w-12 bg-gray-100"></div>
                                    <span className="text-sm font-bold uppercase tracking-widest">أو</span>
                                    <div className="h-[1px] w-12 bg-gray-100"></div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 font-medium"> العودة إلى <Link to="/login" className="text-green-500 font-black hover:underline">تسجيل الدخول</Link></p>
                                    <p className="text-gray-400 text-sm">ليس لديك حساب؟ <Link to="/register" className="text-green-500 font-black hover:underline">إنشاء حساب جديد</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="hidden md:block w-1/2 relative bg-gray-100 m-8 rounded-[2.5rem] overflow-hidden">
                        <img
                            src="/forgot-password-horse.png"
                            alt="Horse Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-reverse space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-green-400">الأصالة العربية</span>
                                </div>
                                <h3 className="text-4xl font-black leading-tight">إرث الخيل العربية، <br /><span className="text-green-400">بمنظور متجدد.</span></h3>
                                <p className="text-white/70 text-sm max-w-xs leading-relaxed">منصة شاملة لإدارة وتداول والاحتفاظ بأجود سلالات الخيل في العالم. انضم إلينا اليوم لتوثيق السلالات وتسهيل المزادات.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
