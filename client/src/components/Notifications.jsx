import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user info first to check if Admin
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUser(res.data);
                    if (res.data.role === 'Admin') {
                        fetchNotifications(token);
                    } else {
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchNotifications = (token) => {
        axios.get('http://localhost:5000/api/join/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setNotifications(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching notifications:", err);
                setLoading(false);
            });
    };

    const handleApprove = async (id, type) => {
        try {
            const token = localStorage.getItem('token');
            let url = `http://localhost:5000/api/join/approve/${id}`;
            if (type === 'HorseSale') {
                url = `http://localhost:5000/api/join/approve-horse/${id}`;
            }

            const res = await axios.post(url, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (type === 'HorseSale') {
                alert("تم قبول عرض بيع الخيل بنجاح!");
            } else {
                alert(`تم قبول الطلب بنجاح! كلمة المرور المبدئية (للمستخدمين الجدد): ${res.data.tempPassword || 'لا تغيير'}`);
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
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/join/deny/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء رفض الطلب.");
        }
    };

    if (loading) return <div className="text-center py-20">جاري التحميل...</div>;

    if (user?.role !== 'Admin') {
        return (
            <div className="bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
                <Navbar />
                <div className="container mx-auto px-16 py-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-800">عذراً، هذه الصفحة مخصصة للمسؤولين فقط.</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 md:px-16 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-1">طلبات الانضمام</h1>
                            <p className="text-gray-400 text-sm">مراجعة طلبات الانضمام الجديدة (بيطريين، مدربين، بائعين).</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((notif) => {
                            const isHorseRequest = notif.type === 'HorseSale';
                            const req = isHorseRequest ? notif.horseRequest : notif.request;

                            // Check if req exists to avoid errors
                            if (!req) return null;

                            return (
                                <div key={notif.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition hover:border-green-100 group relative">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${isHorseRequest ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'} flex items-center justify-center shrink-0`}>
                                            <i className={`fas ${isHorseRequest ? 'fa-horse-head' : 'fa-user-plus'} text-lg`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                                <h3 className="font-black text-gray-800 text-lg">{isHorseRequest ? `طلب بيع: ${req.name}` : req.fullName}</h3>
                                                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                    {new Date(notif.createdAt).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>

                                            {isHorseRequest ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-xl">
                                                    <p><strong className="text-gray-900">اسم الخيل:</strong> {req.name}</p>
                                                    <p><strong className="text-gray-900">العمر:</strong> {req.age} سنوات</p>
                                                    <p><strong className="text-gray-900">السعر:</strong> {req.price} ج.م</p>
                                                    <p><strong className="text-gray-900">الحالة الصحية:</strong> {req.healthStatus}</p>
                                                    <p><strong className="text-gray-900">التطعيمات:</strong> {req.vaccinated ? 'نعم' : 'لا'}</p>
                                                    <p><strong className="text-gray-900">موقع الاستلام:</strong> {req.claimLocation}</p>
                                                    {req.hasRacingHistory && <p className="col-span-2"><strong className="text-gray-900">تاريخ السباقات:</strong> {req.racingHistoryDetails}</p>}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-xl">
                                                    <p><strong className="text-gray-900">الدور المطلوب:</strong> {req.role}</p>
                                                    <p><strong className="text-gray-900">البريد:</strong> {req.email}</p>
                                                    <p><strong className="text-gray-900">الهاتف:</strong> {req.phoneNumber}</p>
                                                    {req.nationalId && <p><strong className="text-gray-900">رقم الهوية:</strong> {req.nationalId}</p>}
                                                    {req.licenseNumber && <p><strong className="text-gray-900">رقم الرخصة:</strong> {req.licenseNumber}</p>}
                                                    {req.experienceYears && <p><strong className="text-gray-900">الخبرة:</strong> {req.experienceYears} سنوات</p>}
                                                    <p className="col-span-2 mt-2"><strong className="text-gray-900">سبب الانضمام:</strong> "{req.motivation}"</p>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button onClick={() => handleApprove(notif.id, notif.type)} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100/50 text-sm">
                                                    قبول الطلب
                                                </button>
                                                <button onClick={() => handleDeny(notif.id)} className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl font-bold hover:bg-red-100 transition text-sm">
                                                    رفض
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {notifications.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                            <i className="far fa-bell-slash text-5xl text-gray-100 mb-4 block"></i>
                            <p className="text-gray-400 font-bold">لا يوجد طلبات جديدة حالياً</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
