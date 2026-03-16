import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// قائمة محافظات مصر
const egyptGovernorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية',
    'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية', 'السويس', 'كفر الشيخ',
    'الفيوم', 'بني سويف', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'المنيا', 'أسيوط',
    'سوهاج', 'قنا', 'البحر الأحمر', 'الأقصر', 'أسوان', 'الوادى الجديد'
];

// الداتا المبدئية للتجربة (تم إضافة نوع المربط)
const initialStudsData = [
    { id: 'S1', name: 'إسطبلات الدوحة الملكية', type: 'تدريب وبيع', img: '/horses/profile_main.png', isFeatured: true, stats: { offspring: 142, mares: 135, stallions: 19, regNo: '14' }, email: 'doha.stud@gmail.com', phone: '+974 1234 5678', city: 'القاهرة' },
    { id: 'S2', name: 'مربط العرب', type: 'تدريب', img: '/auctions/card_1.png', isFeatured: true, stats: { offspring: 59, mares: 17, stallions: 10, regNo: '68' }, email: 'arab.stud@hotmail.com', phone: '+966 50 123 4567', city: 'الجيزة' },
    { id: 'S3', name: 'إسطبلات نجد', type: 'بيع', img: '/auctions/card_2.png', isFeatured: false, stats: { offspring: 2192, mares: 42, stallions: 22, regNo: 'غير معروف' }, email: 'info@najd.com', phone: '+201011122233', city: 'الإسكندرية' },
    { id: 'S4', name: 'مربط الريان', type: 'تدريب وبيع', img: '/auctions/hero.png', isFeatured: false, stats: { offspring: 120, mares: 50, stallions: 15, regNo: '99' }, email: 'alrayyan@stud.qa', phone: '+974 9876 5432', city: 'القاهرة' },
];

// كارت المربط
const StudCard = ({ stud, index, onDelete, onEdit, canManage }) => {
    const slug = stud.name.replace(/\s+/g, '-');
    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 ease-out overflow-hidden flex flex-col relative group animate-fade-heavy"
            style={{ animationDelay: `${index * 200}ms` }}
        >
            {/* أزرار التحكم (حذف وتعديل) تظهر عند الهوفر */}
            {canManage && (
                <div className="absolute top-4 left-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={(e) => { e.preventDefault(); onEdit(stud); }}
                        title="تعديل المربط"
                        className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                        <i className="fas fa-edit"></i>
                    </button>

                    <button
                        onClick={(e) => { e.preventDefault(); onDelete(stud.id); }}
                        title="حذف المربط"
                        className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
            )}

            <div className="p-6 flex flex-col items-center flex-grow">
                <div className="w-28 h-28 rounded-full p-1.5 border-2 border-emerald-50 dark:border-gray-700 mb-4 overflow-hidden group-hover:border-emerald-400 group-hover:shadow-lg transition-all duration-700 relative">
                    <img src={stud.img} alt={stud.name} className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-[1000ms] ease-out" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200' }} />
                </div>

                <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-500">{stud.name}</h2>

                {/* عرض نوع المربط */}
                {stud.type && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full dark:bg-emerald-900/50 dark:text-emerald-300 mb-5 inline-block border border-emerald-200 dark:border-emerald-800">
                        {stud.type}
                    </span>
                )}

                <div className="w-full border border-emerald-100 dark:border-emerald-900/30 rounded-full flex divide-x divide-x-reverse divide-emerald-100 dark:divide-emerald-900/30 mb-6 bg-emerald-50/30 dark:bg-emerald-900/10 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors duration-700">
                    <div className="flex-1 py-3 text-center flex flex-col justify-center transform group-hover:scale-105 transition-transform duration-500"><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-tight">الإنتاج</span><span className="text-sm text-emerald-800 dark:text-emerald-200 font-black">{stud.stats.offspring}</span></div>
                    <div className="flex-1 py-3 text-center flex flex-col justify-center transform group-hover:scale-105 transition-transform duration-500 delay-75"><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-tight">الأفراس</span><span className="text-sm text-emerald-800 dark:text-emerald-200 font-black">{stud.stats.mares}</span></div>
                    <div className="flex-1 py-3 text-center flex flex-col justify-center transform group-hover:scale-105 transition-transform duration-500 delay-150"><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold leading-tight">الفحول</span><span className="text-sm text-emerald-800 dark:text-emerald-200 font-black">{stud.stats.stallions}</span></div>
                </div>
                <div className="w-full text-center space-y-3 mt-auto relative z-10">
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 group-hover:border-emerald-200 transition-colors duration-500"><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">البريد: {stud.email}</p></div>
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 pb-2 group-hover:border-emerald-200 transition-colors duration-500"><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">الهاتف: <span dir="ltr" className="inline-block">{stud.phone}</span></p></div>
                </div>
            </div>
            <Link to={`/studs/${slug}`} className="w-full bg-gray-50 dark:bg-gray-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:text-white text-center font-bold py-4 transition-all duration-500 text-sm tracking-wide group-hover:shadow-inner relative z-10">عرض التفاصيل</Link>
        </div>
    );
};

