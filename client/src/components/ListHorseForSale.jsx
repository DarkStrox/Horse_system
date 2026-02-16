import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ListHorseForSale = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [fetchingHorses, setFetchingHorses] = useState(true);
    const [myHorses, setMyHorses] = useState([]);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        microchipId: '',
        price: '',
        claimLocation: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch User Profile
        axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data);
                if (res.data.role !== 'Seller' && res.data.role !== 'Admin') {
                    alert("يجب أن يكون لديك حساب 'بائع' لعرض خيل للبيع.");
                    navigate('/sales');
                }
            })
            .catch(err => {
                console.error(err);
                navigate('/login');
            });

        // Fetch My Horses
        axios.get('http://localhost:5000/api/horse/my-horses', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setMyHorses(res.data);
                setFetchingHorses(false);
            })
            .catch(err => {
                console.error("Error fetching horses:", err);
                setFetchingHorses(false);
            });
    }, [navigate, location.pathname]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.microchipId || !formData.price || !formData.claimLocation) {
            alert("يرجى ملء جميع الحقول المطلوبة.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/horse/list-for-sale', {
                microchipId: formData.microchipId,
                price: parseFloat(formData.price),
                claimLocation: formData.claimLocation
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const successMsg = user?.role === 'Admin'
                ? "تم إضافة الخيل للمبيعات بنجاح."
                : "تم إرسال طلب البيع بنجاح! سيظهر الخيل في السوق بعد مراجعة الإدارة.";
            alert(successMsg);
            navigate('/sales');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />

            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">عرض خيل للبيع</h2>
                    <p className="text-gray-400 mb-8">اختر خيلاً من خيولك المسجلة وحدد سعر البيع.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Select Horse */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اختر الخيل *</label>
                            <select
                                name="microchipId"
                                value={formData.microchipId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                required
                                disabled={fetchingHorses}
                            >
                                <option value="">-- اختر خيلاً --</option>
                                {myHorses.map(horse => (
                                    <option key={horse.microchipId} value={horse.microchipId}>
                                        {horse.name} ({horse.breed})
                                    </option>
                                ))}
                            </select>
                            {myHorses.length === 0 && !fetchingHorses && (
                                <p className="text-red-500 text-xs mt-2 font-bold">ليس لديك خيول مسجلة في "النظام". يرجى إضافة خيل أولاً.</p>
                            )}
                        </div>

                        {/* Price & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">السعر المطلوب (ج.م) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                    placeholder="مثال: 150000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">موقع الاستلام *</label>
                                <input
                                    type="text"
                                    name="claimLocation"
                                    value={formData.claimLocation}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                    placeholder="مدينة، اسطبل..."
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || myHorses.length === 0}
                            className="w-full bg-[#76E05B] text-white font-black py-4 rounded-2xl text-lg hover:bg-green-600 transition shadow-xl shadow-green-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'جاري الإرسال...' : 'عرض للبيع'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ListHorseForSale;
