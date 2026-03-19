import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionApi, horseApi, studApi, adminApi, joinApi } from '../api/api';

// --- بيانات المرابط وفروعها المتاحة للخيول ---
const studsData = {
  'الشحانية': ['ال الفرع الرئيسي', 'فرع الريان'],
  'مربط العرب': ['فرع القاهرة', 'فرع الإسكندرية', 'فرع الجيزة'],
  'إسطبلات نجد': ['الفرع الرئيسي', 'فرع الجيزة', 'فرع زايد'],
  'مربط الريان': ['الفرع الرئيسي', 'فرع الإسكندرية'],
  'مربط البادية': ['فرع الجيزة', 'فرع الفيوم', 'فرع سقارة'],
  'مزرعة رباب': ['الفرع الرئيسي', 'فرع سقارة'],
  'مربط صقر': ['الفرع الرئيسي', 'فرع المنصورية'],
  'أخرى': ['الفرع الرئيسي']
};

// --- قائمة محافظات مصر (لإضافة المرابط) ---
const egyptGovernorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية', 'القليوبية',
  'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية', 'السويس', 'كفر الشيخ',
  'الفيوم', 'بني سويف', 'مطروح', 'شمال سيناء', 'جنوب سيناء', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'البحر الأحمر', 'الأقصر', 'أسوان', 'الوادى الجديد'
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ================= 1. States الأساسية للتنقل =================
  const [activeSidebarPage, setActiveSidebarPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('البائعين');

  // ================= 2. States الإشعارات =================
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= 3. States الفلترة والبحث =================
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('الكل');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    setFilterStatus('الكل');
    setSearchQuery('');
  }, [activeTab, activeSidebarPage]);

  // ================= 4. قواعد البيانات (States) =================
  const [sellersData, setSellersData] = useState([]);
  const [buyersData, setBuyersData] = useState([]);
  const [vetsData, setVetsData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [horsesData, setHorsesData] = useState([]);
  const [medicalRecordsData, setMedicalRecordsData] = useState([]);
  const [studsDataList, setStudsDataList] = useState([]);
  const [auctionsDataList, setAuctionsDataList] = useState([]);
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, studsRes, horsesRes, auctionsRes, requestsRes] = await Promise.all([
        adminApi.getUsers(),
        studApi.getAll(),
        horseApi.getHorses(),
        auctionApi.getAuctions(),
        joinApi.getNotifications()
      ]);

      const allUsers = usersRes.data || [];
      setSellersData(allUsers.filter(u => u.Role === 'Owner' || u.role === 'Owner' || u.Role === 'Seller' || u.role === 'Seller').map(u => ({
        ...u,
        id: u.Id || u.id,
        seller: u.FullName || u.fullName,
        phone: u.PhoneNumber || u.phoneNumber,
        status: 'نشط'
      })));
      setBuyersData(allUsers.filter(u => u.Role === 'Buyer' || u.role === 'Buyer').map(u => ({
        ...u,
        id: u.Id || u.id,
        name: u.FullName || u.fullName,
        phone: u.PhoneNumber || u.phoneNumber,
        status: 'نشط'
      })));
      setVetsData(allUsers.filter(u => u.Role === 'EquineVet' || u.role === 'EquineVet').map(u => ({
        ...u,
        id: u.Id || u.id,
        name: u.FullName || u.fullName,
        phone: u.PhoneNumber || u.phoneNumber,
        status: 'نشط'
      })));

      setStudsDataList((studsRes.data || []).map(s => {
        const rawImg = s.ImageUrl || s.imageUrl || s.image;
        let finalImg = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=200';
        if (rawImg) {
          if (rawImg.startsWith('http') || rawImg.startsWith('/')) {
            finalImg = rawImg;
          } else {
            finalImg = `/uploads/studs/${rawImg}`;
          }
        }
        return {
          ...s,
          id: s.StudId || s.Id || s.id,
          name: s.NameArabic || s.Name || s.name,
          image: finalImg,
          status: 'نشط'
        };
      }));

      setHorsesData((horsesRes.data || []).map(h => {
        const rawImg = h.ImageUrl || h.imageUrl || h.image;
        let finalImg = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=200';
        if (rawImg) {
          if (rawImg.startsWith('http') || rawImg.startsWith('/')) {
            finalImg = rawImg;
          } else if (rawImg.startsWith('horses/')) {
            finalImg = `/${rawImg}`; // From public/horses/
          } else {
            finalImg = `/uploads/horses/${rawImg}`;
          }
        }
        return {
          ...h,
          id: h.MicrochipId || h.microchipId || h.Id || h.id || (h.MicrochipId === 0 ? 0 : 'غير معروف'),
          name: h.Name || h.name,
          image: finalImg,
          status: h.IsApproved ? 'مقبول' : 'قيد الانتظار'
        };
      }));

      setAuctionsDataList((auctionsRes.data || []).map(a => {
        const rawImg = a.ImageUrl || a.imageUrl || a.image;
        let finalImg = 'https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?auto=format&fit=crop&q=80&w=200';
        if (rawImg) {
          if (rawImg.startsWith('http') || rawImg.startsWith('/')) {
            finalImg = rawImg;
          } else if (rawImg.startsWith('auctions/')) {
            finalImg = `/${rawImg}`; // From public/auctions/
          } else {
            finalImg = `/uploads/auctions/${rawImg}`;
          }
        }
        return {
          ...a,
          id: a.Id || a.id,
          title: a.Name || a.name,
          image: finalImg,
          status: a.Status || 'نشط'
        };
      }));

      setRegistrationRequests((requestsRes.data || []).map(r => ({
        id: r.id,
        ...r.request,
        fullName: r.request?.FullName || r.request?.fullName,
        email: r.request?.Email || r.request?.email,
        phoneNumber: r.request?.PhoneNumber || r.request?.phoneNumber,
        nationalId: r.request?.NationalId || r.request?.nationalId,
        type: r.request?.Role === 'EquineVet' ? 'طبيب بيطري' : r.request?.Role === 'Seller' ? 'بائع' : 'مشتري',
        status: 'قيد الانتظار',
        date: new Date().toLocaleDateString('ar-EG')
      })));

    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin' || userRole === 'admin';
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const updateStudsDataList = (newList) => { setStudsDataList(newList); };
  const updateHorsesData = (newList) => { setHorsesData(newList); };
  const updateAuctionsDataList = (newList) => { setAuctionsDataList(newList); };


  // ================= 5. دوال البحث والفلترة =================
  const getProcessedData = () => {
    let data = [];
    if (activeSidebarPage === 'orders') data = ordersData;
    else if (activeSidebarPage === 'horses') data = horsesData;
    else if (activeSidebarPage === 'studs') data = studsDataList;
    else if (activeSidebarPage === 'auctions') data = auctionsDataList;
    else if (activeSidebarPage === 'medical') data = medicalRecordsData;
    else if (activeSidebarPage === 'requests') data = registrationRequests;
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
    const headers = Object.keys(processedData[0]).filter(k => k !== 'image' && k !== 'initial' && k !== 'files').join(',');
    const rows = processedData.map(row => Object.entries(row).filter(([k]) => k !== 'image' && k !== 'initial' && k !== 'files').map(([_, v]) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + headers + '\n' + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url;
    let fileName = activeTab;
    if (activeSidebarPage === 'orders') fileName = 'Orders';
    if (activeSidebarPage === 'horses') fileName = 'Horses';
    if (activeSidebarPage === 'studs') fileName = 'Studs';
    if (activeSidebarPage === 'auctions') fileName = 'Auctions';
    if (activeSidebarPage === 'medical') fileName = 'Medical_Records';
    if (activeSidebarPage === 'requests') fileName = 'Registration_Requests';
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const getOrderStatusStyle = (status) => {
    if (status === 'مكتمل' || status === 'متاح للبيع' || status === 'سليم' || status === 'نشط' || status === 'مقبول') return 'bg-green-100 text-green-600';
    if (status === 'قيد الانتظار' || status === 'قيد المراجعة' || status === 'قيد العلاج' || status === 'تحت العلاج') return 'bg-yellow-100 text-yellow-600';
    if (status === 'ملغى' || status === 'مباع' || status === 'غير نشط' || status === 'مرفوض') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  const getUserStatusStyle = (status) => status === 'نشط' ? 'bg-green-50 text-green-500 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200';

  // ================= 6. نظام الـ Modal =================
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', data: null });
  const [formData, setFormData] = useState({});

  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('forward');
  const [formErrors, setFormErrors] = useState({});

  const normalizeData = (data) => {
    if (!data) return {};
    const normalized = {};
    Object.keys(data).forEach(key => {
      const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
      normalized[camelCaseKey] = data[key];
    });
    return { ...normalized, ...data }; // Keep both for safety
  };

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, data });
    const normalized = normalizeData(data);

    if (activeSidebarPage === 'studs' && (type === 'add' || type === 'edit')) {
      setFormData(data ? { ...data, images: [], branches: data.branches || [] } : { country: 'مصر', images: [], branches: [] });
      setCurrentStep(1);
      setFormErrors({});
    } else if (activeSidebarPage === 'auctions' && (type === 'add' || type === 'edit')) {
      setFormData(data ? { ...data, venues: data.venues || [{ studName: '', branch: '', horseIds: [] }] } : { venues: [{ studName: '', branch: '', horseIds: [] }] });
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

  const addOrUpdateUserFromRequest = (req, status) => {
    const base = { ...req, status };

    const addToList = (setter, item) => setter(prev => [item, ...prev]);

    if (req.type === 'بائع' || req.role === 'Seller') {
      addToList(setSellersData, {
        ...base,
        id: `ORD-#${Math.floor(1000 + Math.random() * 9000)}`,
        seller: req.fullName,
        phone: req.phoneNumber,
        email: req.email
      });
    } else if (req.type === 'مشتري' || req.role === 'Buyer') {
      addToList(setBuyersData, {
        ...base,
        id: `b${Date.now()}`,
        orderId: `ORD-#${Math.floor(1000 + Math.random() * 9000)}`,
        initial: req.fullName ? req.fullName.charAt(0) : 'م',
        name: req.fullName,
        phone: req.phoneNumber,
        email: req.email
      });
    } else if (req.type === 'طبيب بيطري' || req.role === 'EquineVet') {
      addToList(setVetsData, {
        ...base,
        id: `v${Date.now()}`,
        orderId: `ORD-#${Math.floor(1000 + Math.random() * 9000)}`,
        initial: req.fullName ? req.fullName.replace('د. ', '').charAt(0) : 'ط',
        name: req.fullName,
        phone: req.phoneNumber,
        email: req.email
      });
    } else if (req.type === 'مربط' || req.role === 'Stud') {
      updateStudsDataList(prev => [{
        ...base,
        id: `S${Math.floor(100 + Math.random() * 900)}`,
        name: req.fullName,
        img: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=100&h=100&fit=crop',
        type: 'تدريب وبيع',
        status: 'نشط',
        stats: { offspring: 0, mares: 0, stallions: 0, regNo: req.commercialRegister || '' },
        branches: req.branches || [],
        about: req.about || ''
      }, ...prev]);
    } else if (req.type === 'حصان' || req.role === 'Horse') {
      updateHorsesData(prev => [{
        ...base,
        id: `HRS-${Math.floor(100 + Math.random() * 900)}`,
        name: req.name,
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop'
      }, ...prev]);
    }
  };

  const handleRequestAction = async (id, newStatus) => {
    setIsLoading(true);
    try {
      if (newStatus === 'مرفوض') {
        await joinApi.deny(id);
      } else {
        const request = registrationRequests.find(r => r.id === id);
        if (request?.horseRequest || request?.type === 'طلب تسجيل خيل') {
          await joinApi.approveHorse(id);
        } else {
          await joinApi.approve(id);
        }
      }
      // Refresh all data from the server
      await fetchData();
      if (modalConfig.isOpen) closeModal();
    } catch (error) {
      console.error("Error processing request:", error);
      alert("حدث خطأ أثناء معالجة الطلب.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        // Store the actual file object for submission
        setFormData(prev => ({
          ...prev,
          [name]: files[0],
          // Also store a preview URL for UI display if it's an image
          [`${name}Preview`]: files[0].type.startsWith('image/') ? URL.createObjectURL(files[0]) : null
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStudChange = (e) => {
    const selectedStud = e.target.value;
    setFormData({ ...formData, studName: selectedStud, branch: '' });
  };

  const normalize = (str) => typeof str === 'string' ? str.trim().replace(/\s+/g, ' ') : '';

  const getBranchesForStud = (studName) => {
    if (!studName) return [];
    const normalizedStud = normalize(studName);

    // 1) Branches coming from existing horses in that stud
    const branchesFromHorses = Array.from(new Set(
      horsesData
        .filter(h => normalize(h.studName) === normalizedStud)
        .map(h => normalize(h.branch))
    )).filter(Boolean);
    if (branchesFromHorses.length > 0) return branchesFromHorses;

    // 2) Branches defined on the stud object (added/edited via admin)
    const stud = studsDataList.find(s => normalize(s.name) === normalizedStud);
    if (stud?.branches?.length > 0) {
      return stud.branches.map(normalize).filter(Boolean);
    }

    // 3) Fallback to the hardcoded branches list (if available)
    return (studsData[studName] || []).map(normalize).filter(Boolean);
  };

  const getHorsesForVenue = (venue) => {
    if (!venue?.studName || !venue?.branch) return [];
    const normalizedStud = normalize(venue.studName);
    const normalizedBranch = normalize(venue.branch);
    return horsesData.filter(h => normalize(h.studName) === normalizedStud && normalize(h.branch) === normalizedBranch);
  };

  const updateAuctionVenue = (index, field, value) => {
    setFormData(prev => {
      const venues = [...(prev.venues || [])];
      venues[index] = { ...venues[index], [field]: value };
      if (field === 'studName') {
        venues[index].branch = '';
        venues[index].horseIds = [];
      }
      if (field === 'branch') {
        venues[index].horseIds = [];
      }
      return { ...prev, venues };
    });
  };

  const addAuctionVenue = () => {
    setFormData(prev => ({
      ...prev,
      venues: [...(prev.venues || []), { studName: '', branch: '', horseIds: [] }]
    }));
  };

  const removeAuctionVenue = (index) => {
    setFormData(prev => {
      const venues = [...(prev.venues || [])];
      venues.splice(index, 1);
      return { ...prev, venues };
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    let errors = {};

    if (activeSidebarPage === 'studs') {
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
    }

    if (activeSidebarPage === 'auctions' && currentStep === 1) {
      if (!formData.title?.trim()) errors.title = true;
      if (!formData.startDate) errors.startDate = true;
      if (!formData.endDate) errors.endDate = true;
      if (!formData.location?.trim()) errors.location = true;
      if (!formData.description?.trim()) errors.description = true;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeSidebarPage === 'studs') {
        const studForm = new FormData();
        // Mandatory fields
        studForm.append('NameArabic', formData.name);
        studForm.append('NameEnglish', formData.nameEn);
        studForm.append('FoundedDate', formData.foundedDate);
        studForm.append('RegistrationNumber', formData.regNo);
        studForm.append('Type', formData.type);
        studForm.append('City', formData.city);
        studForm.append('Email', formData.email);
        studForm.append('PhoneNumber', formData.phone);

        // Optional fields
        if (formData.about) studForm.append('About', formData.about);
        if (formData.facebook) studForm.append('FacebookUrl', formData.facebook);
        if (formData.instagram) studForm.append('InstagramUrl', formData.instagram);
        if (formData.youtube) studForm.append('YoutubeUrl', formData.youtube);
        if (formData.twitter) studForm.append('TwitterUrl', formData.twitter);
        if (formData.videoUrl) studForm.append('VideoUrl', formData.videoUrl);
        if (formData.lat) studForm.append('Latitude', formData.lat);
        if (formData.lng) studForm.append('Longitude', formData.lng);

        // Branches
        if (formData.branches && formData.branches.length > 0) {
          formData.branches.forEach((b, i) => studForm.append(`Branches[${i}]`, b));
        }

        // Image file
        if (formData.image instanceof File) {
          studForm.append('ImageFile', formData.image);
        } else if (formData.images && formData.images[0] instanceof File) {
          studForm.append('ImageFile', formData.images[0]);
        }

        if (modalConfig.type === 'add') {
          await studApi.create(studForm);
        } else {
          await studApi.update(formData.id, studForm);
        }
      } else if (activeSidebarPage === 'auctions') {
        const auctionPayload = {
          Name: formData.title,
          StartDate: formData.startDate,
          EndDate: formData.endDate,
          Location: formData.location,
          Description: formData.description,
          Status: formData.status || 'نشط'
        };

        if (modalConfig.type === 'add') {
          await auctionApi.createAuction(auctionPayload);
        } else {
          await adminApi.updateAuction(formData.id, auctionPayload);
        }
      } else if (activeSidebarPage === 'horses') {
        const horseForm = new FormData();
        horseForm.append('Name', formData.name);
        horseForm.append('Color', formData.color);
        horseForm.append('Age', formData.age);
        horseForm.append('Breeder', formData.breeder);
        horseForm.append('Owner', formData.owner);
        horseForm.append('Status', formData.status);
        horseForm.append('StudName', formData.studName);
        horseForm.append('Branch', formData.branch);
        horseForm.append('Type', formData.type);
        horseForm.append('Breed', formData.breed);
        horseForm.append('Sire', formData.sire);
        horseForm.append('Dam', formData.dam);

        if (formData.image instanceof File) horseForm.append('ImageFile', formData.image);
        if (formData.pedigreeImg instanceof File) horseForm.append('PedigreeImageFile', formData.pedigreeImg);
        if (formData.healthRecordPdf instanceof File) horseForm.append('HealthRecordFile', formData.healthRecordPdf);

        if (modalConfig.type === 'add') {
          await horseApi.createHorse(horseForm);
        } else {
          await adminApi.updateHorse(formData.id || formData.microchipId, horseForm);
        }
      } else if (activeSidebarPage === 'dashboard' || activeSidebarPage === 'requests') {
        if (modalConfig.type === 'add') {
          const userForm = new FormData();
          userForm.append('FullName', (activeTab === 'البائعين' ? formData.seller : formData.name) || formData.fullName);
          userForm.append('Email', formData.email);
          userForm.append('PhoneNumber', formData.phone);
          userForm.append('NationalId', formData.nationalId);
          userForm.append('Role', activeTab === 'البائعين' ? 'Seller' : activeTab === 'المشترين' ? 'Buyer' : 'EquineVet');
          userForm.append('Password', 'Admin123!');
          userForm.append('ConfirmPassword', 'Admin123!');

          if (activeTab === 'البائعين') {
            userForm.append('FarmName', formData.farmName);
            userForm.append('SellerRole', formData.sellerRole);
            userForm.append('CommercialRegister', formData.commercialRegister);
            userForm.append('ExperienceYears', formData.experienceYears);
            userForm.append('Address', formData.address);
          } else if (activeTab === 'الأطباء البيطريين') {
            userForm.append('License', formData.license);
            userForm.append('Specialty', formData.specialty);
            userForm.append('ExperienceYears', formData.experienceYears);
            userForm.append('ClinicsWorkedAt', formData.clinicsWorkedAt);
            userForm.append('VetBio', formData.vetBio);
          }

          await userApi.register(userForm);
        } else {
          const userUpdatePayload = {
            FullName: (activeTab === 'البائعين' ? formData.seller : formData.name) || formData.fullName,
            Email: formData.email,
            PhoneNumber: formData.phone,
            NationalId: formData.nationalId,
            Role: formData.role,
            Status: formData.status,
            FarmName: formData.farmName,
            SellerRole: formData.sellerRole,
            CommercialRegister: formData.commercialRegister,
            ExperienceYears: formData.experienceYears ? parseInt(formData.experienceYears) || 0 : null,
            Address: formData.address,
            CountryCity: formData.countryCity,
            License: formData.license,
            Specialty: formData.specialty,
            ClinicsWorkedAt: formData.clinicsWorkedAt,
            VetBio: formData.vetBio
          };
          await adminApi.updateUser(formData.id, userUpdatePayload);
        }
      }

      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("حدث خطأ أثناء حفظ البيانات. يرجى التأكد من المرفقات وصحة البيانات.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const id = modalConfig.data.id || modalConfig.data.Id || modalConfig.data.microchipId || modalConfig.data.MicrochipId;
    if (!id) return alert("لا يمكن تحديد معرف السجل للحذف");

    setIsLoading(true);
    try {
      if (activeSidebarPage === 'horses') await adminApi.deleteHorse(id);
      else if (activeSidebarPage === 'studs') await studApi.remove(id);
      else if (activeSidebarPage === 'auctions') await adminApi.deleteAuction(id);
      else if (activeSidebarPage === 'requests') await joinApi.deny(id);
      else {
        await adminApi.deleteUser(id);
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("حدث خطأ أثناء الحذف. قد يكون السجل مرتبطاً ببيانات أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative font-sans" dir="rtl">

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
          <div className={`bg-white rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-y-auto animate-fade-in-up custom-scrollbar ${((activeSidebarPage === 'studs') || (activeSidebarPage === 'horses' && modalConfig.type === 'edit') || activeSidebarPage === 'requests' || activeSidebarPage === 'dashboard') ? 'max-w-5xl' : 'max-w-3xl'}`}>

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

            {/* ======================= عرض تفاصيل طلب التسجيل (والمستخدمين في لوحة التحكم) ======================= */}
            {modalConfig.type === 'view' && (activeSidebarPage === 'requests' || activeSidebarPage === 'dashboard') && (
              <div className="p-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-gray-800">
                    <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600"><i className="fas fa-user-check"></i></div>
                    تفاصيل السجل الشامل
                  </h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getOrderStatusStyle(modalConfig.data.status)}`}>{modalConfig.data.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* البيانات الأساسية */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2"><i className="fas fa-id-card text-gray-400 ml-2"></i> البيانات الشخصية</h3>
                    <div><span className="text-xs text-gray-500 block">الاسم الكامل</span><strong className="text-gray-800">{modalConfig.data.fullName || modalConfig.data.seller || modalConfig.data.name}</strong></div>
                    <div><span className="text-xs text-gray-500 block">البريد الإلكتروني</span><strong className="text-gray-800 break-all" dir="ltr">{modalConfig.data.email}</strong></div>
                    <div><span className="text-xs text-gray-500 block">رقم الهاتف</span><strong className="text-gray-800" dir="ltr">{modalConfig.data.phoneNumber || modalConfig.data.phone}</strong></div>
                    <div><span className="text-xs text-gray-500 block">الرقم القومي</span><strong className="text-gray-800" dir="ltr">{modalConfig.data.nationalId || 'غير مسجل'}</strong></div>
                    {modalConfig.data.howDidYouHear && <div><span className="text-xs text-gray-500 block">كيف تعرف علينا؟</span><strong className="text-gray-800">{modalConfig.data.howDidYouHear}</strong></div>}
                  </div>

                  {/* بيانات مخصصة حسب النوع */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-emerald-700 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-info-circle text-emerald-500 ml-2"></i> التفاصيل الإضافية</h3>

                    {/* بيانات المشتري */}
                    {(modalConfig.data.role === 'Buyer' || (activeSidebarPage === 'dashboard' && activeTab === 'المشترين')) && (
                      <div><span className="text-xs text-gray-500 block">المحافظة</span><strong className="text-gray-800">{modalConfig.data.governorate || 'لم يحدد'}</strong></div>
                    )}

                    {/* بيانات البائع */}
                    {(modalConfig.data.role === 'Seller' || (activeSidebarPage === 'dashboard' && activeTab === 'البائعين')) && (
                      <>
                        <div><span className="text-xs text-gray-500 block">اسم المزرعة / الإسطبل</span><strong className="text-gray-800">{modalConfig.data.farmName || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">صفة البائع</span><strong className="text-gray-800">{modalConfig.data.sellerRole || 'غير محدد'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">رقم السجل التجاري</span><strong className="text-gray-800">{modalConfig.data.commercialRegister || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">سنوات الخبرة</span><strong className="text-gray-800">{modalConfig.data.experienceYears ? `${modalConfig.data.experienceYears} سنوات` : 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">العنوان</span><strong className="text-gray-800">{modalConfig.data.address || 'غير مسجل'}</strong></div>
                      </>
                    )}

                    {/* بيانات الطبيب البيطري */}
                    {(modalConfig.data.role === 'EquineVet' || (activeSidebarPage === 'dashboard' && activeTab === 'الأطباء البيطريين')) && (
                      <>
                        <div><span className="text-xs text-gray-500 block">الدولة / المدينة</span><strong className="text-gray-800">{modalConfig.data.countryCity || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">رقم الرخصة</span><strong className="text-gray-800">{modalConfig.data.licenseNumber || modalConfig.data.license || 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">التخصص</span><strong className="text-gray-800">{modalConfig.data.vetSpecialization || modalConfig.data.specialty || 'غير محدد'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">سنوات الخبرة</span><strong className="text-gray-800">{modalConfig.data.experienceYears ? `${modalConfig.data.experienceYears} سنوات` : 'غير مسجل'}</strong></div>
                        <div><span className="text-xs text-gray-500 block">أماكن العمل</span><strong className="text-gray-800">{modalConfig.data.clinicsWorkedAt || 'غير مسجل'}</strong></div>
                        <div className="mt-2"><span className="text-xs text-gray-500 block">نبذة وخبرات</span><p className="text-gray-800 text-sm mt-1 bg-gray-50 p-3 rounded-lg border border-gray-100">{modalConfig.data.vetBio || 'لا توجد نبذة'}</p></div>
                      </>
                    )}
                  </div>
                </div>

                {/* المرفقات */}
                {((modalConfig.data.files && Object.keys(modalConfig.data.files).length > 0) || modalConfig.data.nationalIdFile || modalConfig.data.licenseFile || modalConfig.data.vetCertificates || modalConfig.data.recommendationLetter) && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">الملفات والمستندات المرفقة</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {(modalConfig.data.nationalIdFile || (modalConfig.data.files && modalConfig.data.files.nationalIdFile)) && (
                        <a href={modalConfig.data.nationalIdFile || modalConfig.data.files.nationalIdFile} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-3 rounded-xl border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap">
                          <i className="fas fa-file-pdf text-xl"></i> <span className="font-bold text-sm">البطاقة الشخصية</span>
                        </a>
                      )}
                      {(modalConfig.data.recommendationLetter || (modalConfig.data.files && modalConfig.data.files.recommendationLetter)) && (
                        <a href={modalConfig.data.recommendationLetter || modalConfig.data.files.recommendationLetter} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-3 rounded-xl border border-purple-100 hover:bg-purple-100 transition whitespace-nowrap">
                          <i className="fas fa-certificate text-xl"></i> <span className="font-bold text-sm">خطاب الترخيص / التوصية</span>
                        </a>
                      )}
                      {(modalConfig.data.licenseFile || (modalConfig.data.files && modalConfig.data.files.licenseFile)) && (
                        <a href={modalConfig.data.licenseFile || modalConfig.data.files.licenseFile} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-3 rounded-xl border border-orange-100 hover:bg-orange-100 transition whitespace-nowrap">
                          <i className="fas fa-id-badge text-xl"></i> <span className="font-bold text-sm">رخصة المزاولة</span>
                        </a>
                      )}
                      {(modalConfig.data.vetCertificates || (modalConfig.data.files && modalConfig.data.files.vetCertificates)) && (
                        <a href={modalConfig.data.vetCertificates || modalConfig.data.files.vetCertificates} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-3 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition whitespace-nowrap">
                          <i className="fas fa-file-medical text-xl"></i> <span className="font-bold text-sm">الشهادات والخبرات</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between items-center border-t border-gray-100 pt-5">
                  <button onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إغلاق النافذة</button>

                  {activeSidebarPage === 'requests' && modalConfig.data.status === 'قيد الانتظار' && (
                    <div className="flex gap-3">
                      <button onClick={() => handleRequestAction(modalConfig.data.id, 'مرفوض')} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition border border-red-100 flex items-center gap-2">
                        <i className="fas fa-times"></i> رفض الطلب
                      </button>
                      <button onClick={() => handleRequestAction(modalConfig.data.id, 'مكتمل')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30 flex items-center gap-2">
                        <i className="fas fa-check"></i> قبول الطلب
                      </button>
                    </div>
                  )}
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
                    <div className="lg:w-2/3 space-y-6">
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

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-emerald-800 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-address-book ml-2"></i> معلومات التواصل والروابط</h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                          <div><span className="text-xs text-gray-400 block mb-1 font-bold">البريد الإلكتروني</span><strong className="text-gray-800 break-all" dir="ltr">{modalConfig.data.email || 'غير مسجل'}</strong></div>
                          <div><span className="text-xs text-gray-400 block mb-1 font-bold">رقم الهاتف</span><strong className="text-gray-800" dir="ltr">{modalConfig.data.phone || 'غير مسجل'}</strong></div>
                        </div>
                        <div className="flex gap-4 mt-5 pt-4 border-t border-gray-50">
                          {modalConfig.data.facebook ? <a href={modalConfig.data.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"><i className="fab fa-facebook-f"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-facebook-f"></i></div>}
                          {modalConfig.data.instagram ? <a href={modalConfig.data.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition"><i className="fab fa-instagram"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-instagram"></i></div>}
                          {modalConfig.data.twitter ? <a href={modalConfig.data.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition"><i className="fab fa-twitter"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-twitter"></i></div>}
                          {modalConfig.data.youtube ? <a href={modalConfig.data.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition"><i className="fab fa-youtube"></i></a> : <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-300 flex items-center justify-center"><i className="fab fa-youtube"></i></div>}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-emerald-800 mb-4 border-b border-gray-100 pb-2"><i className="fas fa-horse ml-2"></i> الخيول في الفروع</h3>
                        {(() => {
                          const studName = modalConfig.data?.name || '';
                          const branches = getBranchesForStud(studName);
                          if (branches.length === 0) {
                            return <p className="text-sm text-gray-500">لا توجد فروع مسجلة لهذا المربط.</p>;
                          }

                          return (
                            <div className="space-y-4">
                              {branches.map((branch) => {
                                const horsesInBranch = horsesData.filter(h => normalize(h.studName) === normalize(studName) && normalize(h.branch) === normalize(branch));
                                return (
                                  <div key={branch} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-bold text-gray-700">{branch}</h4>
                                      <span className="text-xs text-gray-400">{horsesInBranch.length} خيل</span>
                                    </div>
                                    {horsesInBranch.length === 0 ? (
                                      <p className="text-sm text-gray-500 mt-2">لا توجد خيول مسجلة في هذا الفرع.</p>
                                    ) : (
                                      <ul className="mt-2 space-y-1">
                                        {horsesInBranch.map(horse => (
                                          <li key={horse.id} className="text-sm text-gray-700">- {horse.name}</li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

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
                        <div className="w-full h-32 mt-4 rounded-xl fake-map-bg border border-gray-200 relative flex items-center justify-center">
                          <i className="fas fa-map-marker-alt text-3xl text-emerald-600 drop-shadow-md absolute"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                  <button onClick={closeModal} className="px-8 py-3.5 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">إغلاق النافذة</button>
                </div>
              </div>
            )}

            {/* الإضافة والتعديل لـ "المرابط" (متعدد الخطوات) */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage === 'studs' && (
              <div className="flex flex-col w-full h-full max-h-screen">
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

                <div className="flex-1 overflow-y-auto bg-[#FAF9F6] dark:bg-gray-900 custom-scrollbar">
                  <div key={currentStep} className={`p-6 md:p-8 ${slideDirection === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
                    {currentStep === 1 && (
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-2/3 space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">اسم المربط (إنجليزي) *</label>
                              <input type="text" value={formData.nameEn || ''} onChange={e => {
                                const val = e.target.value;
                                if (!/[\u0600-\u06FF]/.test(val)) { setFormData({ ...formData, nameEn: val }); setFormErrors({ ...formErrors, nameEn: false }); }
                              }} className={`lux-input text-left ${formErrors.nameEn ? 'input-error' : ''}`} dir="ltr" placeholder="Stud Name" />
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">اسم المربط (عربي) *</label>
                              <input type="text" value={formData.name || ''} onChange={e => {
                                const val = e.target.value;
                                if (!/[a-zA-Z]/.test(val)) { setFormData({ ...formData, name: val }); setFormErrors({ ...formErrors, name: false }); }
                              }} className={`lux-input ${formErrors.name ? 'input-error' : ''}`} dir="rtl" placeholder="اسم المربط" />
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">تاريخ التأسيس *</label>
                              <input type="date" value={formData.foundedDate || ''} onChange={e => { setFormData({ ...formData, foundedDate: e.target.value }); setFormErrors({ ...formErrors, foundedDate: false }) }} className={`lux-input ${formErrors.foundedDate ? 'input-error' : ''}`} />
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">رقم التسجيل *</label>
                              <input type="text" value={formData.regNo || ''} onChange={e => { setFormData({ ...formData, regNo: e.target.value }); setFormErrors({ ...formErrors, regNo: false }) }} className={`lux-input ${formErrors.regNo ? 'input-error' : ''}`} placeholder="رقم التسجيل" />
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
                              <label className="text-sm font-bold text-emerald-800">نوع المربط *</label>
                              <select value={formData.type || ''} onChange={e => { setFormData({ ...formData, type: e.target.value }); setFormErrors({ ...formErrors, type: false }) }} className={`lux-input ${formErrors.type ? 'input-error' : ''}`}>
                                <option value="" disabled hidden>اختر نوع المربط</option>
                                <option value="تدريب">تدريب</option>
                                <option value="بيع">بيع</option>
                                <option value="تدريب وبيع">تدريب وبيع</option>
                              </select>
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
                              <label className="text-sm font-bold text-emerald-800">الفروع (مفصولة بفواصل)</label>
                              <input
                                type="text"
                                value={(formData.branches || []).join(', ')}
                                onChange={e => {
                                  const branches = e.target.value.split(',').map(b => b.trim()).filter(Boolean);
                                  setFormData({ ...formData, branches });
                                }}
                                className="lux-input"
                                placeholder="مثال: الفرع الرئيسي, فرع القاهرة"
                              />
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">نبذة عن المربط</label>
                            <textarea placeholder="اكتب نبذة مختصرة عن المربط وتاريخه..." rows="3" value={formData.about || ''} onChange={e => setFormData({ ...formData, about: e.target.value })} className="lux-input resize-none"></textarea>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">الدولة</label>
                              <select value={formData.country || 'مصر'} onChange={e => setFormData({ ...formData, country: e.target.value })} className="lux-input opacity-70 cursor-not-allowed" disabled>
                                <option value="مصر">مصر</option>
                              </select>
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">المدينة / المحافظة *</label>
                              <select value={formData.city || ''} onChange={e => { setFormData({ ...formData, city: e.target.value }); setFormErrors({ ...formErrors, city: false }) }} className={`lux-input ${formErrors.city ? 'input-error' : ''}`}>
                                <option value="">اختر المحافظة</option>
                                {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">عنوان الشارع</label>
                            <input type="text" placeholder="العنوان التفصيلي" value={formData.streetAddress || ''} onChange={e => setFormData({ ...formData, streetAddress: e.target.value })} className="lux-input" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">خط العرض (Latitude)</label>
                              <input type="text" placeholder="مثال: 30.0444" value={formData.lat || ''} onChange={e => setFormData({ ...formData, lat: e.target.value })} className="lux-input text-left" dir="ltr" />
                            </div>
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                              <label className="text-sm font-bold text-emerald-800">خط الطول (Longitude)</label>
                              <input type="text" placeholder="مثال: 31.2357" value={formData.lng || ''} onChange={e => setFormData({ ...formData, lng: e.target.value })} className="lux-input text-left" dir="ltr" />
                            </div>
                          </div>
                        </div>
                        <div className="lg:w-1/3 flex flex-col">
                          <label className="text-sm font-bold text-emerald-800 mb-2 block">موقع المربط على الخريطة</label>
                          <div className="flex-1 min-h-[300px] border border-gray-200 rounded-2xl relative overflow-hidden fake-map-bg p-3 shadow-inner">
                            <div className="bg-white rounded-xl shadow-sm flex items-center p-2 mb-2 w-full z-10 relative border border-gray-200">
                              <input type="text" placeholder="بحث عن موقع..." className="flex-1 outline-none text-sm bg-transparent px-2 font-medium" />
                              <i className="fas fa-search text-gray-400 mx-1 cursor-pointer"></i>
                            </div>
                            <button className="absolute bottom-4 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all z-10">
                              <i className="fas fa-plus"></i>
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
                              <input type="email" placeholder="example@stud.com" value={formData.email || ''} onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: false }) }} className={`lux-input pr-10 text-left ${formErrors.email ? 'input-error' : ''}`} dir="ltr" />
                              <i className="fas fa-envelope absolute top-4 right-4 text-gray-400"></i>
                            </div>
                          </div>
                          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">رقم الهاتف الأساسي *</label>
                            <div className="relative">
                              <input type="tel" placeholder="+20 100 000 0000" value={formData.phone || ''} onChange={e => {
                                const val = e.target.value;
                                if (/^[\d+]*$/.test(val)) { setFormData({ ...formData, phone: val }); setFormErrors({ ...formErrors, phone: false }); }
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
                            <div className="relative"><input type="url" placeholder="https://facebook.com/..." value={formData.facebook || ''} onChange={e => setFormData({ ...formData, facebook: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-facebook absolute top-4 right-4 text-[#1877F2]"></i></div>
                          </div>
                          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">إنستجرام</label>
                            <div className="relative"><input type="url" placeholder="https://instagram.com/..." value={formData.instagram || ''} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-instagram absolute top-4 right-4 text-[#E4405F]"></i></div>
                          </div>
                          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">يوتيوب</label>
                            <div className="relative"><input type="url" placeholder="https://youtube.com/..." value={formData.youtube || ''} onChange={e => setFormData({ ...formData, youtube: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-youtube absolute top-4 right-4 text-[#FF0000]"></i></div>
                          </div>
                          <div className="space-y-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <label className="text-sm font-bold text-emerald-800">إكس (تويتر)</label>
                            <div className="relative"><input type="url" placeholder="https://x.com/..." value={formData.twitter || ''} onChange={e => setFormData({ ...formData, twitter: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-twitter absolute top-4 right-4 text-[#1DA1F2]"></i></div>
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
                              <svg className="w-8 h-8 mb-3 text-emerald-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" /></svg>
                              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-emerald-600">اضغط لرفع صور</span> أو اسحب وأفلت</p>
                              <p className="text-xs text-gray-400">الصيغ المدعومة : صور فقط (image/*)</p>
                            </div>
                            <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => { setFormData({ ...formData, images: [...(formData.images || []), ...Array.from(e.target.files)] }); setFormErrors({ ...formErrors, images: false }) }} />
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
                          <div className="relative"><input type="url" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} className="lux-input pr-10 text-left" dir="ltr" /><i className="fab fa-youtube absolute top-4 right-4 text-gray-400"></i></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 rounded-b-2xl shrink-0">
                  <button onClick={handlePrevStep} className={`px-8 py-3.5 rounded-2xl font-bold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors ${currentStep === 1 ? 'hidden' : 'block'}`}>السابق</button>
                  {currentStep < 4 ? (
                    <button onClick={handleNextStep} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">التالي <i className="fas fa-chevron-left text-xs"></i></button>
                  ) : (
                    <button onClick={handleSubmit} className="px-10 py-3.5 rounded-2xl font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                      <i className={modalConfig.type === 'edit' ? "fas fa-save" : "fas fa-check-circle"}></i>
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
                        {studsDataList.map(stud => (
                          <option key={stud.id} value={stud.name}>{stud.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">فرع المزرعة</label>
                      <select required name="branch" value={formData.branch || ''} onChange={handleInputChange} disabled={!formData.studName} className={`w-full border border-gray-200 rounded-xl p-3 bg-gray-50 transition ${!formData.studName ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-emerald-600/30 outline-none'}`}>
                        <option value="">{formData.studName ? 'اختر الفرع...' : 'اختر المربط أولاً'}</option>
                        {formData.studName && getBranchesForStud(formData.studName).map(branch => <option key={branch} value={branch}>{branch}</option>)}
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

            {/* الإضافة والتعديل للمزادات */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage === 'auctions' && (
              <div className="p-8 max-w-2xl mx-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800"><div className="bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center text-emerald-600"><i className={`fas ${modalConfig.type === 'add' ? 'fa-plus' : 'fa-pen'}`}></i></div>{modalConfig.type === 'add' ? 'إضافة بيانات جديدة' : 'تعديل السجل الحالي'}</h2>
                  <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>1</div>
                    <span className={`text-sm ${currentStep === 1 ? 'text-emerald-800 font-bold' : 'text-gray-400'}`}>تفاصيل المزاد</span>
                  </div>
                  <div className="flex-1 h-[2px] bg-gray-200 relative">
                    <div className="h-full bg-emerald-600 transition-all" style={{ width: currentStep === 1 ? '50%' : '100%' }}></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 2 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>2</div>
                    <span className={`text-sm ${currentStep === 2 ? 'text-emerald-800 font-bold' : 'text-gray-400'}`}>المكان والخيل</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="">
                  {currentStep === 1 && (
                    <div className="grid grid-cols-2 gap-5">
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
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      {formErrors.venues && (
                        <div className="text-sm text-red-600">يرجى اختيار المربط، الفرع، وخيل واحد على الأقل في كل موقع.</div>
                      )}

                      {(formData.venues || []).map((venue, idx) => {
                        const availableHorses = getHorsesForVenue(venue);
                        return (
                          <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between">
                              <h3 className="text-sm font-bold text-gray-700">الموقع {idx + 1}</h3>
                              {(formData.venues || []).length > 1 && (
                                <button type="button" onClick={() => removeAuctionVenue(idx)} className="text-red-500 text-xs hover:text-red-600">حذف</button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">المربط</label>
                                <select value={venue.studName || ''} onChange={e => updateAuctionVenue(idx, 'studName', e.target.value)} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-emerald-600/30 outline-none transition">
                                  <option value="">اختر المربط...</option>
                                  {studsDataList.map(stud => <option key={stud.name} value={stud.name}>{stud.name}</option>)}
                                  {Object.keys(studsData).filter(key => !studsDataList.some(s => s.name === key)).map(stud => <option key={stud} value={stud}>{stud}</option>)}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الفرع</label>
                                <select value={venue.branch || ''} onChange={e => updateAuctionVenue(idx, 'branch', e.target.value)} disabled={!venue.studName} className={`w-full border border-gray-200 rounded-xl p-3 bg-gray-50 transition ${!venue.studName ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-emerald-600/30 outline-none'}`}>
                                  <option value="">{venue.studName ? 'اختر الفرع...' : 'اختر المربط أولاً'}</option>
                                  {venue.studName && getBranchesForStud(venue.studName).map(branch => <option key={branch} value={branch}>{branch}</option>)}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الخيل</label>
                                <select value={(venue.horseIds && venue.horseIds[0]) || ''} onChange={e => updateAuctionVenue(idx, 'horseIds', e.target.value ? [e.target.value] : [])} disabled={!venue.branch} className={`w-full border border-gray-200 rounded-xl p-3 bg-gray-50 transition ${!venue.branch ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-emerald-600/30 outline-none'}`}>
                                  <option value="">{venue.branch ? 'اختر الخيل...' : 'اختر الفرع أولاً'}</option>
                                  {venue.branch && availableHorses.length === 0 && <option value="">لا توجد خيول متاحة</option>}
                                  {availableHorses.map(horse => (
                                    <option key={horse.id} value={horse.id}>{horse.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button type="button" onClick={addAuctionVenue} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">+ إضافة مربط</button>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
                    {currentStep > 1 && (
                      <button type="button" onClick={handlePrevStep} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">السابق</button>
                    )}
                    {currentStep === 1 ? (
                      <button type="button" onClick={handleNextStep} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30">التالي</button>
                    ) : (
                      <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30">{modalConfig.type === 'add' ? 'حفظ وإضافة' : 'حفظ التعديلات'}</button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* ======================= الإضافة والتعديل للمستخدمين (بائع، مشتري، طبيب) بنسق جديد ======================= */}
            {(modalConfig.type === 'add' || modalConfig.type === 'edit') && activeSidebarPage === 'dashboard' && (
              <form onSubmit={handleSubmit} className="p-8 w-full max-w-4xl mx-auto">
                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-gray-800">
                    <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600">
                      <i className={`fas ${modalConfig.type === 'add' ? 'fa-user-plus' : 'fa-user-edit'}`}></i>
                    </div>
                    {modalConfig.type === 'add' ? `إضافة ${activeTab === 'البائعين' ? 'بائع' : activeTab === 'المشترين' ? 'مشتري' : 'طبيب'} جديد` : 'تعديل بيانات الحساب'}
                  </h2>
                  <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* الكارت 1: البيانات الشخصية المشتركة */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-200 pb-2">
                      <i className="fas fa-id-card text-gray-400 ml-2"></i> البيانات الأساسية
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل *</label>
                        <input required name={activeTab === 'البائعين' ? 'seller' : 'name'} value={(activeTab === 'البائعين' ? formData.seller : formData.name) || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" placeholder="أدخل الاسم..." />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني *</label>
                        <input required type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-left focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" dir="ltr" placeholder="example@mail.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف *</label>
                        <input required name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-left focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" dir="ltr" placeholder="+20 100 000 0000" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الرقم القومي</label>
                        <input name="nationalId" value={formData.nationalId || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white text-left focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition" dir="ltr" placeholder="أدخل 14 رقم" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">حالة الحساب</label>
                        <select name="status" value={formData.status || (activeTab === 'البائعين' ? 'مكتمل' : 'نشط')} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition">
                          {activeTab === 'البائعين' ? (
                            <><option value="مكتمل">مكتمل</option><option value="قيد الانتظار">قيد الانتظار</option><option value="ملغى">ملغى</option></>
                          ) : (
                            <><option value="نشط">نشط</option><option value="غير نشط">غير نشط</option></>
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">كيف تعرف علينا؟</label>
                        <select name="howDidYouHear" value={formData.howDidYouHear || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition">
                          <option value="">اختر...</option>
                          <option value="فيسبوك">فيسبوك</option>
                          <option value="تويتر / إكس">تويتر / إكس</option>
                          <option value="إنستجرام">إنستجرام</option>
                          <option value="محرك بحث جوجل">محرك بحث جوجل</option>
                          <option value="صديق / معارف">صديق / معارف</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* الكارت 2: التفاصيل الإضافية المتغيرة */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-emerald-700 mb-5 border-b border-gray-100 pb-2">
                      <i className="fas fa-info-circle text-emerald-500 ml-2"></i> التفاصيل الإضافية ({activeTab})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activeTab === 'البائعين' && (
                        <>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">اسم المزرعة / الإسطبل</label><input name="farmName" value={formData.farmName || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="إن وجد" /></div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">صفة البائع</label>
                            <select name="sellerRole" value={formData.sellerRole || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition">
                              <option value="">اختر صفة...</option>
                              <option value="مربي">مربي</option>
                              <option value="وسيط">وسيط</option>
                              <option value="مالك خاص">مالك خاص</option>
                            </select>
                          </div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم السجل التجاري</label><input name="commercialRegister" value={formData.commercialRegister || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left focus:border-emerald-500 outline-none transition" dir="ltr" /></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">سنوات الخبرة</label><input name="experienceYears" type="number" value={formData.experienceYears || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="مثال: 5" /></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label><input name="address" value={formData.address || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="العنوان التفصيلي للمزرعة أو البائع" /></div>
                        </>
                      )}

                      {activeTab === 'المشترين' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">المحافظة</label>
                          <select name="governorate" value={formData.governorate || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition">
                            <option value="">اختر المحافظة...</option>
                            {egyptGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                          </select>
                        </div>
                      )}

                      {activeTab === 'الأطباء البيطريين' && (
                        <>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">الدولة / المدينة</label><input name="countryCity" value={formData.countryCity || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="مثال: مصر / القاهرة" /></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">رقم الرخصة *</label><input required name="license" value={formData.license || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-left focus:border-emerald-500 outline-none transition" dir="ltr" placeholder="VET-XXXXX" /></div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">التخصص</label>
                            <select name="specialty" value={formData.specialty || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition">
                              <option value="">اختر التخصص...</option>
                              <option value="طب بيطري خيول">طب بيطري خيول</option>
                              <option value="جراحة">جراحة</option>
                              <option value="طب بيطري عام">طب بيطري عام</option>
                            </select>
                          </div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">سنوات الخبرة</label><input name="experienceYears" type="number" value={formData.experienceYears || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="مثال: 7" /></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">العيادات أو المستشفيات</label><input name="clinicsWorkedAt" value={formData.clinicsWorkedAt || ''} onChange={handleInputChange} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:border-emerald-500 outline-none transition" placeholder="أين يعمل الطبيب؟" /></div>
                          <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">نبذة وخبرات عن الطبيب</label><textarea name="vetBio" value={formData.vetBio || ''} onChange={handleInputChange} rows="3" className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 resize-none focus:border-emerald-500 outline-none transition" placeholder="اكتب نبذة عن الطبيب وخبراته السابقة..."></textarea></div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* الكارت 3: المرفقات والمستندات (لا يظهر للمشترين) */}
                  {activeTab !== 'المشترين' && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="text-lg font-bold text-emerald-700 mb-5 border-b border-gray-100 pb-2">
                        <i className="fas fa-folder-open text-emerald-500 ml-2"></i> المرفقات والمستندات
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* البطاقة الشخصية مشتركة للبائع والطبيب */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">البطاقة الشخصية (صورة أو PDF)</label>
                          <label className="flex items-center justify-center w-full h-14 border border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition px-4 overflow-hidden">
                            <i className={`fas fa-file-${formData.nationalIdFile ? 'check text-emerald-600' : 'upload text-gray-400'} ml-2 text-xl`}></i>
                            <span className="text-sm text-gray-600 font-bold truncate">
                              {formData.nationalIdFile ? (typeof formData.nationalIdFile === 'object' ? formData.nationalIdFile.name : 'تم إرفاق ملف البطاقة') : 'اضغط لإرفاق البطاقة'}
                            </span>
                            <input type="file" name="nationalIdFile" accept="image/*,application/pdf" onChange={handleInputChange} className="hidden" />
                          </label>
                        </div>

                        {activeTab === 'البائعين' && (
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">خطاب الترخيص / السجل</label>
                            <label className="flex items-center justify-center w-full h-14 border border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition px-4 overflow-hidden">
                              <i className={`fas fa-file-${formData.recommendationLetter ? 'check text-emerald-600' : 'upload text-gray-400'} ml-2 text-xl`}></i>
                              <span className="text-sm text-gray-600 font-bold truncate">
                                {formData.recommendationLetter ? (typeof formData.recommendationLetter === 'object' ? formData.recommendationLetter.name : 'تم إرفاق ملف الترخيص') : 'اضغط لإرفاق المستند'}
                              </span>
                              <input type="file" name="recommendationLetter" accept="image/*,application/pdf" onChange={handleInputChange} className="hidden" />
                            </label>
                          </div>
                        )}

                        {activeTab === 'الأطباء البيطريين' && (
                          <>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">رخصة المزاولة</label>
                              <label className="flex items-center justify-center w-full h-14 border border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition px-4 overflow-hidden">
                                <i className={`fas fa-file-${formData.licenseFile ? 'check text-emerald-600' : 'upload text-gray-400'} ml-2 text-xl`}></i>
                                <span className="text-sm text-gray-600 font-bold truncate">
                                  {formData.licenseFile ? (typeof formData.licenseFile === 'object' ? formData.licenseFile.name : 'تم إرفاق رخصة المزاولة') : 'اضغط لإرفاق الرخصة'}
                                </span>
                                <input type="file" name="licenseFile" accept="image/*,application/pdf" onChange={handleInputChange} className="hidden" />
                              </label>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-gray-700 mb-2">الشهادات والخبرات المرفقة</label>
                              <label className="flex items-center justify-center w-full h-14 border border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition px-4 overflow-hidden">
                                <i className={`fas fa-file-${formData.vetCertificates ? 'check text-emerald-600' : 'upload text-gray-400'} ml-2 text-xl`}></i>
                                <span className="text-sm text-gray-600 font-bold truncate">
                                  {formData.vetCertificates ? (typeof formData.vetCertificates === 'object' ? formData.vetCertificates.name : 'تم إرفاق ملف الشهادات') : 'اضغط لإرفاق الشهادات'}
                                </span>
                                <input type="file" name="vetCertificates" accept="image/*,application/pdf" onChange={handleInputChange} className="hidden" />
                              </label>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء الأمر</button>
                  <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-600/30 flex items-center gap-2">
                    <i className="fas fa-save"></i>
                    {modalConfig.type === 'add' ? 'حفظ الحساب الجديد' : 'تحديث بيانات الحساب'}
                  </button>
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
            {/* --- زر طلبات التسجيل الجديد --- */}
            <button onClick={() => setActiveSidebarPage('requests')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'requests' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-user-clock w-5 text-center"></i> طلبات التسجيل
            </button>
            <button onClick={() => setActiveSidebarPage('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-users w-5 text-center"></i> المستخدمين
            </button>
            <button onClick={() => setActiveSidebarPage('studs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'studs' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-building w-5 text-center"></i> المرابط والفروع
            </button>
            <button onClick={() => setActiveSidebarPage('horses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'horses' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-horse w-5 text-center"></i> الخيول
            </button>
            <button onClick={() => setActiveSidebarPage('auctions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeSidebarPage === 'auctions' ? 'bg-emerald-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'}`}>
              <i className="fas fa-gavel w-5 text-center"></i> المزادات والفعاليات
            </button>
          </nav>
        </div>

        <div onClick={() => navigate('/profile/admin')} className="p-4 bg-gray-800 flex items-center justify-between m-4 rounded-xl cursor-pointer hover:bg-gray-700 transition">
          <div>
            <h4 className="text-white text-sm font-semibold">أفنان احمد</h4>
            <p className="text-xs text-gray-400">مدير النظام</p>
          </div>
          <div className="bg-[#e2e8f0] w-10 h-10 flex items-center justify-center rounded-full"><i className="fas fa-user text-gray-900"></i></div>
        </div>
      </aside>

      {/* ================= محتوى الصفحة ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100 z-10">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-gray-800">
              {activeSidebarPage === 'dashboard' ? 'إدارة المستخدمين' :
                activeSidebarPage === 'horses' ? 'سجل الخيول والملاك' :
                  activeSidebarPage === 'studs' ? 'إدارة المرابط والفروع' :
                    activeSidebarPage === 'auctions' ? 'إدارة المزادات والفعاليات' :
                      activeSidebarPage === 'requests' ? 'مراجعة طلبات التسجيل' : // العنوان الجديد
                        'الرعاية والسجلات الطبية'}
            </h2>
            <div className="relative w-80">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث سريع..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600" />
              <i className="fas fa-search absolute right-3.5 top-3.5 text-gray-400"></i>
            </div>
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
                          <button onClick={() => { setFilterStatus('الكل'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'الكل' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>الكل</button>
                          {activeTab === 'البائعين' ? (
                            <>
                              <button onClick={() => { setFilterStatus('مكتمل'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'مكتمل' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>مكتمل</button>
                              <button onClick={() => { setFilterStatus('قيد الانتظار'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'قيد الانتظار' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>قيد الانتظار</button>
                              <button onClick={() => { setFilterStatus('ملغى'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'ملغى' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>ملغى</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setFilterStatus('نشط'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'نشط' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>نشط</button>
                              <button onClick={() => { setFilterStatus('غير نشط'); setIsFilterOpen(false); }} className={`w-full text-start px-4 py-2 text-sm hover:bg-emerald-50 transition ${filterStatus === 'غير نشط' ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>غير نشط</button>
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

          {/* ======================= صفحة طلبات التسجيل (الجديدة) ======================= */}
          {activeSidebarPage === 'requests' && (
            <div className="animate-fade-in-up">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">مراجعة طلبات التسجيل</h2>
                  <p className="text-gray-500">مراجعة طلبات الانضمام للمنصة من البائعين والأطباء البيطريين والمشترين.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-xl font-bold border border-emerald-100">
                  {registrationRequests.filter(r => r.status === 'قيد الانتظار').length} طلبات جديدة
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <h3 className="text-xl font-bold text-gray-800">قائمة الطلبات</h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none"
                    >
                      <option value="الكل">كل الحالات</option>
                      <option value="قيد الانتظار">قيد الانتظار</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="مرفوض">مرفوض</option>
                    </select>
                    <button onClick={handleDownloadCSV} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition" title="تصدير">
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                </div>

                <table className="w-full text-right">
                  <thead className="bg-gray-50/50 text-gray-500 text-sm font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-5 px-6">رقم الطلب</th>
                      <th className="py-5 px-6">مقدم الطلب</th>
                      <th className="py-5 px-6 text-center">نوع الحساب</th>
                      <th className="py-5 px-6 text-center">تاريخ التقديم</th>
                      <th className="py-5 px-6 text-center">الحالة</th>
                      <th className="py-5 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {processedData.length > 0 ? processedData.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{request.id}</td>
                        <td className="py-5 px-6 text-sm">
                          <span className="font-bold text-gray-800 block">{request.fullName || request.name || request.seller || request.email || '-'}</span>
                          <span className="text-xs text-gray-400 block" dir="ltr">{request.phoneNumber || request.phone || request.email || ''}</span>
                        </td>
                        <td className="py-5 px-6 text-sm text-center">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold ${request.role === 'Seller' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                              request.role === 'EquineVet' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-sm text-center font-medium text-gray-600" dir="ltr">{request.date}</td>
                        <td className="py-5 px-6 text-sm text-center">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getOrderStatusStyle(request.status)}`}>{request.status}</span>
                        </td>
                        <td className="py-5 px-6 text-sm flex justify-center gap-3 mt-1">
                          {/* --- تعديل: إزالة علامتي الصح والخطأ والاحتفاظ بـ "مراجعة" فقط --- */}
                          <button onClick={() => openModal('view', request)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1">
                            <i className="fas fa-eye"></i> مراجعة
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500 font-medium">لا توجد طلبات مطابقة للبحث</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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