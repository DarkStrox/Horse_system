import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const HorseProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [horse, setHorse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('السجلات الصحية');

    // --- حالة ظهور النوافذ المنبثقة ---
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- حالة بيانات التعديل ---
    const [editData, setEditData] = useState({});

    // --- حالة إضافة سجل عرض (بطولة) جديد ---
    const [isAddingShow, setIsAddingShow] = useState(false);
    const [newShow, setNewShow] = useState({ title: '', date: '', location: '', result: '' });

    // --- قاعدة البيانات المؤقتة (كل حصان له تفاصيله الخاصة الآن) ---
    const mockHorsesDB = [
        {
            id: 'H001', name: 'أسطورة الشحانية', type: 'فحل', breed: 'صقلاوي', color: 'أشقر', birth: 'مارس 2018', img: '/horses/profile_main.png', owner: 'إسطبلات الدوحة', branch: 'الفرع الرئيسي', breeder: 'الشحانية', sire: 'مروان', dam: 'عليا', isActive: true, isForSale: true, price: 850000, claimLocation: 'الدوحة، قطر', ownerEmail: 'info@alshahaniya.qa', ownerPhone: '+974 3344 5566',
            healthStatus: 'ممتازة', weight: '520 كجم', vaccinations: 'مكتملة', nextCheck: 'أكتوبر 2024', pedigreeImg: 'https://images.unsplash.com/photo-1598974357801-cb8107292211?auto=format&fit=crop&q=80&w=800',
            showHistory: [
                { id: 1, title: 'بطولة كتارا الدولية', date: 'فبراير 2024', location: 'الدوحة', result: 'المركز الأول (ذهبية)' }
            ]
        },
        {
            id: 'H002', name: 'وردة الصحراء', type: 'فرس', breed: 'صقلاوي جدراني', color: 'رمادي', birth: 'مايو 2019', img: '/auctions/card_1.png', owner: 'مربط العرب', branch: 'فرع القاهرة', breeder: 'مربط العرب', sire: 'العديات', dam: 'نجمة', isActive: true, isForSale: true, price: 350000, claimLocation: 'القاهرة، مصر', ownerEmail: 'contact@arabstud.eg', ownerPhone: '010 1111 2222',
            healthStatus: 'جيدة جداً', weight: '430 كجم', vaccinations: 'تحتاج لجرعة تنشيطية', nextCheck: 'ديسمبر 2024', pedigreeImg: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80',
            showHistory: [
                { id: 2, title: 'مهرجان القاهرة الدولي', date: 'مارس 2023', location: 'القاهرة', result: 'المركز الثالث (برونزية)' }
            ]
        },
        {
            id: 'H003', name: 'فجر العرب', type: 'فحل', breed: 'كحيلان', color: 'بني', birth: 'يناير 2020', img: '/auctions/card_2.png', owner: 'إسطبلات نجد', branch: 'فرع الجيزة', breeder: 'نجد', sire: 'جسار', dam: 'أصيلة', isActive: true, isForSale: true, price: 420000, claimLocation: 'الجيزة، مصر', ownerEmail: 'sales@najdstables.com', ownerPhone: '011 2233 4455',
            healthStatus: 'ممتازة', weight: '480 كجم', vaccinations: 'مكتملة', nextCheck: 'نوفمبر 2024', pedigreeImg: 'https://images.unsplash.com/photo-1519664824819-01f653457199?auto=format&fit=crop&q=80',
            showHistory: [
                { id: 3, title: 'بطولة الجيزة المحلية', date: 'مايو 2023', location: 'الجيزة', result: 'المركز الأول' }
            ]
        },
        {
            id: 'H004', name: 'أميرة الوادي', type: 'مهرة', breed: 'عبية الشراك', color: 'أبيض', birth: 'فبراير 2022', img: '/auctions/hero.png', owner: 'مربط الريان', branch: 'فرع الإسكندرية', breeder: 'الريان', sire: 'فهد', dam: 'غزالة', isActive: false, isForSale: true, price: 200000, claimLocation: 'الإسكندرية، مصر', ownerEmail: 'info@alrayyan.eg', ownerPhone: '012 3456 7890',
            healthStatus: 'تحت الملاحظة (نمو)', weight: '310 كجم', vaccinations: 'مكتملة', nextCheck: 'سبتمبر 2024', pedigreeImg: 'https://images.unsplash.com/photo-1598974357801-cb8107292211?auto=format&fit=crop&q=80',
            showHistory: []
        },
        {
            id: 'H005', name: 'أدهم البادية', type: 'فحل', breed: 'صقلاوي', color: 'أدهم (أسود)', birth: 'مارس 2018', img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500', owner: 'مربط البادية', branch: 'فرع الجيزة', breeder: 'البادية', sire: 'مروان', dam: 'عليا', isActive: true, isForSale: true, price: 550000, claimLocation: 'الجيزة، مصر', ownerEmail: 'contact@albadiastud.eg', ownerPhone: '010 9988 7766',
            healthStatus: 'ممتازة', weight: '495 كجم', vaccinations: 'مكتملة', nextCheck: 'يناير 2025', pedigreeImg: null,
            showHistory: [
                { id: 4, title: 'بطولة الخالدية', date: 'يناير 2024', location: 'الرياض', result: 'المركز الثاني (فضية)' }
            ]
        },
        {
            id: 'H006', name: 'وردة رباب', type: 'فرس', breed: 'صقلاوي جدراني', color: 'أشعل (رمادي)', birth: 'مايو 2019', img: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=200', owner: 'مزرعة رباب', branch: 'فرع سقارة', breeder: 'رباب', sire: 'العديات', dam: 'نجمة', isActive: true, isForSale: true, price: 450000, claimLocation: 'سقارة، مصر', ownerEmail: 'info@rababstud.com', ownerPhone: '015 5555 6666',
            healthStatus: 'جيدة', weight: '440 كجم', vaccinations: 'مكتملة', nextCheck: 'مارس 2025', pedigreeImg: 'https://images.unsplash.com/photo-1519664824819-01f653457199?auto=format&fit=crop&q=80',
            showHistory: []
        },
        {
            id: 'H007', name: 'فخر صقر', type: 'فحل', breed: 'كحيلان', color: 'كميت (بني)', birth: 'يناير 2020', img: 'https://images.unsplash.com/photo-1519664824819-01f653457199?auto=format&fit=crop&q=80&w=500', owner: 'مربط صقر', branch: 'الفرع الرئيسي - المنصورية', breeder: 'صقر', sire: 'جسار', dam: 'أصيلة', isActive: true, isForSale: true, price: 600000, claimLocation: 'المنصورية، مصر', ownerEmail: 'info@saqrfarm.eg', ownerPhone: '010 0000 1111',
            healthStatus: 'ممتازة', weight: '510 كجم', vaccinations: 'مكتملة', nextCheck: 'فبراير 2025', pedigreeImg: null,
            showHistory: [
                { id: 5, title: 'مهرجان الشارقة', date: 'ديسمبر 2023', location: 'الشارقة', result: 'المركز الأول' }
            ]
        },
        {
            id: 'H008', name: 'نجم الدوحة', type: 'مهر', breed: 'كحيلان', color: 'أشقر', birth: '2021', img: '/horses/profile_main.png', owner: 'إسطبلات الدوحة الملكية', branch: 'فرع الريان', breeder: 'الدوحة', sire: 'غزال', dam: 'سندس', isActive: true, isForSale: false, price: null, claimLocation: 'الدوحة، قطر', ownerEmail: 'info@doharoyal.qa', ownerPhone: '+974 4455 6677',
            healthStatus: 'ممتازة', weight: '380 كجم', vaccinations: 'مكتملة', nextCheck: 'يوليو 2024', pedigreeImg: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80',
            showHistory: []
        },
        {
            id: 'H009', name: 'أصيلة العرب', type: 'فرس', breed: 'عبية', color: 'بني', birth: '2017', img: '/auctions/card_1.png', owner: 'مربط العرب', branch: 'فرع الشرقية', breeder: 'مربط العرب', sire: 'براق', dam: 'كحيلة', isActive: true, isForSale: false, price: null, claimLocation: 'الشرقية، مصر', ownerEmail: 'info@arabstud.eg', ownerPhone: '010 2222 3333',
            healthStatus: 'جيدة جداً', weight: '460 كجم', vaccinations: 'تأخرت جرعة واحدة', nextCheck: 'مايو 2024', pedigreeImg: null,
            showHistory: [
                { id: 6, title: 'بطولة الشرقية للخيول', date: 'أغسطس 2022', location: 'الشرقية', result: 'المركز الثاني' }
            ]
        }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                if (token) {
                    const profileRes = await axios.get(`${API_BASE_URL}/api/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(profileRes.data);
                }

                const horseRes = await axios.get(`${API_BASE_URL}/api/horse/${id}`);
                const data = horseRes.data;

                // Map backend data to frontend model
                setHorse({
                    id: data.microchipId,
                    name: data.name,
                    type: data.gender === 'Male' ? 'فحل' : 'فرس',
                    breed: data.breed,
                    color: '', 
                    birth: data.age > 0 ? `${data.age} سنوات` : 'غير محدد',
                    img: data.imageUrl ? `${API_BASE_URL}${data.imageUrl}` : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a',
                    owner: data.owner?.user?.fullName || 'غير معروف',
                    branch: data.stud?.nameArabic || 'الفرع الرئيسي',
                    ownerEmail: data.owner?.user?.email || 'غير متاح',
                    ownerPhone: data.owner?.user?.phoneNumber || 'غير متاح',
                    healthStatus: data.healthStatus || 'جيدة',
                    weight: 'غير محدد',
                    vaccinations: data.vaccinated ? 'مكتملة' : 'تحتاج للمتابعة',
                    nextCheck: 'قريباً',
                    pedigreeImg: data.pedigreeImageUrl ? `${API_BASE_URL}${data.pedigreeImageUrl}` : null,
                    showHistory: [], // Not currently supported by backend
                    title: `خيل ${data.gender === 'Male' ? 'فحل' : 'فرس'} - ${data.breed}`,
                    regNo: data.microchipId,
                    thumbnails: data.imageUrl ? [`${API_BASE_URL}${data.imageUrl}`] : [],
                    healthRecordFile: data.healthReportUrl ? { name: 'تقرير طبي.pdf', url: `${API_BASE_URL}${data.healthReportUrl}` } : null,
                    sire: data.pedigree?.fatherHorseName || 'غير معروف',
                    dam: data.pedigree?.motherHorseName || 'غير معروف',
                    price: data.price,
                    claimLocation: data.claimLocation,
                    isForSale: data.isForSale
                });
            } catch (err) {
                console.error("Error fetching horse data:", err);
                setHorse(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الخيل؟ لا يمكن التراجع عن هذا الإجراء.")) return;
        alert("تم حذف الخيل بنجاح.");
        navigate('/horses');
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setHorse({ ...horse, ...editData, title: `خيل فحل/فرس - ${editData.breed}` });
        setIsEditModalOpen(false);
        alert("تم تحديث بيانات الحصان بنجاح!");
    };

    const openEditModal = () => {
        setEditData(horse);
        setIsEditModalOpen(true);
    };

    const handleHealthFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHorse({
                ...horse,
                healthRecordFile: { name: file.name, url: URL.createObjectURL(file) }
            });
        }
    };

    const handlePedigreeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHorse({ ...horse, pedigreeImg: URL.createObjectURL(file) });
        }
    };

    const handleAddShow = (e) => {
        e.preventDefault();
        const newRecord = { ...newShow, id: Date.now() };
        setHorse(prev => ({ ...prev, showHistory: [newRecord, ...prev.showHistory] }));
        setIsAddingShow(false);
        setNewShow({ title: '', date: '', location: '', result: '' });
    };

    const handleDeleteShow = (showId) => {
        if (window.confirm("هل تريد حذف هذا السجل من تاريخ العرض؟")) {
            setHorse(prev => ({
                ...prev,
                showHistory: prev.showHistory.filter(s => s.id !== showId)
            }));
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'السجلات الصحية':
                return (
                    <div className="space-y-12 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'الحالة العامة', value: horse.healthStatus, icon: 'shield-heart', color: 'bg-emerald-50 text-emerald-600', detail: 'آخر تحديث: اليوم' },
                                { label: 'الوزن الحالي', value: horse.weight, icon: 'weight-hanging', color: 'bg-blue-50 text-blue-500', detail: 'ضمن المعدل الطبيعي' },
                                { label: 'التطعيمات', value: horse.vaccinations, icon: 'crutch', color: 'bg-purple-50 text-purple-500', detail: 'تحديث السجل' },
                                { label: 'الفحص الدوري', value: horse.nextCheck, icon: 'calendar-check', color: 'bg-amber-50 text-amber-600', detail: 'موعد الفحص القادم' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl`}>
                                            <i className={`fas fa-${stat.icon}`}></i>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold">{stat.label}</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold border-t border-gray-50 dark:border-gray-800 pt-4 truncate">{stat.detail}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-50 dark:bg-gray-800 rounded-full blur-3xl -z-10"></div>

                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-inner shrink-0 transition-colors ${horse.healthRecordFile ? 'bg-emerald-100 dark:bg-gray-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'}`}>
                                    <i className="fas fa-file-medical"></i>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">الملف الطبي الشامل</h3>
                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">يحتوي على كافة الزيارات والتطعيمات والتحاليل.</p>

                                    {horse.healthRecordFile ? (
                                        <div className="mt-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl inline-flex max-w-[250px] sm:max-w-md border border-emerald-100 dark:border-emerald-800/50">
                                            <i className="fas fa-check-circle"></i>
                                            <span className="truncate">{horse.healthRecordFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="mt-3 flex items-center gap-2 text-red-500 dark:text-red-400 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl inline-flex border border-red-100 dark:border-red-900/30">
                                            <i className="fas fa-exclamation-circle"></i>
                                            <span>لا يوجد ملف طبي مرفق حالياً</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 z-10 shrink-0">
                                {horse.healthRecordFile && (
                                    <a href={horse.healthRecordFile.url} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-emerald-800 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
                                        <i className="fas fa-external-link-alt"></i> عرض الملف
                                    </a>
                                )}

                                <label className="flex-1 md:flex-none cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-4 rounded-2xl font-black border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
                                    <i className={`fas ${horse.healthRecordFile ? 'fa-sync-alt' : 'fa-upload'}`}></i>
                                    {horse.healthRecordFile ? 'استبدال الملف' : 'رفع ملف PDF'}
                                    <input type="file" accept="application/pdf" className="hidden" onChange={handleHealthFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'النسب والسلالة':
                return (
                    <div className="animate-fade-in-up max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm text-center">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-4">
                                <i className="fas fa-sitemap text-emerald-600"></i> شجرة النسب والسلالة المرفقة
                            </h3>
                            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-gray-50 dark:border-gray-800 group cursor-pointer bg-gray-50 dark:bg-gray-800 mx-auto w-full aspect-[4/3] md:aspect-auto md:h-[500px] flex items-center justify-center">

                                {horse.pedigreeImg ? (
                                    <img src={horse.pedigreeImg} alt="Pedigree" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <i className="fas fa-image text-6xl mb-4"></i>
                                        <p className="font-bold">لا توجد صورة شجرة نسب مرفقة لهذا الحصان</p>
                                    </div>
                                )}

                                <label className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                    <i className="fas fa-camera text-5xl text-white mb-4"></i>
                                    <span className="text-white font-black text-xl">{horse.pedigreeImg ? 'تحديث شجرة النسب' : 'رفع صورة شجرة النسب'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePedigreeChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'تاريخ العرض':
                return (
                    <div className="animate-fade-in-up">
                        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                    <i className="fas fa-trophy text-amber-500"></i> سجل البطولات والمشاركات
                                </h3>
                                <button onClick={() => setIsAddingShow(!isAddingShow)} className="bg-emerald-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-emerald-100 dark:border-gray-700">
                                    <i className={`fas fa-${isAddingShow ? 'times' : 'plus'}`}></i> {isAddingShow ? 'إلغاء' : 'إضافة مشاركة'}
                                </button>
                            </div>

                            {isAddingShow && (
                                <form onSubmit={handleAddShow} className="mb-10 bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-[2rem] border border-gray-200 dark:border-gray-700 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">اسم البطولة</label>
                                            <input required type="text" value={newShow.title} onChange={e => setNewShow({ ...newShow, title: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 dark:text-white" placeholder="مثال: بطولة كتارا..." />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">التاريخ</label>
                                            <input required type="text" value={newShow.date} onChange={e => setNewShow({ ...newShow, date: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 dark:text-white" placeholder="مثال: مارس 2024" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">المكان</label>
                                            <input required type="text" value={newShow.location} onChange={e => setNewShow({ ...newShow, location: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 dark:text-white" placeholder="مثال: الدوحة، قطر" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 block">النتيجة</label>
                                            <input required type="text" value={newShow.result} onChange={e => setNewShow({ ...newShow, result: e.target.value })} className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 dark:text-white" placeholder="مثال: المركز الأول" />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all">
                                            حفظ المشاركة
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-4">
                                {horse.showHistory.length > 0 ? horse.showHistory.map((show, i) => (
                                    <div key={show.id} className="group bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-amber-400"></div>

                                        <div className="flex-1 pr-4">
                                            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">{show.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold">
                                                <span className="flex items-center gap-1"><i className="fas fa-calendar-alt text-gray-400"></i> {show.date}</span>
                                                <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt text-gray-400"></i> {show.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-2">
                                            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-xl font-black text-sm border border-amber-100 dark:border-amber-900/30">
                                                {show.result}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteShow(show.id)}
                                                className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                                title="حذف"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <i className="fas fa-award text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                                        <h4 className="text-lg font-black text-gray-500 dark:text-gray-400">لا يوجد سجل بطولات متاح لهذا الحصان حالياً.</h4>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="py-20 text-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-gray-300">
                            <i className="fas fa-layer-group"></i>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">قليلاً من الصبر...</h3>
                        <p className="text-gray-400 font-bold">هذا القسم قيد التطوير حالياً لتقديم أفضل تجربة ممكنة.</p>
                    </div>
                );
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-950 font-sans" dir="rtl">
            <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-800 rounded-full animate-spin mb-6 shadow-lg shadow-emerald-100"></div>
            <p className="text-2xl font-black text-emerald-900 animate-pulse tracking-wide">جاري إحضار سجلات الخيل...</p>
        </div>
    );

    if (!horse) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-950 font-sans" dir="rtl">
            <i className="fas fa-horse-head text-6xl text-red-300 mb-4"></i>
            <p className="text-3xl font-black text-red-500 mb-4">عذراً، الخيل غير موجود بالنظام.</p>
            <button onClick={() => navigate(-1)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-bold">عودة للصفحة السابقة</button>
        </div>
    );

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-emerald-200/50 transition-colors duration-300 overflow-x-hidden" dir="rtl">

            <style>{`
                @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(50px); } 100% { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInRight { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalEntry { 0% { opacity: 0; transform: scale(0.95) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-fade-in-right { animation: fadeInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                .animate-modal { animation: modalEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>

            <Navbar />

            <main className="container mx-auto px-4 lg:px-16 py-12">
                <section className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    <div className="w-full lg:w-[45%] space-y-6 animate-fade-in-right opacity-0">
                        <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-[6px] border-white dark:border-gray-900 h-[600px] relative group">
                            <img src={horse.img} alt={horse.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                            {horse.isForSale && (
                                <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-sm text-white px-6 py-2 rounded-xl font-black shadow-lg">
                                    للبيع
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {horse.thumbnails.map((thumb, i) => (
                                <div
                                    key={i}
                                    className="animate-fade-in-up opacity-0 aspect-square rounded-2xl overflow-hidden border-[3px] border-white dark:border-gray-800 shadow-md cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                                    style={{ animationDelay: `${(i * 0.1) + 0.4}s` }}
                                >
                                    <img src={thumb} alt="thumbnail" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-10 py-6">
                        <div className="space-y-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{horse.name}</h1>
                            <p className="text-xl text-emerald-800 font-bold bg-emerald-50 inline-block px-4 py-1.5 rounded-xl border border-emerald-100">{horse.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {[
                                { label: 'رقم التسجيل', value: horse.regNo, icon: 'id-card' },
                                { label: 'السلالة', value: horse.breed, icon: 'dna' },
                                { label: 'تاريخ الميلاد', value: horse.birth, icon: 'calendar-alt' },
                                { label: 'اللون', value: horse.color, icon: 'palette' },
                                { label: 'السعر', value: horse.price ? `${horse.price.toLocaleString()} ج.م` : '100,000 ج.م', icon: 'tag' },
                                { label: 'الموقع', value: horse.claimLocation || 'غير محدد', icon: 'map-marker-alt' },
                                { label: 'الأب والأم', value: `${horse.sire} × ${horse.dam}`, icon: 'project-diagram' },
                                { label: 'الفرع التابع له', value: horse.branch, icon: 'code-branch' }
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="animate-fade-in-up opacity-0 bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center space-x-reverse space-x-4 hover:shadow-md transition-shadow"
                                    style={{ animationDelay: `${(i * 0.1) + 0.3}s` }}
                                >
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-emerald-700 text-lg">
                                        <i className={`fas fa-${item.icon}`}></i>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[11px] text-gray-400 font-bold mb-1">{item.label}</p>
                                        <p className="text-sm font-black text-gray-800 dark:text-white truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="animate-fade-in-up opacity-0 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between" style={{ animationDelay: '0.8s' }}>
                            <div className="flex items-center space-x-reverse space-x-4">
                                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 text-xl shadow-inner border border-emerald-100">
                                    <i className="fas fa-crown"></i>
                                </div>
                                <div>
                                    <p className="text-[11px] text-gray-400 font-bold mb-1">المالك الحالي</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">{horse.owner}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.9s' }}>
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="flex-1 bg-emerald-800 text-white py-5 rounded-[2rem] font-black text-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-reverse space-x-4 group"
                            >
                                <i className="fas fa-phone-alt group-hover:scale-110 transition-transform"></i>
                                <span>{horse.isForSale ? 'تواصل للشراء' : 'تواصل مع المالك'}</span>
                            </button>

                            <button
                                onClick={openEditModal}
                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 w-full sm:w-20 py-5 sm:py-0 rounded-[2rem] font-black text-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1"
                                title="تعديل بيانات الخيل"
                            >
                                <i className="fas fa-pen"></i>
                            </button>

                            {user && user.role === 'Admin' && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 w-full sm:w-20 py-5 sm:py-0 rounded-[2rem] font-black text-xl hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-1"
                                    title="حذف الخيل"
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-28 animate-fade-in-up opacity-0" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center justify-center space-x-reverse space-x-10 mb-12 border-b-2 border-gray-100 dark:border-gray-900 overflow-x-auto pb-4 hide-scrollbar">
                        {['النسب والسلالة', 'تاريخ العرض', 'السجلات الصحية', 'تحليل الذكاء الاصطناعي'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-lg font-black transition-all duration-300 relative pb-4 whitespace-nowrap px-4 ${activeTab === tab ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-[-3px] left-0 right-0 h-1.5 bg-emerald-600 rounded-t-full animate-fade-in"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {renderTabContent()}
                    </div>
                </section>
            </main>

            <Footer />

            {/* ---------- Modal التعديل ---------- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-modal border border-white/20 dark:border-gray-700">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-l from-blue-900 to-blue-800">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <i className="fas fa-edit text-blue-200"></i> تعديل بيانات الحصان الأساسية
                            </h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#FAF9F6] dark:bg-gray-900">
                            <form id="editHorseForm" onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'اسم الحصان', name: 'name', type: 'text', placeholder: 'مثال: أدهم البادية' },
                                    { label: 'رقم التسجيل', name: 'regNo', type: 'text', placeholder: 'رقم التسجيل' },
                                    { label: 'اللون', name: 'color', type: 'text', placeholder: 'مثال: أشعل، أشقر...' },
                                    { label: 'تاريخ الميلاد', name: 'birth', type: 'text', placeholder: 'مثال: مايو 2021' },
                                    { label: 'السعر (إن وُجد)', name: 'price', type: 'text', placeholder: 'مثال: 500000' },
                                    { label: 'الموقع', name: 'claimLocation', type: 'text', placeholder: 'مثال: الجيزة، مصر' },
                                    { label: 'المالك الحالي', name: 'owner', type: 'text', placeholder: 'اسم المالك' },
                                    { label: 'فرع المزرعة', name: 'branch', type: 'text', placeholder: 'مثال: الفرع الرئيسي' },
                                    { label: 'اسم الأب (Sire)', name: 'sire', type: 'text', placeholder: 'اسم الأب' },
                                    { label: 'اسم الأم (Dam)', name: 'dam', type: 'text', placeholder: 'اسم الأم' },
                                ].map((field, idx) => (
                                    <div key={idx} className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <label className="text-sm font-bold text-blue-900 dark:text-blue-400">{field.label}</label>
                                        <input
                                            required type={field.type} name={field.name} value={editData[field.name] || ''} onChange={handleEditChange}
                                            className="w-full px-4 py-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}

                                <div className="space-y-2 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <label className="text-sm font-bold text-blue-900 dark:text-blue-400">الرَّسَن (السلالة)</label>
                                    <select required name="breed" value={editData.breed || ''} onChange={handleEditChange} className="w-full px-4 py-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white">
                                        <option value="صقلاوي">صقلاوي</option>
                                        <option value="صقلاوي جدراني">صقلاوي جدراني</option>
                                        <option value="كحيلان">كحيلان</option>
                                        <option value="عبيان">عبيان</option>
                                        <option value="عبية الشراك">عبية الشراك</option>
                                        <option value="حمداني">حمداني</option>
                                        <option value="هدبان">هدبان</option>
                                        <option value="شويمان">شويمان</option>
                                        <option value="معنقي">معنقي</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-4">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3.5 rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                إلغاء
                            </button>
                            <button type="submit" form="editHorseForm" className="px-10 py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                حفظ التعديلات
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Modal التواصل ---------- */}
            {isContactModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] w-full max-w-md shadow-2xl p-8 relative border border-gray-100 dark:border-gray-800 animate-fade-in-up opacity-0" style={{ animationDelay: '0s' }}>

                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">التواصل مع المالك</h2>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                <svg width="20" height="20" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 1L1 13M1 1l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 flex items-center border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0 ml-4 text-xl">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs text-gray-500 font-bold mb-1">الاسم</span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">{horse.owner}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 flex items-center border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0 ml-4 text-xl">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="flex flex-col text-right overflow-hidden">
                                    <span className="text-xs text-gray-500 font-bold mb-1">البريد الإلكتروني</span>
                                    <span className="text-[15px] font-black text-gray-900 dark:text-white truncate" dir="ltr">{horse.ownerEmail}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 flex items-center border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0 ml-4 text-xl">
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs text-gray-500 font-bold mb-1">رقم الهاتف</span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white" dir="ltr">{horse.ownerPhone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <a href={`mailto:${horse.ownerEmail}`} className="flex-[2] bg-emerald-700 text-white py-4 rounded-2xl font-bold text-center hover:bg-emerald-800 transition shadow-lg shadow-emerald-900/20 text-lg">
                                إرسال بريد
                            </a>

                            {horse.ownerPhone !== 'غير متاح' ? (
                                <a href={`tel:${horse.ownerPhone}`} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-4 rounded-2xl font-bold text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition text-lg">
                                    اتصال
                                </a>
                            ) : (
                                <button disabled className="flex-1 bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold text-center cursor-not-allowed border border-gray-100">
                                    اتصال
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HorseProfile;