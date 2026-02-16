import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const JoinUs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        motivation: '',
        nationalId: '',
        licenseNumber: '',
        experienceYears: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [location.pathname, navigate]);

    const roles = [
        { id: 'EquineVet', title: 'طبيب بيطري', icon: 'user-md', desc: 'انضم كطبيب بيطري معتمد لفحص وعلاج الخيول.' },
        { id: 'Trainer', title: 'مدرب خيل', icon: 'horse-head', desc: 'شارك خبرتك في تدريب وتأهيل الخيول العربية.' },
        { id: 'Seller', title: 'بائع', icon: 'store', desc: 'اعرض خيولك للبيع في منصتنا الموثوقة.' }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = { ...formData, role };
            // Convert experience to number if present, otherwise set to null
            if (payload.experienceYears) {
                payload.experienceYears = parseInt(payload.experienceYears);
            } else {
                payload.experienceYears = null;
            }

            await axios.post('http://localhost:5000/api/join/apply', payload);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء إرسال الطلب. رجاء المحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-gray-50 min-h-screen font-sans text-right Selection:bg-green-100 transition-colors duration-300 dark:bg-gray-950" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center max-w-lg w-full border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            <i className="fas fa-check"></i>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">تم استلام طلبك بنجاح!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">شكراً لاهتمامك بالانضمام إلينا. سيقوم فريقنا بمراجعة طلبك والرد عليك قريباً.</p>
                        <a href="/" className="bg-[#76E05B] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100 dark:shadow-none block w-full text-center">
                            العودة للرئيسية
                        </a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right Selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">انضم إلى مجتمعنا</h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">كن جزءاً من المنظومة الرائدة للخيول العربية الأصيلة. اختر دورك وابدأ رحلتك معنا.</p>
                    </div>

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id)}
                                    className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 group text-center"
                                >
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                        <i className={`fas fa-${r.icon} text-3xl text-gray-400 group-hover:text-green-500 transition-colors`}></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{r.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{r.desc}</p>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center mb-8">
                                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 transition ml-4">
                                    <i className="fas fa-arrow-right text-xl"></i>
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    تقديم طلب: <span className="text-green-500">{roles.find(r => r.id === role)?.title}</span>
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="أدخل اسمك الثلاثي"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="01xxxxxxxxx"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                        placeholder="example@mail.com"
                                    />
                                </div>

                                {role === 'EquineVet' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                            <input
                                                type="text"
                                                name="nationalId"
                                                value={formData.nationalId || ''}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم رخصة مزاولة المهنة</label>
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber || ''}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                {role === 'Trainer' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">سنوات الخبرة</label>
                                            <input
                                                type="number"
                                                name="experienceYears"
                                                value={formData.experienceYears || ''}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                )}

                                {role === 'Seller' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                        <input
                                            type="text"
                                            name="nationalId"
                                            value={formData.nationalId || ''}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">لماذا ترغب بالانضمام إلينا؟</label>
                                    <textarea
                                        name="motivation"
                                        value={formData.motivation}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition resize-none text-gray-900 dark:text-white"
                                        placeholder="حدثنا قليلاً عن خبرتك وشغفك..."
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 text-red-500 px-6 py-4 rounded-xl text-sm font-bold flex items-center">
                                        <i className="fas fa-exclamation-circle ml-3"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#76E05B] text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-xl shadow-green-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default JoinUs;
