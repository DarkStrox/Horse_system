import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const ClassifyHorse = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [classifying, setClassifying] = useState(false);
    const [result, setResult] = useState(null);

    // Feature Form State
    const [mode, setMode] = useState('image'); // 'image' or 'info'
    const [formData, setFormData] = useState({
        Gender: 'Stallion',
        Age: 5,
        Height_cm: 150,
        Weight_kg: 400,
        Body_Format: 'Elegant',
        Bone_Density: 'Medium',
        Neck_Length: 'Long',
        Chest_Width: 'Medium'
    });

    const handleModeSwitch = (newMode) => {
        setMode(newMode);
        setResult(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleClassify = async () => {
        if (mode === 'image' && !selectedImage) return;
        setClassifying(true);
        setResult(null);

        try {
            if (mode === 'image') {
                // Image to Base64
                const reader = new FileReader();
                reader.onloadend = async () => {
                    try {
                        const base64String = reader.result;

                        const response = await fetch('http://localhost:5000/api/ai/predict-breed', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                ImageData: base64String
                            })
                        });

                        if (!response.ok) {
                            throw new Error('فشل في تحليل الصورة');
                        }

                        const data = await response.json();

                        setResult({
                            type: data.breedArabic || data.breed || 'خيل عربي أصيل',
                            confidence: data.confidence,
                            details: 'نتيجة التحليل البصري'
                        });
                    } catch (error) {
                        console.error('Image prediction error:', error);
                        alert('حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.');
                    } finally {
                        setClassifying(false);
                    }
                };

                reader.onerror = () => {
                    console.error('File reading error');
                    alert('حدث خطأ في قراءة الصورة.');
                    setClassifying(false);
                };

                reader.readAsDataURL(selectedImage);
            } else {
                // Info Prediction
                const payload = {
                    Gender: formData.Gender,
                    Age: parseInt(formData.Age),
                    Height_cm: parseFloat(formData.Height_cm),
                    Weight_kg: parseFloat(formData.Weight_kg),
                    Body_Format: formData.Body_Format,
                    Bone_Density: formData.Bone_Density,
                    Neck_Length: formData.Neck_Length,
                    Chest_Width: formData.Chest_Width
                };

                const response = await fetch('http://localhost:5000/api/ai/predict-strain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('فشل في تحليل البيانات');
                }

                const data = await response.json();

                setResult({
                    type: `${data.predictedStrainArabic}\n(${data.predictedStrain})`,
                    confidence: data.confidence,
                    details: 'توقع السلالة (STRAIN)'
                });
                setClassifying(false);
            }
        } catch (error) {
            console.error('Classification error:', error);
            alert('حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.');
            setClassifying(false);
        }
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

                <div className="w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 relative z-10 mx-auto mt-8">
                    {/* Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-10 mx-auto max-w-sm relative">
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-gray-700 rounded-xl shadow-sm transition-all duration-300 ease-in-out ${mode === 'info' ? 'translate-x-full left-1.5' : 'left-1.5'}`}
                        ></div>
                        <button
                            onClick={() => handleModeSwitch('image')}
                            className={`flex-1 flex items-center justify-center space-x-reverse space-x-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${mode === 'image' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <i className="fas fa-image"></i>
                            <span>تحديد بالصورة</span>
                        </button>
                        <button
                            onClick={() => handleModeSwitch('info')}
                            className={`flex-1 flex items-center justify-center space-x-reverse space-x-2 py-3 rounded-xl text-sm font-bold transition-colors relative z-10 ${mode === 'info' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                        >
                            <i className="fas fa-list-ul"></i>
                            <span>تحديد بالبيانات</span>
                        </button>
                    </div>

                    {mode === 'image' ? (
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
                                        <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 text-center">اضغط لرفع صورة</h3>
                                        <p className="text-gray-400 text-sm font-bold text-center">صورة الحصان *</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        (Gender) الجنس
                                    </label>
                                    <select
                                        name="Gender"
                                        value={formData.Gender}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Stallion">Stallion (ذكر)</option>
                                        <option value="Mare">Mare (أنثى)</option>
                                        <option value="Gelding">Gelding (مخصي)</option>
                                    </select>
                                </div>

                                {/* Body Format */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Body Format
                                    </label>
                                    <select
                                        name="Body_Format"
                                        value={formData.Body_Format}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Elegant">Elegant (أنيق)</option>
                                        <option value="Compact">Compact (مدمج)</option>
                                        <option value="Muscular">Muscular (عضلي)</option>
                                        <option value="Lean">Lean (نحيل)</option>
                                    </select>
                                </div>

                                {/* Bone Density */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Bone Density
                                    </label>
                                    <select
                                        name="Bone_Density"
                                        value={formData.Bone_Density}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Light">Light (خفيف)</option>
                                        <option value="Medium">Medium (متوسط)</option>
                                        <option value="Heavy">Heavy (ثقيل)</option>
                                    </select>
                                </div>

                                {/* Neck Length */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Neck Length
                                    </label>
                                    <select
                                        name="Neck_Length"
                                        value={formData.Neck_Length}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Short">Short (قصير)</option>
                                        <option value="Medium">Medium (متوسط)</option>
                                        <option value="Long">Long (طويل)</option>
                                    </select>
                                </div>

                                {/* Chest Width */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        Chest Width
                                    </label>
                                    <select
                                        name="Chest_Width"
                                        value={formData.Chest_Width}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="Narrow">Narrow (ضيق)</option>
                                        <option value="Medium">Medium (متوسط)</option>
                                        <option value="Broad">Broad (عريض)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            className={`w-full py-4 rounded-2xl font-black text-lg transition shadow-xl ${((mode === 'image' && !selectedImage) || classifying)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                                : 'bg-[#76E05B] text-white hover:bg-green-500 shadow-green-100 dark:shadow-green-900/20'
                                }`}
                            disabled={(mode === 'image' && !selectedImage) || classifying}
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
                        <div className="mt-10 bg-[#0f3b20] dark:bg-[#0a2715] p-8 rounded-2xl border border-green-800 animate-in fade-in slide-in-from-bottom-4 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 bg-[#2ed86a] text-white rounded-[1.2rem] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(46,216,106,0.4)] shrink-0">
                                        <i className="fas fa-horse-head"></i>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-[#b4e8c6] mb-1">{result.details}</p>
                                        <h2 className="text-3xl font-black text-white whitespace-pre-line">
                                            {result.type}
                                            {mode === 'image' && !(result.type.includes('عربي') || result.type.toLowerCase().includes('arabian')) && (
                                                <span className="text-sm font-bold text-red-400 mr-2 block mt-1">
                                                    (غير عربي - Not Arabian)
                                                </span>
                                            )}
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4">
                                    <div className="flex justify-between items-center text-sm font-bold text-[#b4e8c6]">
                                        <span>نسبة الثقة المدعومة بالذكاء الاصطناعي</span>
                                        <span>{Number(result.confidence).toFixed(3)}%</span>
                                    </div>
                                    <div className="w-full bg-[#1b4a2e] rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-[#2ed86a] h-2.5 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${result.confidence}%` }}
                                        ></div>
                                    </div>
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
