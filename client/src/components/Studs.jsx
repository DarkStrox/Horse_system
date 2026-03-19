import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { studApi } from '../api/api';

// قائمة محافظات مصر
const egyptGovernorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية',
    'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية', 'السويس', 'كفر الشيخ',
    'الفيوم', 'بني سويف', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'المنيا', 'أسيوط',
    'سوهاج', 'قنا', 'البحر الأحمر', 'الأقصر', 'أسوان', 'الوادى الجديد'
];

const StudCard = ({ stud, index, onEdit }) => {
    // Handling both backend (ID) and mock (Slug)
    const studId = stud.Id || stud.id;
    const studName = stud.Name || stud.name;
    const slug = studId || studName?.replace(/\s+/g, '-');
    
    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200';
        if (url.startsWith('http')) return url;
        return url; // Proxied via Vite
    };

    return (
        <div className="animate-fade-in-up opacity-0 h-full" style={{ animationDelay: `${index * 0.15}s` }}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(26,71,49,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden flex flex-col relative group transform hover:-translate-y-2 h-full">

                {(localStorage.getItem('userRole') === 'Admin') && (
                    <div className="absolute top-4 left-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button onClick={(e) => { e.preventDefault(); onEdit(stud); }} className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-emerald-600 hover:bg-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all"><i className="fas fa-edit"></i></button>
                    </div>
                )}

                <div className="p-6 flex flex-col items-center flex-grow bg-white dark:bg-gray-800">
                    <div className="w-28 h-28 rounded-full p-1 border-2 border-gray-200 dark:border-gray-600 mb-4 overflow-hidden group-hover:border-emerald-500 transition-all relative bg-gray-50 dark:bg-gray-700">
                        <img src={getImageUrl(stud.img)} alt={stud.name} className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-[1000ms] ease-out" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200' }} />
                    </div>

                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{studName}</h2>

                    {(stud.Type || stud.type) && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-1 rounded-xl dark:bg-emerald-900/40 dark:text-emerald-400 mb-5 inline-block border border-emerald-100 dark:border-emerald-800 uppercase tracking-widest">{stud.Type || stud.type}</span>
                    )}

                    <div className="w-full border border-gray-100 dark:border-gray-700 rounded-2xl flex divide-x divide-x-reverse divide-gray-100 dark:divide-gray-700 mb-6 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex-1 py-3 text-center flex flex-col justify-center"><span className="text-[10px] text-emerald-700 dark:text-emerald-500 font-bold uppercase">Production</span><span className="text-sm text-gray-900 dark:text-white font-black">{(stud.Stats || stud.stats)?.offspring || 0}</span></div>
                        <div className="flex-1 py-3 text-center flex flex-col justify-center"><span className="text-[10px] text-emerald-700 dark:text-emerald-500 font-bold uppercase">Mares</span><span className="text-sm text-gray-900 dark:text-white font-black">{(stud.Stats || stud.stats)?.mares || 0}</span></div>
                        <div className="flex-1 py-3 text-center flex flex-col justify-center"><span className="text-[10px] text-emerald-700 dark:text-emerald-500 font-bold uppercase">Stallions</span><span className="text-sm text-gray-900 dark:text-white font-black">{(stud.Stats || stud.stats)?.stallions || 0}</span></div>
                    </div>

                    <div className="w-full text-center space-y-3 mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-bold"><i className="fas fa-envelope text-emerald-600 dark:text-emerald-500"></i> {stud.Email || stud.email || "N/A"}</div>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-bold"><i className="fas fa-phone text-emerald-600 dark:text-emerald-500"></i> <span dir="ltr">{stud.Phone || stud.phone || "N/A"}</span></div>
                    </div>
                </div>

                <div className="p-4 pt-0 mt-auto">
                    <Link to={`/studs/${slug}`} className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-900/20 text-xs tracking-widest group-hover:-translate-y-1 uppercase">
                        <span>عرض التفاصيل View Details</span>
                        <i className="fas fa-arrow-left text-[10px] transform group-hover:-translate-x-1 transition-transform"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Studs = () => {
    const [studsList, setStudsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudId, setEditingStudId] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [slideDirection, setSlideDirection] = useState('forward');
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        nameEn: '', nameAr: '', foundedDate: '', regNo: '', studType: '', about: '',
        country: 'مصر', city: '', streetAddress: '', lat: '', lng: '',
        email: '', phonePrimary: '',
        facebook: '', instagram: '', youtube: '', twitter: '',
        videoUrl: '', images: []
    });

    const [formErrors, setFormErrors] = useState({});

    const fetchStuds = async () => {
        try {
            setLoading(true);
            const res = await studApi.getAll();
            setStudsList(res.data);
        } catch (err) {
            console.error("Error fetching studs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStuds();
    }, []);

    const featuredStuds = studsList.filter(s => s.IsFeatured || s.isFeatured);
    const filteredStuds = studsList.filter(s => (s.Name || s.name)?.includes(searchTerm));

    const handleEditClick = (stud) => {
        setFormData({
            nameAr: stud.nameArabic || stud.name,
            nameEn: stud.nameEnglish || '',
            foundedDate: stud.establishedDate ? stud.establishedDate.split('T')[0] : '',
            regNo: stud.stats?.regNo || '',
            studType: stud.type || '',
            about: stud.description || '',
            country: 'مصر',
            city: stud.city || '',
            streetAddress: '', lat: '', lng: '',
            email: stud.email || '',
            phonePrimary: stud.phone || '',
            facebook: stud.facebookUrl || '',
            instagram: stud.instagramUrl || '',
            youtube: stud.youtubeUrl || '',
            twitter: stud.twitterUrl || '',
            videoUrl: '', 
            images: []
        });
        setEditingStudId(stud.Id || stud.id);
        setCurrentStep(1);
        setIsAddModalOpen(true);
    };

    const handleAddNewClick = () => {
        setFormData({ nameEn: '', nameAr: '', foundedDate: '', regNo: '', studType: '', about: '', country: 'مصر', city: '', streetAddress: '', lat: '', lng: '', email: '', phonePrimary: '', facebook: '', instagram: '', youtube: '', twitter: '', videoUrl: '', images: [] });
        setEditingStudId(null);
        setCurrentStep(1);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsAddModalOpen(false);
            setIsClosing(false);
            setEditingStudId(null);
        }, 500);
    };

    const handleNextStep = () => {
        let errors = {};
        if (currentStep === 1) {
            if (!formData.nameEn.trim()) errors.nameEn = true;
            if (!formData.nameAr.trim()) errors.nameAr = true;
            if (!formData.foundedDate) errors.foundedDate = true;
            if (!formData.city) errors.city = true;
            if (!formData.studType) errors.studType = true;
        } else if (currentStep === 2) {
            if (!formData.email.trim()) errors.email = true;
            if (!formData.phonePrimary.trim()) errors.phonePrimary = true;
        }
        if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

        setFormErrors({});
        setSlideDirection('forward');
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setSlideDirection('backward');
        setCurrentStep(prev => prev - 1);
    };

    const handleSave = async () => {
        if (!editingStudId && formData.images.length === 0) {
            setFormErrors({ images: true });
            alert('يرجى رفع صورة واحدة على الأقل للمربط لحفظ البيانات');
            return;
        }

        const data = new FormData();
        data.append('NameArabic', formData.nameAr);
        data.append('NameEnglish', formData.nameEn);
        data.append('Description', formData.about);
        data.append('Email', formData.email);
        data.append('FacebookUrl', formData.facebook);
        data.append('InstagramUrl', formData.instagram);
        data.append('TwitterUrl', formData.twitter);
        data.append('WebsiteUrl', formData.youtube); // Youtube mapping to WebsiteUrl for now
        data.append('City', formData.city);
        data.append('StudType', formData.studType);
        if (formData.foundedDate) data.append('EstablishedDate', formData.foundedDate);
        if (formData.images.length > 0) {
            data.append('ImageFile', formData.images[0]);
        }

        try {
            setSaving(true);
            if (editingStudId) {
                await studApi.update(editingStudId, data);
                alert('تم تعديل بيانات المربط بنجاح!');
            } else {
                await studApi.create(data);
                alert('تمت إضافة المربط بنجاح!');
            }
            fetchStuds();
            closeModal();
        } catch (err) {
            console.error("Error saving stud:", err);
            alert('حدث خطأ أثناء حفظ البيانات. يرجى التأكد من صلاحيات الحساب.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalEntry { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideInForward { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInBackward { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-modal { animation: modalEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .slide-forward { animation: slideInForward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .slide-backward { animation: slideInBackward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        .fake-map-bg { background-color: #f9fafb; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l25 25M25 25l25-25M50 0l25 25M75 25l25-25M100 50l-25 25M75 75l-25-25M50 50l-25 25M25 75L0 50' stroke='%23e5e7eb' stroke-width='1' fill='none' /%3E%3C/svg%3E"); }
        .dark .fake-map-bg { background-color: #374151; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l25 25M25 25l25-25M50 0l25 25M75 25l25-25M100 50l-25 25M75 75l-25-25M50 50l-25 25M25 75L0 50' stroke='%234b5563' stroke-width='1' fill='none' /%3E%3C/svg%3E"); }
        
        .lux-input {
            width: 100%; padding: 0.75rem 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem;
            outline: none; transition: all 0.3s; font-size: 0.875rem; color: #111827; font-weight: 500;
        }
        .dark .lux-input { background-color: #374151; border-color: #4b5563; color: #f9fafb; }
        .lux-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
        .lux-input::placeholder { color: #9ca3af; }
        .dark .lux-input::placeholder { color: #9ca3af; }
        .input-error { border-color: #ef4444 !important; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important; }
      `}</style>

            <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen font-sans text-right selection:bg-emerald-200/50 relative overflow-x-hidden transition-colors duration-300" dir="rtl">

                <Navbar />

                {/* --- المودال (نافذة إضافة / تعديل مربط) بتصميم HorseList المحدث --- */}
                {isAddModalOpen && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'animate-fade-in opacity-100'}`}>
                        <div className={`bg-white dark:bg-gray-800 w-full max-w-6xl shadow-2xl flex flex-col max-h-[95vh] rounded-[2rem] border border-white/20 dark:border-gray-700 ${isClosing ? 'scale-95 opacity-0 transition-all duration-300' : 'animate-modal'}`}>

                            {/* هيدر المودال */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-l from-emerald-900 to-emerald-800 shrink-0">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    {editingStudId ? <><i className="fas fa-edit text-emerald-200"></i> تعديل بيانات المربط</> : <><i className="fas fa-plus-circle text-emerald-200"></i> إضافة مربط جديد</>}
                                </h2>
                                <button onClick={closeModal} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            {/* شريط التقدم (الخطوات) */}
                            <div className="px-10 py-6 hidden sm:block shrink-0 bg-[#FAF9F6] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-200 dark:bg-gray-700 -z-10"></div>
                                    <div className="absolute top-4 right-[10%] h-[2px] bg-emerald-600 -z-10 transition-all duration-1000" style={{ width: `${((currentStep - 1) / 3) * 80}%` }}></div>

                                    {[
                                        { num: 1, label: 'بيانات المربط' },
                                        { num: 2, label: 'معلومات التواصل' },
                                        { num: 3, label: 'روابط السوشيال ميديا' },
                                        { num: 4, label: 'الصور والفيديو' }
                                    ].map((step) => (
                                        <div key={step.num} className="flex flex-col items-center gap-2 bg-[#FAF9F6] dark:bg-gray-900 px-2">
                                            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 relative rounded-lg border
                                        ${currentStep >= step.num ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white text-gray-400 border-gray-200 dark:bg-gray-800 dark:border-gray-600'}`}>
                                                {step.num}
                                            </div>
                                            <span className={`text-xs mt-1 transition-colors ${currentStep >= step.num ? 'text-emerald-800 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* محتوى النموذج */}
                            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#FAF9F6] dark:bg-gray-900 custom-scrollbar">
                                <div key={currentStep} className={slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'}>

                                    {/* الخطوة 1: بيانات المربط */}
                                    {currentStep === 1 && (
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="lg:w-2/3 space-y-5">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">اسم المربط (إنجليزي) *</label>
                                                        <input type="text" value={formData.nameEn} onChange={e => {
                                                            const val = e.target.value;
                                                            if (!/[\u0600-\u06FF]/.test(val)) { setFormData({ ...formData, nameEn: val }); setFormErrors({ ...formErrors, nameEn: false }); }
                                                        }} className={`lux-input text-left ${formErrors.nameEn ? 'input-error' : ''}`} dir="ltr" placeholder="Stud Name" />
                                                    </div>

                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">اسم المربط (عربي) *</label>
                                                        <input type="text" value={formData.nameAr} onChange={e => {
                                                            const val = e.target.value;
                                                            if (!/[a-zA-Z]/.test(val)) { setFormData({ ...formData, nameAr: val }); setFormErrors({ ...formErrors, nameAr: false }); }
                                                        }} className={`lux-input ${formErrors.nameAr ? 'input-error' : ''}`} dir="rtl" placeholder="اسم المربط" />
                                                    </div>

                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">تاريخ التأسيس *</label>
                                                        <input type="date" value={formData.foundedDate} onChange={e => { setFormData({ ...formData, foundedDate: e.target.value }); setFormErrors({ ...formErrors, foundedDate: false }) }} className={`lux-input ${formErrors.foundedDate ? 'input-error' : ''}`} />
                                                    </div>

                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">رقم التسجيل *</label>
                                                        <input type="text" value={formData.regNo} onChange={e => { setFormData({ ...formData, regNo: e.target.value }); setFormErrors({ ...formErrors, regNo: false }) }} className={`lux-input ${formErrors.regNo ? 'input-error' : ''}`} placeholder="رقم التسجيل" />
                                                    </div>

                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm md:col-span-2">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">نوع المربط *</label>
                                                        <select value={formData.studType} onChange={e => { setFormData({ ...formData, studType: e.target.value }); setFormErrors({ ...formErrors, studType: false }) }} className={`lux-input ${formErrors.studType ? 'input-error' : ''}`}>
                                                            <option value="" disabled hidden>اختر نوع المربط</option>
                                                            <option value="تدريب">تدريب</option>
                                                            <option value="بيع">بيع</option>
                                                            <option value="تدريب وبيع">تدريب وبيع</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">نبذة عن المربط</label>
                                                    <textarea placeholder="اكتب نبذة مختصرة عن المربط وتاريخه..." rows="3" value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} className="lux-input resize-none"></textarea>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">الدولة</label>
                                                        <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="lux-input opacity-70 cursor-not-allowed" disabled>
                                                            <option value="مصر">مصر</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">المدينة / المحافظة *</label>
                                                        <select value={formData.city} onChange={e => { setFormData({ ...formData, city: e.target.value }); setFormErrors({ ...formErrors, city: false }) }} className={`lux-input ${formErrors.city ? 'input-error' : ''}`}>
                                                            <option value="">اختر المحافظة</option>
                                                            {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">عنوان الشارع</label>
                                                    <input type="text" placeholder="العنوان التفصيلي" value={formData.streetAddress} onChange={e => setFormData({ ...formData, streetAddress: e.target.value })} className="lux-input" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">خط العرض (Latitude)</label>
                                                        <input type="text" placeholder="مثال: 30.0444" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="lux-input text-left" dir="ltr" />
                                                    </div>
                                                    <div className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                        <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">خط الطول (Longitude)</label>
                                                        <input type="text" placeholder="مثال: 31.2357" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="lux-input text-left" dir="ltr" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* الخريطة */}
                                            <div className="lg:w-1/3 flex flex-col">
                                                <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400 mb-2 block">موقع المربط على الخريطة</label>
                                                <div className="flex-1 min-h-[300px] border border-gray-200 dark:border-gray-600 rounded-2xl relative overflow-hidden fake-map-bg p-3 shadow-inner">
                                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center p-2 mb-2 w-full z-10 relative border border-gray-200 dark:border-gray-600">
                                                        <input type="text" placeholder="بحث عن موقع..." className="flex-1 outline-none text-sm bg-transparent dark:text-white px-2 font-medium" />
                                                        <svg className="w-4 h-4 text-gray-400 mx-1 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                    </div>
                                                    <button className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all z-10">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 2: معلومات التواصل */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6 max-w-2xl mx-auto py-8">
                                            <div className="space-y-5">
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">البريد الإلكتروني *</label>
                                                    <div className="relative">
                                                        <input type="email" placeholder="example@stud.com" value={formData.email} onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: false }) }} className={`lux-input pr-10 text-left ${formErrors.email ? 'input-error' : ''}`} dir="ltr" />
                                                        <i className="fas fa-envelope absolute top-4 right-4 text-gray-400"></i>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">رقم الهاتف الأساسي *</label>
                                                    <div className="relative">
                                                        <input type="tel" placeholder="+20 100 000 0000" value={formData.phonePrimary} onChange={e => {
                                                            const val = e.target.value;
                                                            if (/^[\d+]*$/.test(val)) { setFormData({ ...formData, phonePrimary: val }); setFormErrors({ ...formErrors, phonePrimary: false }); }
                                                        }} className={`lux-input pr-10 text-left ${formErrors.phonePrimary ? 'input-error' : ''}`} dir="ltr" />
                                                        <i className="fas fa-phone absolute top-4 right-4 text-gray-400"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 3: روابط السوشيال ميديا */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6 max-w-4xl mx-auto py-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">فيسبوك</label>
                                                    <div className="relative">
                                                        <input type="url" placeholder="https://facebook.com/..." value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" />
                                                        <i className="fab fa-facebook absolute top-4 right-4 text-[#1877F2]"></i>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">إنستجرام</label>
                                                    <div className="relative">
                                                        <input type="url" placeholder="https://instagram.com/..." value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" />
                                                        <i className="fab fa-instagram absolute top-4 right-4 text-[#E4405F]"></i>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">يوتيوب</label>
                                                    <div className="relative">
                                                        <input type="url" placeholder="https://youtube.com/..." value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" />
                                                        <i className="fab fa-youtube absolute top-4 right-4 text-[#FF0000]"></i>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                    <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">إكس (تويتر)</label>
                                                    <div className="relative">
                                                        <input type="url" placeholder="https://x.com/..." value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" />
                                                        <i className="fab fa-twitter absolute top-4 right-4 text-[#1DA1F2] dark:text-white"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 4: الصور والفيديو */}
                                    {currentStep === 4 && (
                                        <div className="space-y-6 max-w-5xl mx-auto py-2">
                                            <div className="space-y-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-emerald-500 transition-colors">
                                                <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400 block">
                                                    رفع صور المربط {!editingStudId && <span className="text-red-500">*</span>}
                                                </label>
                                                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${formErrors.images ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}>
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg className="w-8 h-8 mb-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-emerald-600 dark:text-emerald-400">اضغط لرفع صور</span> أو اسحب وأفلت</p>
                                                        <p className="text-xs text-gray-400">الصيغ المدعومة : صور فقط (image/*)</p>
                                                    </div>
                                                    <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => { setFormData({ ...formData, images: [...formData.images, ...Array.from(e.target.files)] }); setFormErrors({ ...formErrors, images: false }) }} />
                                                </label>

                                                {formData.images.length > 0 && (
                                                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                                        {formData.images.map((img, i) => (
                                                            <div key={i} className="w-20 h-20 rounded-xl border-2 border-emerald-500 overflow-hidden flex-shrink-0 shadow-md">
                                                                <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                <label className="text-sm font-bold text-emerald-900 dark:text-emerald-400">رابط فيديو المربط الترويجي (يوتيوب)</label>
                                                <div className="relative">
                                                    <input type="url" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" />
                                                    <i className="fab fa-youtube absolute top-4 right-4 text-gray-400"></i>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* أزرار التحكم (السابق، التالي، حفظ) */}
                            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-4 rounded-b-[2rem]">
                                <button
                                    onClick={handlePrevStep}
                                    className={`px-8 py-3.5 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${currentStep === 1 ? 'hidden' : 'block'}`}
                                >
                                    السابق
                                </button>

                                {currentStep < 4 ? (
                                    <button onClick={handleNextStep} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                        التالي
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                        {editingStudId ? <i className="fas fa-save"></i> : null}
                                        {editingStudId ? 'حفظ التعديلات' : 'حفظ البيانات'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- المحتوى الأساسي للصفحة من الخارج --- */}
                <div className="pb-20 pt-10 text-right">

                    <div className="container mx-auto px-4 lg:px-16 mb-16 animate-fade-in-up opacity-0">
                        <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-emerald-50 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-b from-emerald-900 to-emerald-800 text-white md:w-20 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                                <span className="md:-rotate-90 whitespace-nowrap font-black tracking-widest text-xl relative z-10">المرابط المميزة</span>
                            </div>
                            <div className="flex-1 p-8 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] dark:bg-none">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featuredStuds.map((stud, idx) => <StudCard key={`featured-${idx}`} stud={stud} index={idx} onEdit={handleEditClick} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="container mx-auto px-4 lg:px-16 text-right animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>

                        {/* --- زر الإضافة ورأس الصفحة --- */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">دليل المرابط</h1>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">استكشف وتواصل مع أهم مرابط الخيل العربية الأصيلة</p>
                            </div>

                        {localStorage.getItem('userRole') === 'Admin' && (
                            <button
                                onClick={handleAddNewClick}
                                className="w-full sm:w-auto bg-gray-800 dark:bg-emerald-800 hover:bg-gray-900 dark:hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-lg shadow-gray-800/30 dark:shadow-emerald-900/30 hover:shadow-xl transform hover:-translate-y-1 transition-all"
                            >
                                <i className="fas fa-plus"></i> إضافة مربط جديد
                            </button>
                        )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white dark:bg-gray-800 p-3 rounded-[2rem] shadow-lg shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-emerald-800 dark:text-emerald-400 transition-colors"><i className="fas fa-search text-lg"></i></div>
                                <input type="text" placeholder="ابحث باسم المربط..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-6 pr-14 py-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-emerald-600/10 border border-transparent focus:border-emerald-200 dark:focus:border-emerald-600 text-gray-800 dark:text-white font-bold transition-all dark:placeholder-gray-400" />
                            </div>
                            <select className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold md:w-48 cursor-pointer">
                                <option value="">كل المحافظات</option>
                                {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredStuds.length > 0 ? (
                                filteredStuds.map((stud, index) => <StudCard key={stud.Id || stud.id} stud={stud} index={index + 2} onEdit={handleEditClick} />)
                            ) : (
                                <div className="col-span-full text-center py-24 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-gray-700 text-emerald-800 dark:text-emerald-400 mb-5">
                                        <i className="fas fa-search text-3xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">لا توجد نتائج مطابقة</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">حاول البحث باسم مختلف.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Studs;