import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const API_BASE_URL = 'http://localhost:5000';

const HorseList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('الكل');

    const horses = [
        { id: 'H001', name: 'أسطورة الشحانية', type: 'فحل', breed: 'صقلاوي', color: 'أشقر', birth: 'مارس 2018', img: '/horses/profile_main.png', owner: 'إسطبلات الدوحة الملكية' },
        { id: 'H002', name: 'وردة الصحراء', type: 'فرس', breed: 'صقلاوي جدراني', color: 'رمادي', birth: 'مايو 2019', img: '/auctions/card_1.png', owner: 'مربط العرب' },
        { id: 'H003', name: 'فجر العرب', type: 'فحل', breed: 'كحيلان', color: 'بني', birth: 'ينار 2020', img: '/auctions/card_2.png', owner: 'إسطبلات نجد' },
        { id: 'H004', name: 'أميرة الوادي', type: 'مهرة', breed: 'عبية الشراك', color: 'أبيض', birth: 'فبراير 2022', img: '/auctions/hero.png', owner: 'مربط الريان' },
    ];

    const filteredHorses = horses.filter(h => {
        const matchesSearch = h.name.includes(searchTerm) || h.id.includes(searchTerm);
        const matchesFilter = activeFilter === 'الكل' || h.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-16 py-12">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white">دليل الخيل العربية</h1>
                        <p className="text-gray-400 font-medium">استكشف قاعدة بيانات شاملة لأجمل وأعرق سلالات الخيل.</p>
                    </div>

                    <div className="flex items-center space-x-reverse space-x-3 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        {['الكل', 'فحل', 'فرس', 'مهرة', 'أمهر'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${activeFilter === filter ? 'bg-green-500 text-white shadow-lg shadow-green-100 dark:shadow-green-900/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredHorses.map((horse) => (
                        <Link to={`/horse/${horse.id}`} key={horse.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 group hover:-translate-y-3 transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <img src={horse.img} alt={horse.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute bottom-5 right-5 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <p className="text-xs font-bold">{horse.breed}</p>
                                    <h4 className="text-xl font-black">{horse.name}</h4>
                                </div>
                                <div className="absolute top-5 right-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-lg">
                                    #{horse.id}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-gray-400">النوع:</span>
                                    <span className="text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full">{horse.type}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                                    <span>تاريخ الميلاد:</span>
                                    <span className="text-gray-600 dark:text-gray-300">{horse.birth}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center space-x-reverse space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-[10px]">
                                        <i className="fas fa-landmark"></i>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold truncate flex-1">{horse.owner}</p>
                                    <i className="fas fa-chevron-left text-[10px] text-green-500 group-hover:translate-x-[-4px] transition-transform"></i>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredHorses.length === 0 && (
                    <div className="text-center py-40 animate-in fade-in zoom-in">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-gray-300">
                            <i className="fas fa-search"></i>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">لا توجد نتائج بحث</h3>
                        <p className="text-gray-400 font-bold">جرب البحث بكلمات أخرى أو تغيير الفلاتر.</p>
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
};

export default HorseList;
