import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { auctionApi } from "../api/api";

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const res = await auctionApi.getAuction(id);
      setAuction(res.data);
    } catch (err) {
      console.error("Error fetching auction details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || isNaN(bidAmount)) return;

    if (parseFloat(bidAmount) <= (auction.currentBid || auction.basePrice)) {
       alert("يجب أن يكون المزايدة أعلى من السعر الحالي");
       return;
    }

    try {
      setIsSubmittingBid(true);
      await auctionApi.placeBid(id, parseFloat(bidAmount));
      alert("تم تقديم المزايدة بنجاح!");
      setBidAmount("");
      fetchAuctionDetails(); // Refresh data
    } catch (err) {
      console.error("Error placing bid:", err);
      alert(err.response?.data?.message || "حدث خطأ أثناء تقديم المزايدة");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen flex items-center justify-center text-right font-sans" dir="rtl">
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin"></div>
           <p className="text-xl font-bold text-emerald-900 dark:text-emerald-400">جاري تحميل تفاصيل المزاد...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen flex items-center justify-center text-right font-sans" dir="rtl">
        <h1 className="text-2xl font-bold dark:text-white">عفواً، المزاد غير موجود</h1>
      </div>
    );
  }

  const auctionImage = auction.horseImage || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=1200';

  return (
    <>
      <style>{`
        @keyframes fadeUpHeavy { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-heavy { animation: fadeUpHeavy 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right transition-colors duration-300 font-sans" dir="rtl">
        <Navbar />

        <div className="relative h-[450px] flex items-center justify-center bg-cover bg-center animate-fade-heavy" style={{ backgroundImage: `url(${auctionImage})` }}>
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[2px]"></div>
          <div className="relative z-10 text-white text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">{auction.name}</h1>
            <div className="flex gap-4 justify-center flex-wrap">
              <span className="bg-emerald-600 px-6 py-2 rounded-xl text-sm font-black border border-emerald-500 shadow-lg shadow-emerald-900/40">الحالة: {auction.status}</span>
              <span className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-xl text-sm font-black border border-white/20">السعر الحالي: {auction.currentBid?.toLocaleString() || auction.basePrice?.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>

        <section className="container mx-auto px-4 md:px-16 py-12">
          <div className="flex justify-center gap-4 md:gap-12 border-b border-gray-200 dark:border-gray-800 mb-12">
            {["info", "bids"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-8 font-black text-xl transition-all relative ${activeTab === tab ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
              >
                {tab === "info" ? "معلومات المزاد" : "سجل المزايدات"}
                {activeTab === tab && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-emerald-700 dark:bg-emerald-400 rounded-full"></div>}
              </button>
            ))}
          </div>

          <div className="animate-fade-heavy">
            {activeTab === "info" && (
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3 underline decoration-emerald-500 decoration-4 underline-offset-8">
                       تفاصيل الحصان
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">الاسم</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{auction.horseName}</p>
                       </div>
                       <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">السلالة</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{auction.horseBreed}</p>
                       </div>
                       <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">تاريخ البدء</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{new Date(auction.startTime).toLocaleDateString('ar-EG')}</p>
                       </div>
                       <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1 uppercase">تاريخ الانتهاء</p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">{new Date(auction.endTime).toLocaleDateString('ar-EG')}</p>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border border-emerald-100 dark:border-emerald-800 shadow-xl shadow-emerald-900/5">
                    <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">وصف المزاد</h2>
                    <p className="leading-relaxed text-lg text-gray-600 dark:text-gray-300 font-medium">{auction.description}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-10 border-2 border-emerald-700 shadow-2xl sticky top-28">
                   <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white text-center">قدّم عرضك الآن</h2>
                   <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl mb-8 border border-emerald-100 dark:border-emerald-800 text-center">
                      <p className="text-emerald-900 dark:text-emerald-200 font-bold mb-2">السعر الحالي</p>
                      <p className="text-4xl font-black text-emerald-700 dark:text-emerald-400">{(auction.currentBid || auction.basePrice).toLocaleString()} ج.م</p>
                   </div>

                   <form onSubmit={handleBidSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">مبلغ المزايدة</label>
                        <div className="relative">
                           <input 
                              type="number" 
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder="أدخل مبلغاً أعلى من السعر الحالي"
                              className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-6 py-4 outline-none transition-all font-black text-xl text-center pr-16"
                              required
                           />
                           <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-400">ج.م</span>
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmittingBid || auction.status !== 'Live'}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-emerald-900/20 transition-all hover:-translate-y-1"
                      >
                        {isSubmittingBid ? 'جاري الإرسال...' : auction.status === 'Live' ? 'تأكيد المزايدة' : 'المزاد غير متاح حالياً'}
                      </button>
                      <p className="text-center text-xs text-gray-400 font-bold mt-4">بالموافقة، أنت تلتزم بدفع المبلغ في حال فوزك بالمزاد</p>
                   </form>
                </div>
              </div>
            )}

            {activeTab === "bids" && (
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-black mb-10 text-gray-900 dark:text-white flex items-center justify-between">
                   سجل المزايدات
                   <span className="text-base font-bold text-gray-400">{auction.bids?.length || 0} مزايدة</span>
                </h2>
                
                <div className="space-y-6">
                   {auction.bids && auction.bids.length > 0 ? (
                     auction.bids.map((bid, i) => (
                       <div key={bid.bidId} className={`flex items-center justify-between p-6 rounded-3xl border ${i === 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-gray-50 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700'}`}>
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${i === 0 ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {i + 1}
                             </div>
                             <div>
                                <p className="font-black text-gray-900 dark:text-white text-lg">{bid.userName}</p>
                                <p className="text-xs text-gray-500 font-bold uppercase">{new Date(bid.bidTime).toLocaleString('ar-EG')}</p>
                             </div>
                          </div>
                          <div className="text-left">
                             <p className={`text-2xl font-black ${i === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>{bid.amount.toLocaleString()} ج.م</p>
                             {i === 0 && <span className="text-[10px] bg-emerald-700 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest mt-1 inline-block">الأعلى حالياً</span>}
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="text-center py-20 text-gray-400">
                        <i className="fas fa-gavel text-6xl mb-6 opacity-20"></i>
                        <p className="text-xl font-bold">لا توجد مزايدات على هذا الحصان بعد.</p>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AuctionDetails;