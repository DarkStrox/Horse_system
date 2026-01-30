import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const AuctionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);
    const [user, setUser] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setUser(res.data)).catch(console.error);
        }

        fetchAuction();
        const interval = setInterval(fetchAuction, 5000); // Polling every 5s
        return () => clearInterval(interval);
    }, [id]);

    const fetchAuction = () => {
        axios.get(`${API_BASE_URL}/api/auction/${id}`)
            .then(res => {
                setAuction(res.data);
                calculateTimeLeft(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const calculateTimeLeft = (data) => {
        const end = new Date(data.endTime).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance < 0) {
            setTimeLeft("انتهى المزاد");
        } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${hours}س ${minutes}د ${seconds}ث`);
        }
    };

    const handleBid = async () => {
        if (!user) return navigate('/login');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/auction/${id}/bid`, { amount: parseFloat(bidAmount) }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("تم تسجيل زايدتك بنجاح!");
            setBidAmount('');
            fetchAuction();
        } catch (err) {
            alert(err.response?.data || "حدث خطأ أثناء المزايدة");
        }
    };

    const handleInsurancePayment = async () => {
        if (!window.confirm("سيتم خصم 200 جنيه كتأمين لدخول المزاد. هل أنت موافق؟")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/auction/pay-insurance`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("تم دفع التأمين بنجاح! يمكنك الآن المزايدة.");
            // Refresh user profile
            const res = await axios.get('http://localhost:5000/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء الدفع");
        }
    };

    const handleAcceptWinner = async () => {
        if (!window.confirm("هل أنت متأكد من قبول هذا العرض وإنهاء المزاد؟")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/auction/${id}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("تم إنهاء المزاد ونقل الملكية بنجاح.");
            fetchAuction();
        } catch (err) {
            console.error(err);
            alert("حدث خطأ");
        }
    };

    if (loading) return <div className="text-center py-20">جاري التحميل...</div>;
    if (!auction) return <div className="text-center py-20">المزاد غير موجود</div>;

    const isLive = auction.status === 'Live';
    const isOwner = user && (user.id === auction.createdById || user.role === 'Admin');
    const minBid = auction.currentBid + auction.minimumIncrement;

    const getProfilePicUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return API_BASE_URL + url;
    };

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right" dir="rtl">
            <Navbar />
            <main className="container mx-auto px-4 md:px-16 py-10">

                {/* Status Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">{auction.name}</h1>
                    <div className={`px-6 py-2 rounded-xl font-bold flex items-center gap-2 ${isLive ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                        <i className="far fa-clock"></i>
                        <span>{isLive ? `ينتهي خلال: ${timeLeft}` : auction.status}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Media & Horse Info */}
                    <div className="space-y-8">
                        <div className="h-[400px] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
                            {auction.videoUrl ? (
                                <video src={getProfilePicUrl(auction.videoUrl)} controls className="w-full h-full object-cover" />
                            ) : (
                                <img src={getProfilePicUrl(auction.imageUrl || auction.horse.imageUrl) || '/horses/default.png'} className="w-full h-full object-cover" alt={auction.name} />
                            )}
                        </div>

                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-black mb-6 border-b pb-4 dark:border-gray-800">تفاصيل الخيل</h2>
                            <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <p><span className="text-gray-400 ml-2">الاسم:</span> <span className="font-bold dark:text-white">{auction.horse.name}</span></p>
                                <p><span className="text-gray-400 ml-2">السلالة:</span> <span className="font-bold dark:text-white">{auction.horse.breed}</span></p>
                                <p><span className="text-gray-400 ml-2">العمر:</span> <span className="font-bold dark:text-white">{auction.horse.age} سنوات</span></p>
                                <p><span className="text-gray-400 ml-2">الجنس:</span> <span className="font-bold dark:text-white">{auction.horse.gender}</span></p>
                                <p><span className="text-gray-400 ml-2">اللون:</span> <span className="font-bold dark:text-white">{auction.horse.colour?.name || 'غير محدد'}</span></p>
                                <p><span className="text-gray-400 ml-2">الصحة:</span> <span className="font-bold text-green-500">{auction.horse.healthStatus}</span></p>
                            </div>
                            <Link to={`/horse/${auction.horse.microchipId}`} className="block mt-6 text-center text-green-500 font-bold hover:underline">
                                عرض الملف الكامل للخيل
                            </Link>
                        </div>
                    </div>

                    {/* Bidding Section */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-lg border border-green-50 dark:border-gray-800">
                            <div className="text-center mb-8">
                                <p className="text-gray-400 font-bold mb-2">السعر الحالي</p>
                                <p className="text-5xl font-black text-green-500">{auction.currentBid.toLocaleString()} <span className="text-base text-gray-400">ج.م</span></p>
                            </div>

                            {isLive ? (
                                user ? (
                                    user.isVerifiedBidder ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <input
                                                    type="number"
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                    placeholder={`أدخل مبلغ (أعلى من ${minBid})`}
                                                    className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none focus:border-green-500 border border-transparent font-bold text-center"
                                                />
                                                <button onClick={handleBid} className="bg-green-500 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-600 transition">
                                                    تأكيد المزايدة
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 text-center">* الزيادة الأدنى: {auction.minimumIncrement} ج.م</p>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-4 bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
                                            <i className="fas fa-exclamation-triangle text-3xl text-yellow-500"></i>
                                            <p className="font-bold text-gray-800 dark:text-white">يجب دفع مبلغ التأمين للمشاركة في المزاد</p>
                                            <button onClick={handleInsurancePayment} className="bg-yellow-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-yellow-600 transition shadow-lg">
                                                دفع التأمين (200 ج.م)
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center">
                                        <Link to="/login" className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold">سجل دخول للمزايدة</Link>
                                    </div>
                                )
                            ) : (
                                <div className="text-center p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                                    <p className="font-bold text-gray-500">
                                        {auction.status === 'Completed' ? `بيعت للمزايد: ${auction.winnerId}` : 'المزاد مغلق حالياً'}
                                    </p>
                                    {isOwner && auction.status === 'WaitingForSeller' && (
                                        <button onClick={handleAcceptWinner} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">
                                            قبول العرض الأعلى
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bid History */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 max-h-[400px] overflow-y-auto">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                                <i className="fas fa-history text-gray-400"></i>
                                سجل المزايدات اللحظي
                            </h3>
                            <div className="space-y-4">
                                {auction.bids.length === 0 ? (
                                    <p className="text-gray-400 text-center">لا توجد مزايدات حتى الآن. كن الأول!</p>
                                ) : (
                                    auction.bids.map((bid, index) => (
                                        <div key={bid.id} className={`flex justify-between items-center p-4 rounded-2xl ${index === 0 ? 'bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{bid.bidderName}</p>
                                                    <p className="text-[10px] text-gray-400 ltr">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <p className={`font-black ${index === 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {bid.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AuctionDetails;
