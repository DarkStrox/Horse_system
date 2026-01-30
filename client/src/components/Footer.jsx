import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="pt-24 pb-12 bg-white dark:bg-gray-950 px-16 transition-colors duration-300 border-t border-gray-100 dark:border-gray-900">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 border-b border-gray-100 dark:border-gray-900 pb-16">
                <div className="space-y-6">
                    <div className="flex items-center space-x-reverse space-x-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-black text-xl text-gray-800 dark:text-white">نظام الخيل العربية</span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-500 text-base leading-relaxed">
                        المنصة الشاملة لإدارة وتجارة والاحتفاء بأعرق سلالات الخيل في العالم. نوفر لك الأدوات والبيئة للازدهار.
                    </p>
                </div>

                <div>
                    <h5 className="font-black text-gray-800 dark:text-white text-lg mb-8 underline decoration-green-500">روابط سريعة</h5>
                    <ul className="space-y-4 text-gray-400 dark:text-gray-500 font-medium">
                        <li><Link to="/about" className="hover:text-green-500 transition">عن المنصة</Link></li>
                        <li><Link to="/auctions" className="hover:text-green-500 transition">المزادات</Link></li>
                        <li><Link to="/news" className="hover:text-green-500 transition">الأخبار</Link></li>
                        <li><Link to="/contact" className="hover:text-green-500 transition">اتصل بنا</Link></li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-black text-gray-800 dark:text-white text-lg mb-8 underline decoration-green-500">الدعم</h5>
                    <ul className="space-y-4 text-gray-400 dark:text-gray-500 font-medium">
                        <li
                            className="hover:text-green-500 transition cursor-pointer"
                            onClick={() => alert('تواصل معنا عبر الهاتف: 01030469659 \nأو البريد الإلكتروني: mohamed200031921@gmail.com')}
                        >
                            مركز المساعدة
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto mt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 dark:text-gray-600 text-sm font-medium">
                <p>نظام الخيل العربية المتكامل، جميع الحقوق محفوظة.</p>
                <div className="flex space-x-reverse space-x-6 mt-6 md:mt-0 text-lg">
                    <a href="#" className="hover:text-green-500 transition"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="hover:text-green-500 transition"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="hover:text-green-500 transition"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
