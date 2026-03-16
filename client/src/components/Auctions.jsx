import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const initialEvents =[
  { eventId: 1, title: 'مزاد إيجي هورسياس الماسي', startDate: '2025-10-12', location: 'القاهرة - مصر', description: 'مزاد لبيع الخيول العربية الأصيلة ونخبة من الأبطال.' },
  { eventId: 2, title: 'بطولة المراسم رباب', startDate: '2025-10-09', location: 'الجيزة - سقارة', description: 'بطولة دولية لجمال الخيول العربية برعاية مزرعة رباب.' },
  { eventId: 3, title: 'North Coast Championship', startDate: '2025-07-10', location: 'الساحل الشمالي', description: 'Arabian Horses Championship at the heart of North Coast.' }
];

const Auctions = () => {
  const [events, setEvents] = useState(initialEvents);
  const[isFabOpen, setIsFabOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(''); 
  const[selectedEventId, setSelectedEventId] = useState(''); 

  const [formData, setFormData] = useState({
    title: '', startDate: '', location: '', description: ''
  });

  const openActionModal = (mode) => {
    setModalMode(mode);
    setIsFabOpen(false);
    setSelectedEventId('');
    setFormData({ title: '', startDate: '', location: '', description: '' });
    setIsModalOpen(true);
  };

  const handleSelectChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedEventId(id);
    if (id) {
      const selectedEvent = events.find(ev => ev.eventId === id);
      if (selectedEvent) {
        setFormData({
          title: selectedEvent.title,
          startDate: selectedEvent.startDate,
          location: selectedEvent.location,
          description: selectedEvent.description
        });
      }
    } else {
      setFormData({ title: '', startDate: '', location: '', description: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData,[name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (modalMode === 'add') {
      const newAuction = {
        eventId: Date.now(), 
        title: formData.title,
        startDate: formData.startDate,
        location: formData.location,
        description: formData.description
      };
      setEvents([newAuction, ...events]);
    } else if (modalMode === 'edit') {
      setEvents(events.map(event => 
        event.eventId === selectedEventId ? { ...event, ...formData } : event
      ));
    }
    setIsModalOpen(false);
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

      {/* نفس خلفية HorseList: كريمي في اللايت و gray-900 في الدارك */}
      <div className="bg-[#FAF9F6] dark:bg-gray-900 min-h-screen text-right font-sans transition-colors duration-500 relative overflow-x-hidden" dir="rtl">
        <div className="absolute inset-0 bg-pattern opacity-[0.02] dark:opacity-[0.05] pointer-events-none"></div>

        <Navbar />

        {/* الهيدر بنفس أسلوب الأقسام في HorseList */}
        <section className="relative z-10 container mx-auto px-4 lg:px-16 pt-28 pb-12 text-center reveal-item delay-100">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 relative inline-block">
              المزادات والفعاليات
              <span className="absolute -bottom-3 right-0 w-1/2 h-1.5 bg-emerald-700 rounded-full"></span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-6 font-bold text-lg">تابعي أحدث فعاليات ومزادات الخيل العربية الأصيلة</p>
          </div>
        </section>

        {/* قائمة المزادات بنفس أسلوب تصميم كروت HorseList */}
        <section className="relative z-10 container mx-auto px-4 lg:px-16 pb-24 reveal-item delay-200">
          <div className="max-w-5xl mx-auto space-y-8">
            {events.length === 0 ? (
              <p className="text-center text-gray-500 font-bold text-xl py-10">لا توجد مزادات حالياً.</p>
            ) : (
              events.map((event, index) => (
                <div 
                  key={event.eventId} 
                  className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* صندوق التاريخ - ألوان Emerald ثابتة */}
                  <div className="w-28 h-28 md:w-32 md:h-32 min-w-[112px] bg-emerald-50 dark:bg-emerald-900/30 rounded-[2rem] flex flex-col items-center justify-center border-2 border-emerald-100 dark:border-emerald-800 transition-transform group-hover:scale-105">
                    <span className="text-3xl md:text-4xl font-black text-emerald-700 dark:text-emerald-400 leading-none">
                      {new Date(event.startDate).getDate() || '-'}
                    </span>
                    <span className="text-sm md:text-base font-black text-emerald-900 dark:text-emerald-200 mt-1 uppercase">
                      {event.startDate ? new Date(event.startDate).toLocaleString('ar-EG', { month: 'short' }) : 'غير محدد'}
                    </span>
                  </div>

                  <div className="flex-1 text-center md:text-right w-full">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-emerald-700 transition-colors">{event.title}</h3>
                    <div className="mt-3">
                      <p className="text-emerald-800 dark:text-emerald-400 font-bold mb-1">📍 {event.location || 'غير محدد'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">{event.description || 'لا يوجد وصف'}</p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    <Link
                      to={`/auction/${event.eventId}`}
                      className="flex items-center justify-center gap-3 bg-emerald-800 hover:bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-900/20 transition-all duration-300 hover:-translate-x-2"
                    >
                      التفاصيل
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        
        <Footer />

        {/* الزر العائم والقائمة */}
        <div className="fixed bottom-10 left-10 z-40 flex flex-col-reverse items-center gap-4">
          <button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 ${isFabOpen ? 'bg-gray-800 rotate-45' : 'bg-emerald-700 hover:bg-emerald-800'}`}
          >
            <span className="text-4xl text-white font-light mb-1">+</span>
          </button>

          <div className={`flex flex-col gap-3 transition-all duration-300 absolute bottom-20 ${isFabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <button onClick={() => openActionModal('add')} className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"><i className="fas fa-plus"></i></button>
            <button onClick={() => openActionModal('edit')} className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"><i className="fas fa-edit"></i></button>
          </div>
        </div>

        {/* المودال بنفس روح تصميم HorseList */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md transition-opacity">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative reveal-item" dir="rtl">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-gray-400 hover:text-red-500 transition-colors text-2xl font-black">✕</button>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 border-b-2 border-emerald-50 dark:border-gray-800 pb-4">
                {modalMode === 'add' && 'إضافة مزاد جديد'}
                {modalMode === 'edit' && 'تعديل بيانات مزاد'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {modalMode === 'edit' && (
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">اختر المزاد</label>
                    <select value={selectedEventId} onChange={handleSelectChange} required className="w-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-bold transition-all">
                      <option value="" disabled>-- اختر المزاد من هنا --</option>
                      {events.map(ev => <option key={ev.eventId} value={ev.eventId}>{ev.title}</option>)}
                    </select>
                  </div>
                )}
                {(modalMode === 'add' || (modalMode === 'edit' && selectedEventId !== '')) && (
                  <>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">اسم المزاد</label>
                      <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">تاريخ البدء</label>
                      <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">الموقع</label>
                      <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">الوصف</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full bg-[#FAF9F6] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none"></textarea>
                    </div>
                  </>
                )}
                <div className="flex gap-4 mt-8 pt-4">
                  <button type="submit" disabled={modalMode !== 'add' && selectedEventId === ''} className={`flex-1 font-black py-4 rounded-xl transition-all text-white shadow-lg bg-emerald-800 hover:bg-emerald-900 ${(modalMode !== 'add' && selectedEventId === '') ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>
                    {modalMode === 'add' ? 'إضافة المزاد' : 'حفظ التعديلات'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Auctions;