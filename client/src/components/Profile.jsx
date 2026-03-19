import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { userApi } from '../api/api';
import api from '../api/api';

const Profile = () => {
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        bio: '',
        profilePictureUrl: '',
        role: '',
        lastPasswordChangedAt: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [activeTab, setActiveTab] = useState('personal');
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const getProfilePicUrl = (url) => {
        if (!url) return "https://ui-avatars.com/api/?name=" + user.fullName;
        if (url.startsWith('http')) return url;
        return url; // Proxied via Vite
    };

    const formatDate = (dateString) => {
        if (!dateString) return "لم يتم التغيير مؤخراً";
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "اليوم";
        if (diffDays === 1) return "أمس";
        if (diffDays < 7) return `منذ ${diffDays} أيام`;
        if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
        return `منذ ${Math.floor(diffDays / 30)} أشهر`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await userApi.getProfile();
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setSaving(true);
            const res = await api.post('/profile/upload-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser({ ...user, profilePictureUrl: res.data.url });
            setMessage('تم تحديث الصورة الشخصية بنجاح');
        } catch (err) {
            console.error("Error uploading picture:", err);
            setMessage('حدث خطأ أثناء رفع الصورة');
        } finally {
            setSaving(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await api.put('/profile', user);
            setMessage('تم تحديث الملف الشخصي بنجاح');
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage('حدث خطأ أثناء التحديث');
        } finally {
            setSaving(false);
        }
    };

    const submitPasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('كلمات المرور الجديدة غير متطابقة');
            return;
        }

        try {
            setSaving(true);
            await api.post('/profile/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage('تم تغيير كلمة المرور بنجاح');
            setUser({ ...user, lastPasswordChangedAt: new Date().toISOString() });
            setPasswordError('');
        } catch (err) {
            console.error("Error changing password:", err);
            setPasswordError('فشل تغيير كلمة المرور. تأكد من كلمة المرور الحالية.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-gray-950 font-sans" dir="rtl">
            <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-black text-emerald-800 dark:text-emerald-400">تحميل الملف الشخصي...</p>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl transform group-hover:rotate-3 transition-transform duration-500">
                                    <img src={getProfilePicUrl(user.profilePictureUrl)} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <button 
                                    onClick={triggerFileInput} 
                                    className="absolute -bottom-2 -left-2 bg-emerald-700 text-white w-12 h-12 rounded-2xl border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-2xl transform hover:scale-110 hover:-rotate-12 transition-all cursor-pointer"
                                >
                                    <i className="fas fa-camera text-xl"></i>
                                </button>
                            </div>
                            <div className="space-y-4 text-center md:text-right relative z-10 flex-1">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{user.fullName || "عضو جديد"}</h2>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                   <span className="px-5 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                                       ROLE: {user.role || "MEMBER"}
                                   </span>
                                   <span className="px-5 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl text-xs font-black border border-gray-100 dark:border-gray-700">
                                       Verified Account
                                   </span>
                                </div>
                            </div>
                            <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-l from-emerald-50/10 dark:from-emerald-900/5 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-12">
                            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800 pb-8">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-700">
                                   <i className="fas fa-user-edit"></i>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">البيانات الشـخصية</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <FormField label="الاسم بالكامل" value={user.fullName} name="fullName" onChange={handleChange} />
                                <FormField label="البريد الإلكتروني" value={user.email} readOnly icon="fa-envelope" />
                                <FormField label="رقم الهاتف" value={user.phoneNumber || ''} name="phoneNumber" onChange={handleChange} placeholder="+20 1xx xxx xxxx" />
                                <FormField label="الموقع / المدينة" value={user.city || 'القاهرة، مصر'} readOnly placeholder="القاهرة، مصر" />
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2">نبذة عن مسيرتك في عالم الخيل</label>
                                    <textarea
                                        name="bio"
                                        value={user.bio || ''}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 p-6 rounded-[2rem] outline-none transition-all text-gray-900 dark:text-white font-bold resize-none shadow-inner"
                                        placeholder="تحدث عن خبرتك، إسطبلك، أو شغفك بالخيل العربية..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-12">
                            <div className="flex items-center gap-4 border-b border-gray-50 dark:border-gray-800 pb-8">
                                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-700">
                                   <i className="fas fa-shield-alt"></i>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">إعدادات الأمان</h3>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-[#FAF9F6] dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-inner gap-8">
                                <div className="space-y-2 text-center md:text-right">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">كلمة المرور</p>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">آخر تحديث للأمان: {formatDate(user.lastPasswordChangedAt)}</p>
                                </div>
                                <button
                                    onClick={() => { setShowPasswordModal(true); setPasswordError(''); }}
                                    className="bg-emerald-800 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-950 transition-all hover:-translate-y-1"
                                >
                                    تغيير كلمة المرور الآن
                                </button>
                            </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-950/20 p-12 rounded-[3.5rem] border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2 text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-red-600 dark:text-red-400 mb-2">
                                    <i className="fas fa-radiation text-2xl"></i>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">منطقة الخطر الشديد</h3>
                                </div>
                                <p className="text-red-400 text-sm font-bold">حذف الحساب سيؤدي إلى فقدان جميع البيانات والمشاركات في المزادات بشكل نهائي.</p>
                            </div>
                            <button className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-red-900/20 hover:bg-red-700 transition-all">إغلاق الحساب نهائياً</button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-white dark:bg-gray-900 p-24 rounded-[4rem] border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 text-gray-300 rounded-[2.5rem] flex items-center justify-center mx-auto text-4xl shadow-inner">
                            <i className="fas fa-tools"></i>
                        </div>
                        <div className="max-w-md mx-auto space-y-4">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">قيد التطوير</h3>
                            <p className="text-gray-400 font-bold text-lg">هذه الميزة ستتوفر قريباً في التحديث القادم لنظام الخيل العربية.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-[#FAF9F6] dark:bg-gray-950 min-h-screen font-sans text-right transition-colors duration-500" dir="rtl">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[4rem] p-12 shadow-2xl border border-white/20 dark:border-gray-800 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">تحديث الأمان</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {passwordError && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-5 rounded-2xl mb-8 font-black text-sm border border-red-100 dark:border-red-900/30">{passwordError}</div>}

                        <div className="space-y-8">
                            <FormField label="كلمة المرور الحالية" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                            <FormField label="كلمة المرور الجديدة" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                            <FormField label="تأكيد الكلمة الجديدة" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                            
                            <button
                                onClick={submitPasswordChange}
                                disabled={saving}
                                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-900/30 transition-all hover:-translate-y-1 mt-4"
                            >
                                {saving ? "جاري التحديث..." : "تأكيد التغيير العـميق"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />

            <div className="container mx-auto px-4 md:px-16 py-16">
                <header className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-20 bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 underline decoration-emerald-500 decoration-8 underline-offset-8">إدارة الحساب CONTROL PANEL</h1>
                        <p className="text-gray-400 font-bold text-lg">مرحباً بك في لوحة تحكم ملفك الشخصي الخاص.</p>
                    </div>
                    <div className="flex gap-6 w-full lg:w-auto">
                        <button onClick={() => navigate('/')} className="flex-1 lg:flex-none px-10 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-colors">إلـغاء</button>
                        <button onClick={handleSubmit} disabled={saving} className="flex-1 lg:flex-none px-12 py-4 bg-emerald-800 text-white rounded-[1.5rem] font-black shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all hover:-translate-y-1 flex items-center justify-center gap-4">
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>{saving ? 'جاري المزامنة...' : 'حفظ التعديلات'}</span>
                        </button>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row gap-16">
                    <aside className="w-full lg:w-96 space-y-6">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm sticky top-32">
                            <nav className="space-y-3">
                                <SidebarBtn icon="fa-user" label="البيانات الشخصية" active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} />
                                <SidebarBtn icon="fa-shield-halved" label="الأمان والخصوصية" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                                <SidebarBtn icon="fa-horse-head" label="إسطبلاتي الخاصة" active={activeTab === 'stables'} onClick={() => setActiveTab('stables')} />
                                <SidebarBtn icon="fa-wallet" label="المحفظة المالية" active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} />
                                <div className="h-px bg-gray-50 dark:bg-gray-800 my-4 mx-4"></div>
                                <button onClick={handleLogout} className="w-full flex items-center gap-4 p-5 rounded-[1.5rem] text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-black text-sm group">
                                    <i className="fas fa-power-off group-hover:rotate-90 transition-transform"></i>
                                    <span>تسجيل خروج آمن</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {message && (
                            <div className={`mb-10 p-6 rounded-[2rem] text-center font-black animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl ${message.includes('بنجاح') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                <i className={`ml-4 text-xl ${message.includes('بنجاح') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
                                {message}
                            </div>
                        )}
                        {renderTabContent()}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const FormField = ({ label, value, name, onChange, type = "text", readOnly = false, placeholder = "", icon = "" }) => (
    <div className="space-y-3 group">
        <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mr-2 transition-colors group-focus-within:text-emerald-700">{label}</label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`w-full ${readOnly ? 'bg-gray-50/50 dark:bg-gray-800/20 cursor-not-allowed text-gray-400' : 'bg-[#FAF9F6] dark:bg-black/40 border-2 border-transparent focus:border-emerald-700 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white'} p-5 pr-14 rounded-2xl outline-none transition-all duration-300 font-black shadow-inner`}
            />
            {icon && <i className={`fas ${icon} absolute right-6 top-1/2 -translate-y-1/2 text-gray-300`}></i>}
        </div>
    </div>
);

const SidebarBtn = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-500 ${active ? 'bg-emerald-800 text-white shadow-2xl shadow-emerald-900/30' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}
    >
        <div className="flex items-center gap-4">
            <i className={`fas ${icon} text-lg`}></i>
            <span className="font-black text-sm uppercase tracking-tight">{label}</span>
        </div>
        {active && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
    </button>
);

export default Profile;