import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get token and email from URL (real email flow) or sessionStorage (demo flow)
    const token = searchParams.get('token') || sessionStorage.getItem('resetToken');
    const email = searchParams.get('email') || sessionStorage.getItem('resetEmail');

    useEffect(() => {
        if (!token || !email) {
            setError('رابط إعادة التعيين منتهي الصلاحية أو غير صالح. يرجى طلب رابط جديد.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('كلمات المرور غير متطابقة.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axios.post('/api/Account/reset-password', {
                email,
                token,
                newPassword: passwords.newPassword
            });
            setMessage('تم إعادة تعيين كلمة المرور بنجاح! سيتم توجيهك لتسجيل الدخول...');
            sessionStorage.removeItem('resetToken');
            sessionStorage.removeItem('resetEmail');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error("Reset Password Error:", err);
            if (err.response && err.response.data) {
                // Handle Identity errors array
                if (Array.isArray(err.response.data)) {
                    const errorMessages = err.response.data.map(e => e.description).join(' ');
                    setError(errorMessages);
                }
                // Handle simple message object
                else if (err.response.data.message) {
                    setError(err.response.data.message);
                }
                // Handle string error
                else if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else {
                    setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
                }
            } else {
                setError('حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.');
            }
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
                    <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center border-l border-gray-50">
                        <div className="max-w-md mx-auto w-full space-y-10">
                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-black text-gray-900">إعادة تعيين كلمة المرور</h1>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    يرجى إدخال كلمة المرور الجديدة الخاصة بك أدناه لاستعادة الوصول إلى حسابك.
                                </p>
                            </div>

                            {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold text-center border border-red-100">{error}</div>}
                            {message && <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-bold text-center border border-green-100">{message}</div>}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-black text-gray-700 mr-2">كلمة المرور الجديدة</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-100 p-5 pr-14 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-100 transition-all text-right placeholder:text-gray-300"
                                        />
                                        <i className="fas fa-lock absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition"></i>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-black text-gray-700 mr-2">تأكيد كلمة المرور</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-100 p-5 pr-14 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-green-100 transition-all text-right placeholder:text-gray-300"
                                        />
                                        <i className="fas fa-check-double absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition"></i>
                                    </div>
                                </div>

                                {/* Password Strength Visual */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">قوة كلمة المرور</span>
                                        <span className={`text-xs font-bold transition-colors ${passwords.newPassword.length === 0 ? 'text-gray-300' :
                                            passwords.newPassword.length < 6 ? 'text-red-500' :
                                                passwords.newPassword.length < 10 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                            {passwords.newPassword.length === 0 ? 'غير مدخلة' :
                                                passwords.newPassword.length < 8 ? 'ضعيفة (يجب أن تكون 8 أحرف على الأقل)' :
                                                    passwords.newPassword.length < 10 ? 'متوسطة' : 'قوية'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex space-x-reverse space-x-1">
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length > 0 ? (passwords.newPassword.length < 8 ? 'bg-red-500' : 'bg-green-500') : 'bg-transparent'
                                            }`}></div>
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length >= 8 ? (passwords.newPassword.length < 10 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-transparent'
                                            }`}></div>
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length >= 10 ? 'bg-green-400' : 'bg-transparent'
                                            }`}></div>
                                    </div>
                                </div>

                                <button
                                    disabled={loading || !token}
                                    className="w-full bg-gradient-to-r from-[#76E05B] to-[#48B02C] text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-100 hover:shadow-green-200 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                                </button>
                            </form>

                            <div className="text-center pt-4">
                                <Link to="/login" className="text-gray-400 font-bold hover:text-green-500 transition flex items-center justify-center space-x-reverse space-x-2">
                                    <i className="fas fa-arrow-right text-sm"></i>
                                    <span>العودة لتسجيل الدخول</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="hidden md:block w-1/2 relative bg-gray-100 m-8 rounded-[2.5rem] overflow-hidden">
                        <img
                            src="/reset-password-horse.png"
                            alt="Horse Background"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-reverse space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-green-400">نظام الخيل العربية</span>
                                </div>
                                <h3 className="text-4xl font-black leading-tight">بداية جديدة، <br /><span className="text-green-400">بأمان تام.</span></h3>
                                <p className="text-white/70 text-sm max-w-xs leading-relaxed">نحن نأخذ أمن بياناتك على محمل الجد. استعد وصولك الآن وواصل رحلتك في عالم الخيل العربية الأصيلة.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
