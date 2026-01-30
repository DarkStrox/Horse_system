import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const CreateAuction = () => {
    const navigate = useNavigate();
    const [horses, setHorses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        microchipId: '',
        basePrice: '',
        startTime: '',
        endTime: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Fetch user's horses
        axios.get(`${API_BASE_URL}/api/horse/my-horses`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setHorses(res.data))
            .catch(err => {
                console.error("Error fetching horses:", err);
                alert("Error: " + (err.response?.status || err.message));
                setHorses([]);
            });

        // Also if admin, fetch all horses? For now assume Seller creates for their own.
        // If Admin, maybe fetch all. But let's stick to "My Horses" endpoint for simplicity or assume User is Owner.
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'image') setImageFile(e.target.files[0]);
        if (e.target.name === 'video') setVideoFile(e.target.files[0]);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('microchipId', formData.microchipId);
            data.append('basePrice', formData.basePrice);
            data.append('startTime', formData.startTime);
            data.append('endTime', formData.endTime);
            if (imageFile) data.append('imageFile', imageFile);
            if (videoFile) data.append('videoFile', videoFile);

            await axios.post(`${API_BASE_URL}/api/auction/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("تم إنشاء المزاد بنجاح!");
            navigate('/auctions');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.response?.data || "حدث خطأ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />
            <main className="container mx-auto px-4 md:px-16 py-12">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">إنشاء مزاد جديد</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-bold mb-2 dark:text-white">عنوان المزاد</label>
                            <input type="text" name="name" onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" placeholder="مثال: مزاد الفرس الأصيلة..." required />
                        </div>

                        <div>
                            <label className="block font-bold mb-2 dark:text-white">اختر الخيل</label>
                            <select name="microchipId" onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" required>
                                <option value="">-- اختر من خيولك --</option>
                                {horses.map(h => (
                                    <option key={h.microchipId} value={h.microchipId}>{h.name} - {h.breed}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold mb-2 dark:text-white">صورة المزاد (اختياري)</label>
                            <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" />
                            <p className="text-xs text-gray-400 mt-1">اتركها فارغة لاستخدام صورة الخيل الأصلية</p>
                        </div>



                        <div>
                            <label className="block font-bold mb-2 dark:text-white">السعر الافتتاحي (ج.م)</label>
                            <input type="number" name="basePrice" onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold mb-2 dark:text-white">وقت البدء</label>
                                <input type="datetime-local" name="startTime" onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" required />
                            </div>
                            <div>
                                <label className="block font-bold mb-2 dark:text-white">وقت الانتهاء</label>
                                <input type="datetime-local" name="endTime" onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" required />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold mb-2 dark:text-white">رفع فيديو (اختياري)</label>
                            <input type="file" name="video" onChange={handleFileChange} accept="video/*" className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-green-500 text-white font-black py-4 rounded-xl shadow-lg hover:bg-green-600 transition">
                            {loading ? 'جاري الإنشاء...' : 'إنشاء المزاد'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateAuction;
