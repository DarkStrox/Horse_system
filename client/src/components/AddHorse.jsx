import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const AddHorse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        microchipId: '',
        name: '',
        gender: 'Male',
        breed: '',
        age: '',
        price: '',
        healthStatus: '',
        vaccinated: false,
        hasRacingHistory: false,
        racingHistoryDetails: '',
        claimLocation: '',
        claimLocation: '',
        imageFile: null,
        videoFile: null
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setUser(res.data);
                // Check role: allow Seller or Admin
                if (res.data.role !== 'Seller' && res.data.role !== 'Admin') {
                    alert("يجب أن يكون لديك حساب 'بائع' لعرض خيل للبيع.");
                    navigate('/sales');
                }
            })
            .catch(err => {
                console.error(err);
                navigate('/login');
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!formData.name || !formData.price || !formData.claimLocation || !formData.microchipId) {
            alert("يرجى ملء الحقول المطلوبة (بما في ذلك رقم التسجيل).");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append('microchipId', formData.microchipId);
        data.append('name', formData.name);
        data.append('gender', formData.gender);
        data.append('breed', formData.breed);
        data.append('age', parseInt(formData.age) || 0);
        data.append('price', parseFloat(formData.price) || 0);
        data.append('healthStatus', formData.healthStatus);
        data.append('vaccinated', formData.vaccinated);
        data.append('hasRacingHistory', formData.hasRacingHistory);
        if (formData.racingHistoryDetails) data.append('racingHistoryDetails', formData.racingHistoryDetails);
        data.append('claimLocation', formData.claimLocation);

        if (formData.imageFile) data.append('imageFile', formData.imageFile);
        if (formData.videoFile) data.append('videoFile', formData.videoFile);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/horse/sell', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const successMsg = user?.role === 'Admin'
                ? "تم إضافة الخيل بنجاح وظهوره في السوق فوراً."
                : "تم إرسال طلب البيع بنجاح! سيظهر الخيل في السوق بعد مراجعة الإدارة وموافقتها.";
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
                    <p className="text-gray-400 mb-8">أدخل تفاصيل الخيل بدقة ليتم عرضها للمشترين.</p>

                    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                        {/* Microchip ID */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الشريحة (Microchip ID) *</label>
                            <input
                                type="text"
                                name="microchipId"
                                value={formData.microchipId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                placeholder="مثال: H005 (يجب أن يكون فريداً)"
                                required
                            />
                        </div>

                        {/* Name & Breed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم الخيل *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                    placeholder="اسم الخيل"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">السلالة</label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                    placeholder="مثال: صقلاوي"
                                />
                            </div>
                        </div>

                        {/* Gender & Age */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الجنس</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                >
                                    <option value="Male">ذكر (Male)</option>
                                    <option value="Female">أنثى (Female)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">العمر (سنوات)</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                    placeholder="مثال: 5"
                                />
                            </div>
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

                        {/* Media Uploads - Images & Video */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">صورة الخيل (رئيسية)</label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">فيديو الخيل (اختياري)</label>
                                <input
                                    type="file"
                                    name="videoFile"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                />
                            </div>
                        </div>

                        {/* Health */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الحالة الصحية</label>
                            <input
                                type="text"
                                name="healthStatus"
                                value={formData.healthStatus}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition"
                                placeholder="مثال: سليمة، إصابة سابقة..."
                            />
                        </div>

                        {/* Vaccine Checkbox */}
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <input
                                type="checkbox"
                                name="vaccinated"
                                checked={formData.vaccinated}
                                onChange={handleChange}
                                id="vaccinated"
                                className="w-5 h-5 accent-green-500 rounded focus:ring-green-500"
                            />
                            <label htmlFor="vaccinated" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                هل تم أخذ التطعيمات مؤخراً؟
                            </label>
                        </div>

                        {/* Racing History */}
                        <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="hasRacingHistory"
                                    checked={formData.hasRacingHistory}
                                    onChange={handleChange}
                                    id="hasRacingHistory"
                                    className="w-5 h-5 accent-green-500 rounded focus:ring-green-500"
                                />
                                <label htmlFor="hasRacingHistory" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    هل شارك في سباقات وفاز؟
                                </label>
                            </div>

                            {formData.hasRacingHistory && (
                                <textarea
                                    name="racingHistoryDetails"
                                    value={formData.racingHistoryDetails}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition h-24"
                                    placeholder="اذكر التفاصيل (اسم السباق، المركز...)"
                                ></textarea>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#76E05B] text-white font-black py-4 rounded-2xl text-lg hover:bg-green-600 transition shadow-xl shadow-green-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال طلب البيع'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AddHorse;
