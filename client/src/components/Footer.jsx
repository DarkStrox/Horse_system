import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="pt-24 pb-12 bg-white dark:bg-gray-950 px-16 transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 border-b border-gray-100 dark:border-gray-900 pb-16">

                {/* العمود الأول: الشعار والوصف */}
                <div className="space-y-6">
                    <div className="flex items-center space-x-reverse space-x-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-xl text-gray-800 dark:text-white">نظام الخيل العربية</span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-base leading-relaxed">
                        المنصة الشاملة لإدارة وتجارة والاحتفاء بأعرق سلالات الخيل في العالم. نوفر لك الأدوات والبيئة للازدهار.
                    </p>
                </div>

                {/* العمود الثاني: الروابط السريعة (تم التعديل هنا) */}
                <div>
                    <h5 className="font-black text-gray-800 dark:text-white text-lg mb-8 underline decoration-[#76E05B]">روابط سريعة</h5>
                    <ul className="space-y-4 text-gray-400 dark:text-gray-500 font-medium">
                        <li><Link to="/" className="hover:text-[#76E05B] transition">الرئيسية</Link></li>
                        <li><Link to="/horses" className="hover:text-[#76E05B] transition">ملفات الخيل</Link></li>
                        <li><Link to="/studs" className="hover:text-[#76E05B] transition">المرابط</Link></li>
                        <li><Link to="/auctions" className="hover:text-[#76E05B] transition">المزادات</Link></li>
                        <li><Link to="/news" className="hover:text-[#76E05B] transition">الأخبار</Link></li>
                    </ul>
                </div>

                {/* العمود الثالث: الدعم الفني والتواصل */}
                <div>
                    <h5 className="font-black text-gray-800 dark:text-white text-lg mb-8 underline decoration-[#76E05B]">الدعم</h5>
                    <ul className="space-y-5 text-gray-400 dark:text-gray-500 font-medium">
                        <li className="hover:text-[#76E05B] transition cursor-pointer">
                            مركز المساعدة
                        </li>

                        {/* الخط الساخن */}
                        <li className="flex flex-col gap-1.5 mt-2">
                            <div className="flex items-center text-sm">
                                <i className="fas fa-phone-alt text-[#76E05B] ml-2"></i>
                                <span>الخط الساخن:</span>
                            </div>
                            <a href="tel:01030469659" className="text-gray-800 dark:text-gray-300 font-bold hover:text-[#76E05B] transition w-fit" dir="ltr">
                                01030469659
                            </a>
                        </li>

                        {/* البريد الإلكتروني */}
                        <li className="flex flex-col gap-1.5 mt-2">
                            <div className="flex items-center text-sm">
                                <i className="fas fa-envelope text-[#76E05B] ml-2"></i>
                                <span>البريد الإلكتروني:</span>
                            </div>
                            <a href="mailto:mohamed200031921@gmail.com" className="text-gray-800 dark:text-gray-300 font-bold hover:text-[#76E05B] transition w-fit truncate" dir="ltr">
                                mohamed200031921@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* الجزء السفلي من الفوتر */}
            <div className="container mx-auto mt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-600 text-sm font-medium">
                <p>نظام الخيل العربية المتكامل، جميع الحقوق محفوظة.</p>
                <div className="flex space-x-reverse space-x-6 mt-6 md:mt-0 text-lg">
                    <a href="#" className="hover:text-[#76E05B] transition"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="hover:text-[#76E05B] transition"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="hover:text-[#76E05B] transition"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;