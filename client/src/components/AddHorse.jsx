import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { horseApi } from '../api/api';

const AddHorse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        microchipId: '',
        name: '',
        gender: 'Male',
        breed: '',
        age: '',
        healthStatus: '',
        vaccinated: false,
        hasRacingHistory: false,
        racingHistoryDetails: '',
        imageFile: null,
        videoFile: null
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('/api/account/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
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

        const data = new FormData();
        data.append('microchipId', formData.microchipId);
        data.append('name', formData.name);
        data.append('gender', formData.gender);
        data.append('breed', formData.breed);
        data.append('age', parseInt(formData.age) || 0);
        data.append('healthStatus', formData.healthStatus);
        data.append('vaccinated', formData.vaccinated);
        data.append('hasRacingHistory', formData.hasRacingHistory);
        if (formData.racingHistoryDetails) data.append('racingHistoryDetails', formData.racingHistoryDetails);

        if (formData.imageFile) data.append('imageFile', formData.imageFile);
        if (formData.videoFile) data.append('videoFile', formData.videoFile);

        try {
            await horseApi.createHorse(data);
            alert("تم إضافة الخيل إلى النظام بنجاح.");
            navigate('/horses');
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

            <div className="container mx-auto px-4 py-32 flex justify-center">
                <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl p-10 md:p-14 border border-gray-100 dark:border-gray-800">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 underline decoration-emerald-500 decoration-8 underline-offset-8">إضافة خيل للنظام</h2>
                    <p className="text-gray-400 mb-12 font-bold uppercase tracking-widest text-xs">أدخل تفاصيل الخيل لتسجيلها في قاعدتنا البيانية.</p>

                    <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">رقم الشريحة (MICROCHIP ID) *</label>
                            <input
                                type="text"
                                name="microchipId"
                                value={formData.microchipId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white"
                                placeholder="مثال: H005 (يجب أن يكون فريداً)"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">اسم الخيل *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white"
                                    placeholder="اسم الخيل"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">السلالة (BREED)</label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white"
                                    placeholder="مثال: صقلاوي"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الجنس (GENDER)</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white appearance-none"
                                >
                                    <option value="Male">ذكر (MALE)</option>
                                    <option value="Female">أنثى (FEMALE)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">العمر (AGE)</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white"
                                    placeholder="مثال: 5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">صورة الخيل (MAIN IMAGE)</label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none dark:text-white font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300">فيديو (OPTIONAL VIDEO)</label>
                                <input
                                    type="file"
                                    name="videoFile"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-black text-gray-700 dark:text-gray-300">الحالة الصحية (HEALTH)</label>
                            <input
                                type="text"
                                name="healthStatus"
                                value={formData.healthStatus}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[2rem] outline-none border-2 border-transparent focus:border-emerald-500 transition-all font-bold dark:text-white"
                                placeholder="مثال: سليمة، إصابة سابقة..."
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 md:p-8 p-6 rounded-[2.5rem] border-2 border-transparent hover:border-emerald-500 transition-all">
                            <input
                                type="checkbox"
                                name="vaccinated"
                                checked={formData.vaccinated}
                                onChange={handleChange}
                                id="vaccinated"
                                className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer"
                            />
                            <label htmlFor="vaccinated" className="text-base font-black text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                هل تم أخذ التطعيمات مؤخراً؟ (VACCINATED)
                            </label>
                        </div>

                        <div className="space-y-6 bg-gray-50 dark:bg-gray-800 md:p-8 p-6 rounded-[2.5rem] border-2 border-transparent hover:border-emerald-500 transition-all">
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    name="hasRacingHistory"
                                    checked={formData.hasRacingHistory}
                                    onChange={handleChange}
                                    id="hasRacingHistory"
                                    className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer"
                                />
                                <label htmlFor="hasRacingHistory" className="text-base font-black text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    هل شارك في سباقات سابقة؟ (RACING HISTORY)
                                </label>
                            </div>

                            {formData.hasRacingHistory && (
                                <textarea
                                    name="racingHistoryDetails"
                                    value={formData.racingHistoryDetails}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-gray-900 p-5 rounded-2xl outline-none border-2 border-emerald-100 dark:border-gray-700 focus:border-emerald-500 transition-all h-32 font-bold dark:text-white"
                                    placeholder="اذكر التفاصيل (اسم السباق، المركز...)"
                                ></textarea>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-800 text-white font-black py-6 rounded-[2.5rem] text-xl hover:bg-emerald-900 transition shadow-2xl shadow-emerald-900/40 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                        >
                            {loading ? 'جاري الإرسال...' : 'تأكيد التسجيل في النظام'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AddHorse;