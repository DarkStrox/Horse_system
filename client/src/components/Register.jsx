import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';

const Register = () => {
    const navigate = useNavigate();

    // --- استخدام الـ URL Parameters للتحكم في الخطوات ---
    const [searchParams, setSearchParams] = useSearchParams();
    const role = searchParams.get('role');
    const step = role ? 2 : 1;

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // قائمة محافظات مصر
    const egyptianGovernorates = [
        'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'البحيرة', 'الشرقية',
        'الدقهلية', 'الغربية', 'المنوفية', 'كفر الشيخ', 'دمياط', 'بورسعيد',
        'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
        'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
        'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ];

    const roles = [
        { id: 'User', title: 'مستخدم ', icon: 'user', desc: 'سجل لإنشاء حساب شخصي لتصفح الخيول والتفاعل مع المجتمع.', needsApproval: false },
        { id: 'Buyer', title: 'مشتري', icon: 'shopping-bag', desc: 'سجل كمشتري لتصفح واقتناء الخيول العربية الأصيلة.', needsApproval: false },
        { id: 'Seller', title: 'بائع', icon: 'store', desc: 'انضم كبائع لعرض خيولك ومزرعتك في منصتنا.', needsApproval: true },
        { id: 'EquineVet', title: 'طبيب بيطري', icon: 'user-md', desc: 'انضم كطبيب بيطري معتمد لفحص وعلاج الخيول.', needsApproval: true }
    ];

    const [formData, setFormData] = useState({
        // أساسي
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        nationalId: '',

        // بائع (تم إزالة sellerType لأنها أصبحت مؤسسة فقط)
        farmName: '',
        address: '',
        commercialRegister: '',
        experienceYears: '',
        sellerRole: '',
        recommendationLetter: null,

        // مشتري
        governorate: '',

        // سؤال مشترك
        howDidYouHear: '',
        otherHowDidYouHear: '',

        // طبيب بيطري
        countryCity: '',
        licenseNumber: '',
        vetSpecialization: '',
        clinicsWorkedAt: '',
        vetBio: '',
        licenseFile: null,
        nationalIdFile: null,
        vetCertificates: null,
        confirmAccuracy: false
    });

    const [filePreviews, setFilePreviews] = useState({
        licenseFile: '',
        nationalIdFile: '',
        recommendationLetter: '',
        vetCertificates: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // 1. الحقول التي تقبل أرقام فقط
        const numberOnlyFields = ['phoneNumber', 'nationalId', 'commercialRegister', 'licenseNumber', 'experienceYears'];
        if (numberOnlyFields.includes(name)) {
            // السماح برقم الهاتف أن يحتوي على + في البداية
            if (name === 'phoneNumber' && value !== '' && !/^[\d+]*$/.test(value)) return;
            // باقي حقول الأرقام
            if (name !== 'phoneNumber' && value !== '' && !/^\d*$/.test(value)) return;

            // تحديد الرقم القومي بـ 14 رقم كحد أقصى
            if (name === 'nationalId' && value.length > 14) return;
        }

        // 2. الحقول التي تقبل حروف فقط (عربي، إنجليزي، مسافات) ولا تقبل أرقام
        const textOnlyFields = ['fullName'];
        if (textOnlyFields.includes(name)) {
            if (value !== '' && !/^[\u0600-\u06FFa-zA-Z\s]+$/.test(value)) return;
        }

        // تحديث الـ State
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setError('يرجى تحميل صورة (JPG/PNG) أو ملف PDF فقط');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
                return;
            }

            setFormData({ ...formData, [name]: file });

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreviews(prev => ({ ...prev, [name]: '📄 ملف PDF محمل بنجاح' }));
            }
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setError('');
        setSearchParams({ role: selectedRole });
    };

    const handleGoBack = (e) => {
        e.preventDefault();
        setError('');
        setSearchParams({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متوافقة');
            return;
        }

        if (['Buyer', 'Seller', 'EquineVet'].includes(role) && formData.nationalId.length < 14) {
            setError('الرقم القومي يجب أن يتكون من 14 رقماً');
            return;
        }

        setLoading(true);

        try {
            const payload = new FormData();
            payload.append('role', role);
            payload.append('fullName', formData.fullName);
            payload.append('email', formData.email);
            payload.append('password', formData.password);
            payload.append('phoneNumber', formData.phoneNumber);

            if (['Buyer', 'Seller', 'EquineVet'].includes(role) && formData.howDidYouHear) {
                const finalHowDidYouHear = formData.howDidYouHear === 'أخرى' && formData.otherHowDidYouHear.trim() !== ''
                    ? formData.otherHowDidYouHear
                    : formData.howDidYouHear;

                payload.append('howDidYouHear', finalHowDidYouHear);
            }

            if (role === 'Seller') {
                payload.append('nationalId', formData.nationalId);
                // تم إرسال الداتا مباشرة بافتراض أنه مؤسسة/إسطبل دائماً
                payload.append('farmName', formData.farmName);
                payload.append('address', formData.address);
                payload.append('commercialRegister', formData.commercialRegister);
                payload.append('nationalIdFile', formData.nationalIdFile);
                payload.append('experienceYears', formData.experienceYears);
                payload.append('sellerRole', formData.sellerRole);
                payload.append('recommendationLetter', formData.recommendationLetter);
            }

            if (role === 'EquineVet') {
                payload.append('nationalId', formData.nationalId);
                payload.append('countryCity', formData.countryCity);
                payload.append('licenseNumber', formData.licenseNumber);
                payload.append('experienceYears', formData.experienceYears);
                payload.append('vetSpecialization', formData.vetSpecialization);
                payload.append('clinicsWorkedAt', formData.clinicsWorkedAt);
                payload.append('vetBio', formData.vetBio);
                payload.append('confirmAccuracy', formData.confirmAccuracy);
                payload.append('licenseFile', formData.licenseFile);
                payload.append('nationalIdFile', formData.nationalIdFile);
                payload.append('vetCertificates', formData.vetCertificates);
            }

            if (role === 'Buyer') {
                payload.append('nationalId', formData.nationalId);
                if (formData.governorate) payload.append('governorate', formData.governorate);
            }

            await axios.post('/api/account/register', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
        } catch (err) {
            let message = 'حدث خطأ أثناء التسجيل. رجاء المحاولة لاحقاً.';
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (Array.isArray(data) && data.length > 0) {
                    message = data.map(e => e.description).join('، ');
                } else if (typeof data === 'object') {
                    const messages = Object.values(data).flat();
                    if (messages.length > 0) message = messages.join('، ');
                }
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const selectedRoleObj = roles.find(r => r.id === role);
        const approvalText = selectedRoleObj?.needsApproval
            ? 'تم إنشاء حسابك بنجاح. سيقوم فريقنا بمراجعة مستنداتك وتفعيل الحساب قريباً.'
            : `تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والبدء في استخدام المنصة.`;

        return (
            <div className="bg-gray-50 min-h-screen font-sans text-right selection:bg-[#82D616] transition-colors duration-300 dark:bg-gray-950" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
                    <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center max-w-lg w-full border border-gray-100 dark:border-gray-800">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-[#82D616] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                            <i className="fas fa-check"></i>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">تم إنشاء حسابك بنجاح!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-lg">{approvalText}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#82D616] text-white px-8 py-4 rounded-2xl font-black hover:bg-green-600 transition shadow-lg shadow-green-100 dark:shadow-none block w-full text-center hover:-translate-y-1">
                            الذهاب لتسجيل الدخول
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- الجزء الخاص بـ "كيف توصلت إلينا" (تم نقله كمتغير ليعمل بدون فقدان التركيز) ---
    const howDidYouHearJSX = (
        <div className="space-y-4 md:col-span-2 mt-2">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كيف توصلت إلينا؟</label>
                <select
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                >
                    <option value="">اختر إجابة...</option>
                    <option value="فيسبوك">فيسبوك</option>
                    <option value="إنستجرام">إنستجرام</option>
                    <option value="تويتر (X)">تويتر (X)</option>
                    <option value="لينكد إن">لينكد إن</option>
                    <option value="صديق / معارف">عن طريق صديق أو معارف</option>
                    <option value="محرك بحث جوجل">محرك بحث جوجل</option>
                    <option value="أخرى">أخرى</option>
                </select>
            </div>
            {formData.howDidYouHear === 'أخرى' && (
                <div className="space-y-2 animate-fade-in-up">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">يرجى التوضيح</label>
                    <input
                        type="text"
                        name="otherHowDidYouHear"
                        value={formData.otherHowDidYouHear}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                        placeholder="اذكر التفاصيل..."
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="relative min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">

            <div className="fixed inset-0 z-0 bg-black">
                <img src="/register-horse.png" alt="Background" className="w-full h-full object-cover object-center opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0A0F16] backdrop-blur-[2px]"></div>
            </div>

            <style>{`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
            `}</style>

            <div className="relative z-10 flex flex-col min-h-screen">

                <div className="w-full p-6 flex justify-end items-center container mx-auto">
                    <Link to="/login" className="text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-bold backdrop-blur-md transition border border-white/10">تسجيل الدخول</Link>
                </div>

                {step === 1 && (
                    <div className="flex-1 flex flex-col justify-center items-center px-4 py-10 animate-fade-in-up">
                        <div className="text-center mb-10">
                            <span className="bg-[#82D616] text-white px-4 py-1 rounded-full text-xs font-black tracking-wider mb-4 inline-block">مرحباً بك</span>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">إنشاء حساب جديد</h1>
                            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">اختر صفة الحساب التي تناسبك للبدء في رحلتك معنا في عالم الخيل العربية الأصيلة.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id)}
                                    className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-[2.5rem] hover:bg-white/20 hover:border-[#82D616] hover:-translate-y-2 transition-all duration-300 group text-center cursor-pointer shadow-2xl flex flex-col h-full"
                                >
                                    <div className="w-20 h-20 bg-black/30 group-hover:bg-[#82D616] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 border border-white/10 shrink-0">
                                        <i className={`fas fa-${r.icon} text-3xl text-white`}></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 shrink-0">{r.title}</h3>
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">{r.desc}</p>

                                    <div className="h-6 shrink-0 mt-auto">
                                        {r.needsApproval && (
                                            <div className="px-3 py-1 bg-yellow-500/20 text-xs font-bold text-yellow-300 rounded-full inline-block border border-yellow-500/30">
                                                يتطلب مراجعة
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex-1 py-10 px-4 animate-fade-in-up">
                        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800">

                            <div className="flex items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                                <button
                                    type="button"
                                    onClick={handleGoBack}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition ml-4 cursor-pointer w-10 h-10 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                                    title="العودة للاختيار"
                                >
                                    <i className="fas fa-arrow-right text-xl"></i>
                                </button>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    إنشاء حساب: <span className="text-[#82D616]">{roles.find(r => r.id === role)?.title}</span>
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* الحقول الأساسية المشتركة */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="أدخل اسمك الثلاثي"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
                                        <input
                                            type="text" // تم تغيير النوع لـ text مع بقاء الـ regex لمنع ظهور أسهم الأرقام
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="01xxxxxxxxx"
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="example@mail.com"
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            dir="ltr"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">تأكيد كلمة المرور</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                            placeholder="••••••••"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>

                                {/* نموذج المستخدم العادي */}
                                {role === 'User' && (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800 flex items-center mt-6">
                                        <input
                                            type="checkbox"
                                            id="agreeTermsUser"
                                            required
                                            className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer ml-3"
                                        />
                                        <label htmlFor="agreeTermsUser" className="text-sm font-bold text-green-800 dark:text-green-300 cursor-pointer">
                                            أوافق على شروط الاستخدام وسياسة الخصوصية للمنصة.
                                        </label>
                                    </div>
                                )}

                                {/* نموذج الطبيب البيطري */}
                                {role === 'EquineVet' && (
                                    <div className="space-y-6 mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الدولة / المدينة (محل العمل)</label>
                                                <input
                                                    type="text"
                                                    name="countryCity"
                                                    value={formData.countryCity}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="مثال: مصر / القاهرة"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                                <input
                                                    type="text"
                                                    name="nationalId"
                                                    value={formData.nationalId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="14 رقم"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم رخصة مزاولة المهنة</label>
                                                <input
                                                    type="text"
                                                    name="licenseNumber"
                                                    value={formData.licenseNumber}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">سنوات الخبرة</label>
                                                <input
                                                    type="text"
                                                    name="experienceYears"
                                                    value={formData.experienceYears}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="مثال: 5"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2 mt-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">التخصص</label>
                                                <select
                                                    name="vetSpecialization"
                                                    value={formData.vetSpecialization}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="" disabled>اختر التخصص...</option>
                                                    <option value="طب بيطري خيول">طب بيطري خيول</option>
                                                    <option value="جراحة">جراحة</option>
                                                    <option value="طب بيطري عام">طب بيطري عام</option>
                                                </select>
                                            </div>

                                            {howDidYouHearJSX}

                                            <div className="space-y-2 md:col-span-2 mt-4">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">العيادات أو المستشفيات التي عملت بها</label>
                                                <input
                                                    type="text"
                                                    name="clinicsWorkedAt"
                                                    value={formData.clinicsWorkedAt}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="اذكر أهم أماكن عملك السابقة أو الحالية"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">نبذة مختصرة / خبرتك مع الخيول</label>
                                                <textarea
                                                    name="vetBio"
                                                    value={formData.vetBio}
                                                    onChange={handleChange}
                                                    required
                                                    rows="4"
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition resize-none text-gray-900 dark:text-white"
                                                    placeholder="اكتب نبذة عن خبراتك ومهاراتك في هذا المجال..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-[#82D616]">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">رفع رخصة مزاولة المهنة</label>
                                                <input
                                                    type="file"
                                                    name="licenseFile"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.licenseFile}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#82D616] file:text-white hover:file:bg-green-600 block cursor-pointer"
                                                />
                                                {filePreviews.licenseFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>

                                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-[#82D616]">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">صورة البطاقة الشخصية</label>
                                                <input
                                                    type="file"
                                                    name="nationalIdFile"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.nationalIdFile}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#82D616] file:text-white hover:file:bg-green-600 block cursor-pointer"
                                                />
                                                {filePreviews.nationalIdFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>

                                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-[#82D616]">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">رفع الشهادات</label>
                                                <input
                                                    type="file"
                                                    name="vetCertificates"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.vetCertificates}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#82D616] file:text-white hover:file:bg-green-600 block cursor-pointer"
                                                />
                                                {filePreviews.vetCertificates && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800 flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                name="confirmAccuracy"
                                                id="confirmAccuracy"
                                                checked={formData.confirmAccuracy}
                                                onChange={handleChange}
                                                required
                                                className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer ml-3"
                                            />
                                            <label htmlFor="confirmAccuracy" className="text-sm font-bold text-green-800 dark:text-green-300 cursor-pointer">
                                                أقر بأن جميع البيانات المقدمة أعلاه صحيحة ومطابقة للواقع.
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* نموذج البائع (مؤسسة / مزرعة بشكل افتراضي) */}
                                {role === 'Seller' && (
                                    <div className="space-y-6 mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم المزرعة / الإسطبل (المؤسسة)</label>
                                                <input
                                                    type="text"
                                                    name="farmName"
                                                    value={formData.farmName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="مثال: مربط الجياد"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم السجل التجاري</label>
                                                <input
                                                    type="text"
                                                    name="commercialRegister"
                                                    value={formData.commercialRegister}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي للمفوض)</label>
                                                <input
                                                    type="text"
                                                    name="nationalId"
                                                    value={formData.nationalId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="14 رقم"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان المزرعة / الإسطبل بالتفصيل</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="أدخل العنوان التفصيلي للمزرعة"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عدد سنوات الخبرة في مجال الخيول</label>
                                                <input
                                                    type="text"
                                                    name="experienceYears"
                                                    value={formData.experienceYears}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="مثال: 5"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الغرض من البيع (صفتك)</label>
                                                <select
                                                    name="sellerRole"
                                                    value={formData.sellerRole}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="" disabled>اختر صفتك...</option>
                                                    <option value="مربي">مربي</option>
                                                    <option value="وسيط">وسيط</option>
                                                    <option value="مالك خاص">مالك خاص</option>
                                                </select>
                                            </div>
                                        </div>

                                        {howDidYouHearJSX}

                                        <div className="space-y-6 mt-6 border-t border-gray-100 dark:border-gray-800 pt-6">
                                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-[#82D616]">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">صورة البطاقة الشخصية</label>
                                                <input
                                                    type="file"
                                                    name="nationalIdFile"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.nationalIdFile}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#82D616] file:text-white hover:file:bg-green-600 block cursor-pointer"
                                                />
                                                {filePreviews.nationalIdFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>

                                            <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-[#82D616]">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">خطاب التوصية / الترخيص</label>
                                                <input
                                                    type="file"
                                                    name="recommendationLetter"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.recommendationLetter}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#82D616] file:text-white hover:file:bg-green-600 block cursor-pointer"
                                                />
                                                {filePreviews.recommendationLetter && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* نموذج المشتري */}
                                {role === 'Buyer' && (
                                    <div className="space-y-6 mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                                <input
                                                    type="text"
                                                    name="nationalId"
                                                    value={formData.nationalId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="14 رقم"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المحافظة</label>
                                                <select
                                                    name="governorate"
                                                    value={formData.governorate}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-[#82D616] focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="">اختر المحافظة...</option>
                                                    {egyptianGovernorates.map((gov) => (
                                                        <option key={gov} value={gov}>{gov}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {howDidYouHearJSX}
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 text-red-500 px-6 py-4 rounded-xl text-sm font-bold flex items-center mt-6">
                                        <i className="fas fa-exclamation-circle ml-3"></i>
                                        {error}
                                    </div>
                                )}

                                <div className="pt-4 mt-8 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#82D616] text-white py-5 rounded-2xl font-black text-xl hover:bg-green-600 transition shadow-xl shadow-green-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-reverse space-x-2"
                                    >
                                        {loading ? <span>جاري إنشاء الحساب...</span> : <span>إنشاء الحساب</span>}
                                    </button>
                                    <p className="text-center mt-6 text-gray-500 font-bold">
                                        لديك حساب بالفعل؟ <Link to="/login" className="text-[#82D616] underline hover:text-green-600 transition ml-1">تسجيل الدخول</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;