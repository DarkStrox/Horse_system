import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const ContactUs = () => {
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user:", err));
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const getProfilePicUrl = (url) => {
        if (!url) return "https://ui-avatars.com/api/?name=" + (user?.fullName || "User");
        if (url.startsWith('http')) return url;
        return API_BASE_URL + url;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-16 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-black">تواصل معنا</span>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">نحن هنا للإجابة على جميع استفساراتك</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        سواء كنت مربياً، مالكاً، أو مهتماً بالخيل العربية، يسعدنا سماع صوتك وتقديم الدعم اللازم لك.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        {[
                            { title: 'البريد الإلكتروني', value: <span dir="ltr">mohamed200031921@gmail.com</span>, icon: 'envelope', color: 'bg-blue-50 text-blue-500' },
                            { title: 'رقم الهاتف', value: <span dir="ltr">+201030469659</span>, icon: 'phone', color: 'bg-green-50 text-green-500' },
                            { title: 'المكتب الرئيسي', value: <span dir="ltr">6 October, Giza, Egypt</span>, icon: 'map-marker-alt', color: 'bg-yellow-50 text-yellow-500' }
                        ].map((info, i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-reverse space-x-6">
                                <div className={`${info.color} w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                                    <i className={`fas fa-${info.icon}`}></i>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-1">{info.title}</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">{info.value}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition group-hover:bg-green-500/30"></div>
                            <h3 className="text-xl font-black mb-4 relative z-10">ساعات العمل</h3>
                            <div className="space-y-2 relative z-10">
                                <p className="text-gray-400 font-bold">الأحد - الخميس: 9:00 ص - 6:00 م</p>
                                <p className="text-gray-400 font-bold">الجمعة - السبت: مغلق</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الاسم بالكامل</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                        placeholder="محمد أحمد"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition text-left"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الموضوع</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                    placeholder="كيف يمكننا مساعدتك؟"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الرسالة</label>
                                <textarea
                                    rows="6"
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition resize-none"
                                    placeholder="اكتب رسالتك هنا..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full bg-[#76E05B] text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-green-100 dark:shadow-green-900/20 hover:bg-green-500 transition disabled:opacity-50"
                            >
                                {status === 'sending' ? (
                                    <span className="flex items-center justify-center space-x-reverse space-x-3">
                                        <i className="fas fa-spinner fa-spin"></i>
                                        <span>جاري الإرسال...</span>
                                    </span>
                                ) : 'إرسال الرسالة'}
                            </button>

                            {status === 'success' && (
                                <div className="bg-green-50 text-green-600 p-5 rounded-2xl text-center font-bold animate-in fade-in zoom-in duration-300">
                                    <i className="fas fa-check-circle mr-2"></i>
                                    تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت ممكن.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ContactUs;
