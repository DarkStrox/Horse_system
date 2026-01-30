import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ClassifyHorse = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [classifying, setClassifying] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleClassify = () => {
        if (!selectedImage) return;
        setClassifying(true);
        // Simulate API call for now
        setTimeout(() => {
            setResult({
                type: 'خيول عربية أصيلة',
                confidence: 98.5,
                details: 'يتميز هذا الخيل بخصائص السلالة العربية الأصيلة، بما في ذلك ...'
            });
            setClassifying(false);
        }, 2000);
    };

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-16 py-20 min-h-[80vh] flex flex-col items-center">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black">Beta AI</span>
                    <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-tight">
                        تحديد نوع الحصان <span className="text-green-500">بالذكاء الاصطناعي</span>
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 text-xl leading-relaxed">
                        قم برفع صورة للحصان وسيقوم نظامنا الذكي بتحليلها وتحديد السلالة بدقة عالية.
                    </p>
                </div>

                <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800">
                    <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] p-10 text-center relative hover:border-green-300 dark:hover:border-green-900 transition-colors group cursor-pointer"
                        onClick={() => document.getElementById('horse-image-upload').click()}
                    >
                        <input
                            type="file"
                            id="horse-image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {previewUrl ? (
                            <div className="relative">
                                <img src={previewUrl} alt="Preview" className="max-h-80 mx-auto rounded-2xl shadow-lg" />
                                <button
                                    className="absolute -top-4 -right-4 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(null);
                                        setPreviewUrl(null);
                                        setResult(null);
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 py-10">
                                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl group-hover:scale-110 transition duration-300">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-gray-800 dark:text-gray-200">اضغط لرفع صورة</h3>
                                    <p className="text-gray-400 text-sm font-bold">JGP, PNG, WEBP (Max 5MB)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            className={`w-full py-4 rounded-2xl font-black text-lg transition shadow-xl ${!selectedImage
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#76E05B] text-white hover:bg-green-500 shadow-green-100 dark:shadow-green-900/20'
                                }`}
                            disabled={!selectedImage || classifying}
                            onClick={handleClassify}
                        >
                            {classifying ? (
                                <span className="flex items-center justify-center space-x-reverse space-x-3">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>جاري التحليل...</span>
                                </span>
                            ) : 'ابدأ التحليل'}
                        </button>
                    </div>

                    {result && (
                        <div className="mt-10 bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-start space-x-reverse space-x-6">
                                <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0">
                                    <i className="fas fa-horse-head"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-600 mb-1">النتيجة ({result.confidence}%)</p>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">{result.type}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        {result.details}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ClassifyHorse;
