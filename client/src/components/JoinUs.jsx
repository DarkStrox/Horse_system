import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { joinApi } from '../api/api';

const JoinUs = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const role = searchParams.get('role');
    const step = role ? 2 : 1;

    const egyptianGovernorates = [
        'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'البحيرة', 'الشرقية',
        'الدقهلية', 'الغربية', 'المنوفية', 'كفر الشيخ', 'دمياط', 'بورسعيد',
        'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
        'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
        'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ];

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
        motivation: '',
        farmName: '',
        address: '',
        sellerType: 'individual',
        commercialRegister: '',
        experienceYears: '',
        sellerRole: '',
        recommendationLetter: null,
        governorate: '',
        howDidYouHear: '',
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

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [filePreviews, setFilePreviews] = useState({
        licenseFile: '',
        nationalIdFile: '',
        recommendationLetter: '',
        vetCertificates: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const roles = [
        { id: 'Seller', title: 'بائع معتمد', icon: 'store-alt', desc: 'اعرض خيولك للبيع وشارك في المزادات الرسمية.', needsApproval: true },
        { id: 'EquineVet', title: 'طبيب بيطري', icon: 'stethoscope', desc: 'قدم خدماتك الطبية واعتمد تقارير الحالة الصحية.', needsApproval: true }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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

            if (file.size > 10 * 1024 * 1024) {
                setError('حجم الملف كبير جداً، يرجى اختيار ملف أقل من 10 ميجابايت');
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
                setFilePreviews(prev => ({ ...prev, [name]: '📄 ملف مستند محمل' }));
            }
        }
    };

    const handleRoleSelect = (selectedRole) => {
        setError('');
        setSearchParams({ role: selectedRole });
    };

    const handleGoBack = (e) => {
        e.preventDefault();
        setSearchParams({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = new FormData();
            payload.append('role', role);
            payload.append('fullName', formData.fullName);
            payload.append('email', formData.email);
            payload.append('phoneNumber', formData.phoneNumber);

            if (formData.nationalId) payload.append('nationalId', formData.nationalId);

            if (role === 'Seller') {
                payload.append('motivation', formData.motivation);
                payload.append('sellerType', formData.sellerType);
                if (formData.sellerType === 'institution') {
                    payload.append('farmName', formData.farmName);
                    payload.append('address', formData.address);
                    payload.append('commercialRegister', formData.commercialRegister);
                }
                payload.append('nationalIdFile', formData.nationalIdFile);
                payload.append('experienceYears', formData.experienceYears);
                payload.append('sellerRole', formData.sellerRole);
                payload.append('recommendationLetter', formData.recommendationLetter);
            }

            if (role === 'EquineVet') {
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
                if (formData.governorate) payload.append('governorate', formData.governorate);
                if (formData.howDidYouHear) payload.append('howDidYouHear', formData.howDidYouHear);
            }

            await joinApi.apply(payload);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('فشل إرسال الطلب، يرجى التحقق من البيانات والمحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 p-16 rounded-[4rem] shadow-2xl text-center max-w-2xl w-full border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-700">
                        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                            <i className="fas fa-paper-plane text-4xl"></i>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">تم الإرسال بنجاح</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-12 text-xl font-bold leading-relaxed">
                            شكراً لاهتمامك بالانضمام إلينا. سيتم مراجعة طلبك من قبل المختصين والرد عليك عبر البريد الإلكتروني في أقرب وقت.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <button onClick={() => navigate('/')} className="flex-1 bg-emerald-800 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-900/20">العودة للرئيسية</button>
                            <button onClick={() => { setSuccess(false); setSearchParams({}); }} className="flex-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-3xl font-black text-xl">طلب جديد</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    <header className="text-center mb-20 animate-in fade-in slide-in-from-top-10 duration-1000">
                        <span className="inline-block py-2 px-6 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800 mb-8">فرصة استثنائية</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase leading-tight">انضم إلى مجتمع <br /><span className="text-emerald-700">نخبة الخيل العربية</span></h1>
                        <p className="text-xl text-gray-400 font-black max-w-3xl mx-auto uppercase tracking-widest">Purebred Arabian Horse Ecosystem</p>
                    </header>

                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in fade-in zoom-in duration-700">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id)}
                                    className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] border-2 border-transparent hover:border-emerald-700 hover:shadow-2xl transition-all duration-700 group text-center flex flex-col items-center transform hover:-translate-y-4"
                                >
                                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 rounded-[2.5rem] flex items-center justify-center mb-10 transition-all duration-500 shadow-inner group-hover:rotate-12">
                                        <i className={`fas fa-${r.icon} text-4xl text-gray-300 group-hover:text-emerald-700 transition-colors`}></i>
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">{r.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg font-bold leading-relaxed mb-8">{r.desc}</p>
                                    <div className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest ${r.needsApproval ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                        {r.needsApproval ? 'Approval Required' : 'Instant Access'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-900 p-12 md:p-20 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-4 h-full bg-emerald-700"></div>
                            
                            <div className="flex items-center gap-6 mb-16">
                                <button onClick={handleGoBack} className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-700 transition-all hover:pr-4">
                                    <i className="fas fa-arrow-right text-2xl"></i>
                                </button>
                                <div>
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">نموذج الانضمام: {roles.find(r => r.id === role)?.title}</h2>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Application for {role} Role</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <FormField label="الاسم الرباعي الكامل" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="كما هو في الهوية" />
                                    <FormField label="رقم الجوال النشط" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} required placeholder="+20 1xxx xxx xxx" />
                                    <FormField label="البريد الإلكتروني الرسمي" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="official@example.com" />
                                    <FormField label="الرقم القومي / الهوية" name="nationalId" value={formData.nationalId} onChange={handleChange} required placeholder="14 رقماً" />
                                </div>

                                {role === 'EquineVet' && (
                                    <div className="space-y-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <FormField label="مقر العمل الحالي (الدولة/المدينة)" name="countryCity" value={formData.countryCity} onChange={handleChange} required />
                                            <FormField label="رقم ترخيص مزاولة المهنة" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                                            <FormField label="سنوات الخبرة المتخصصة" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} required />
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">التخصص الدقيق</label>
                                                <select name="vetSpecialization" value={formData.vetSpecialization} onChange={handleChange} required className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-5 rounded-2xl outline-none transition-all font-black text-gray-900 dark:text-white shadow-inner">
                                                    <option value="" disabled>اختر التخصص...</option>
                                                    <option value="Equine Surgery">جراحة خيول</option>
                                                    <option value="Equine Reproduction">تناسل وتلقيح</option>
                                                    <option value="Internal Medicine">باطنة خيول</option>
                                                </select>
                                            </div>
                                        </div>
                                        <FormField label="العيادات التي سبق العمل بها" name="clinicsWorkedAt" value={formData.clinicsWorkedAt} onChange={handleChange} required />
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">نبذة مهنية عن خبرتك</label>
                                            <textarea name="vetBio" value={formData.vetBio} onChange={handleChange} required rows="5" className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-6 rounded-[2rem] outline-none transition-all text-gray-900 dark:text-white font-black resize-none shadow-inner" placeholder="اكتب نبذة عن مسيرتك المهنية..."></textarea>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <FileUploadField label="رخصة المزاولة" name="licenseFile" onChange={handleFileChange} uploaded={!!formData.licenseFile} />
                                            <FileUploadField label="الهوية الوطنية" name="nationalIdFile" onChange={handleFileChange} uploaded={!!formData.nationalIdFile} />
                                            <FileUploadField label="الشهادات العلمية" name="vetCertificates" onChange={handleFileChange} uploaded={!!formData.vetCertificates} />
                                        </div>
                                    </div>
                                )}

                                {role === 'Seller' && (
                                    <div className="space-y-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">نوع البائع</label>
                                                <select name="sellerType" value={formData.sellerType} onChange={handleChange} required className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-5 rounded-2xl outline-none transition-all font-black text-gray-900 dark:text-white shadow-inner">
                                                    <option value="individual">بائع فرد INDIVIDUAL</option>
                                                    <option value="institution">مؤسسة / مربط رسمي INSTITUTION</option>
                                                </select>
                                            </div>
                                            {formData.sellerType === 'institution' && <FormField label="رقم السجل التجاري" name="commercialRegister" value={formData.commercialRegister} onChange={handleChange} required />}
                                        </div>
                                        {formData.sellerType === 'institution' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
                                                <FormField label="اسم المزرعة / المربط" name="farmName" value={formData.farmName} onChange={handleChange} required />
                                                <FormField label="العنوان التفصيلي" name="address" value={formData.address} onChange={handleChange} required />
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <FormField label="سنوات الخبرة في التربية" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} required />
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">صفتك الحالية</label>
                                                <select name="sellerRole" value={formData.sellerRole} onChange={handleChange} required className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-5 rounded-2xl outline-none transition-all font-black text-gray-900 dark:text-white shadow-inner">
                                                    <option value="" disabled>اختر صفتك...</option>
                                                    <option value="Breeder">مربي خيول</option>
                                                    <option value="Agent">وسيط معتمد</option>
                                                    <option value="Private Owner">مالك خاص</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <FileUploadField label="صورة الهوية" name="nationalIdFile" onChange={handleFileChange} uploaded={!!formData.nationalIdFile} />
                                            <FileUploadField label="خطاب التوصية" name="recommendationLetter" onChange={handleFileChange} uploaded={!!formData.recommendationLetter} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">لماذا ترغب في الانضمام للمنصة؟</label>
                                            <textarea name="motivation" value={formData.motivation} onChange={handleChange} required rows="5" className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-6 rounded-[2rem] outline-none transition-all text-gray-900 dark:text-white font-black resize-none shadow-inner" placeholder="اكتب هنا دوافعك وتطلعاتك..."></textarea>
                                        </div>
                                    </div>
                                )}

                                {role === 'Buyer' && (
                                    <div className="space-y-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">المحافظة</label>
                                                <select name="governorate" value={formData.governorate} onChange={handleChange} className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-5 rounded-2xl outline-none transition-all font-black text-gray-900 dark:text-white shadow-inner">
                                                    <option value="">اختر المحافظة...</option>
                                                    {egyptianGovernorates.map((gov) => (
                                                        <option key={gov} value={gov}>{gov}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">كيف سمعت عنا؟</label>
                                                <select name="howDidYouHear" value={formData.howDidYouHear} onChange={handleChange} className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-5 rounded-2xl outline-none transition-all font-black text-gray-900 dark:text-white shadow-inner">
                                                    <option value="">اختر إجابة...</option>
                                                    <option value="Social Media">وسائل التواصل الاجتماعي</option>
                                                    <option value="Friend">عن طريق صديق</option>
                                                    <option value="Search Engine">محركات البحث</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-[2rem] font-black text-sm border border-red-100 dark:border-red-900/30 animate-shake">{error}</div>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-800 hover:bg-emerald-950 text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-emerald-900/30 transition-all hover:-translate-y-2 uppercase tracking-tighter disabled:opacity-50"
                                >
                                    {loading ? 'جاري المعالجة...' : 'إرسال طلب الاعتماد الرسمي'}
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

const FormField = ({ label, value, name, onChange, type = "text", required = false, placeholder = "" }) => (
    <div className="space-y-3 group">
        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2 transition-colors group-focus-within:text-emerald-700">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 focus:bg-white dark:focus:bg-black p-5 rounded-2xl outline-none transition-all duration-300 font-black text-gray-900 dark:text-white shadow-inner"
        />
    </div>
);

const FileUploadField = ({ label, name, onChange, uploaded }) => (
    <div className={`p-8 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 ${uploaded ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-emerald-700'}`}>
        <label className="block cursor-pointer">
            <div className="text-center">
                <i className={`fas ${uploaded ? 'fa-check-circle text-emerald-600' : 'fa-cloud-upload-alt text-gray-300'} text-3xl mb-4 transition-transform ${uploaded ? 'scale-110' : ''}`}></i>
                <p className={`text-xs font-black uppercase tracking-widest ${uploaded ? 'text-emerald-700' : 'text-gray-400'}`}>{uploaded ? 'File Ready' : label}</p>
            </div>
            <input type="file" name={name} onChange={onChange} className="hidden" />
        </label>
    </div>
);

export default JoinUs;