const Studs = () => {
    const [user, setUser] = useState(null);
    const [studsList, setStudsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setUser(res.data))
                .catch(err => console.error("Error fetching user profile:", err));
        }

        fetchStuds();
    }, []);

    const fetchStuds = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/stud');
            setStudsList(response.data);
        } catch (error) {
            console.error("Error fetching studs:", error);
        } finally {
            setLoading(false);
        }
    };

    const canManageStuds = user && (user.role === 'Admin' || user.role === 'Seller');

    // --- حالات المودال والتعديل ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudId, setEditingStudId] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [isClosing, setIsClosing] = useState(false);
    const [slideDirection, setSlideDirection] = useState('forward');

    // إضافة حقل studType
    const [formData, setFormData] = useState({
        nameEn: '', nameAr: '', foundedDate: '', regNo: '', studType: '', about: '',
        country: 'مصر', city: '', streetAddress: '', lat: '', lng: '',
        email: '', phonePrimary: '',
        facebook: '', instagram: '', youtube: '', twitter: '',
        videoUrl: '', images: []
    });

    const [formErrors, setFormErrors] = useState({});

    const featuredStuds = studsList.filter(s => s.isFeatured);
    const filteredStuds = studsList.filter(s => s.name.includes(searchTerm));

    // --- دالة حذف المربط ---
    const handleDeleteStud = async (id) => {
        if (window.confirm(`هل أنت متأكد من رغبتك في حذف هذا المربط؟`)) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://localhost:5000/api/stud/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudsList(studsList.filter(stud => stud.id !== id));
                alert('تم حذف المربط بنجاح');
            } catch (error) {
                console.error("Error deleting stud:", error);
                alert('حدث خطأ أثناء الحذف');
            }
        }
    };

    // --- دالة فتح مودال التعديل وتعبئة البيانات ---
    const handleEditClick = (stud) => {
        setFormData({
            nameAr: stud.name,
            nameEn: '',
            foundedDate: '2020-01-01',
            regNo: stud.stats.regNo,
            studType: stud.type || '', // تعبئة نوع المربط
            about: '',
            country: 'مصر',
            city: stud.city || 'القاهرة',
            streetAddress: '', lat: '', lng: '',
            email: stud.email,
            phonePrimary: stud.phone,
            facebook: '', instagram: '', youtube: '', twitter: '', videoUrl: '',
            images: []
        });
        setEditingStudId(stud.id);
        setCurrentStep(1);
        setIsAddModalOpen(true);
    };

    // --- دالة فتح مودال الإضافة (تفريغ البيانات) ---
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
            if (!formData.nameEn.trim() && !editingStudId) errors.nameEn = true;
            if (!formData.nameAr.trim()) errors.nameAr = true;
            if (!formData.foundedDate) errors.foundedDate = true;
            if (!formData.city) errors.city = true;
            if (!formData.regNo.trim()) errors.regNo = true;
            if (!formData.studType) errors.studType = true; // نوع المربط إجباري هنا
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

        const token = localStorage.getItem('token');
        const data = new FormData();
        data.append('NameArabic', formData.nameAr);
        data.append('NameEnglish', formData.nameEn);
        data.append('EstablishedDate', formData.foundedDate);
        data.append('Description', formData.about);
        data.append('Email', formData.email);
        data.append('FacebookUrl', formData.facebook);
        data.append('InstagramUrl', formData.instagram);
        data.append('TwitterUrl', formData.twitter);
        data.append('WebsiteUrl', formData.youtube); // Using youtube field for website or just as a placeholder
        data.append('StudType', formData.studType);
        data.append('City', formData.city);
        
        // Use placeholder only if city is not provided
        if (!formData.city) data.append('LocationId', '1'); 

        if (formData.images.length > 0) {
            data.append('ImageFile', formData.images[0]);
        }

        try {
            if (editingStudId) {
                await axios.put(`http://localhost:5000/api/stud/${editingStudId}`, data, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}` 
                    }
                });
                alert('تم تعديل بيانات المربط بنجاح!');
            } else {
                await axios.post('http://localhost:5000/api/stud', data, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}` 
                    }
                });
                alert('تمت إضافة المربط بنجاح!');
            }
            fetchStuds(); // Refresh the list from the server
            closeModal();
        } catch (error) {
            console.error("Error saving stud:", error);
            alert('حدث خطأ أثناء حفظ البيانات');
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeUpHeavy { from { opacity: 0; transform: translateY(60px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes modalBounce { 0% { opacity: 0; transform: scale(0.85) translateY(30px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideInForward { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInBackward { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-heavy { animation: fadeUpHeavy 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .animate-modal { animation: modalBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-forward { animation: slideInForward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .slide-backward { animation: slideInBackward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .fake-map-bg { background-color: #f0f4f8; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l25 25M25 25l25-25M50 0l25 25M75 25l25-25M100 50l-25 25M75 75l-25-25M50 50l-25 25M25 75L0 50' stroke='%23d1d5db' stroke-width='1' fill='none' /%3E%3C/svg%3E"); }
        
        .input-field { width: 100%; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; outline: none; transition: border-color 0.3s; font-size: 0.875rem; }
        .dark .input-field { background-color: #374151; border-color: #4b5563; color: white; }
        .input-field:focus { border-color: #059669; } 
        .input-error { border-color: #ef4444 !important; }
      `}</style>

            <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right font-sans transition-colors duration-500 relative overflow-x-hidden" dir="rtl">

                <Navbar />

                {/* --- المودال (نافذة إضافة / تعديل مربط) --- */}
                {isAddModalOpen && (
                    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
                        <div className={`bg-white dark:bg-gray-800 w-full max-w-6xl shadow-2xl flex flex-col max-h-[95vh] rounded-lg border border-gray-100 dark:border-gray-700 ${isClosing ? 'scale-95 opacity-0 transition-all duration-300' : 'animate-modal'}`}>

                            {/* هيدر المودال */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    {editingStudId ? <><i className="fas fa-edit text-blue-600"></i> تعديل بيانات المربط</> : <><i className="fas fa-plus-circle text-emerald-600"></i> إضافة مربط جديد</>}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            {/* شريط التقدم (الخطوات) */}
                            <div className="px-10 py-6 border-b border-gray-100 dark:border-gray-700 hidden sm:block">
                                <div className="flex items-center justify-between relative">
                                    <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-200 dark:bg-gray-700 -z-10"></div>
                                    <div className="absolute top-4 right-[10%] h-[2px] bg-emerald-600 dark:bg-emerald-500 -z-10 transition-all duration-1000" style={{ width: `${((currentStep - 1) / 3) * 80}%` }}></div>

                                    {[
                                        { num: 1, label: 'بيانات المربط' },
                                        { num: 2, label: 'معلومات التواصل' },
                                        { num: 3, label: 'روابط السوشيال ميديا' },
                                        { num: 4, label: 'الصور والفيديو' }
                                    ].map((step) => (
                                        <div key={step.num} className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 px-2">
                                            <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 relative 
                                        ${currentStep >= step.num ? 'bg-emerald-600 text-white rounded' : 'bg-gray-50 text-gray-400 border border-gray-200 dark:bg-gray-700 dark:border-gray-600 rounded'}`}>
                                                {step.num}
                                            </div>
                                            <span className={`text-xs mt-1 transition-colors ${currentStep >= step.num ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* محتوى النموذج */}
                            <div className="p-8 overflow-y-auto flex-1 bg-white dark:bg-gray-800 overflow-x-hidden">
                                <div key={currentStep} className={slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'}>

                                    {/* الخطوة 1: بيانات المربط */}
                                    {currentStep === 1 && (
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            <div className="lg:w-2/3 space-y-6 text-right">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">

                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="اسم المربط (إنجليزي) *"
                                                            value={formData.nameEn}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                if (!/[\u0600-\u06FF]/.test(val)) {
                                                                    setFormData({ ...formData, nameEn: val });
                                                                    setFormErrors({ ...formErrors, nameEn: false });
                                                                }
                                                            }}
                                                            className={`input-field text-left ${formErrors.nameEn ? 'input-error' : ''}`}
                                                            dir="ltr"
                                                        />
                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="اسم المربط (عربي) *"
                                                            value={formData.nameAr}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                if (!/[a-zA-Z]/.test(val)) {
                                                                    setFormData({ ...formData, nameAr: val });
                                                                    setFormErrors({ ...formErrors, nameAr: false });
                                                                }
                                                            }}
                                                            className={`input-field ${formErrors.nameAr ? 'input-error' : ''}`}
                                                            dir="rtl"
                                                        />
                                                    </div>

                                                    <div className="relative">
                                                        <span className="absolute -top-2 right-3 bg-white dark:bg-gray-800 px-1 text-[10px] text-gray-400">تاريخ التأسيس *</span>
                                                        <input type="date" value={formData.foundedDate} onChange={e => { setFormData({ ...formData, foundedDate: e.target.value }); setFormErrors({ ...formErrors, foundedDate: false }) }} className={`input-field ${formErrors.foundedDate ? 'input-error' : ''}`} />
                                                    </div>

                                                    {/* حقل رقم التسجيل */}
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="رقم التسجيل *"
                                                            value={formData.regNo}
                                                            onChange={e => {
                                                                setFormData({ ...formData, regNo: e.target.value });
                                                                setFormErrors({ ...formErrors, regNo: false });
                                                            }}
                                                            className={`input-field ${formErrors.regNo ? 'input-error' : ''}`}
                                                        />
                                                    </div>

                                                    {/* حقل نوع المربط (الجديد) */}
                                                    <div>
                                                        <select
                                                            value={formData.studType}
                                                            onChange={e => {
                                                                setFormData({ ...formData, studType: e.target.value });
                                                                setFormErrors({ ...formErrors, studType: false });
                                                            }}
                                                            className={`input-field bg-transparent ${formErrors.studType ? 'input-error' : ''} ${!formData.studType ? 'text-gray-400' : 'text-gray-800 dark:text-white'}`}
                                                        >
                                                            <option value="" disabled hidden>نوع المربط *</option>
                                                            <option value="تدريب" className="text-gray-800 dark:text-white">تدريب</option>
                                                            <option value="بيع" className="text-gray-800 dark:text-white">بيع</option>
                                                            <option value="تدريب وبيع" className="text-gray-800 dark:text-white">تدريب وبيع</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <textarea placeholder="نبذة عن المربط" rows="3" value={formData.about} onChange={e => setFormData({ ...formData, about: e.target.value })} className="input-field resize-none"></textarea>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-500">الدولة</label>
                                                        <select value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className="input-field bg-gray-50 dark:bg-gray-700">
                                                            <option value="مصر">مصر</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-500">المدينة / المحافظة *</label>
                                                        <select value={formData.city} onChange={e => { setFormData({ ...formData, city: e.target.value }); setFormErrors({ ...formErrors, city: false }) }} className={`input-field ${formErrors.city ? 'input-error' : ''}`}>
                                                            <option value="">اختر المحافظة</option>
                                                            {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">عنوان الشارع</label>
                                                    <input type="text" placeholder="العنوان التفصيلي" value={formData.streetAddress} onChange={e => setFormData({ ...formData, streetAddress: e.target.value })} className="input-field" />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-500">خط العرض (Latitude)</label>
                                                        <input type="text" placeholder="مثال: 30.0444" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="input-field" dir="ltr" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs text-gray-500">خط الطول (Longitude)</label>
                                                        <input type="text" placeholder="مثال: 31.2357" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="input-field" dir="ltr" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* الخريطة */}
                                            <div className="lg:w-1/3 flex flex-col text-right">
                                                <label className="text-sm text-gray-800 dark:text-gray-200 mb-2 block font-semibold">موقع المربط على الخريطة</label>
                                                <div className="flex-1 min-h-[300px] border border-gray-200 dark:border-gray-700 rounded-lg relative overflow-hidden fake-map-bg p-3">
                                                    <div className="bg-white dark:bg-gray-800 rounded shadow flex items-center p-2 mb-2 w-full z-10 relative border border-gray-100 dark:border-gray-600">
                                                        <input type="text" placeholder="بحث عن موقع..." className="flex-1 outline-none text-sm bg-transparent dark:text-white px-2" />
                                                        <svg className="w-4 h-4 text-gray-400 mx-1 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                                    </div>
                                                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all z-10">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 2: معلومات التواصل */}
                                    {currentStep === 2 && (
                                        <div className="space-y-6 max-w-2xl mx-auto py-8">
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">بيانات الاتصال الأساسية</h3>
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <input type="email" placeholder="البريد الإلكتروني *" value={formData.email} onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: false }) }} className={`input-field pr-10 ${formErrors.email ? 'input-error' : ''}`} dir="ltr" />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        placeholder="رقم الهاتف الأساسي *"
                                                        value={formData.phonePrimary}
                                                        onChange={e => {
                                                            const val = e.target.value;
                                                            if (/^[\d+]*$/.test(val)) {
                                                                setFormData({ ...formData, phonePrimary: val });
                                                                setFormErrors({ ...formErrors, phonePrimary: false });
                                                            }
                                                        }}
                                                        className={`input-field pr-10 ${formErrors.phonePrimary ? 'input-error' : ''}`}
                                                        dir="ltr"
                                                    />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 3: روابط السوشيال ميديا */}
                                    {currentStep === 3 && (
                                        <div className="space-y-6 max-w-4xl mx-auto py-6">
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-2">روابط التواصل الاجتماعي</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="relative">
                                                    <input type="url" placeholder="رابط حساب فيسبوك" value={formData.facebook} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="input-field pr-10" dir="ltr" />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                </div>
                                                <div className="relative">
                                                    <input type="url" placeholder="رابط حساب إنستجرام" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="input-field pr-10" dir="ltr" />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                                </div>
                                                <div className="relative">
                                                    <input type="url" placeholder="رابط قناة يوتيوب" value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} className="input-field pr-10" dir="ltr" />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                                </div>
                                                <div className="relative">
                                                    <input type="url" placeholder="رابط حساب تويتر (X)" value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} className="input-field pr-10" dir="ltr" />
                                                    <svg className="w-5 h-5 absolute top-3 right-3 text-gray-800 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* الخطوة 4: الصور والفيديو */}
                                    {currentStep === 4 && (
                                        <div className="space-y-6 max-w-5xl mx-auto py-2">
                                            <div className="flex items-center gap-2 mb-4">
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100">رفع الصور ومقاطع الفيديو</h3>
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                                                    رفع صور المربط {!editingStudId && <span className="text-red-500">*</span>}
                                                </label>
                                                <label className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all py-12 ${formErrors.images ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-gray-700'}`}>
                                                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                                                        اسحب وأفلت الصور هنا أو <span className="text-emerald-600 font-bold hover:underline">اختر ملفاً لرفعه</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400">الصيغ المدعومة : صور فقط (image/*)</p>
                                                    <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => { setFormData({ ...formData, images: [...formData.images, ...Array.from(e.target.files)] }); setFormErrors({ ...formErrors, images: false }) }} />
                                                </label>

                                                {formData.images.length > 0 && (
                                                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                                        {formData.images.map((img, i) => (
                                                            <div key={i} className="w-16 h-16 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                                                <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative pt-4">
                                                <input type="url" placeholder="رابط فيديو المربط الترويجي (يوتيوب)" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className="input-field pr-10 bg-gray-50 dark:bg-gray-700" dir="ltr" />
                                                <svg className="w-5 h-5 absolute top-7 right-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* أزرار التحكم (السابق، التالي، حفظ) */}
                            <div className="p-5 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 rounded-b-lg">
                                <button
                                    onClick={handlePrevStep}
                                    className={`px-8 py-2.5 rounded text-sm font-bold border border-gray-300 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${currentStep === 1 ? 'hidden' : 'block'}`}
                                >
                                    السابق
                                </button>

                                {currentStep < 4 ? (
                                    <button onClick={handleNextStep} className="px-10 py-2.5 rounded text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md">
                                        التالي
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="px-10 py-2.5 rounded text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2">
                                        {editingStudId ? <i className="fas fa-save"></i> : null}
                                        {editingStudId ? 'حفظ التعديلات' : 'حفظ البيانات'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- المحتوى الأساسي للصفحة من الخارج --- */}
                <div className="pb-24 pt-10 text-right">

                    {/* قسم المرابط المميزة */}
                    <div className="container mx-auto px-4 lg:px-16 mb-16 animate-fade-heavy">
                        <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-emerald-900 text-white md:w-16 flex items-center justify-center p-4 md:p-0">
                                <span className="md:-rotate-90 font-bold tracking-widest text-lg whitespace-nowrap">المرابط المميزة</span>
                            </div>
                            <div className="flex-1 p-6 bg-white dark:bg-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {featuredStuds.map((stud, idx) => <StudCard key={`featured-${idx}`} stud={stud} index={idx} onDelete={handleDeleteStud} onEdit={handleEditClick} canManage={canManageStuds} />)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700 mb-12 max-w-7xl mx-auto" />

                    {/* قسم دليل المرابط والبحث */}
                    <section className="container mx-auto px-4 lg:px-16 text-right">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 animate-fade-heavy">
                            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">دليل المرابط</h1>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <input type="text" placeholder="بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2.5 pr-10 border border-gray-200 dark:border-gray-700 rounded outline-none text-sm dark:bg-gray-800 dark:text-white" />
                                    <svg className="w-4 h-4 absolute top-3.5 right-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                {/* فلتر المحافظات */}
                                <select className="p-2.5 border border-gray-200 dark:border-gray-700 rounded outline-none text-sm bg-white dark:bg-gray-800 dark:text-white w-36">
                                    <option value="">اختر المحافظة</option>
                                    {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                                </select>
                                {canManageStuds && (
                                    <button onClick={handleAddNewClick} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded font-medium shadow active:scale-95 transition-all text-sm whitespace-nowrap">
                                        + إضافة مربط جديد
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                <div className="col-span-full py-20 text-center font-bold text-gray-400">جاري تحميل المرابط...</div>
                            ) : (
                                filteredStuds.map((stud, index) => <StudCard key={stud.id} stud={stud} index={index + 2} onDelete={handleDeleteStud} onEdit={handleEditClick} canManage={canManageStuds} />)
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