import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// الداتا المحدثة
const mockEventsData = {
  1: {
    title: "مزاد إيجي هورسياس الماسي",
    startDate: "2025-10-12",
    endDate: "2025-10-13",
    time: "4:00 PM - 10:00 PM",
    location: "Rababa Stud, Abu El Numrus, Giza",
    email: "info@thestud.net",
    phone: "0110000000",
    imageUrl: "/events/auction1.jpg",
    description: "مزاد كبير لبيع أفضل الخيول العربية الأصيلة.",
    results:[
      { name: "كحيل بسيوني", closingPrice: 95000, openingPrice: 90000, buyer: "عزوز عبد القادر", sold: true, birthDate: "2024-10-02", colour: "أسود", father: "عنتر بسيوني", mother: "غيداء زينة", gender: "ذكر" },
      { name: "وود اليهجة", closingPrice: 20000, openingPrice: 29000, buyer: "مصطفى فهمي", sold: true, birthDate: "2023-05-15", colour: "أشقر", father: "بحر الريان", mother: "نجمة الصباح", gender: "أنثى" },
    ],
  },
  2: {
    title: "بطولة المراسم رباب",
    startDate: "2025-10-09",
    endDate: "2025-10-10",
    time: "5:00 PM - 9:00 PM",
    location: "مربط رباب - الجيزة",
    email: "rababa@gmail.com",
    phone: "0100000000",
    imageUrl: "/events/championship1.jpg",
    description: "بطولة خاصة بعرض أجمل الخيول العربية برعاية دولية.",
    results:[
      { name: "صقر الجيزة", closingPrice: 150000, openingPrice: 120000, buyer: "مربط الصقر", sold: true, birthDate: "2023-01-01", colour: "أشقر", father: "مروان الشقب", mother: "عالية", gender: "ذكر" },
      { name: "لؤلؤة المراسم", closingPrice: 0, openingPrice: 80000, buyer: null, sold: false, birthDate: "2022-05-12", colour: "رمادي", father: "فارس", mother: "نجمة", gender: "أنثى" },
    ],
  },
  3: {
    title: "North Coast Championship",
    startDate: "2025-07-10",
    endDate: "2025-07-12",
    time: "6:00 PM - 12:00 AM",
    location: "North Coast - Sidi Abdel Rahman",
    email: "northcoast@horses.com",
    phone: "0120000000",
    imageUrl: "/events/northcoast.jpg",
    description: "البطولة الصيفية السنوية لجمال الخيل العربية في الساحل الشمالي.",
    results:[
      { name: "نسيم البحر", closingPrice: 200000, openingPrice: 150000, buyer: "أحمد علي", sold: true, birthDate: "2021-06-20", colour: "أبيض", father: "بحر", mother: "موج", gender: "ذكر" },
    ],
  },
};

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [selectedHorse, setSelectedHorse] = useState(null);

  const auction = mockEventsData[id];

  if (!auction) {
    return (
      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen flex items-center justify-center text-right" dir="rtl">
        <h1 className="text-2xl font-bold dark:text-white">عفواً، المزاد غير موجود</h1>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUpHeavy { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalBounce { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-heavy { animation: fadeUpHeavy 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-modal { animation: modalBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
      `}</style>

      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right transition-colors duration-300" dir="rtl">
        <Navbar />

        {/* هيدر المزاد بنفس ستايل التدرج في Studs */}
        <div className="relative h-[350px] flex items-center justify-center bg-cover bg-center animate-fade-heavy" style={{ backgroundImage: `url(${auction.imageUrl})` }}>
          <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-[2px]"></div>
          <div className="relative z-10 text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-black mb-6">{auction.title}</h1>
            <div className="flex gap-4 justify-center flex-wrap">
              <span className="bg-emerald-600/80 px-4 py-2 rounded-full text-sm font-bold border border-emerald-500">بداية: {auction.startDate}</span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">نهاية: {auction.endDate}</span>
            </div>
          </div>
        </div>

        {/* التابز */}
        <section className="container mx-auto px-4 md:px-16 py-12">
          <div className="flex justify-center gap-4 md:gap-12 border-b border-gray-200 dark:border-gray-800 mb-12">
            {["info", "live", "results"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-6 font-black text-lg transition-all ${
                  activeTab === tab ? "text-emerald-700 border-b-4 border-emerald-700 dark:text-emerald-400 dark:border-emerald-400" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                }`}
              >
                {tab === "info" ? "معلومات" : tab === "live" ? "مباشر" : "النتائج"}
              </button>
            ))}
          </div>

          <div className="animate-fade-heavy">
            {activeTab === "info" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-2">
                    <i className="fas fa-info-circle text-emerald-600"></i> تفاصيل التواصل
                  </h2>
                  <div className="space-y-6 text-gray-600 dark:text-gray-300 font-bold">
                    <p className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">📧</span> {auction.email}</p>
                    <p className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">📞</span> {auction.phone}</p>
                    <p className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">📍</span> {auction.location}</p>
                    <p className="flex items-center gap-3"><span className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">⏰</span> {auction.time}</p>
                  </div>
                </div>
                <div className="bg-emerald-900 text-white rounded-[2rem] p-10 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
                  <h2 className="text-2xl font-black mb-6 relative z-10">وصف المزاد</h2>
                  <p className="leading-relaxed text-lg relative z-10 opacity-90">{auction.description}</p>
                </div>
              </div>
            )}

            {activeTab === "live" && (
              <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="w-4 h-4 bg-emerald-600 rounded-full animate-ping"></span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-black text-xl">سيتم تفعيل البث المباشر فور انطلاق المزاد</p>
              </div>
            )}

            {/* --- كروت الخيل المحدثة بألوان Studs --- */}
            {activeTab === "results" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {auction.results.length > 0 ? (
                  auction.results.map((item, index) => (
                    <div 
                      key={index} 
                      className="animate-fade-in-up opacity-0 h-full"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(26,71,49,0.12)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden flex flex-col relative group transform hover:-translate-y-2 h-full">
                        
                        <div className="relative h-60 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                            <img 
                                src={item.imageUrl || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500'} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className={`absolute top-4 left-4 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm ${item.sold ? 'bg-red-500/90 border border-red-400 text-white' : 'bg-emerald-600/90 border border-emerald-500 text-white'}`}>
                                <div className={`w-2 h-2 rounded-full ${item.sold ? 'bg-white' : 'bg-white animate-pulse'}`}></div>
                                <span className="text-xs font-bold">{item.sold ? 'تم البيع SOLD' : 'متاح'}</span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow relative">
                            <div className="text-center mb-5 pb-5 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="font-black text-2xl text-gray-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                                {(item.father || item.mother) && (
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/40 inline-block px-4 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                                        {item.father || 'غير محدد'} × {item.mother || 'غير محدد'}
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-3 mb-6 text-sm flex-grow">
                                {item.colour && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-500 dark:text-gray-400">اللون:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.colour}</span>
                                    </div>
                                )}
                                {item.gender && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-500 dark:text-gray-400">الجنس:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{item.gender}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-500 dark:text-gray-400">الافتتاح:</span>
                                    <span className="font-black text-gray-900 dark:text-white">{item.openingPrice?.toLocaleString()} ج.م</span>
                                </div>
                                {item.closingPrice > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-500 dark:text-gray-400">الإغلاق:</span>
                                        <span className="font-black text-emerald-600 dark:text-emerald-400">{item.closingPrice?.toLocaleString()} ج.م</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-2">
                                <button 
                                    onClick={() => setSelectedHorse(item)}
                                    className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_15px_rgba(6,78,59,0.3)] hover:shadow-[0_8px_25px_rgba(6,78,59,0.4)] group-hover:-translate-y-1"
                                >
                                    <span>عرض التفاصيل</span>
                                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                </button>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-12 font-bold col-span-full">لا توجد نتائج متاحة حالياً.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* --- نافذة التفاصيل (المودال) بألوان Studs --- */}
        {selectedHorse && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 max-w-lg w-full relative animate-modal border border-white/20 dark:border-gray-700">
              <button onClick={() => setSelectedHorse(null)} className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
              
              <h2 className="text-3xl font-black mb-8 text-center text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
                {selectedHorse.name}
              </h2>
              
              <div className="space-y-4">
                {[
                  { l: "تاريخ الميلاد", v: selectedHorse.birthDate }, 
                  { l: "اللون", v: selectedHorse.colour }, 
                  { l: "الأب", v: selectedHorse.father }, 
                  { l: "الأم", v: selectedHorse.mother }, 
                  { l: "الجنس", v: selectedHorse.gender }, 
                  { l: "المشتري", v: selectedHorse.buyer }
                ].map((info, i) => (
                  info.v && (
                    <div key={i} className="flex justify-between border-b border-dashed border-gray-100 dark:border-gray-700 pb-3">
                      <span className="text-gray-500 dark:text-gray-400 font-bold">{info.l}:</span>
                      <span className="font-black text-emerald-700 dark:text-emerald-400">{info.v}</span>
                    </div>
                  )
                ))}
              </div>

              <button 
                onClick={() => setSelectedHorse(null)}
                className="w-full mt-8 bg-gray-900 dark:bg-emerald-800 text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default AuctionDetails;