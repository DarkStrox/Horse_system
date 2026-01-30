import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:5000';

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
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);

    const getProfilePicUrl = (url) => {
        if (!url) return "https://ui-avatars.com/api/?name=" + user.fullName;
        if (url.startsWith('http')) return url;
        return API_BASE_URL + url;
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
                const res = await axios.get('/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
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

        const token = localStorage.getItem('token');
        try {
            setSaving(true);
            const res = await axios.post('/api/profile/upload-picture', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
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

        const token = localStorage.getItem('token');
        try {
            await axios.put('/api/profile', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

        const token = localStorage.getItem('token');
        try {
            setSaving(true);
            await axios.post('/api/profile/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setMessage('تم تغيير كلمة المرور بنجاح');
            setUser({ ...user, lastPasswordChangedAt: new Date().toISOString() });
            setPasswordError(''); // Clear any previous error
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

    if (loading) return <div className="text-center p-20 font-sans text-green-600">Loading profile...</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Profile Summary Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-reverse space-x-10 relative z-10">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                        <img src={getProfilePicUrl(user.profilePictureUrl)} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <button onClick={triggerFileInput} className="absolute bottom-1 left-1 bg-green-500 text-white w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg transform hover:scale-110 transition cursor-pointer">
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-reverse space-x-3">
                                        <h2 className="text-3xl font-black text-gray-900">{user.fullName || "اسم المستخدم"}</h2>
                                        <span className="bg-blue-50 text-blue-500 px-3 py-0.5 rounded-full text-xs font-bold flex items-center space-x-reverse space-x-1">
                                            <i className="fas fa-check-circle text-[10px]"></i>
                                            <span>موثق</span>
                                        </span>
                                        <span className="bg-yellow-50 text-yellow-600 px-3 py-0.5 rounded-full text-xs font-bold flex items-center space-x-reverse space-x-1">
                                            <i className="fas fa-crown text-[10px]"></i>
                                            <span>عضوية ذهبية</span>
                                        </span>
                                    </div>
                                    <p className="text-gray-400 font-bold">{user.role || "عضو"}</p>
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-green-50/20 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Details Form Card */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
                            <div className="flex items-center space-x-reverse space-x-3 border-b border-gray-50 pb-6">
                                <i className="fas fa-file-alt text-green-500 text-xl"></i>
                                <h3 className="text-xl font-black text-gray-800">البيانات الأساسية</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">الاسم بالكامل</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">البريد الإلكتروني</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-left text-gray-400 cursor-not-allowed"
                                        />
                                        <i className="far fa-envelope absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">رقم الهاتف</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={user.phoneNumber || ''}
                                        onChange={handleChange}
                                        placeholder="+966 5x xxx xxxx"
                                        className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl text-left outline-none focus:ring-4 focus:ring-green-100 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">المدينة / المنطقة</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="الرياض، المملكة العربية السعودية"
                                            className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-5 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">نبذة عني</label>
                                    <textarea
                                        name="bio"
                                        value={user.bio || ''}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition resize-none"
                                        placeholder="تحدث عن نفسك قليلاً..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10">
                            <div className="flex items-center space-x-reverse space-x-3 border-b border-gray-50 pb-6">
                                <i className="fas fa-shield-alt text-[#19E15B] text-xl"></i>
                                <h3 className="text-xl font-black text-gray-800">إعدادات الأمان</h3>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                                <div className="space-y-1">
                                    <p className="font-black text-gray-900">كلمة المرور</p>
                                    <p className="text-xs text-gray-400">آخر تحديث: {formatDate(user.lastPasswordChangedAt)}</p>
                                </div>
                                <button
                                    onClick={() => { setShowPasswordModal(true); setPasswordError(''); }}
                                    className="bg-white text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 shadow-sm transition"
                                >
                                    تغيير كلمة المرور
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                                <div>
                                    <p className="font-black text-gray-900">المصادقة الثنائية (2FA)</p>
                                    <p className="text-xs text-gray-400 mt-1">أضف طبقة أمان إضافية لحسابك عبر رمز التحقق.</p>
                                </div>
                                <button
                                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 shadow-inner ${twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${twoFactorEnabled ? 'right-1' : 'right-7'}`}></div>
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-reverse space-x-2 text-red-600">
                                    <i className="fas fa-exclamation-triangle"></i>
                                    <h3 className="font-black">منطقة الخطر</h3>
                                </div>
                                <p className="text-red-400 text-sm">بمجرد حذف حسابك، لا يمكن التراجع عن هذا الإجراء. يرجى توخي الحذر.</p>
                            </div>
                            <button className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-600 transition">حذف الحساب</button>
                        </div>
                    </div>
                );
            case 'financial':
                return (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                            <i className="far fa-credit-card"></i>
                        </div>
                        <div className="max-w-xs mx-auto space-y-2">
                            <h3 className="text-xl font-black text-gray-900">المعاملات المالية</h3>
                            <p className="text-gray-400 text-sm">لا توجد معاملات مالية حتى الآن. سيتم عرض سجل المدفوعات والمزادات هنا.</p>
                        </div>
                        <button className="bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-600 transition">إضافة وسيلة دفع</button>
                    </div>
                );
            case 'stables':
                return (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto text-3xl">
                            <i className="fas fa-horse"></i>
                        </div>
                        <div className="max-w-xs mx-auto space-y-2">
                            <h3 className="text-xl font-black text-gray-900">إسطبلاتي الخاصة</h3>
                            <p className="text-gray-400 text-sm">قم بإدارة خيولك وإسطبلاتك من هنا. يمكنك إضافة خيول جديدة للمشاركة في المزادات.</p>
                        </div>
                        <button className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 transition">إضافة خيل جديد</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-right" dir="rtl">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-gray-900">تغيير كلمة المرور</h3>
                            <button onClick={() => { setShowPasswordModal(false); setPasswordError(''); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {passwordError && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold">{passwordError}</div>}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-2">كلمة المرور الحالية</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-2">كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-2">تأكيد كلمة المرور الجديدة</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 transition"
                                />
                            </div>
                            <button
                                onClick={submitPasswordChange}
                                disabled={saving}
                                className="w-full bg-[#19E15B] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-600 transition"
                            >
                                {saving ? "جاري الحفظ..." : "تحديث كلمة المرور"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />

            <div className="container mx-auto px-16 py-10">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1">ملف تعريف المستخدم</h1>
                        <p className="text-gray-400 text-sm">إدارة معلوماتك الشخصية، تفضيلات الخصوصية، وإعدادات الحساب الخاصة بك.</p>
                    </div>
                    <div className="flex space-x-reverse space-x-4">
                        <Link to="/" className="bg-white text-gray-700 px-6 py-2.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition">إلغاء</Link>
                        <button onClick={handleSubmit} disabled={saving} className="bg-[#19E15B] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition flex items-center space-x-reverse space-x-2">
                            <i className="far fa-save"></i>
                            <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <div className="w-full lg:w-72 space-y-2">
                        <aside className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'personal' ? 'bg-green-50 text-green-600 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                                >
                                    <div className="flex items-center space-x-reverse space-x-3">
                                        <i className="far fa-user text-lg"></i>
                                        <span>المعلومات الشخصية</span>
                                    </div>
                                    {activeTab === 'personal' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'security' ? 'bg-green-50 text-green-600 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                                >
                                    <div className="flex items-center space-x-reverse space-x-3">
                                        <i className="fas fa-shield-alt text-lg"></i>
                                        <span>الأمان وكلمة المرور</span>
                                    </div>
                                    {activeTab === 'security' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('stables')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'stables' ? 'bg-green-50 text-green-600 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                                >
                                    <div className="flex items-center space-x-reverse space-x-3">
                                        <i className="fas fa-horse text-lg"></i>
                                        <span>إسطبلاتي</span>
                                    </div>
                                    {activeTab === 'stables' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                </button>
                                <button
                                    onClick={() => setActiveTab('financial')}
                                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'financial' ? 'bg-green-50 text-green-600 font-bold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                                >
                                    <div className="flex items-center space-x-reverse space-x-3">
                                        <i className="far fa-credit-card text-lg"></i>
                                        <span>المعاملات المالية</span>
                                    </div>
                                    {activeTab === 'financial' && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                                </button>
                                <Link to="/notifications" className="w-full flex items-center space-x-reverse space-x-3 p-3.5 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition">
                                    <i className="far fa-bell text-lg"></i>
                                    <span>الإشعارات</span>
                                </Link>
                            </nav>
                        </aside>

                        <button onClick={handleLogout} className="w-full flex items-center space-x-reverse space-x-3 p-4 rounded-3xl text-red-400 hover:bg-red-50 transition-colors font-bold text-sm">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>تسجيل الخروج برفق</span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {message && (
                            <div className={`mb-6 p-4 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('بنجاح') ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                                <i className={`mx-2 ${message.includes('بنجاح') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}`}></i>
                                {message}
                            </div>
                        )}
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
