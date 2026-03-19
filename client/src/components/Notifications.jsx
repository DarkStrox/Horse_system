import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { joinApi, userApi } from '../api/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        userApi.getProfile()
            .then(res => {
                setUser(res.data);
                if (res.data.role === 'Admin') {
                    fetchNotifications();
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await joinApi.getNotifications();
            setNotifications(res.data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, type) => {
        try {
            let res;
            if (type === 'HorseSale') {
                res = await joinApi.approveHorse(id);
                alert("تم قبول عرض بيع الخيل بنجاح!");
            } else {
                res = await joinApi.approve(id);
                alert(`تم قبول الطلب بنجاح! كلمة المرور المبدئية: ${res.data.tempPassword || 'لا تغيير'}`);
            }
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء قبول الطلب.");
        }
    };

    const handleDeny = async (id) => {
        if (!window.confirm("هل أنت متأكد من رفض هذا الطلب؟")) return;
        try {
            await joinApi.deny(id);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء رفض الطلب.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-950 font-sans" dir="rtl">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">جاري تحميل الإشعارات والطلبات...</p>
        </div>
    );

    if (user?.role !== 'Admin') {
        return (
            <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-16 py-32 text-center">
                    <i className="fas fa-lock text-7xl text-red-100 mb-8"></i>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">عذراً، وصول مرفوض</h1>
                    <p className="text-gray-400 font-bold mt-4">هذه الصفحة مخصصة لمديري النظام فقط.</p>
                    <button onClick={() => navigate('/')} className="mt-10 bg-emerald-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl">العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 md:px-16 py-16">
                <header className="max-w-5xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 underline decoration-emerald-500 decoration-8 underline-offset-8">مركز الطلبات</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">مراجعة ومعالجة طلبات الانضمام وبيع الخيل المعلقة.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-900 px-8 py-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <span className="text-gray-400 font-black uppercase text-xs tracking-widest">إجمالي الطلبات:</span>
                            <span className="text-3xl font-black text-emerald-700">{notifications.length}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto space-y-8">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => {
                            const isHorseRequest = notif.type === 'HorseSale';
                            const req = isHorseRequest ? notif.horseRequest : notif.request;
                            if (!req) return null;

                            return (
                                <div key={notif.id} className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-3 h-full ${isHorseRequest ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                    
                                    <div className="flex flex-col lg:flex-row items-start gap-10">
                                        <div className={`w-20 h-20 rounded-[2rem] ${isHorseRequest ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'} flex items-center justify-center shrink-0 text-3xl shadow-inner`}>
                                            <i className={`fas ${isHorseRequest ? 'fa-horse-head' : 'fa-id-card'}`}></i>
                                        </div>
                                        
                                        <div className="flex-1 space-y-8 w-full">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                   <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{isHorseRequest ? `طلب عرض بيع: ${req.name}` : req.fullName}</h3>
                                                   <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${isHorseRequest ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                       {isHorseRequest ? 'خيل للبيع' : `طلب حساب: ${req.role}`}
                                                   </span>
                                                </div>
                                                <div className="text-gray-400 font-bold text-sm bg-gray-50 dark:bg-gray-800 px-6 py-2 rounded-full border border-gray-100 dark:border-gray-700">
                                                    <i className="far fa-clock ml-2"></i>
                                                    {new Date(notif.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#FAF9F6] dark:bg-gray-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-inner">
                                                {isHorseRequest ? (
                                                    <>
                                                        <DetailItem label="السلالة" value={req.breed} />
                                                        <DetailItem label="العمر" value={`${req.age} سنوات`} />
                                                        <DetailItem label="السعر" value={`${req.price.toLocaleString()} ج.م`} />
                                                        <DetailItem label="الحالة الصحية" value={req.healthStatus} />
                                                        <DetailItem label="التطعيمات" value={req.vaccinated ? 'مكتملة ✅' : 'ناقصة ❌'} />
                                                        <DetailItem label="الموقع" value={req.claimLocation} />
                                                        {req.hasRacingHistory && <div className="col-span-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-2"><DetailItem label="تاريخ السباقات" value={req.racingHistoryDetails} /></div>}
                                                    </>
                                                ) : (
                                                    <>
                                                        <DetailItem label="البريد" value={req.email} />
                                                        <DetailItem label="الهاتف" value={req.phoneNumber} />
                                                        <DetailItem label="الهوية الوطنية" value={req.nationalId || 'غير مرفق'} />
                                                        {req.licenseNumber && <DetailItem label="رقم الرخصة" value={req.licenseNumber} />}
                                                        {req.experienceYears && <DetailItem label="سنوات الخبرة" value={`${req.experienceYears} سنة`} />}
                                                        <div className="col-span-full border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                                                            <DetailItem label="ملاحظات الطلب" value={req.motivation} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <button onClick={() => handleApprove(notif.id, notif.type)} className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1">
                                                    اعتماد الطلب وترقية الحساب
                                                </button>
                                                <button onClick={() => handleDeny(notif.id)} className="bg-red-50 text-red-500 border border-red-100 px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                    رفض نهائي
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <i className="fas fa-check-double text-4xl text-emerald-200"></i>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">لا يوجد طلبات معلقة</h3>
                            <p className="text-gray-400 font-bold text-lg">لقد قمت بمعالجة جميع الطلبات الواردة بنجاح.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="text-right">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-base font-black text-gray-800 dark:text-white truncate">{value}</p>
    </div>
);

export default Notifications;