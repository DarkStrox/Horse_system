import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متوافقة');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/account/register', {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            let message = 'حدث خطأ أثناء التسجيل';
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (Array.isArray(data) && data.length > 0) {
                    // Start of Identity error array: [{code: "...", description: "..."}]
                    message = data.map(e => e.description).join('، ');
                } else if (typeof data === 'object') {
                    // Start of ModelState error object: { "Field": ["Error message"] }
                    // Flatten the object values into a single string
                    const messages = Object.values(data).flat();
                    if (messages.length > 0) {
                        message = messages.join('، ');
                    }
                }
            }
            setError(message);
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
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">إنشاء حساب جديد</h1>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">أدخل بياناتك للبدء في رحلتك مع الخيل العربية</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mr-2">الاسم الكامل</label>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"><i className="far fa-user"></i></span>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="مثال: محمد عبدالله"
                                    className="w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-100 transition text-gray-900 dark:text-white"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mr-2">كلمة المرور</label>
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
                            <span className="text-[10px] text-gray-400 dark:text-gray-600 mr-2">يجب أن تحتوي على 8 أحرف على الأقل</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mr-2">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"><i className="fas fa-shield-alt text-sm"></i></span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50/50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-100 transition text-left text-gray-900 dark:text-white"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-reverse space-x-3 mr-2">
                            <input type="checkbox" className="w-4 h-4 rounded text-green-500 focus:ring-green-500" required />
                            <span className="text-xs text-gray-500">أوافق على <span className="text-green-500 underline cursor-pointer">شروط الخدمة</span> و <span className="text-green-500 underline cursor-pointer">سياسة الخصوصية</span></span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#82D616] text-white p-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-green-600 transition flex items-center justify-center space-x-reverse space-x-3 group"
                        >
                            <span>{loading ? 'جاري التحميل...' : 'إنشاء الحساب'}</span>
                            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition"></i>
                        </button>
                    </form>


                    <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        لديك حساب بالفعل؟ <Link to="/login" className="text-green-500 font-bold underline hover:text-green-600 transition">تسجيل الدخول</Link>
                    </p>
                </div>

                <div className="hidden lg:block w-full max-w-[600px] relative">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <img src="/register-horse.png" alt="Horse" className="w-full h-[700px] object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-16 right-12 left-12 text-white space-y-4">
                            <span className="bg-[#82D616] px-4 py-1 rounded-full text-xs font-black">اللغة العربية</span>
                            <h2 className="text-5xl font-black leading-tight">أصالة الخيل،<br />بمستقبل رقمي.</h2>
                            <p className="text-gray-200 text-lg">انضم إلى أكبر منصة رقمية لإدارة وتوثيق سلالات الخيل العربية الأصيلة في المنطقة.</p>
                        </div>
                        <div className="absolute top-12 left-12 bg-white/90 backdrop-blur p-4 rounded-2xl flex items-center space-x-reverse space-x-4 shadow-xl">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white"><i className="fas fa-check"></i></div>
                            <div>
                                <p className="font-black text-gray-900 text-sm">موثوقة بنسبة</p>
                                <p className="text-xs text-gray-500">100% آمنة</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
