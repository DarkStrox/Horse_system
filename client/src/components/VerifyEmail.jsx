import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const VerifyEmail = () => {
    const location = useLocation();
    const email = location.state?.email || 'user@example.com';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
            {/* Navbar */}
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl p-12 md:p-16 text-center space-y-10 relative overflow-hidden group">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-50 rounded-full blur-3xl group-hover:bg-green-100 transition duration-500"></div>

                    <div className="relative space-y-8">
                        <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg shadow-green-100/50 transform group-hover:scale-110 transition duration-500">
                            <i className="far fa-envelope-open text-[#48B02C] text-4xl"></i>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-gray-900 leading-tight">تحقق من بريدك الوارد</h1>
                            <p className="text-gray-400 text-lg">
                                لقد أرسلنا رابط التحقق إلى <span className="text-gray-900 font-black">{email}</span>. يرجى التحقق من صندوق الوارد الخاص بك والنقر على الرابط لتفعيل حسابك.
                            </p>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-start space-x-reverse space-x-4 text-right">
                            <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                            <p className="text-blue-600/80 text-sm leading-relaxed">
                                إذا لم تجد البريد الإلكتروني، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam).
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <button className="w-full bg-[#19E15B] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 hover:bg-green-600 transition trasform active:scale-95">
                                إعادة إرسال بريد التحقق
                            </button>

                            {/* Demo Mode Button */}
                            <Link to="/reset-password" className="block w-full bg-blue-100 text-blue-600 py-3 rounded-[1rem] font-bold text-center hover:bg-blue-200 transition">
                                (وضع تجريبي) اضغط هنا لإعادة تعيين كلمة المرور
                            </Link>

                            <Link to="/login" className="block text-gray-400 font-bold hover:text-green-500 transition flex items-center justify-center space-x-reverse space-x-2">
                                <i className="fas fa-arrow-right text-sm"></i>
                                <span>العودة لتسجيل الدخول</span>
                            </Link>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between text-xs text-gray-300 font-bold uppercase tracking-widest gap-4">
                        <span>عنوان البريد الإلكتروني خاطئ؟</span>
                        <Link to="/forgot-password" className="text-green-500 hover:underline">تغيير البريد الإلكتروني</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
