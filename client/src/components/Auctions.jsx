import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { auctionApi } from '../api/api';

const Auctions = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const res = await auctionApi.getAuctions();
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUpCustom {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .reveal-item { 
          animation: fadeInUpCustom 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .bg-pattern { background-image: url('https://www.transparenttextures.com/patterns/arabesque.png'); }
      `}</style>

      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right font-sans transition-colors duration-500 relative overflow-x-hidden" dir="rtl">
        <div className="absolute inset-0 bg-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none"></div>

        <Navbar />

        <section className="relative z-10 container mx-auto px-4 lg:px-16 pt-28 pb-12 text-center reveal-item delay-100">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 relative inline-block">
              المزادات والفعاليات
              <span className="absolute -bottom-3 right-0 w-1/2 h-1.5 bg-emerald-700 rounded-full"></span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-6 font-bold text-lg">تابعي أحدث فعاليات ومزادات الخيل العربية الأصيلة</p>
          </div>
        </section>

        <section className="relative z-10 container mx-auto px-4 lg:px-16 pb-24 reveal-item delay-200">
          <div className="max-w-5xl mx-auto space-y-8">
            {loading ? (
              <p className="text-center text-gray-500 font-bold text-xl py-10">جاري تحميل المزادات...</p>
            ) : events.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <i className="fas fa-calendar-times text-6xl text-gray-200 mb-6"></i>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-xl">لا توجد مزادات حالياً.</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.auctionId}
                  className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 min-w-[112px] bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] flex flex-col items-center justify-center border-2 border-emerald-100 dark:border-emerald-800 transition-transform group-hover:scale-105">
                    <span className="text-3xl md:text-4xl font-black text-emerald-700 dark:text-emerald-400 leading-none">
                      {new Date(event.startTime).getDate() || '-'}
                    </span>
                    <span className="text-sm md:text-base font-black text-emerald-900 dark:text-emerald-200 mt-1 uppercase">
                      {event.startTime ? new Date(event.startTime).toLocaleString('ar-EG', { month: 'short' }) : 'غير محدد'}
                    </span>
                  </div>

                  <div className="flex-1 text-center md:text-right w-full">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{event.name}</h3>
                    <div className="mt-4 space-y-2">
                       <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>{event.locationName || 'غير محدد'}</span>
                       </div>
                       <p className="text-gray-500 dark:text-gray-400 font-medium">
                          المشارك: <span className="text-gray-900 dark:text-white font-bold">{event.horseName}</span> ({event.horseBreed})
                       </p>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700">
                             <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">السعر الحالي</p>
                             <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{event.currentBid?.toLocaleString() || 0} ج.م</p>
                          </div>
                          <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${event.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {event.status === 'Live' ? 'مباشر الآن' : event.status}
                          </span>
                       </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <Link
                      to={`/auction/${event.auctionId}`}
                      className="flex items-center justify-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-900/20 transition-all duration-300 hover:-translate-x-2"
                    >
                      <span>عرض التفاصيل</span>
                      <i className="fas fa-chevron-left text-sm"></i>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <Footer />

        {localStorage.getItem('userRole') === 'Admin' && (
          <div className="fixed bottom-10 left-10 z-40 flex flex-col-reverse items-center gap-4">
            <button
              onClick={() => setIsFabOpen(!isFabOpen)}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 ${isFabOpen ? 'bg-gray-800 rotate-45 shadow-gray-900/40' : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20'}`}
            >
              <i className="fas fa-plus text-2xl text-white"></i>
            </button>
  
            <div className={`flex flex-col gap-4 transition-all duration-500 absolute bottom-24 ${isFabOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-75 pointer-events-none'}`}>
              <Link 
                to="/auction/create" 
                className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-1 group relative"
                title="إنشاء مزاد"
              >
                <i className="fas fa-gavel text-xl"></i>
                <span className="absolute right-16 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm pointer-events-none">إنشاء مزاد جديد</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Auctions;