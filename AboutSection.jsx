import React from "react";

const AboutSection = () => {
    return (
        <>
            {/* ABOUT HERO */}
            <section id="about" className="container mx-auto px-16 py-20 flex flex-col lg:flex-row items-center justify-between gap-16">

                <div className="w-full lg:w-1/2 space-y-8">
                    <span className="bg-[#E9F9E5] text-[#48B02C] px-4 py-1.5 rounded-full text-xs font-black tracking-wider">
                        عن المنصة
                    </span>

                    <h2 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1]">
                        إرث الخيل العربية
                        <br />
                        <span className="text-[#76E05B]">
                            بمنظور رقمي متجدد
                        </span>
                    </h2>

                    <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed max-w-xl">
                        نحن أول منصة عربية متكاملة تهدف إلى رقمنة تاريخ وسلالات الخيل العربية
                        الأصيلة، وتوفير بيئة موثوقة للمربين والهواة لتوثيق، تداول،
                        والاحتفاء بهذا الإرث العظيم.
                    </p>

                    <button className="flex items-center space-x-reverse space-x-4 text-gray-600 dark:text-gray-300 font-bold hover:text-green-500 transition group bg-gray-50 dark:bg-gray-900/50 px-8 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:border-green-500 transition bg-white dark:bg-gray-800">
                            <i className="fas fa-play text-xs"></i>
                        </div>
                        <span className="text-lg">
                            شاهد الفيديو التعريفي
                        </span>
                    </button>
                </div>

                <div className="w-full lg:w-1/2 relative">
                    <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900">
                        <img
                            src="/about/hero.png"
                            alt="Arabian Horse"
                            className="w-full h-[600px] object-cover"
                        />
                    </div>

                    {/* التعديل تم هنا: جعلنا bottom-8 و right-8 بدلاً من السالب، وأضفنا z-30 */}
                    {/* Floating Card */}
                    <div className="absolute bottom-8 right-8 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 dark:border-gray-700 flex items-center space-x-reverse space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-inner">
                            <i className="fas fa-check-circle text-lg"></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">
                                موثوقية البيانات
                            </p>
                            <p className="text-base font-black text-gray-900 dark:text-white">
                                سجلات معتمدة 100%
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* STATS SECTION */}
            <section className="py-20 bg-gray-50/50 dark:bg-gray-900/20">
                <div className="container mx-auto px-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'خيل مسجل', value: '5,000' },
                            { label: 'مرابط', value: '1,200' },
                            { label: 'مزاد ناجح', value: '350' },
                            { label: 'دعم فني', value: '24/7' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2">
                                <h3 className="text-5xl font-black text-gray-900 dark:text-white">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-400 font-bold">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutSection;