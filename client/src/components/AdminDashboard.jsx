
import React, { useState, useEffect, useRef } from 'react';

// --- بيانات المرابط وفروعها المتاحة للخيول ---
const studsData = {
  'الشحانية':['الفرع الرئيسي', 'فرع الريان'],
  'مربط العرب':['فرع القاهرة', 'فرع الإسكندرية', 'فرع الجيزة'],
  'إسطبلات نجد':['الفرع الرئيسي', 'فرع الجيزة', 'فرع زايد'],
  'مربط الريان':['الفرع الرئيسي', 'فرع الإسكندرية'],
  'مربط البادية':['فرع الجيزة', 'فرع الفيوم', 'فرع سقارة'],
  'مزرعة رباب':['الفرع الرئيسي', 'فرع سقارة'],
  'مربط صقر':['الفرع الرئيسي', 'فرع المنصورية'],
  'أخرى':['الفرع الرئيسي']
};

// --- قائمة محافظات مصر (لإضافة المرابط) ---
const egyptGovernorates =[
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية', 
  'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية', 'السويس', 'كفر الشيخ', 
  'الفيوم', 'بني سويف', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'المنيا', 'أسيوط', 
  'سوهاج', 'قنا', 'البحر الأحمر', 'الأقصر', 'أسوان', 'الوادى الجديد'
];

