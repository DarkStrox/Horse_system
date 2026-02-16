import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const ClassifyHorse = () => {
    const [formData, setFormData] = useState({
        Height_cm: '',
        Weight_kg: '',
        Head_Profile: 'Straight',
        Tail_Carriage: 'Medium',
        Neck_Arch: 'Medium',
        Rib_Count: '18',
        Back_Length: 'Short'
    });
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [classifying, setClassifying] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleClassify = async (e) => {
        e.preventDefault();

        if (isAdvanced && !selectedImage) {
            setError("يرجى رفع صورة للحصان عند تفعيل الوضع المتقدم.");
            return;
        }

        setClassifying(true);
        setError(null);
        setResult(null);

        try {
            let imageData = null;
            if (isAdvanced && selectedImage) {
                imageData = await convertToBase64(selectedImage);
            }

            const payload = {
                ...formData,
                Height_cm: parseFloat(formData.Height_cm),
                Weight_kg: parseFloat(formData.Weight_kg),
                Rib_Count: parseInt(formData.Rib_Count),
                IsAdvanced: isAdvanced,
                ImageData: imageData
            };

            const response = await axios.post('http://localhost:5000/api/ai/predict-breed', payload);
            setResult(response.data);

        } catch (err) {
            console.error("AI Prediction Error:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.details || err.message || "فشل الاتصال بخادم الذكاء الاصطناعي.";
            setError(errorMsg + (err.response?.status ? ` (Code: ${err.response.status})` : ''));
        } finally {
            setClassifying(false);
        }
    };

    return (
        <div className="bg-[#FAFBF9] dark:bg-gray-950 min-h-screen font-sans text-right selection:bg-green-100 transition-colors duration-300" dir="rtl">
            <Navbar />

            <section className="container mx-auto px-4 py-16 flex flex-col items-center">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
                    <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black">Beta AI</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                        تحديد نوع الحصان <span className="text-green-500">بالذكاء الاصطناعي</span>
                    </h1>
                    <p className="text-gray-400 dark:text-gray-500 text-lg md:text-xl leading-relaxed">
                        أدخل الخصائص البدنية للحصان ليقوم نظامنا الذكي بتحليلها وتحديد السلالة بدقة عالية.
                    </p>
                </div>

                <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">

                    {/* Advanced Toggle */}
                    <div className="flex items-center justify-between mb-10 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="space-y-1">
                            <h3 className="font-black text-gray-900 dark:text-white">التحليل المتقدم (Advanced AI)</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تحليل صورة الحصان مع البيانات للحصول على دقة أعلى.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isAdvanced}
                                onChange={(e) => setIsAdvanced(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    <form onSubmit={handleClassify} className="space-y-8">

                        {/* Image Upload Area - Only shows if advanced enabled */}
                        {isAdvanced && (
                            <div className="animate-in fade-in slide-in-from-top-4">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">صورة الحصان *</label>
                                <div
                                    className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl p-8 text-center cursor-pointer hover:border-green-300 transition-colors"
                                    onClick={() => document.getElementById('horse-image').click()}
                                >
                                    <input
                                        type="file"
                                        id="horse-image"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {previewUrl ? (
                                        <div className="relative inline-block">
                                            <img src={previewUrl} alt="Preview" className="max-h-64 rounded-2xl shadow-md" />
                                            <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                                <i className="fas fa-check text-green-500"></i>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-6 space-y-4">
                                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-2xl flex items-center justify-center mx-auto text-2xl">
                                                <i className="fas fa-camera"></i>
                                            </div>
                                            <p className="text-gray-400 font-bold">اضغط لرفع صورة واضحة للحصان</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Numeric Fields */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">الارتفاع (سم) *</label>
                                <input
                                    type="number"
                                    name="Height_cm"
                                    value={formData.Height_cm}
                                    onChange={handleChange}
                                    required
                                    step="0.1"
                                    placeholder="مثال: 155.5"
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">الوزن (كجم) *</label>
                                <input
                                    type="number"
                                    name="Weight_kg"
                                    value={formData.Weight_kg}
                                    onChange={handleChange}
                                    required
                                    step="0.1"
                                    placeholder="مثال: 450.0"
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Select Fields */}
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">ملامح الرأس *</label>
                                <select
                                    name="Head_Profile"
                                    value={formData.Head_Profile}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                >
                                    <option value="Straight">مستقيم (Straight)</option>
                                    <option value="Roman">روماني (Roman)</option>
                                    <option value="Dished">مقعر / دبي (Dished)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">وضعية الذيل *</label>
                                <select
                                    name="Tail_Carriage"
                                    value={formData.Tail_Carriage}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                >
                                    <option value="High">مرتفع (High)</option>
                                    <option value="Medium">متوسط (Medium)</option>
                                    <option value="Low">منخفض (Low)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">تقوس الرقبة *</label>
                                <select
                                    name="Neck_Arch"
                                    value={formData.Neck_Arch}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                >
                                    <option value="High">مرتفع (High)</option>
                                    <option value="Medium">متوسط (Medium)</option>
                                    <option value="Low">منخفض (Low)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">عدد الأضلاع *</label>
                                <select
                                    name="Rib_Count"
                                    value={formData.Rib_Count}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                >
                                    <option value="17">17 (نادر - غالباً خيول عربية)</option>
                                    <option value="18">18 (شائع)</option>
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">طول الظهر *</label>
                                <select
                                    name="Back_Length"
                                    value={formData.Back_Length}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-xl outline-none border border-transparent focus:border-green-500 transition text-gray-900 dark:text-white"
                                >
                                    <option value="Short">قصير (Short)</option>
                                    <option value="Long">طويل (Long)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={classifying}
                            className={`w-full py-5 rounded-2xl font-black text-xl transition shadow-xl ${classifying
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-[#76E05B] text-white hover:bg-green-500 shadow-green-100 dark:shadow-green-900/20'
                                }`}
                        >
                            {classifying ? (
                                <span className="flex items-center justify-center space-x-reverse space-x-3">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>جاري التحليل...</span>
                                </span>
                            ) : 'بدا التحليل'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-8 bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center space-x-reverse space-x-3">
                            <i className="fas fa-exclamation-triangle"></i>
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 space-y-6">
                            {/* ML Base Result - Hidden if advanced mismatch */}
                            {(!result.advancedFeedback || result.matches) && (
                                <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900 shadow-xl shadow-green-100/20">
                                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-reverse md:space-x-8">
                                        <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center text-3xl shadow-lg shrink-0">
                                            <i className="fas fa-horse-head"></i>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-sm font-black text-green-600 mb-2 uppercase tracking-widest">تحليل البيانات</p>
                                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{result.breedArabic}</h2>
                                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-bold">
                                                بناءً على السمات البدنية، الحصان هو <span className="text-green-600 underline">{result.breedArabic}</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Grok Feedback Result */}
                            {result.advancedFeedback && (
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900 shadow-xl shadow-blue-100/20">
                                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-reverse md:space-x-8">
                                        <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center text-3xl shadow-lg shrink-0">
                                            <i className="fas fa-microchip"></i>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="text-sm font-black text-blue-600 mb-2 uppercase tracking-widest">تقييم Advanced AI</p>
                                            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed font-bold italic">
                                                "{result.advancedFeedback}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ClassifyHorse;
