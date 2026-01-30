import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const ContactSeller = () => {
    const { horseId } = useParams();
    const navigate = useNavigate();
    const [horse, setHorse] = useState(null);
    const [user, setUser] = useState(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch User
        axios.get(`${API_BASE_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setUser(res.data)).catch(console.error);

        // Fetch Horse Details
        axios.get(`${API_BASE_URL}/api/horse/${horseId}`)
            .then(res => {
                setHorse(res.data);
                setSubject(`استفسار بخصوص الخيل: ${res.data.name}`);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching horse:", err);
                setLoading(false);
            });
    }, [horseId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const receiverId = horse.owner?.user?.id; // Assuming fetch returns this structure

            // If owner structure is different, we might need to adjust.
            // Based on HorseProfile, owner is fetched. 
            // Warning: The backend API /api/horse/{id} might strictly return Owner Profile but we need User ID.
            // We need to ensure the backend returns Owner's User ID. 
            // If it doesn't, we might need another endpoint or update the GetHorse DTO.
            // Let's assume the backend 'GetHorse' includes Owner.User object. 
            // If not, we might fail here. 
            // For now, let's try.

            if (!receiverId) {
                console.error("Receiver ID missing. Horse Owner Data:", horse.owner);
                alert("تعذر العثور على معرف المالك. يرجى التأكد من أن الخيل مرتبط بمالك مسجل.");
                setSending(false);
                return;
            }

            await axios.post(`${API_BASE_URL}/api/message/send`, {
                receiverId: receiverId,
                horseId: horseId,
                subject,
                content
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("تم إرسال الرسالة بنجاح!");
            navigate(`/horse/${horseId}`);
        } catch (err) {
            console.error("Error sending message:", err);
            const errorMsg = err.response?.data?.message || err.response?.data?.title || "حدث خطأ أثناء إرسال الرسالة.";
            alert(`خطأ: ${errorMsg}`);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><p>جاري التحميل...</p></div>;
    if (!horse) return <div className="min-h-screen flex items-center justify-center"><p>لم يتم العثور على الخيل.</p></div>;

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />
            <main className="container mx-auto px-4 md:px-16 py-12">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl p-10 border border-gray-50 dark:border-gray-800">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">تواصل مع المالك</h1>

                    <div className="flex items-center space-x-reverse space-x-6 mb-10 pb-10 border-b border-gray-100 dark:border-gray-800">
                        <img
                            src={horse.imageUrl || '/horses/profile_main.png'}
                            alt={horse.name}
                            className="w-24 h-24 rounded-2xl object-cover shadow-md"
                        />
                        <div>
                            <p className="text-gray-400 font-bold text-sm mb-1">بخصوص الخيل</p>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{horse.name}</h2>
                            <p className="text-green-500 font-bold text-sm mt-1">{horse.owner?.user?.fullName || "اسم المالك"}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">الموضوع</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-transparent focus:border-green-500 outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">نص الرسالة</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows="6"
                                className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-transparent focus:border-green-500 outline-none transition resize-none"
                                placeholder="اكتب رسالتك وتفاصيل استفسارك هنا..."
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center space-x-reverse space-x-3 ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#76E05B] hover:bg-green-600 text-white shadow-green-100 dark:shadow-green-900/20'}`}
                        >
                            {sending ? (
                                <span>جاري الإرسال...</span>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    <span>إرسال الرسالة</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactSeller;
