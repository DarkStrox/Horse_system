import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const JoinUs = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const role = searchParams.get('role');
    const step = role ? 2 : 1;

    // قائمة محافظات مصر للمشتري
    const egyptianGovernorates = [
        'القاهرة', 'الإسكندرية', 'الجيزة', 'القليوبية', 'البحيرة', 'الشرقية',
        'الدقهلية', 'الغربية', 'المنوفية', 'كفر الشيخ', 'دمياط', 'بورسعيد',
        'الإسماعيلية', 'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
        'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
        'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ];

    const [formData, setFormData] = useState({
        // أساسي
        fullName: '',
        email: '',
        phoneNumber: '',
        nationalId: '',
        motivation: '',

        // بائع
        farmName: '',
        address: '',
        sellerType: 'individual',
        commercialRegister: '',
        experienceYears: '',
        sellerRole: '',
        recommendationLetter: null,

        // مشتري
        governorate: '',
        howDidYouHear: '',

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
        { id: 'Buyer', title: 'مشتري', icon: 'shopping-bag', desc: 'سجل كمشتري لتصفح واقتناء الخيول العربية الأصيلة.', needsApproval: false },
        { id: 'Seller', title: 'بائع', icon: 'store', desc: 'انضم كبائع لعرض خيولك ومزرعتك في منصتنا.', needsApproval: true },
        { id: 'EquineVet', title: 'طبيب بيطري', icon: 'user-md', desc: 'انضم كطبيب بيطري معتمد لفحص وعلاج الخيول.', needsApproval: true }
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
        setFormData({
            fullName: '', email: '', phoneNumber: '', nationalId: '', motivation: '',
            farmName: '', address: '', sellerType: 'individual', commercialRegister: '',
            experienceYears: '', sellerRole: '', recommendationLetter: null,
            governorate: '', howDidYouHear: '',
            countryCity: '', licenseNumber: '', vetSpecialization: '', clinicsWorkedAt: '',
            vetBio: '', licenseFile: null, nationalIdFile: null, vetCertificates: null, confirmAccuracy: false
        });
        setFilePreviews({ licenseFile: '', nationalIdFile: '', recommendationLetter: '', vetCertificates: '' });
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

            await axios.post('http://localhost:5000/api/join/apply', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء إرسال الطلب. رجاء المحاولة لاحقاً.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        const selectedRole = roles.find(r => r.id === role);
        const approvalText = selectedRole?.needsApproval
            ? 'سيقوم فريقنا بمراجعة طلبك والرد عليك قريباً.'
            : `يمكنك البدء فوراً في استخدام حسابك كـ${selectedRole?.title}`;

        return (
            <div className="bg-gray-50 min-h-screen font-sans text-right Selection:bg-green-100 transition-colors duration-300 dark:bg-gray-950" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center max-w-lg w-full border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                            <i className="fas fa-check"></i>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">تم استلام طلبك بنجاح!</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{approvalText}</p>
                        <button
                            onClick={() => { setSuccess(false); setSearchParams({}); }}
                            className="bg-[#76E05B] text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100 dark:shadow-none block w-full text-center mb-2"
                        >
                            تقديم طلب آخر
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="border-2 border-[#76E05B] text-[#76E05B] px-8 py-3 rounded-xl font-bold hover:bg-[#76E05B] hover:text-white transition shadow-lg shadow-green-100 dark:shadow-none block w-full text-center">
                            العودة للرئيسية
                        </button>
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
                                    className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-2 border-transparent hover:border-green-500 hover:shadow-xl transition-all duration-300 group text-center cursor-pointer"
                                >
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                        <i className={`fas fa-${r.icon} text-3xl text-gray-400 group-hover:text-green-500 transition-colors`}></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{r.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{r.desc}</p>
                                    {r.needsApproval && (
                                        <div className="mt-3 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-xs font-bold text-yellow-800 dark:text-yellow-200 rounded-full inline-block">
                                            يحتاج موافقة
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center mb-8">
                                <button
                                    type="button"
                                    onClick={handleGoBack}
                                    className="text-gray-400 hover:text-gray-600 transition ml-4 cursor-pointer"
                                    title="العودة للاختيار"
                                >
                                    <i className="fas fa-arrow-right text-xl"></i>
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    تقديم طلب: <span className="text-green-500">{roles.find(r => r.id === role)?.title}</span>
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* البيانات الأساسية المشتركة */}
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

                                {/* حقول الطبيب البيطري */}
                                {role === 'EquineVet' && (
                                    <div className="space-y-6 mt-8">

                                        {/* الحقول النصية (بدون عناوين مهنية أو خبرة) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الدولة / المدينة (محل العمل)</label>
                                                <input
                                                    type="text"
                                                    name="countryCity"
                                                    value={formData.countryCity}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">سنوات الخبرة</label>
                                                <input
                                                    type="number"
                                                    name="experienceYears"
                                                    value={formData.experienceYears}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="" disabled>اختر التخصص...</option>
                                                    <option value="طب بيطري خيول">طب بيطري خيول</option>
                                                    <option value="جراحة">جراحة</option>
                                                    <option value="طب بيطري عام">طب بيطري عام</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">العيادات أو المستشفيات التي عملت بها</label>
                                                <input
                                                    type="text"
                                                    name="clinicsWorkedAt"
                                                    value={formData.clinicsWorkedAt}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition resize-none text-gray-900 dark:text-white"
                                                    placeholder="اكتب نبذة عن خبراتك ومهاراتك في هذا المجال..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* المستندات للطبيب البيطري تحت بعض */}
                                        <div className="space-y-6 mt-6">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">المستندات</h3>

                                            <div className="space-y-6">
                                                <div className="space-y-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-green-500">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">رفع رخصة مزاولة المهنة</label>
                                                    <input
                                                        type="file"
                                                        name="licenseFile"
                                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                        onChange={handleFileChange}
                                                        required={!formData.licenseFile}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#76E05B] file:text-white hover:file:bg-green-600 block"
                                                    />
                                                    {filePreviews.licenseFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                                </div>

                                                <div className="space-y-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-green-500">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">صورة البطاقة الشخصية</label>
                                                    <input
                                                        type="file"
                                                        name="nationalIdFile"
                                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                        onChange={handleFileChange}
                                                        required={!formData.nationalIdFile}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#76E05B] file:text-white hover:file:bg-green-600 block"
                                                    />
                                                    {filePreviews.nationalIdFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                                </div>

                                                <div className="space-y-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-green-500">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">رفع الشهادات</label>
                                                    <input
                                                        type="file"
                                                        name="vetCertificates"
                                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                        onChange={handleFileChange}
                                                        required={!formData.vetCertificates}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#76E05B] file:text-white hover:file:bg-green-600 block"
                                                    />
                                                    {filePreviews.vetCertificates && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* الموافقة */}
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

                                {/* حقول البائع */}
                                {role === 'Seller' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">هل أنت بائع فرد أم مؤسسة؟</label>
                                                <select
                                                    name="sellerType"
                                                    value={formData.sellerType}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="individual">بائع فرد</option>
                                                    <option value="institution">مؤسسة / شركة</option>
                                                </select>
                                            </div>

                                            {formData.sellerType === 'institution' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم السجل التجاري</label>
                                                    <input
                                                        type="text"
                                                        name="commercialRegister"
                                                        value={formData.commercialRegister}
                                                        onChange={handleChange}
                                                        required={formData.sellerType === 'institution'}
                                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                                <input
                                                    type="text"
                                                    name="nationalId"
                                                    value={formData.nationalId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            {/* إظهار حقل اسم المزرعة للمؤسسات فقط */}
                                            {formData.sellerType === 'institution' && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم المزرعة / الإسطبل</label>
                                                    <input
                                                        type="text"
                                                        name="farmName"
                                                        value={formData.farmName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                        placeholder="مثال: مربط الجياد"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* إظهار حقل عنوان المزرعة للمؤسسات فقط */}
                                        {formData.sellerType === 'institution' && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عنوان المزرعة / الإسطبل بالتفصيل</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                    placeholder="أدخل العنوان التفصيلي للمزرعة"
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">عدد سنوات الخبرة في مجال الخيول</label>
                                                <input
                                                    type="number"
                                                    name="experienceYears"
                                                    value={formData.experienceYears}
                                                    onChange={handleChange}
                                                    required
                                                    min="0"
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="" disabled>اختر صفتك...</option>
                                                    <option value="مربي">مربي</option>
                                                    <option value="وسيط">وسيط</option>
                                                    <option value="مالك خاص">مالك خاص</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* مسافات موسعة بين ملفات البائع تحت بعض */}
                                        <div className="space-y-6 mt-6">
                                            <div className="space-y-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-green-500">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">صورة البطاقة الشخصية</label>
                                                <input
                                                    type="file"
                                                    name="nationalIdFile"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.nationalIdFile}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#76E05B] file:text-white hover:file:bg-green-600 block"
                                                />
                                                {filePreviews.nationalIdFile && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>

                                            <div className="space-y-3 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition hover:border-green-500">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block">خطاب التوصية</label>
                                                <input
                                                    type="file"
                                                    name="recommendationLetter"
                                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                                    onChange={handleFileChange}
                                                    required={!formData.recommendationLetter}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#76E05B] file:text-white hover:file:bg-green-600 block"
                                                />
                                                {filePreviews.recommendationLetter && <div className="mt-2 text-sm text-green-600 font-bold">تم الإرفاق ✓</div>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* حقول المشتري */}
                                {role === 'Buyer' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">رقم البطاقة (الرقم القومي)</label>
                                                <input
                                                    type="text"
                                                    name="nationalId"
                                                    value={formData.nationalId}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">المحافظة / محل العمل</label>
                                                <select
                                                    name="governorate"
                                                    value={formData.governorate}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
                                                >
                                                    <option value="">اختر المحافظة...</option>
                                                    {egyptianGovernorates.map((gov) => (
                                                        <option key={gov} value={gov}>{gov}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">كيف توصلت إلينا؟</label>
                                            <select
                                                name="howDidYouHear"
                                                value={formData.howDidYouHear}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition text-gray-900 dark:text-white"
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
                                    </div>
                                )}

                                {/* سؤال الدافع يظهر للبائع فقط */}
                                {role === 'Seller' && (
                                    <div className="space-y-2 mt-6">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            لماذا ترغب بالانضمام إلينا؟
                                        </label>
                                        <textarea
                                            name="motivation"
                                            value={formData.motivation}
                                            onChange={handleChange}
                                            required
                                            rows="4"
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-green-500 focus:bg-white dark:focus:bg-gray-800 px-5 py-4 rounded-xl outline-none transition resize-none text-gray-900 dark:text-white"
                                            placeholder="اكتب هنا..."
                                        ></textarea>
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/10 text-red-500 px-6 py-4 rounded-xl text-sm font-bold flex items-center mt-6">
                                        <i className="fas fa-exclamation-circle ml-3"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#76E05B] text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-xl shadow-green-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-8"
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