export default function Dashboard() {
  // ================= 1. States الأساسية للتنقل =================
  const[activeSidebarPage, setActiveSidebarPage] = useState('dashboard');
  const[activeTab, setActiveTab] = useState('البائعين'); 
  const[isDarkMode, setIsDarkMode] = useState(false);
  
  // ================= 2. States الإشعارات =================
  const[isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  },[]);

  // ================= 3. States الفلترة والبحث =================
  const[searchQuery, setSearchQuery] = useState('');
  const[filterStatus, setFilterStatus] = useState('الكل');
  const[isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    setFilterStatus('الكل');
    setSearchQuery('');
  },[activeTab, activeSidebarPage]);

  // ================= 4. قواعد البيانات (States) =================
  const[sellersData, setSellersData] = useState([
    { id: 'ORD-#5241', seller: 'فهد العتيبي', phone: '+966 50 111 1111', email: 'fahad@example.com', status: 'مكتمل' },
    { id: 'ORD-#5242', seller: 'مربط الصقور', phone: '+966 50 222 2222', email: 'saqour@example.com', status: 'قيد الانتظار' },
    { id: 'ORD-#5243', seller: 'سارة الشمري', phone: '+966 50 333 3333', email: 'sara@example.com', status: 'ملغى' },
    { id: 'ORD-#5244', seller: 'خالد منصور', phone: '+966 50 444 4444', email: 'khaled@example.com', status: 'مكتمل' }
  ]);

  const[buyersData, setBuyersData] = useState([
    { id: 'b1', orderId: 'ORD-#6001', initial: 'أ', name: 'أحمد محمد', phone: '+966501234567', email: 'ahmed@example.com', orders: '٥ خيول', status: 'مكتمل' },
    { id: 'b2', orderId: 'ORD-#6002', initial: 'س', name: 'سارة علي', phone: '+966551234567', email: 'sara@example.com', orders: '٢ خيول', status: 'ملغى' },
    { id: 'b3', orderId: 'ORD-#6003', initial: 'خ', name: 'خالد عبدالله', phone: '+966561234567', email: 'khaled@example.com', orders: '٠ خيول', status: 'قيد الانتظار' },
    { id: 'b4', orderId: 'ORD-#6004', initial: 'ن', name: 'نورة يوسف', phone: '+966541234567', email: 'noura@example.com', orders: '٨ خيول', status: 'مكتمل' }
  ]);

  const[vetsData, setVetsData] = useState([
    { id: 'v1', orderId: 'ORD-#7001', initial: 'أ', name: 'د. أحمد علي', license: 'VET-001#', specialty: 'جراحة الخيول', email: 'ahmed@vet.com', phone: '+966 50 123 4567', status: 'مكتمل' },
    { id: 'v2', orderId: 'ORD-#7002', initial: 'س', name: 'د. سارة حسن', license: 'VET-002#', specialty: 'تغذية الخيول', email: 'sara@vet.com', phone: '+966 50 234 5678', status: 'مكتمل' },
    { id: 'v3', orderId: 'ORD-#7003', initial: 'م', name: 'د. محمد محمود', license: 'VET-003#', specialty: 'طب الطوارئ', email: 'mohammad@vet.com', phone: '+966 50 345 6789', status: 'قيد الانتظار' }
  ]);

  const[ordersData, setOrdersData] = useState([
    { id: 'ORD-9001', horse: 'نجم', type: 'شراء', amount: '١٥٠,٠٠٠ ر.س', date: '2023/11/01', status: 'قيد المراجعة' },
    { id: 'ORD-9002', horse: 'أصيل', type: 'فحص طبي', amount: '٥,٠٠٠ ر.س', date: '2023/11/02', status: 'مكتمل' }
  ]);

  const[horsesData, setHorsesData] = useState([
    { id: 'HRS-101', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop', name: 'البراق', breed: 'عربي أصيل', age: '٤ سنوات', color: 'أشقر', owner: 'فهد العتيبي', status: 'متاح للبيع', type: 'فحل', sire: 'نجم الدين', dam: 'الريم', breeder: 'مربط العتيبي', studName: 'أخرى', branch: 'الفرع الرئيسي', healthRecordPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', pedigreeImg: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=400' },
    { id: 'HRS-102', image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=100&h=100&fit=crop', name: 'الريم', breed: 'إنجليزي', age: '٣ سنوات', color: 'أسود', owner: 'مربط الصقور', status: 'مباع', type: 'فرس', sire: 'غير معروف', dam: 'غير معروف', breeder: 'مربط الصقور', studName: 'مربط صقر', branch: 'الفرع الرئيسي', healthRecordPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', pedigreeImg: 'https://images.unsplash.com/photo-1534005081014-99d75b33190e?w=400' },
    { id: 'HRS-103', image: 'https://images.unsplash.com/photo-1534005081014-99d75b33190e?w=100&h=100&fit=crop', name: 'سيف', breed: 'هجين', age: '٥ سنوات', color: 'رمادي', owner: 'فيصل الراجحي', status: 'تحت العلاج', type: 'فحل', sire: 'شواش', dam: 'حلا', breeder: 'الراجحي', studName: 'إسطبلات نجد', branch: 'فرع زايد', healthRecordPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', pedigreeImg: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400' }
  ]);

  const[medicalRecordsData, setMedicalRecordsData] = useState([
    { id: 'MED-501', horseName: 'البراق', vetName: 'د. أحمد علي', date: '2023/10/20', type: 'فحص دوري', diagnosis: 'سليم تماماً', status: 'مكتمل' },
    { id: 'MED-502', horseName: 'سيف', vetName: 'د. سارة حسن', date: '2023/11/05', type: 'علاج إصابة', diagnosis: 'إصابة في الحافر الأيمن', status: 'قيد العلاج' }
  ]);

  const[studsDataList, setStudsDataList] = useState([
    { id: 'S1', name: 'إسطبلات الدوحة الملكية', nameEn: 'Doha Stud', type: 'تدريب وبيع', image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=100&h=100&fit=crop', email: 'doha.stud@gmail.com', phone: '+974 1234 5678', city: 'القاهرة', regNo: '14', foundedDate: '2010-01-01', status: 'نشط' },
    { id: 'S2', name: 'مربط العرب', nameEn: 'Arab Stud', type: 'تدريب', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop', email: 'arab.stud@hotmail.com', phone: '+966 50 123 4567', city: 'الجيزة', regNo: '68', foundedDate: '2015-05-20', status: 'نشط' }
  ]);

  // --- داتا المزادات الجديدة ---
  const[auctionsDataList, setAuctionsDataList] = useState([
    { id: 'AUC-1', title: 'مزاد إيجي هورسياس الماسي', startDate: '2025-10-12', endDate: '2025-10-13', location: 'القاهرة - مصر', description: 'مزاد كبير لبيع أفضل الخيول العربية الأصيلة.', status: 'قيد الانتظار', image: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=100&h=100&fit=crop' },
    { id: 'AUC-2', title: 'بطولة المراسم رباب', startDate: '2025-10-09', endDate: '2025-10-10', location: 'مربط رباب - الجيزة', description: 'بطولة خاصة بعرض أجمل الخيول العربية برعاية دولية.', status: 'مكتمل', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop' },
    { id: 'AUC-3', title: 'North Coast Championship', startDate: '2025-07-10', endDate: '2025-07-12', location: 'الساحل الشمالي', description: 'البطولة الصيفية السنوية لجمال الخيل العربية في الساحل الشمالي.', status: 'مكتمل', image: 'https://images.unsplash.com/photo-1534005081014-99d75b33190e?w=100&h=100&fit=crop' }
  ]);

  // ================= 5. بيانات الإعدادات والحفظ =================
  const[adminData, setAdminData] = useState({ 
    name: 'أفنان احمد', 
    email: 'admin@horse-system.com',
    phone: '+20 100 000 0000',
    password: 'password123' // كلمة المرور الافتراضية للتجربة
  });
  const[settingsInput, setSettingsInput] = useState({ 
    name: adminData.name, 
    email: adminData.email,
    phone: adminData.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const[saveStatus, setSaveStatus] = useState('idle');
  const[isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);

  const handleSaveSettings = () => {
    // التحقق من صحة كلمة المرور إذا كان بطاقة تغيير كلمة المرور مفتوحة وهناك محاولة لتغييرها
    if (isPasswordChangeOpen && (settingsInput.newPassword || settingsInput.confirmPassword || settingsInput.currentPassword)) {
      if (settingsInput.currentPassword !== adminData.password) {
        alert('كلمة المرور الحالية غير صحيحة');
        return;
      }
      if (settingsInput.newPassword !== settingsInput.confirmPassword) {
        alert('كلمة المرور الجديدة وتأكيدها غير متطابقين');
        return;
      }
      if (settingsInput.newPassword.length < 6) {
        alert('كلمة المرور الجديدة يجب أن تتكون من ٦ أحرف/أرقام على الأقل');
        return;
      }
      // تحديث كل البيانات بالإضافة لكلمة المرور الجديدة
      setAdminData({ 
        name: settingsInput.name, 
        email: settingsInput.email, 
        phone: settingsInput.phone,
        password: settingsInput.newPassword 
      });
      setIsPasswordChangeOpen(false);
    } else {
      // تحديث البيانات بدون تغيير كلمة المرور
      setAdminData({ 
        name: settingsInput.name, 
        email: settingsInput.email, 
        phone: settingsInput.phone,
        password: adminData.password 
      });
    }

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);

    // تصفير حقول كلمة المرور بعد الحفظ
    setSettingsInput(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  // ================= 6. دوال البحث والفلترة =================
  const getProcessedData = () => {
    let data =[];
    if (activeSidebarPage === 'orders') data = ordersData;
    else if (activeSidebarPage === 'horses') data = horsesData;
    else if (activeSidebarPage === 'studs') data = studsDataList;
    else if (activeSidebarPage === 'auctions') data = auctionsDataList;
    else if (activeSidebarPage === 'medical') data = medicalRecordsData;
    else if (activeSidebarPage === 'settings') return[]; 
    else data = activeTab === 'البائعين' ? sellersData : activeTab === 'المشترين' ? buyersData : vetsData;

    return data.filter(item => {
      const matchesSearch = Object.values(item).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterStatus === 'الكل' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };
  const processedData = getProcessedData();

  const handleDownloadCSV = () => {
    if (processedData.length === 0) return alert("لا توجد بيانات لتحميلها");
    const headers = Object.keys(processedData[0]).filter(k => k !== 'image' && k !== 'initial').join(',');
    const rows = processedData.map(row => Object.entries(row).filter(([k]) => k !== 'image' && k !== 'initial').map(([_, v]) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; 
    let fileName = activeTab;
    if(activeSidebarPage === 'orders') fileName = 'Orders';
    if(activeSidebarPage === 'horses') fileName = 'Horses';
    if(activeSidebarPage === 'studs') fileName = 'Studs';
    if(activeSidebarPage === 'auctions') fileName = 'Auctions';
    if(activeSidebarPage === 'medical') fileName = 'Medical_Records';
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getOrderStatusStyle = (status) => {
    if(status === 'مكتمل' || status === 'متاح للبيع' || status === 'سليم' || status === 'نشط') return 'bg-green-100 text-green-600';
    if(status === 'قيد الانتظار' || status === 'قيد المراجعة' || status === 'قيد العلاج' || status === 'تحت العلاج') return 'bg-yellow-100 text-yellow-600';
    if(status === 'ملغى' || status === 'مباع' || status === 'غير نشط') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  const getUserStatusStyle = (status) => status === 'نشط' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200';

  // ================= 7. نظام الـ Modal =================
  const[modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const[formData, setFormData] = useState({});
  
  const[currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('forward');
  const[formErrors, setFormErrors] = useState({});

  const openModal = (type, data = null) => { 
    setModalConfig({ isOpen: true, type, data }); 
    if(activeSidebarPage === 'studs' && (type === 'add' || type === 'edit')) {
      setFormData(data ? { ...data, images:[] } : { country: 'مصر', images:[] });
      setCurrentStep(1);
      setFormErrors({});
    } else {
      setFormData(data || {}); 
    }
  };
  
  const closeModal = () => { 
    setModalConfig({ isOpen: false, type: '', data: null }); 
    setFormData({}); 
    setCurrentStep(1);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        if (name === 'healthRecordPdf') setFormData({ ...formData,[name]: files[0] });
        else setFormData({ ...formData, [name]: URL.createObjectURL(files[0]) });
      }
    } else {
      setFormData({ ...formData,[name]: value });
    }
  };

  const handleStudChange = (e) => {
    const selectedStud = e.target.value;
    setFormData({ ...formData, studName: selectedStud, branch: '' });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    let errors = {};
    if (currentStep === 1) {
        if (!formData.nameEn?.trim() && modalConfig.type !== 'edit') errors.nameEn = true; 
        if (!formData.name?.trim()) errors.name = true;
        if (!formData.foundedDate) errors.foundedDate = true;
        if (!formData.city) errors.city = true;
        if (!formData.regNo?.trim()) errors.regNo = true; 
        if (!formData.type) errors.type = true;
    } else if (currentStep === 2) {
        if (!formData.email?.trim()) errors.email = true;
        if (!formData.phone?.trim()) errors.phone = true;
    }
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    
    setFormErrors({}); 
    setSlideDirection('forward'); 
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setSlideDirection('backward');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeSidebarPage === 'studs') {
      if (modalConfig.type === 'add' && (!formData.images || formData.images.length === 0)) {
        setFormErrors({ images: true });
        alert('يرجى رفع صورة واحدة على الأقل للمربط لحفظ البيانات');
        return;
      }

      const finalImage = formData.images && formData.images.length > 0 
        ? URL.createObjectURL(formData.images[0]) 
        : formData.image || 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=100&h=100&fit=crop';

      const newStudData = { ...formData, image: finalImage, status: formData.status || 'نشط' };

      if (modalConfig.type === 'add') {
        setStudsDataList([{ ...newStudData, id: `S${Math.floor(100 + Math.random() * 900)}` }, ...studsDataList]);
      } else {
        setStudsDataList(studsDataList.map(item => item.id === formData.id ? newStudData : item));
      }
      closeModal();
      return;
    }

    if (activeSidebarPage === 'auctions') {
      if (modalConfig.type === 'add') setAuctionsDataList([{ ...formData, id: `AUC-${Math.floor(100 + Math.random() * 900)}`, image: formData.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop', status: formData.status || 'قيد الانتظار' }, ...auctionsDataList]);
      else setAuctionsDataList(auctionsDataList.map(item => item.id === formData.id ? formData : item));
    } else if (activeSidebarPage === 'orders') {
      if (modalConfig.type === 'add') setOrdersData([{ ...formData, id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toLocaleDateString('en-CA').replace(/-/g, '/') }, ...ordersData]);
      else setOrdersData(ordersData.map(item => item.id === formData.id ? formData : item));
    } else if (activeSidebarPage === 'horses') {
      if (modalConfig.type === 'add') setHorsesData([{ ...formData, id: `HRS-${Math.floor(100 + Math.random() * 900)}`, image: formData.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop' }, ...horsesData]);
      else setHorsesData(horsesData.map(item => item.id === formData.id ? formData : item));
    } else if (activeSidebarPage === 'medical') {
      if (modalConfig.type === 'add') setMedicalRecordsData([{ ...formData, id: `MED-${Math.floor(500 + Math.random() * 900)}`, date: new Date().toLocaleDateString('en-CA').replace(/-/g, '/') }, ...medicalRecordsData]);
      else setMedicalRecordsData(medicalRecordsData.map(item => item.id === formData.id ? formData : item));
    } else {
      if (activeTab === 'البائعين') {
        if (modalConfig.type === 'add') setSellersData([{ ...formData, id: `ORD-#${Math.floor(Math.random() * 10000)}` }, ...sellersData]);
        else setSellersData(sellersData.map(item => item.id === formData.id ? formData : item));
      } else if (activeTab === 'المشترين') {
        if (modalConfig.type === 'add') setBuyersData([{ ...formData, id: `b${Date.now()}`, orderId: formData.orderId || `ORD-#${Math.floor(Math.random() * 10000)}`, initial: formData.name ? formData.name.charAt(0) : 'م', orders: formData.orders || '٠ خيول' }, ...buyersData]);
        else setBuyersData(buyersData.map(item => item.id === formData.id ? formData : item));
      } else if (activeTab === 'الأطباء البيطريين') {
        if (modalConfig.type === 'add') setVetsData([{ ...formData, id: `v${Date.now()}`, orderId: formData.orderId || `ORD-#${Math.floor(Math.random() * 10000)}`, initial: formData.name ? formData.name.replace('د. ', '').charAt(0) : 'ط' }, ...vetsData]);
        else setVetsData(vetsData.map(item => item.id === formData.id ? formData : item));
      }
    }
    closeModal();
  };

  const handleDelete = () => {
    if (activeSidebarPage === 'orders') setOrdersData(ordersData.filter(item => item.id !== modalConfig.data.id));
    else if (activeSidebarPage === 'horses') setHorsesData(horsesData.filter(item => item.id !== modalConfig.data.id));
    else if (activeSidebarPage === 'studs') setStudsDataList(studsDataList.filter(item => item.id !== modalConfig.data.id));
    else if (activeSidebarPage === 'auctions') setAuctionsDataList(auctionsDataList.filter(item => item.id !== modalConfig.data.id));
    else if (activeSidebarPage === 'medical') setMedicalRecordsData(medicalRecordsData.filter(item => item.id !== modalConfig.data.id));
    else {
      if (activeTab === 'البائعين') setSellersData(sellersData.filter(item => item.id !== modalConfig.data.id));
      if (activeTab === 'المشترين') setBuyersData(buyersData.filter(item => item.id !== modalConfig.data.id));
      if (activeTab === 'الأطباء البيطريين') setVetsData(vetsData.filter(item => item.id !== modalConfig.data.id));
    }
    closeModal();
  };

  return (
    <div className={`flex h-screen bg-gray-50 overflow-hidden relative font-sans ${isDarkMode ? 'dark-mode-active' : ''}`} dir="rtl">
      
      {/* ================= أكواد الـ CSS  ================= */}
      <style>{`
        @keyframes slideInForward { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInBackward { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .slide-forward { animation: slideInForward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .slide-backward { animation: slideInBackward 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        
        .fake-map-bg { background-color: #f9fafb; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l25 25M25 25l25-25M50 0l25 25M75 25l25-25M100 50l-25 25M75 75l-25-25M50 50l-25 25M25 75L0 50' stroke='%23e5e7eb' stroke-width='1' fill='none' /%3E%3C/svg%3E"); }
        .dark-mode-active .fake-map-bg { background-color: #374151; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l25 25M25 25l25-25M50 0l25 25M75 25l25-25M100 50l-25 25M75 75l-25-25M50 50l-25 25M25 75L0 50' stroke='%234b5563' stroke-width='1' fill='none' /%3E%3C/svg%3E"); }
        
        .lux-input { width: 100%; padding: 0.75rem 1rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; outline: none; transition: all 0.3s; font-size: 0.875rem; color: #111827; font-weight: 500; }
        .dark-mode-active .lux-input { background-color: #374151 !important; border-color: #4b5563 !important; color: #f9fafb !important; }
        .lux-input:focus { border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
        .lux-input::placeholder { color: #9ca3af; }
        .dark-mode-active .lux-input::placeholder { color: #9ca3af !important; }
        .input-error { border-color: #ef4444 !important; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important; }

        .dark-mode-active { background-color: #111827 !important; color: #f3f4f6 !important; }
        .dark-mode-active .bg-white { background-color: #1f2937 !important; border-color: #374151 !important; }
        .dark-mode-active .bg-gray-50 { background-color: #111827 !important; }
        .dark-mode-active .bg-gray-50\\/50 { background-color: rgba(17, 24, 39, 0.5) !important; }
        .dark-mode-active .bg-gray-50\\/30 { background-color: rgba(17, 24, 39, 0.3) !important; }
        .dark-mode-active .bg-gray-100 { background-color: #374151 !important; }
        .dark-mode-active .border-gray-100, .dark-mode-active .border-gray-200, .dark-mode-active .border-gray-50 { border-color: #374151 !important; }
        .dark-mode-active .text-gray-800 { color: #f9fafb !important; }
        .dark-mode-active .text-gray-700 { color: #f3f4f6 !important; }
        .dark-mode-active .text-gray-600 { color: #d1d5db !important; }
        .dark-mode-active .text-gray-500 { color: #9ca3af !important; }
        .dark-mode-active input:not(.lux-input), .dark-mode-active select:not(.lux-input), .dark-mode-active textarea:not(.lux-input) { background-color: #374151 !important; color: #f9fafb !important; border-color: #4b5563 !important; }
        .dark-mode-active input::placeholder, .dark-mode-active textarea::placeholder { color: #9ca3af !important; }
        .dark-mode-active .hover\\:bg-gray-50:hover { background-color: #374151 !important; }
        .dark-mode-active .hover\\:bg-gray-100:hover { background-color: #4b5563 !important; }
        .dark-mode-active .hover\\:bg-gray-200:hover { background-color: #6b7280 !important; }
        .dark-mode-active .divide-gray-100 > :not([hidden]) ~ :not([hidden]) { border-color: #374151 !important; }
        
        .dark-mode-active .bg-red-100 { background-color: rgba(239, 68, 68, 0.2) !important; color: #fca5a5 !important;}
        .dark-mode-active .bg-green-100 { background-color: rgba(34, 197, 94, 0.2) !important; color: #86efac !important;}
        .dark-mode-active .bg-yellow-100 { background-color: rgba(234, 179, 8, 0.2) !important; color: #fde047 !important;}
        .dark-mode-active .bg-blue-100 { background-color: rgba(59, 130, 246, 0.2) !important; color: #93c5fd !important;}
        .dark-mode-active .bg-gray-100 { background-color: rgba(156, 163, 175, 0.2) !important; color: #d1d5db !important;}
        .dark-mode-active .bg-emerald-50 { background-color: rgba(16, 185, 129, 0.15) !important; }
      `}</style>

      {/* ================= النافذة المنبثقة (Modal) ================= */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-y-auto animate-fade-in-up custom-scrollbar ${((activeSidebarPage === 'studs') || (activeSidebarPage === 'horses' && modalConfig.type === 'edit')) ? 'max-w-5xl' : 'max-w-3xl'}`}>
            
            {/* عرض الحذف (موحد) */}
            {modalConfig.type === 'delete' && (
              <div className="text-center p-8 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl shadow-sm border border-red-100"><i className="fas fa-trash-alt"></i></div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">هل أنت متأكد من الحذف؟</h2>
                <p className="text-gray-500 mb-8">لا يمكن التراجع عن هذا الإجراء، سيتم حذف السجل نهائياً.</p>
                <div className="flex gap-4 justify-center">
                  <button onClick={handleDelete} className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-md">نعم، تأكيد الحذف</button>
                  <button onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء الأمر</button>
                </div>
              </div>
            )}

            {/* ======================= عرض التفاصيل المخصص للخيول ======================= */}
            {modalConfig.type === 'view' && activeSidebarPage === 'horses' && (
              <div className="p-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-gray-800">
                    <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600">
                      <i className="fas fa-horse-head"></i>
                    </div>
                    السجل الشامل للخيل: {modalConfig.data.name}
                  </h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* صورة الخيل */}
                  <div className="md:w-1/3">
                    <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-200 bg-gray-50">
                      <img src={modalConfig.data.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'} alt={modalConfig.data.name} className="w-full h-64 object-cover" />
                    </div>
                    <div className="mt-4 text-center">
                      <span className={`px-6 py-2 rounded-full text-sm font-bold shadow-sm ${getOrderStatusStyle(modalConfig.data.status)}`}>
                        {modalConfig.data.status || 'متاح'}
                      </span>
                    </div>
                  </div>

                  {/* التفاصيل */}
                  <div className="md:w-2/3 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 text-xs mb-1 font-bold">السلالة (الرَّسَن)</span>
                        <strong className="text-gray-800">{modalConfig.data.breed || 'غير محدد'}</strong>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 text-xs mb-1 font-bold">النوع</span>
                        <strong className="text-gray-800">{modalConfig.data.type || 'غير محدد'}</strong>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 text-xs mb-1 font-bold">اللون</span>
                        <strong className="text-gray-800">{modalConfig.data.color || 'غير محدد'}</strong>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 text-xs mb-1 font-bold">العمر / تاريخ الميلاد</span>
                        <strong className="text-gray-800">{modalConfig.data.age || 'غير محدد'}</strong>
                      </div>
                    </div>

                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                      <h3 className="font-bold text-emerald-800 mb-3 border-b border-emerald-200 pb-2"><i className="fas fa-sitemap ml-2"></i> النسب والتوليد</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="text-xs text-gray-500 block">الأب (Sire)</span><strong className="text-gray-800">{modalConfig.data.sire || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">الأم (Dam)</span><strong className="text-gray-800">{modalConfig.data.dam || 'غير مسجل'}</strong></div>
                        <div className="col-span-2"><span className="text-xs text-gray-500 block">المُربّي (Breeder)</span><strong className="text-gray-800">{modalConfig.data.breeder || 'غير مسجل'}</strong></div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                      <h3 className="font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2"><i className="fas fa-map-marker-alt ml-2 text-emerald-600"></i> الملكية والموقع</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><span className="text-xs text-gray-500 block">المالك الحالي</span><strong className="text-gray-800">{modalConfig.data.owner || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">المربط</span><strong className="text-gray-800">{modalConfig.data.studName || 'غير محدد'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">الفرع</span><strong className="text-gray-800">{modalConfig.data.branch || 'غير محدد'}</strong></div>
                      </div>
                    </div>

                    {/* المرفقات */}
                    <div className="flex gap-4 pt-2">
                      {modalConfig.data.healthRecordPdf ? (
                        <a href={typeof modalConfig.data.healthRecordPdf === 'string' ? modalConfig.data.healthRecordPdf : URL.createObjectURL(modalConfig.data.healthRecordPdf)} target="_blank" rel="noreferrer" className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition border border-blue-100">
                          <i className="fas fa-file-medical"></i> السجل الطبي
                        </a>
                      ) : (
                        <div className="flex-1 bg-gray-50 text-gray-400 p-3 rounded-xl flex items-center justify-center gap-2 font-bold border border-gray-100 cursor-not-allowed">
                          <i className="fas fa-file-medical"></i> لا يوجد سجل طبي
                        </div>
                      )}

                      {modalConfig.data.pedigreeImg ? (
                        <a href={typeof modalConfig.data.pedigreeImg === 'string' ? modalConfig.data.pedigreeImg : URL.createObjectURL(modalConfig.data.pedigreeImg)} target="_blank" rel="noreferrer" className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition border border-green-100">
                          <i className="fas fa-project-diagram"></i> شجرة النسب
                        </a>
                      ) : (
                        <div className="flex-1 bg-gray-50 text-gray-400 p-3 rounded-xl flex items-center justify-center gap-2 font-bold border border-gray-100 cursor-not-allowed">
                          <i className="fas fa-project-diagram"></i> لا توجد شجرة نسب
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="mt-8 flex justify-end border-t border-gray-100 pt-5">
                  <button onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إغلاق النافذة</button>
                </div>
              </div>
            )}

            {/* ======================= عرض التفاصيل المخصص للمرابط ======================= */}
            {modalConfig.type === 'view' && activeSidebarPage === 'studs' && (
              <div className="flex flex-col w-full">
                {/* Header matches the Add form header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-l from-emerald-900 to-emerald-800 shrink-0 rounded-t-2xl">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <i className="fas fa-building text-emerald-200"></i> تفاصيل المربط: {modalConfig.data.name}
                    </h2>
                    <button onClick={closeModal} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto bg-[#FAF9F6] dark:bg-gray-900">
                   <div className="flex flex-col lg:flex-row gap-8">
                      {/* Right side (Main details) */}
                      <div className="lg:w-2/3 space-y-6">
                         {/* Basic Info Block */}
                         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-info-circle ml-2"></i> بيانات المربط الأساسية</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">الاسم (إنجليزي)</span><strong className="text-gray-800">{modalConfig.data.nameEn || 'غير محدد'}</strong></div>
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">نوع المربط</span><strong className="text-gray-800">{modalConfig.data.type || 'غير محدد'}</strong></div>
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">تاريخ التأسيس</span><strong className="text-gray-800">{modalConfig.data.foundedDate || 'غير محدد'}</strong></div>
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">رقم التسجيل</span><strong className="text-gray-800">{modalConfig.data.regNo || 'غير محدد'}</strong></div>
                              <div className="col-span-2">
                                 <span className="text-xs text-gray-400 block mb-1 font-bold">نبذة عن المربط</span>
                                 <p className="text-gray-800 text-sm leading-relaxed mt-1">{modalConfig.data.about || 'لا توجد نبذة مسجلة عن هذا المربط حتى الآن.'}</p>
                              </div>
                            </div>
                         </div>

                         {/* Contact & Social Block */}
                         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-address-book ml-2"></i> معلومات التواصل والروابط</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">البريد الإلكتروني</span><strong className="text-gray-800 break-all" dir="ltr">{modalConfig.data.email || 'غير مسجل'}</strong></div>
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">رقم الهاتف</span><strong className="text-gray-800" dir="ltr">{modalConfig.data.phone || 'غير مسجل'}</strong></div>
                            </div>
                            {/* Social Icons row */}
                            <div className="flex gap-4 mt-5 pt-4 border-t border-gray-50">
                              {modalConfig.data.facebook ? <a href={modalConfig.data.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"><i className="fab fa-facebook-f"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-facebook-f"></i></div>}
                              {modalConfig.data.instagram ? <a href={modalConfig.data.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition"><i className="fab fa-instagram"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-instagram"></i></div>}
                              {modalConfig.data.twitter ? <a href={modalConfig.data.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition"><i className="fab fa-twitter"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-twitter"></i></div>}
                              {modalConfig.data.youtube ? <a href={modalConfig.data.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"><i className="fab fa-youtube"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-youtube"></i></div>}
                            </div>
                         </div>
                      </div>

                      {/* Left side (Image & Map/Location) */}
                      <div className="lg:w-1/3 space-y-6">
                         <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border-2 border-gray-50">
                               <img src={modalConfig.data.image} alt={modalConfig.data.name} className="w-full h-full object-cover" />
                            </div>
                            <span className={`px-6 py-2 rounded-full text-sm font-bold w-full text-center ${getOrderStatusStyle(modalConfig.data.status)}`}>
                               {modalConfig.data.status || 'نشط'}
                            </span>
                         </div>

                         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-emerald-800 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-map-marker-alt ml-2"></i> الموقع</h3>
                            <div className="space-y-3">
                              <div><span className="text-xs text-gray-400 block mb-1 font-bold">الدولة • المدينة</span><strong className="text-gray-800">{modalConfig.data.country || 'مصر'} • {modalConfig.data.city || 'غير محدد'}</strong></div>
                              {modalConfig.data.streetAddress && <div><span className="text-xs text-gray-400 block mb-1 font-bold">الشارع</span><strong className="text-gray-800">{modalConfig.data.streetAddress}</strong></div>}
                            </div>
                            {/* Mini Map representation */}
                            <div className="w-full h-32 mt-4 rounded-xl fake-map-bg border border-gray-200 relative flex items-center justify-center">
                               <i className="fas fa-map-marker-alt text-3xl text-emerald-600 drop-shadow-md absolute"></i>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                    <button onClick={closeModal} className="px-8 py-3.5 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">إغلاق النافذة</button>
                </div>
              </div>
            )}

            {/* عرض التفاصيل العادي (للباقي: المزادات، البائعين، الأطباء، المشترين) */}
            {modalConfig.type === 'view' && activeSidebarPage !== 'horses' && activeSidebarPage !== 'studs' && (
              <div className="p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800"><div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600"><i className="fas fa-eye"></i></div>تفاصيل السجل</h2>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
                  {Object.entries(modalConfig.data).map(([key, value]) => {
                    if (key === 'id' || key === 'image' || key === 'initial' || typeof value === 'object') return null;
                    
                    // تحويل مفاتيح الحقول إلى اللغة العربية لتبدو بشكل سليم في العرض
                    const arabicLabels = {
                      title: 'اسم المزاد / الفعالية',
                      startDate: 'تاريخ البدء',
                      endDate: 'تاريخ الانتهاء',
                      location: 'الموقع',
                      description: 'وصف الفعالية',
                      status: 'الحالة',
                      seller: 'اسم البائع',
                      phone: 'رقم الهاتف',
                      email: 'البريد الإلكتروني',
                      orderId: 'معرف الطلب',
                      name: 'الاسم',
                      orders: 'الطلبات',
                      license: 'رقم الرخصة',
                      specialty: 'التخصص',
                      date: 'التاريخ',
                      type: 'النوع',
                      amount: 'المبلغ',
                      horseName: 'اسم الخيل',
                      vetName: 'اسم الطبيب',
                      diagnosis: 'التشخيص',
                      horse: 'الخيل'
                    };
                    const displayLabel = arabicLabels[key] || key;

                    return (
                      <div key={key} className={`bg-gray-50 p-4 rounded-xl border border-gray-100 ${(key === 'about' || key === 'description') ? 'col-span-2' : ''}`}>
                        <span className="block text-gray-400 text-xs mb-2 font-bold uppercase">{displayLabel}</span>
                        <strong className="text-gray-800 text-base">{value}</strong>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-end"><button onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إغلاق</button></div>
              </div>
            )}

            {/* الإضافة والتعديل لـ "المرابط" (متعدد الخطوات) */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage === 'studs' && (
              <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-l from-emerald-900 to-emerald-800 shrink-0 rounded-t-2xl">
                      <h2 className="text-2xl font-black text-white flex items-center gap-3">
                          {modalConfig.type === 'edit' ? <><i className="fas fa-edit text-emerald-200"></i> تعديل بيانات المربط</> : <><i className="fas fa-plus-circle text-emerald-200"></i> إضافة مربط جديد</>}
                      </h2>
                      <button onClick={closeModal} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>

                  <div className="px-10 py-6 hidden sm:block shrink-0 bg-[#FAF9F6] dark:bg-gray-900 border-b border-gray-100">
                      <div className="flex items-center justify-between relative">
                          <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-200 -z-10"></div>
                          <div className="absolute top-4 right-[10%] h-[2px] bg-emerald-600 -z-10 transition-all duration-1000" style={{ width: `${((currentStep - 1) / 3) * 80}%` }}></div>
                          
                          {[
                              { num: 1, label: 'بيانات المربط' },
                              { num: 2, label: 'معلومات التواصل' },
                              { num: 3, label: 'روابط السوشيال ميديا' },
                              { num: 4, label: 'الصور والفيديو' }
                          ].map((step) => (
                              <div key={step.num} className="flex flex-col items-center gap-2 bg-[#FAF9F6] dark:bg-gray-900 px-2">
                                  <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 relative rounded-lg border
                                      ${currentStep >= step.num ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white text-gray-400 border-gray-200'}`}>
                                      {step.num}
                                  </div>
                                  <span className={`text-xs mt-1 transition-colors ${currentStep >= step.num ? 'text-emerald-800 font-bold' : 'text-gray-400'}`}>
                                      {step.label}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="p-6 md:p-8 overflow-hidden bg-[#FAF9F6] dark:bg-gray-900">
                      <div key={currentStep} className={slideDirection === 'forward' ? 'slide-forward' : 'slide-backward'}>
                          {currentStep === 1 && (
                              <div className="flex flex-col lg:flex-row gap-8">
                                  <div className="lg:w-2/3 space-y-5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative">
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <label className="text-sm font-bold text-emerald-800">اسم المربط (إنجليزي) *</label>
                                            <input type="text" value={formData.nameEn || ''} onChange={e => {
                                                  const val = e.target.value;
                                                  if (!/[\u0600-\u06FF]/.test(val)) { setFormData({...formData, nameEn: val}); setFormErrors({...formErrors, nameEn: false}); }
                                              }} className={`lux-input text-left ${formErrors.nameEn ? 'input-error' : ''}`} dir="ltr" placeholder="Stud Name" />
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <label className="text-sm font-bold text-emerald-800">اسم المربط (عربي) *</label>
                                            <input type="text" value={formData.name || ''} onChange={e => {
                                                  const val = e.target.value;
                                                  if (!/[a-zA-Z]/.test(val)) { setFormData({...formData, name: val}); setFormErrors({...formErrors, name: false}); }
                                              }} className={`lux-input ${formErrors.name ? 'input-error' : ''}`} dir="rtl" placeholder="اسم المربط" />
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <label className="text-sm font-bold text-emerald-800">تاريخ التأسيس *</label>
                                            <input type="date" value={formData.foundedDate || ''} onChange={e => {setFormData({...formData, foundedDate: e.target.value}); setFormErrors({...formErrors, foundedDate: false})}} className={`lux-input ${formErrors.foundedDate ? 'input-error' : ''}`} />
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <label className="text-sm font-bold text-emerald-800">رقم التسجيل *</label>
                                            <input type="text" value={formData.regNo || ''} onChange={e => {setFormData({...formData, regNo: e.target.value}); setFormErrors({...formErrors, regNo: false})}} className={`lux-input ${formErrors.regNo ? 'input-error' : ''}`} placeholder="رقم التسجيل" />
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
                                            <label className="text-sm font-bold text-emerald-800">نوع المربط *</label>
                                            <select value={formData.type || ''} onChange={e => {setFormData({...formData, type: e.target.value}); setFormErrors({...formErrors, type: false})}} className={`lux-input ${formErrors.type ? 'input-error' : ''}`}>
                                              <option value="" disabled hidden>اختر نوع المربط</option>
                                              <option value="تدريب">تدريب</option>
                                              <option value="بيع">بيع</option>
                                              <option value="تدريب وبيع">تدريب وبيع</option>
                                            </select>
                                          </div>
                                      </div>
                                      <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">نبذة عن المربط</label>
                                          <textarea placeholder="اكتب نبذة مختصرة عن المربط وتاريخه..." rows="3" value={formData.about || ''} onChange={e => setFormData({...formData, about: e.target.value})} className="lux-input resize-none"></textarea>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                              <label className="text-sm font-bold text-emerald-800">الدولة</label>
                                              <select value={formData.country || 'مصر'} onChange={e => setFormData({...formData, country: e.target.value})} className="lux-input opacity-70 cursor-not-allowed" disabled>
                                                  <option value="مصر">مصر</option>
                                              </select>
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                              <label className="text-sm font-bold text-emerald-800">المدينة / المحافظة *</label>
                                              <select value={formData.city || ''} onChange={e => {setFormData({...formData, city: e.target.value}); setFormErrors({...formErrors, city: false})}} className={`lux-input ${formErrors.city ? 'input-error' : ''}`}>
                                                  <option value="">اختر المحافظة</option>
                                                  {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                                              </select>
                                          </div>
                                      </div>
                                      <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">عنوان الشارع</label>
                                          <input type="text" placeholder="العنوان التفصيلي" value={formData.streetAddress || ''} onChange={e => setFormData({...formData, streetAddress: e.target.value})} className="lux-input" />
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                              <label className="text-sm font-bold text-emerald-800">خط العرض (Latitude)</label>
                                              <input type="text" placeholder="مثال: 30.0444" value={formData.lat || ''} onChange={e => setFormData({...formData, lat: e.target.value})} className="lux-input text-left" dir="ltr" />
                                          </div>
                                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                              <label className="text-sm font-bold text-emerald-800">خط الطول (Longitude)</label>
                                              <input type="text" placeholder="مثال: 31.2357" value={formData.lng || ''} onChange={e => setFormData({...formData, lng: e.target.value})} className="lux-input text-left" dir="ltr" />
                                          </div>
                                      </div>
                                  </div>
                                  <div className="lg:w-1/3 flex flex-col">
                                      <label className="text-sm font-bold text-emerald-800 mb-2 block">موقع المربط على الخريطة</label>
                                      <div className="flex-1 min-h-[300px] border border-gray-200 rounded-2xl relative overflow-hidden fake-map-bg p-3 shadow-inner">
                                          <div className="bg-white rounded-xl shadow-sm flex items-center p-2 mb-2 w-full z-10 relative border border-gray-200">
                                              <input type="text" placeholder="بحث عن موقع..." className="flex-1 outline-none text-sm bg-transparent px-2 font-medium" />
                                              <svg className="w-4 h-4 text-gray-400 mx-1 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                          </div>
                                          <button className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all z-10">
                                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )}
                          {currentStep === 2 && (
                              <div className="space-y-6 max-w-2xl mx-auto py-8">
                                  <div className="space-y-5">
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">البريد الإلكتروني *</label>
                                          <div className="relative">
                                              <input type="email" placeholder="example@stud.com" value={formData.email || ''} onChange={e => {setFormData({...formData, email: e.target.value}); setFormErrors({...formErrors, email: false})}} className={`lux-input pr-10 text-left ${formErrors.email ? 'input-error' : ''}`} dir="ltr" />
                                              <i className="fas fa-envelope absolute top-4 right-4 text-gray-400"></i>
                                          </div>
                                      </div>
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">رقم الهاتف الأساسي *</label>
                                          <div className="relative">
                                              <input type="tel" placeholder="+20 100 000 0000" value={formData.phone || ''} onChange={e => {
                                                      const val = e.target.value;
                                                      if (/^[\d+]*$/.test(val)) { setFormData({...formData, phone: val}); setFormErrors({...formErrors, phone: false}); }
                                                  }} className={`lux-input pr-10 text-left ${formErrors.phone ? 'input-error' : ''}`} dir="ltr" />
                                              <i className="fas fa-phone absolute top-4 right-4 text-gray-400"></i>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}
                          {currentStep === 3 && (
                              <div className="space-y-6 max-w-4xl mx-auto py-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">فيسبوك</label>
                                          <div className="relative"><input type="url" placeholder="https://facebook.com/..." value={formData.facebook || ''} onChange={e => setFormData({...formData, facebook: e.target.value})} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-facebook absolute top-4 right-4 text-[#1877F2]"></i></div>
                                      </div>
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">إنستجرام</label>
                                          <div className="relative"><input type="url" placeholder="https://instagram.com/..." value={formData.instagram || ''} onChange={e => setFormData({...formData, instagram: e.target.value})} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-instagram absolute top-4 right-4 text-[#E4405F]"></i></div>
                                      </div>
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">يوتيوب</label>
                                          <div className="relative"><input type="url" placeholder="https://youtube.com/..." value={formData.youtube || ''} onChange={e => setFormData({...formData, youtube: e.target.value})} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-youtube absolute top-4 right-4 text-[#FF0000]"></i></div>
                                      </div>
                                      <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                          <label className="text-sm font-bold text-emerald-800">إكس (تويتر)</label>
                                          <div className="relative"><input type="url" placeholder="https://x.com/..." value={formData.twitter || ''} onChange={e => setFormData({...formData, twitter: e.target.value})} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-twitter absolute top-4 right-4 text-[#1DA1F2]"></i></div>
                                      </div>
                                  </div>
                              </div>
                          )}
                          {currentStep === 4 && (
                              <div className="space-y-6 max-w-5xl mx-auto py-2">
                                  <div className="space-y-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-500 transition-colors">
                                      <label className="text-sm font-bold text-emerald-800 block">رفع صور المربط {modalConfig.type === 'add' && <span className="text-red-500">*</span>}</label>
                                      <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${formErrors.images ? 'border-red-500 bg-red-50' : ''}`}>
                                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                              <svg className="w-8 h-8 mb-3 text-emerald-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-emerald-600">اضغط لرفع صور</span> أو اسحب وأفلت</p>
                                              <p className="text-xs text-gray-400">الصيغ المدعومة : صور فقط (image/*)</p>
                                          </div>
                                          <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => {setFormData({...formData, images:[...(formData.images || []), ...Array.from(e.target.files)]}); setFormErrors({...formErrors, images: false})}} />
                                      </label>
                                      {formData.images && formData.images.length > 0 && (
                                          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                              {formData.images.map((img, i) => (
                                                  <div key={i} className="w-20 h-20 rounded-xl border-2 border-emerald-600 overflow-hidden flex-shrink-0 shadow-md">
                                                      <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                                  <div className="space-y-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                      <label className="text-sm font-bold text-emerald-800">رابط فيديو المربط الترويجي (يوتيوب)</label>
                                      <div className="relative"><input type="url" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl || ''} onChange={e => setFormData({...formData, videoUrl: e.target.value})} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-youtube absolute top-4 right-4 text-gray-400"></i></div>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                      <button onClick={handlePrevStep} className={`px-8 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'hidden' : 'block'}`}>السابق</button>
                      {currentStep < 4 ? (
                          <button onClick={handleNextStep} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">التالي</button>
                      ) : (
                          <button onClick={handleSubmit} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                              {modalConfig.type === 'edit' ? <i className="fas fa-save"></i> : null}
                              {modalConfig.type === 'edit' ? 'حفظ التعديلات' : 'حفظ البيانات'}
                          </button>
                      )}
                  </div>
              </div>
            )}

            {/* ======================= الإضافة والتعديل للخيول (تصميم منقسم في حالة التعديل) ======================= */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage === 'horses' && (
              <div className="flex flex-col md:flex-row w-full">
                
                {/* البطاقة الجانبية: تظهر فقط في حالة التعديل لتعرض البيانات الحالية */}
                {modalConfig.type === 'edit' && (
                  <div className="md:w-1/3 bg-gray-50 p-6 md:p-8 border-l border-gray-100 hidden md:block overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-200 pb-3 flex items-center gap-2">
                      <i className="fas fa-info-circle text-emerald-600"></i> البيانات الحالية
                    </h3>
                    
                    <div className="rounded-xl overflow-hidden shadow-sm border-4 border-white mb-5 bg-white">
                      <img src={modalConfig.data.image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400'} alt={modalConfig.data.name} className="w-full h-48 object-cover" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-400 block mb-1 font-bold">الاسم الحالي</span>
                        <strong className="text-sm text-gray-800">{modalConfig.data.name}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-400 block mb-1 font-bold">اللون • العمر</span>
                        <strong className="text-sm text-gray-800">{modalConfig.data.color} • {modalConfig.data.age}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-400 block mb-1 font-bold">السلالة • النوع</span>
                        <strong className="text-sm text-gray-800">{modalConfig.data.breed} • {modalConfig.data.type}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-400 block mb-1 font-bold">الموقع (المربط والفرع)</span>
                        <strong className="text-sm text-gray-800">{modalConfig.data.studName} - {modalConfig.data.branch}</strong>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-xs text-gray-400 block mb-1 font-bold">المالك الحالي</span>
                        <strong className="text-sm text-gray-800">{modalConfig.data.owner}</strong>
                      </div>
                    </div>
                    
                    {/* المرفقات: السجل الطبي وشجرة النسب */}
                    <div className="mt-4 flex flex-col gap-3">
                      {modalConfig.data.healthRecordPdf ? (
                        <a href={typeof modalConfig.data.healthRecordPdf === 'string' ? modalConfig.data.healthRecordPdf : URL.createObjectURL(modalConfig.data.healthRecordPdf)} target="_blank" rel="noreferrer" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition border border-blue-100 text-sm">
                          <i className="fas fa-file-medical"></i> السجل الطبي
                        </a>
                      ) : (
                        <div className="w-full bg-white text-gray-400 p-3 rounded-xl flex items-center justify-center gap-2 font-bold border border-gray-100 cursor-not-allowed text-sm shadow-sm">
                          <i className="fas fa-file-medical"></i> لا يوجد سجل طبي
                        </div>
                      )}

                      {modalConfig.data.pedigreeImg ? (
                        <a href={typeof modalConfig.data.pedigreeImg === 'string' ? modalConfig.data.pedigreeImg : URL.createObjectURL(modalConfig.data.pedigreeImg)} target="_blank" rel="noreferrer" className="w-full bg-green-50 text-green-600 hover:bg-green-100 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition border border-green-100 text-sm">
                          <i className="fas fa-project-diagram"></i> شجرة النسب
                        </a>
                      ) : (
                        <div className="w-full bg-white text-gray-400 p-3 rounded-xl flex items-center justify-center gap-2 font-bold border border-gray-100 cursor-not-allowed text-sm shadow-sm">
                          <i className="fas fa-project-diagram"></i> لا توجد شجرة نسب
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* فورم الإدخال (يأخذ ثلثين المساحة في التعديل، والمساحة كاملة في الإضافة) */}
                <form onSubmit={handleSubmit} className={`p-6 md:p-8 ${modalConfig.type === 'edit' ? 'md:w-2/3' : 'w-full max-w-2xl mx-auto'}`}>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                      <div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600">
                        <i className={`fas ${modalConfig.type === 'add' ? 'fa-plus' : 'fa-pen'}`}></i>
                      </div>
                      {modalConfig.type === 'add' ? 'إضافة خيل جديد' : `تعديل بيانات الخيل`}
                    </h2>
                    <button type="button" onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">صورة الحصان</label>
                        <div className="flex items-center justify-center w-full mt-1">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                              <i className="fas fa-cloud-upload-alt text-3xl mb-3 text-gray-400"></i>
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-emerald-600">اضغط لرفع صورة</span> أو اسحب وأفلت</p>
                            </div>
                            <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="hidden" />
                          </label>
                        </div>
                        {formData.image && (
                          <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم الحصان</label><input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="مثال: أدهم البادية" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اللون</label><input required name="color" value={formData.color || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="مثال: أشعل، أشقر، كميت..." /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الميلاد / العمر</label><input required name="age" value={formData.age || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="مثال: مايو 2021" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">المُربّي (Breeder)</label><input required name="breeder" value={formData.breeder || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="من قام بتوليد الحصان" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">المالك الحالي</label><input required name="owner" value={formData.owner || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="اسم المالك" /></div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                        <select name="status" value={formData.status || 'متاح للبيع'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition">
                          <option>متاح للبيع</option><option>مباع</option><option>تحت العلاج</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اسم المربط</label>
                        <select required name="studName" value={formData.studName || ''} onChange={handleStudChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition">
                          <option value="">اختر المربط...</option>
                          {Object.keys(studsData).map(stud => <option key={stud} value={stud}>{stud}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">فرع المزرعة</label>
                        <select required name="branch" value={formData.branch || ''} onChange={handleInputChange} disabled={!formData.studName} className={`w-full border border-gray-200 rounded-xl p-3 bg-gray-50 transition ${!formData.studName ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-emerald-600/30 outline-none'}`}>
                          <option value="">{formData.studName ? 'اختر الفرع...' : 'اختر المربط أولاً'}</option>
                          {formData.studName && studsData[formData.studName].map(branch => <option key={branch} value={branch}>{branch}</option>)}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">النوع</label>
                        <select required name="type" value={formData.type || 'فحل'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition">
                          <option value="فحل">فحل (ذكر بالغ)</option><option value="فرس">فرس (أنثى بالغة)</option><option value="مهر">مهر (ذكر صغير)</option><option value="مهرة">مهرة (أنثى صغيرة)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الرَّسَن (السلالة)</label>
                        <select required name="breed" value={formData.breed || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition">
                          <option value="">اختر الرسن...</option><option value="صقلاوي">صقلاوي</option><option value="صقلاوي جدراني">صقلاوي جدراني</option><option value="كحيلان">كحيلان</option><option value="عبيان">عبيان</option><option value="عبية الشراك">عبية الشراك</option><option value="حمداني">حمداني</option><option value="هدبان">هدبان</option><option value="شويمان">شويمان</option><option value="معنقي">معنقي</option><option value="أخرى">أخرى</option>
                        </select>
                      </div>
                      
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم الأب (Sire)</label><input required type="text" name="sire" value={formData.sire || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="اسم الأب" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم الأم (Dam)</label><input required type="text" name="dam" value={formData.dam || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition" placeholder="اسم الأم" /></div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">ملف السجلات الصحية</label>
                        <div className="flex items-center w-full mt-1">
                          <label className="flex items-center justify-center w-full h-14 border border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors px-4">
                            <div className="flex items-center justify-center gap-3">
                              <i className="fas fa-file-alt text-emerald-600 text-xl"></i>
                              <span className="text-sm text-gray-600 font-bold truncate">{formData.healthRecordPdf ? (formData.healthRecordPdf.name || 'ملف مرفق') : 'اضغط لاختيار الملف (PDF)'}</span>
                            </div>
                            <input type="file" name="healthRecordPdf" accept="application/pdf" onChange={handleInputChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">صورة شجرة النسب (Pedigree)</label>
                        <div className="flex items-center justify-center w-full mt-1">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                              <i className="fas fa-sitemap text-2xl mb-2 text-gray-400"></i>
                              <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-emerald-600">اضغط لرفع شهادة / صورة النسب</span></p>
                            </div>
                            <input type="file" name="pedigreeImg" accept="image/*" onChange={handleInputChange} className="hidden" />
                          </label>
                        </div>
                        {formData.pedigreeImg && (
                          <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md">
                            <img src={typeof formData.pedigreeImg === 'string' ? formData.pedigreeImg : URL.createObjectURL(formData.pedigreeImg)} alt="Pedigree Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-gray-100">
                    <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء الأمر</button>
                    <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30">
                      {modalConfig.type === 'add' ? 'حفظ الحصان' : 'حفظ التعديلات'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* الإضافة والتعديل للنماذج الأخرى (البائعين، المزادات، إلخ) */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage !== 'studs' && activeSidebarPage !== 'horses' && (
              <form onSubmit={handleSubmit} className="p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800"><div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600"><i className={`fas ${modalConfig.type === 'add' ? 'fa-plus' : 'fa-pen'}`}></i></div>{modalConfig.type === 'add' ? 'إضافة بيانات جديدة' : 'تعديل السجل الحالي'}</h2>
                  <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="grid grid-cols-2 gap-5">

                  {/* ======================= حقول صفحة المزادات ======================= */}
                  {activeSidebarPage === 'auctions' && (
                    <>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">صورة المزاد / الفعالية</label>
                        <div className="flex items-center justify-center w-full mt-1">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                              <i className="fas fa-image text-3xl mb-3 text-gray-400"></i>
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-emerald-600">اضغط لرفع صورة</span> أو اسحب وأفلت</p>
                            </div>
                            <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="hidden" />
                          </label>
                        </div>
                        {formData.image && (
                          <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">اسم المزاد / الفعالية</label><input required name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" placeholder="مثال: مزاد إيجي هورسياس الماسي" /></div>
                      
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">تاريخ البدء</label><input required type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الانتهاء</label><input required type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">الموقع</label><input required name="location" value={formData.location || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" placeholder="مثال: القاهرة - مصر" /></div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
                        <select name="status" value={formData.status || 'قيد الانتظار'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50">
                          <option>قيد الانتظار</option><option>مكتمل</option><option>ملغى</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">وصف المزاد</label>
                        <textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="3" className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 resize-none" placeholder="وصف تفصيلي للفعالية..."></textarea>
                      </div>
                    </>
                  )}

                  {/* ======================= حقول البائعين والمشترين والأطباء ======================= */}
                  {activeSidebarPage === 'dashboard' && activeTab === 'البائعين' && (
                    <>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم البائع</label><input required name="seller" value={formData.seller || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label><input required name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" placeholder="+966 50 000 0000" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label><input required type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label><select name="status" value={formData.status || 'مكتمل'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50"><option>مكتمل</option><option>قيد الانتظار</option><option>ملغى</option></select></div>
                    </>
                  )}
                  {activeSidebarPage === 'dashboard' && activeTab === 'المشترين' && (
                    <>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم المشتري</label><input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label><input required name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label><input required type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label><select name="status" value={formData.status || 'نشط'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50"><option>نشط</option><option>غير نشط</option></select></div>
                    </>
                  )}
                  {activeSidebarPage === 'dashboard' && activeTab === 'الأطباء البيطريين' && (
                    <>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم الطبيب</label><input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الرخصة</label><input required name="license" value={formData.license || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">التخصص</label><input required name="specialty" value={formData.specialty || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label><input required name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label><input required type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left" dir="ltr" /></div>
                      <div><label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label><select name="status" value={formData.status || 'نشط'} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50"><option>نشط</option><option>غير نشط</option></select></div>
                    </>
                  )}

                </div>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                  <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md">{modalConfig.type === 'add' ? 'حفظ وإضافة' : 'حفظ التعديلات'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= القائمة الجانبية (Sidebar) ================= */}
      <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col justify-between hidden md:flex z-10 shrink-0">
        <div>
          <div className="flex items-center gap-3 p-6 text-white mb-6">
            <div className="bg-emerald-600 min-w-[40px] h-10 flex items-center justify-center rounded-lg shadow-lg"><i className="fas fa-horse-head text-xl text-white"></i></div>
            <div><h1 className="font-bold text-lg leading-tight">نظام إدارة الخيول</h1><p className="text-[11px] text-gray-400">لوحة التحكم الإدارية</p></div>
          </div>
          
          <nav className="space-y-2 px-4 text-sm font-medium">
            <button onClick={() => setActiveSidebarPage('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-users w-5 text-center"></i> المستخدمين
            </button>
            <button onClick={() => setActiveSidebarPage('horses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'horses' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-horse w-5 text-center"></i> الخيول
            </button>
            <button onClick={() => setActiveSidebarPage('studs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'studs' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-building w-5 text-center"></i> المرابط والفروع
            </button>
            <button onClick={() => setActiveSidebarPage('auctions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'auctions' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-gavel w-5 text-center"></i> المزادات والفعاليات
            </button>
            <button onClick={() => setActiveSidebarPage('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'settings' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-cog w-5 text-center"></i> الإعدادات
            </button>
          </nav>
        </div>
        <div className="p-4 bg-gray-800 flex items-center justify-between m-4 rounded-xl cursor-pointer">
           <div><h4 className="text-white text-sm font-semibold">{adminData.name}</h4><p className="text-xs text-gray-400">مدير النظام</p></div>
          <div className="bg-[#e2e8f0] w-10 h-10 flex items-center justify-center rounded-full"><i className="fas fa-user text-gray-900"></i></div>
        </div>
      </aside>

      {/* ================= محتوى الصفحة ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100 z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-gray-800">
              {activeSidebarPage === 'dashboard' ? 'إدارة المستخدمين' : 
               activeSidebarPage === 'orders' ? 'إدارة الطلبات الشاملة' :
               activeSidebarPage === 'horses' ? 'سجل الخيول والملاك' :
               activeSidebarPage === 'studs' ? 'إدارة المرابط والفروع' :
               activeSidebarPage === 'auctions' ? 'إدارة المزادات والفعاليات' :
               activeSidebarPage === 'medical' ? 'الرعاية والسجلات الطبية' : 'إعدادات النظام'}
            </h2>
            {activeSidebarPage !== 'settings' && (
              <div className="relative w-80">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث سريع..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600" />
                <i className="fas fa-search absolute right-3.5 top-3.5 text-gray-400"></i>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-5 text-gray-500 text-lg relative">
              <div ref={notifRef} className="relative">
                <i onClick={() => setIsNotifOpen(!isNotifOpen)} className="fas fa-bell cursor-pointer hover:text-emerald-600 transition relative">
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </i>
                {isNotifOpen && (
                  <div className="absolute top-8 left-0 w-80 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 overflow-hidden transform transition-all">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h4 className="font-bold text-sm text-gray-800">الإشعارات الحديثة</h4>
                      <button className="text-xs text-emerald-600 hover:underline font-medium">تحديد الكل كمقروء</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b border-gray-50 hover:bg-emerald-50/50 cursor-pointer transition flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0"><i className="fas fa-shopping-bag"></i></div>
                        <div><p className="text-sm text-gray-800 font-medium">طلب جديد من <span className="font-bold">سعود بن عبدالعزيز</span></p><p className="text-xs text-gray-400 mt-1">منذ ١٠ دقائق</p></div>
                      </div>
                      <div className="p-4 border-b border-gray-50 hover:bg-emerald-50/50 cursor-pointer transition flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0"><i className="fas fa-check-circle"></i></div>
                        <div><p className="text-sm text-gray-800 font-medium">تم تأكيد التقرير الطبي للخيل <span className="font-bold">البراق</span></p><p className="text-xs text-gray-400 mt-1">منذ ساعتين</p></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 text-center border-t border-gray-100 cursor-pointer hover:bg-gray-100"><span className="text-sm text-gray-600 font-medium">عرض كل الإشعارات</span></div>
                  </div>
                )}
              </div>
              <i className="fas fa-language cursor-pointer hover:text-emerald-600 transition"></i>
            </div>
          </div>
        </header>

        {/* منطقة المحتوى القابلة للتمرير */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">

          {/* ======================= صفحة إدارة المستخدمين ======================= */}
          {activeSidebarPage === 'dashboard' && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div><p className="text-gray-500 text-sm mb-2 font-medium">إجمالي المستخدمين</p><h3 className="text-3xl font-bold text-gray-800">١,٢٥٠</h3><p className="text-green-500 text-xs mt-2 font-medium"><i className="fas fa-arrow-up ml-1"></i>٥٪ عن الشهر الماضي</p></div>
                  <div className="bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl"><i className="fas fa-users text-emerald-600 text-2xl"></i></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div><p className="text-gray-500 text-sm mb-2 font-medium">الطلبات النشطة</p><h3 className="text-3xl font-bold text-gray-800">٤٥</h3><p className="text-green-500 text-xs mt-2 font-medium"><i className="fas fa-arrow-up ml-1"></i>٢٪ هذا الأسبوع</p></div>
                  <div className="bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl"><i className="fas fa-shopping-cart text-emerald-600 text-2xl"></i></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div><p className="text-gray-500 text-sm mb-2 font-medium">طلبات قيد الانتظار</p><h3 className="text-3xl font-bold text-gray-800">١٢</h3><p className="text-red-500 text-xs mt-2 font-medium"><i className="fas fa-arrow-down ml-1"></i>١٪ منذ أمس</p></div>
                  <div className="bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl"><i className="fas fa-clipboard-list text-emerald-600 text-2xl"></i></div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-bold text-gray-800">إدارة المستخدمين</h3>
                  <div className="flex items-center gap-3">
                    <div className="relative" ref={filterRef}>
                      <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`w-10 h-10 flex items-center justify-center border rounded-lg transition ${isFilterOpen ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <i className="fas fa-filter"></i>
                      </button>
                      {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-20">
                          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase border-b border-gray-50 mb-1">تصفية حسب:</p>
                          <button onClick={() => {setFilterStatus('الكل'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'الكل' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>الكل</button>
                          {activeTab === 'البائعين' ? (
                            <>
                              <button onClick={() => {setFilterStatus('مكتمل'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'مكتمل' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>مكتمل</button>
                              <button onClick={() => {setFilterStatus('قيد الانتظار'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'قيد الانتظار' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>قيد الانتظار</button>
                              <button onClick={() => {setFilterStatus('ملغى'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'ملغى' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>ملغى</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => {setFilterStatus('نشط'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'نشط' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>نشط</button>
                              <button onClick={() => {setFilterStatus('غير نشط'); setIsFilterOpen(false);}} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'غير نشط' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>غير نشط</button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <button onClick={handleDownloadCSV} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-green-600 transition" title="تصدير كـ CSV"><i className="fas fa-download"></i></button>
                  </div>
                </div>

                <div className="flex border-b border-gray-100 px-6 bg-gray-50/30">
                  {['البائعين', 'المشترين', 'الأطباء البيطريين'].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-6 font-semibold text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}>{tab}</button>
                  ))}
                </div>

                <div className="flex-1 overflow-x-auto">
                  {activeTab === 'البائعين' && (
                    <>
                      <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">قائمة البائعين</h3>
                          <p className="text-sm text-gray-400 font-medium">إدارة ومتابعة جميع البائعين المسجلين في النظام</p>
                        </div>
                        <button onClick={() => openModal('add')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition shadow-md"><i className="fas fa-plus"></i> إضافة بائع جديد</button>
                      </div>
                      <table className="w-full text-right">
                        <thead className="bg-gray-50/50 text-gray-500 text-xs font-semibold">
                          <tr><th className="py-4 px-6">معرف الطلب</th><th className="py-4 px-6">اسم البائع</th><th className="py-4 px-6 text-center">رقم الهاتف</th><th className="py-4 px-6 text-center">البريد الإلكتروني</th><th className="py-4 px-6 text-center">الحالة</th><th className="py-4 px-6 text-center">الإجراءات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {processedData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition group">
                              <td className="py-4 px-6 text-sm font-bold text-gray-700">{row.id}</td>
                              <td className="py-4 px-6 text-sm text-gray-800 font-bold">{row.seller}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-medium tracking-wide text-center" dir="ltr">{row.phone}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">{row.email}</td>
                              <td className="py-4 px-6 text-sm text-center"><span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getOrderStatusStyle(row.status)}`}>{row.status}</span></td>
                              <td className="py-4 px-6 text-sm flex justify-center gap-4 mt-2">
                                <button onClick={() => openModal('view', row)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                                <button onClick={() => openModal('edit', row)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                                <button onClick={() => openModal('delete', row)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  {activeTab === 'المشترين' && (
                    <>
                      <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">قائمة المشترين</h3>
                          <p className="text-sm text-gray-400 font-medium">إدارة ومتابعة جميع المشترين المسجلين في النظام</p>
                        </div>
                        <button onClick={() => openModal('add')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition shadow-md"><i className="fas fa-plus"></i> إضافة مشتر جديد</button>
                      </div>
                      <table className="w-full text-right">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold">
                          <tr><th className="py-4 px-6">معرف الطلب</th><th className="py-4 px-6">اسم المشتري</th><th className="py-4 px-6 text-center">رقم الهاتف</th><th className="py-4 px-6 text-center">البريد الإلكتروني</th><th className="py-4 px-6 text-center">الحالة</th><th className="py-4 px-6 text-center">الإجراءات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {processedData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                              <td className="py-4 px-6 text-sm font-bold text-gray-700">{row.orderId}</td>
                              <td className="py-4 px-6"><div className="flex items-center justify-start gap-4"><div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">{row.initial}</div><span className="font-bold text-gray-800 text-sm">{row.name}</span></div></td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-medium tracking-wide text-center" dir="ltr">{row.phone}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">{row.email}</td>
                              <td className="py-4 px-6 text-center"><span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center justify-center w-max mx-auto gap-1.5 ${getOrderStatusStyle(row.status)}`}>{row.status}</span></td>
                              <td className="py-4 px-6 text-sm flex justify-center gap-5 mt-2">
                                <button onClick={() => openModal('view', row)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                                <button onClick={() => openModal('edit', row)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                                <button onClick={() => openModal('delete', row)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  {activeTab === 'الأطباء البيطريين' && (
                    <>
                      <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">قائمة الأطباء البيطريين</h3>
                          <p className="text-sm text-gray-400 font-medium">إدارة وتعديل بيانات الطاقم الطبي</p>
                        </div>
                        <button onClick={() => openModal('add')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition shadow-md"><i className="fas fa-user-plus"></i> إضافة طبيب جديد</button>
                      </div>
                      <table className="w-full text-right">
                        <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold">
                          <tr><th className="py-4 px-6">معرف الطلب</th><th className="py-4 px-6">اسم الطبيب</th><th className="py-4 px-6 text-center">التخصص</th><th className="py-4 px-6 text-center">معلومات الاتصال</th><th className="py-4 px-6 text-center">الحالة</th><th className="py-4 px-6 text-center">الإجراءات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {processedData.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                              <td className="py-4 px-6 text-sm font-bold text-gray-700">{row.orderId}</td>
                              <td className="py-4 px-6"><div className="flex items-center justify-start gap-4"><div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">{row.initial}</div><div><h4 className="font-bold text-gray-800 text-sm">{row.name}</h4><span className="text-xs text-gray-400 font-medium">رقم الرخصة: {row.license}</span></div></div></td>
                              <td className="py-4 px-6 text-sm text-gray-600 font-medium text-center">{row.specialty}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center"><div className="flex flex-col gap-1 items-center"><div className="flex items-center gap-2"><span dir="ltr">{row.email}</span> <i className="fas fa-envelope text-gray-400"></i></div><div className="flex items-center gap-2"><span dir="ltr">{row.phone}</span> <i className="fas fa-phone-alt text-gray-400"></i></div></div></td>
                              <td className="py-4 px-6 text-center"><span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center justify-center w-max mx-auto gap-1.5 ${getOrderStatusStyle(row.status)}`}>{row.status}</span></td>
                              <td className="py-4 px-6 text-sm flex justify-center gap-5 mt-4">
                                <button onClick={() => openModal('view', row)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                                <button onClick={() => openModal('edit', row)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                                <button onClick={() => openModal('delete', row)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-gray-100 flex items-center justify-end">
                  <div className="flex items-center gap-2" dir="ltr">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"><i className="fas fa-chevron-left text-xs text-gray-400"></i></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white text-sm font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"><i className="fas fa-chevron-right text-xs text-gray-400"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= صفحة الخيول ======================= */}
          {activeSidebarPage === 'horses' && (
            <div className="animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة الخيول وسجلاتها</h2>
                  <p className="text-gray-500">متابعة كافة بيانات الخيول، الملاك، والحالة العامة لكل خيل.</p>
                </div>
                <button onClick={() => openModal('add')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition flex items-center gap-2">
                  <i className="fas fa-plus"></i> إضافة خيل جديد
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-bold text-gray-800">قائمة الخيول</h3>
                  <button onClick={handleDownloadCSV} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-green-600 transition" title="تصدير كـ CSV">
                    <i className="fas fa-download"></i>
                  </button>
                </div>

                <table className="w-full text-right">
                  <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-5 px-6">الرقم</th>
                      <th className="py-5 px-6">الخيل</th>
                      <th className="py-5 px-6">السلالة</th>
                      <th className="py-5 px-6 text-center">العمر واللون</th>
                      <th className="py-5 px-6">المالك الحالي</th>
                      <th className="py-5 px-6 text-center">الحالة</th>
                      <th className="py-5 px-6 text-center">الخيارات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedData.map((horse) => (
                      <tr key={horse.id} className="hover:bg-gray-50 transition">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{horse.id}</td>
                        <td className="py-5 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <img src={horse.image} alt="Horse" className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100" />
                            <span className="font-bold text-gray-800">{horse.name}</span>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-sm font-medium text-gray-600">{horse.breed}</td>
                        <td className="py-5 px-6 text-sm text-center text-gray-500">{horse.age} • {horse.color}</td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{horse.owner}</td>
                        <td className="py-5 px-6 text-sm text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getOrderStatusStyle(horse.status)}`}>{horse.status}</span>
                        </td>
                        <td className="py-5 px-6 text-sm flex justify-center gap-4 mt-3">
                          <button onClick={() => openModal('view', horse)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                          <button onClick={() => openModal('edit', horse)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                          <button onClick={() => openModal('delete', horse)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= صفحة المرابط ======================= */}
          {activeSidebarPage === 'studs' && (
            <div className="animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة المرابط والفروع</h2>
                  <p className="text-gray-500">إضافة وتعديل بيانات المرابط، الفروع، وبيانات التواصل الخاصة بها.</p>
                </div>
                <button onClick={() => openModal('add')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition flex items-center gap-2">
                  <i className="fas fa-plus"></i> إضافة مربط جديد
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-bold text-gray-800">قائمة المرابط</h3>
                  <button onClick={handleDownloadCSV} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-green-600 transition" title="تصدير كـ CSV">
                    <i className="fas fa-download"></i>
                  </button>
                </div>

                <table className="w-full text-right">
                  <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-5 px-6">المعرف</th>
                      <th className="py-5 px-6">اسم المربط</th>
                      <th className="py-5 px-6 text-center">النوع</th>
                      <th className="py-5 px-6 text-center">المحافظة</th>
                      <th className="py-5 px-6 text-center">معلومات التواصل</th>
                      <th className="py-5 px-6 text-center">الحالة</th>
                      <th className="py-5 px-6 text-center">الخيارات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedData.map((stud) => (
                      <tr key={stud.id} className="hover:bg-gray-50 transition">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{stud.id}</td>
                        <td className="py-5 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <img src={stud.image} alt="Stud" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                            <div>
                                <span className="font-bold text-gray-800 block">{stud.name}</span>
                                <span className="text-xs text-gray-400 block">{stud.nameEn}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-sm text-center font-medium text-gray-600">{stud.type}</td>
                        <td className="py-5 px-6 text-sm text-center font-bold text-gray-700">{stud.city}</td>
                        <td className="py-5 px-6 text-sm text-gray-500 font-medium text-center">
                            <div className="flex flex-col gap-1 items-center">
                                <div className="flex items-center gap-2"><span dir="ltr">{stud.email}</span></div>
                                <div className="flex items-center gap-2"><span dir="ltr">{stud.phone}</span></div>
                            </div>
                        </td>
                        <td className="py-5 px-6 text-sm text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getOrderStatusStyle(stud.status)}`}>{stud.status}</span>
                        </td>
                        <td className="py-5 px-6 text-sm flex justify-center gap-4 mt-3">
                          <button onClick={() => openModal('view', stud)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                          <button onClick={() => openModal('edit', stud)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                          <button onClick={() => openModal('delete', stud)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= صفحة المزادات ======================= */}
          {activeSidebarPage === 'auctions' && (
            <div className="animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">إدارة المزادات والفعاليات</h2>
                  <p className="text-gray-500">إضافة وتعديل بيانات المزادات، البطولات، ومتابعة تواريخها وحالتها.</p>
                </div>
                <button onClick={() => openModal('add')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition flex items-center gap-2">
                  <i className="fas fa-plus"></i> إضافة مزاد جديد
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-bold text-gray-800">قائمة المزادات</h3>
                  <button onClick={handleDownloadCSV} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-green-600 transition" title="تصدير كـ CSV">
                    <i className="fas fa-download"></i>
                  </button>
                </div>

                <table className="w-full text-right">
                  <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-5 px-6">المعرف</th>
                      <th className="py-5 px-6">اسم المزاد / الفعالية</th>
                      <th className="py-5 px-6 text-center">تاريخ البدء</th>
                      <th className="py-5 px-6 text-center">الموقع</th>
                      <th className="py-5 px-6 text-center">الحالة</th>
                      <th className="py-5 px-6 text-center">الخيارات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedData.map((auction) => (
                      <tr key={auction.id} className="hover:bg-gray-50 transition">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{auction.id}</td>
                        <td className="py-5 px-6 text-sm">
                          <div className="flex items-center gap-3">
                            <img src={auction.image} alt="Auction" className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100" />
                            <div>
                                <span className="font-bold text-gray-800 block truncate max-w-[200px]">{auction.title}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-sm text-center font-medium text-gray-600" dir="ltr">{auction.startDate}</td>
                        <td className="py-5 px-6 text-sm text-center font-bold text-gray-700">{auction.location}</td>
                        <td className="py-5 px-6 text-sm text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getOrderStatusStyle(auction.status)}`}>{auction.status}</span>
                        </td>
                        <td className="py-5 px-6 text-sm flex justify-center gap-4 mt-3">
                          <button onClick={() => openModal('view', auction)} className="text-gray-400 hover:text-emerald-600 transition"><i className="fas fa-eye text-lg"></i></button>
                          <button onClick={() => openModal('edit', auction)} className="text-gray-400 hover:text-blue-500 transition"><i className="fas fa-pen text-lg"></i></button>
                          <button onClick={() => openModal('delete', auction)} className="text-gray-400 hover:text-red-500 transition"><i className="fas fa-trash text-lg"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= صفحة الإعدادات ======================= */}
          {activeSidebarPage === 'settings' && (
            <div className="animate-fade-in-up max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner"><i className="fas fa-cogs"></i></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">إعدادات النظام</h2>
                    <p className="text-gray-500 text-sm mt-1">إدارة تفاصيل الحساب، الإشعارات، والأمان.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* إعدادات الملف الشخصي */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-user-circle text-gray-400"></i> معلومات الحساب</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                        <input 
                          type="text" 
                          value={settingsInput.name} 
                          onChange={(e) => setSettingsInput({...settingsInput, name: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/50" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          value={settingsInput.email}
                          onChange={(e) => setSettingsInput({...settingsInput, email: e.target.value})}
                          dir="ltr" 
                          className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600/50" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                        <input 
                          type="tel" 
                          value={settingsInput.phone}
                          onChange={(e) => setSettingsInput({...settingsInput, phone: e.target.value})}
                          dir="ltr" 
                          className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-emerald-600/50" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* إعدادات الأمان وتغيير كلمة المرور */}
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <i className="fas fa-shield-alt text-gray-400"></i> إعدادات الأمان
                      </h3>
                      <button 
                        onClick={() => {
                          setIsPasswordChangeOpen(!isPasswordChangeOpen);
                          if(isPasswordChangeOpen){
                             setSettingsInput(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${isPasswordChangeOpen ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        <i className={`fas ${isPasswordChangeOpen ? 'fa-times' : 'fa-lock'}`}></i>
                        {isPasswordChangeOpen ? 'إلغاء التغيير' : 'تغيير كلمة المرور'}
                      </button>
                    </div>

                    {isPasswordChangeOpen && (
                      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الحالية</label>
                            <input 
                              type="password" 
                              value={settingsInput.currentPassword}
                              onChange={(e) => setSettingsInput({...settingsInput, currentPassword: e.target.value})}
                              className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50 text-left" 
                              dir="ltr"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                            <input 
                              type="password" 
                              value={settingsInput.newPassword}
                              onChange={(e) => setSettingsInput({...settingsInput, newPassword: e.target.value})}
                              className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50 text-left" 
                              dir="ltr"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
                            <input 
                              type="password" 
                              value={settingsInput.confirmPassword}
                              onChange={(e) => setSettingsInput({...settingsInput, confirmPassword: e.target.value})}
                              className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/50 text-left" 
                              dir="ltr"
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* إعدادات النظام والإشعارات */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fas fa-bell text-gray-400"></i> تفضيلات النظام</h3>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                      
                      {/* زر الإشعارات */}
                      <div className="flex items-center justify-between">
                        <div><h4 className="font-bold text-sm text-gray-800">تلقي إشعارات البريد</h4><p className="text-xs text-gray-500 mt-1">إرسال ملخص يومي بالطلبات الجديدة وحالة الخيول.</p></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* زر تفعيل الوضع الداكن */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">تفعيل الوضع الداكن</h4>
                          <p className="text-xs text-gray-500 mt-1">تغيير ألوان الواجهة إلى الألوان الداكنة لإراحة العين.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isDarkMode} 
                            onChange={() => setIsDarkMode(!isDarkMode)} 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                    </div>
                  </div>

                  {/* حفظ */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                      onClick={handleSaveSettings}
                      className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all duration-300 ${saveStatus === 'saved' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                    >
                      {saveStatus === 'saved' ? 'تم الحفظ بنجاح ✓' : 'حفظ التغييرات'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* الفوتر */}
          <footer className="mt-8 flex justify-between text-sm text-gray-400 font-medium pb-4">
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-600 transition underline">سياسة الخصوصية</a>
              <a href="#" className="hover:text-gray-600 transition underline">الدعم الفني</a>
            </div>
            <p>© ٢٠٢٣ نظام إدارة الخيول. جميع الحقوق محفوظة.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}