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
            if (err.response && err.response.data) {
                if (Array.isArray(err.response.data)) {
                    setError(err.response.data.map(e => e.description).join(' '));
                } else {
                    setError(err.response.data.message || 'حدث خطأ أثناء التحديث.');
                }
            } else {
                setError('حدث خطأ في الاتصال بالسيرفر.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeUpHeavy {
                    0% { opacity: 0; transform: translateY(100px) scale(0.9); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                }
                @keyframes animateIn {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-card { animation: fadeUpHeavy 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                .animate-item { opacity: 0; animation: animateIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
                
                .main-bg {
                    background-image: url('/reset-password-horse.png');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                }
            `}</style>

            <div className="main-bg min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500" dir="rtl">
                {/* Overlay التعتيم الشامل */}
                <div className="absolute inset-0 bg-white/30 dark:bg-black/75 backdrop-blur-[1.5px] transition-colors duration-500"></div>

                <Navbar />

                <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <div className="bg-white/80 dark:bg-gray-900/85 backdrop-blur-2xl w-full max-w-xl rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-white/50 dark:border-gray-800 animate-card">

                        <div className="space-y-8">
                            <div className="text-center space-y-4 animate-item" style={{ animationDelay: '0.3s' }}>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white">إعادة تعيين كلمة المرور</h1>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">أدخلي كلمة المرور الجديدة لاستعادة حسابك</p>
                            </div>

                            {/* التنبيهات */}
                            {(error || message) && (
                                <div className="animate-item" style={{ animationDelay: '0.1s' }}>
                                    {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center border border-red-100 dark:border-red-800/50">{error}</div>}
                                    {message && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-2xl text-sm font-bold text-center border border-green-100 dark:border-green-800/50">{message}</div>}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* كلمة المرور الجديدة */}
                                <div className="space-y-3 animate-item" style={{ animationDelay: '0.4s' }}>
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">كلمة المرور الجديدة</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            required
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-white/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/20 focus:border-green-500 transition-all text-right dark:text-white"
                                        />
                                        <i className="fas fa-lock absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition"></i>
                                    </div>
                                </div>

                                {/* تأكيد كلمة المرور */}
                                <div className="space-y-3 animate-item" style={{ animationDelay: '0.5s' }}>
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">تأكيد كلمة المرور</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            required
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-white/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 pr-14 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/20 focus:border-green-500 transition-all text-right dark:text-white"
                                        />
                                        <i className="fas fa-check-double absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition"></i>
                                    </div>
                                </div>

                                {/* مؤشر قوة كلمة المرور (التصميم الأصلي بالكامل) */}
                                <div className="space-y-2 animate-item" style={{ animationDelay: '0.6s' }}>
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">قوة كلمة المرور</span>
                                        <span className={`text-xs font-bold transition-colors ${passwords.newPassword.length === 0 ? 'text-gray-300' :
                                            passwords.newPassword.length < 8 ? 'text-red-500' :
                                                passwords.newPassword.length < 10 ? 'text-yellow-500' : 'text-green-500'
                                            }`}>
                                            {passwords.newPassword.length === 0 ? 'غير مدخلة' :
                                                passwords.newPassword.length < 8 ? 'ضعيفة (يجب أن تكون 8 أحرف على الأقل)' :
                                                    passwords.newPassword.length < 10 ? 'متوسطة' : 'قوية'}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex space-x-reverse space-x-1">
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length > 0 ? (passwords.newPassword.length < 8 ? 'bg-red-500' : 'bg-green-500') : 'bg-transparent'
                                            }`}></div>
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length >= 8 ? (passwords.newPassword.length < 10 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-transparent'
                                            }`}></div>
                                        <div className={`h-full w-1/3 transition-all duration-500 ${passwords.newPassword.length >= 10 ? 'bg-green-400' : 'bg-transparent'
                                            }`}></div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all transform hover:-translate-y-1 animate-item"
                                    style={{ animationDelay: '0.7s' }}
                                >
                                    {loading ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
                                </button>
                            </form>

                            <div className="text-center pt-4 animate-item" style={{ animationDelay: '0.8s' }}>
                                <Link to="/login" className="text-gray-400 dark:text-gray-500 font-bold hover:text-green-500 transition flex items-center justify-center space-x-reverse space-x-2">
                                    <i className="fas fa-arrow-right text-sm"></i>
                                    <span>العودة لتسجيل الدخول</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;