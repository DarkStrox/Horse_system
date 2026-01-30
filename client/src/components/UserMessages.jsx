import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const UserMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        fetchMessages(token);
    }, []);

    const fetchMessages = (token) => {
        axios.get(`${API_BASE_URL}/api/message/my-messages`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching messages:", err);
                setLoading(false);
            });
    };

    const markAsRead = async (id, isRead) => {
        if (isRead) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/message/mark-read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI locally
            setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl font-bold text-gray-400">جاري التحميل...</p></div>;

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />
            <main className="container mx-auto px-4 md:px-16 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">الرسائل الواردة</h1>

                    {messages.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <i className="far fa-envelope-open text-6xl text-gray-200 dark:text-gray-700 mb-6 block"></i>
                            <p className="text-gray-400 font-bold text-lg">لا توجد رسائل حالياً</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => markAsRead(msg.id, msg.isRead)}
                                    className={`bg-white dark:bg-gray-900 p-6 rounded-3xl border transition cursor-pointer group hover:shadow-md ${!msg.isRead ? 'border-green-500 shadow-sm' : 'border-gray-100 dark:border-gray-800 opacity-90'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!msg.isRead ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 dark:bg-gray-800'}`}>
                                            <i className={`fas ${msg.type === 'Sent' ? 'fa-paper-plane' : 'fa-inbox'} text-lg`}></i>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {msg.type === 'Sent' ? `إلى: ${msg.receiverName}` : `من: ${msg.senderName}`}
                                                </h3>
                                                <span className="text-xs text-gray-400 font-medium ltr">
                                                    {new Date(msg.timestamp).toLocaleString('ar-EG')}
                                                </span>
                                            </div>
                                            <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">{msg.subject}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{msg.content}</p>
                                        </div>
                                        {!msg.isRead && (
                                            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserMessages;
