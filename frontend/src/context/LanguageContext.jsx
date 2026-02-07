import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // Navigation
    home: 'Home',
    list: 'Gift Gallery',
    form: 'Form',
    faq: 'Help Center',
    about: 'About',
    blog: 'Blog',
    birthdays: 'Birthday Calendar',
    myOrders: 'My Orders',
    profile: 'Profile',
    admin: 'Admin',
    cart: 'Cart',
    
    // Common
    login: 'Login',
    logout: 'Logout',
    loading: 'Loading',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    update: 'Update',
    search: 'Search',
    
    // DIY List
    diyWishlistCentral: 'DIY Wishlist Central',
    loadingDiyProjects: 'Loading DIY Projects...',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    
    // Cart
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    browseProjects: 'Browse our amazing DIY projects and start creating!',
    exploreProjects: 'Explore Projects',
    proceedToCheckout: 'Confirm Your Gift',
    loginToCheckout: 'Login to Checkout',
    continueShopping: '← Continue Shopping',
    loginToSaveCart: 'Login to save your cart and submit your request!',
    
    // Birthday Calendar
    birthdayCalendar: 'Birthday Calendar 🎂',
    upcomingBirthdays: 'Upcoming Birthdays (Next 30 Days)',
    calendarView: 'Calendar View',
    allBirthdays: 'All Birthdays',
    addBirthday: 'Add Birthday',
    editBirthday: 'Edit Birthday',
    addNewBirthday: 'Add New Birthday',
    noBirthdaysYet: 'No birthdays yet',
    startAddingBirthdays: 'Start adding your friends\' birthdays!',
    loginToManageBirthdays: 'Login to add, edit, or delete birthdays',
    loadingBirthdays: 'Loading birthdays...',
    today: 'Today',
    in: 'In',
    day: 'day',
    days: 'days',
    todayExclaim: '🎉 Today!',
    
    // Form fields
    name: 'Name',
    birthday: 'Birthday',
    notes: 'Notes',
    notesOptional: 'Notes (optional)',
    giftIdeasPlaceholder: 'Gift ideas, preferences, etc.',
    required: 'required',
    
    // Days of week
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    
    // Months
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    
    // Messages
    confirmDelete: 'Are you sure you want to delete this birthday?',
    errorSaving: 'Error saving birthday. Please try again.',
    errorDeleting: 'Error deleting birthday. Please try again.',
    
    // Announcement
    welcomeMessage: 'Welcome to Ariel\'s New Website',
    
    // 404 Page
    pageNotFoundTitle: 'Page Not Found',
    pageNotFoundDescription: 'Sorry, the page you\'re looking for doesn\'t exist or has been moved.',
    goHome: 'Go Home',
    browseDIY: 'Browse DIY Projects',
    popularPages: 'Popular Pages:',
    
    // Admin Dashboard
    adminDashboard: 'Admin Dashboard',
    orders: 'Orders',
    manageOrders: 'Manage Orders',
    viewCustomers: 'View Customers',
    approveRequests: 'Approve Requests',
    orderStatus: 'Order Status',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    totalOrders: 'Total Orders',
    pendingRequests: 'Pending Requests',
    upcomingBirthdaysCount: 'Upcoming Birthdays',
    customers: 'Customers',
    projects: 'Projects',
    manageProjects: 'Manage Projects',
    additionalRequests: 'Additional Requests',
    approveRequest: 'Approve',
    rejectRequest: 'Reject',
    requestReason: 'Request Reason',
    customerName: 'Customer Name',
    customerEmail: 'Customer Email',
    orderDate: 'Order Date',
    birthdayDate: 'Birthday Date',
    customization: 'Customization',
    colors: 'Colors',
    size: 'Size',
    personalization: 'Personalization',
    specialRequests: 'Special Requests',
    noOrders: 'No orders yet',
    noRequests: 'No additional requests',
    noBirthdays: 'No birthdays',
    noCustomers: 'No customers yet',
    addProject: 'Add Project',
    editProject: 'Edit Project',
    deleteProject: 'Delete Project',
    projectName: 'Project Name',
    description: 'Description',
    materials: 'Materials',
    estimatedTime: 'Estimated Time',
    categories: 'Categories',
    images: 'Images',
    confirmDeleteProject: 'Are you sure you want to delete this project?',
    projectAdded: 'Project added successfully',
    projectUpdated: 'Project updated successfully',
    projectDeleted: 'Project deleted successfully',
    orderUpdated: 'Order status updated',
    requestApproved: 'Request approved',
    requestRejected: 'Request rejected',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    viewDetails: 'View Details',
    orderDetails: 'Order Details',
    totalItems: 'Total Items',
    loggedInAs: 'Logged in as',
    signOut: 'Sign Out',
    statistics: 'Statistics',
    recentOrders: 'Recent Orders',
    allOrders: 'All Orders',
    allProjects: 'All Projects',
    allCustomers: 'All Customers',
    orderHistory: 'Order History',
    noOrderHistory: 'No order history',

    // Room Visualizer
    roomVisualizer: 'Room Visualizer',
    seeInRoom: 'See it in your room',
    pickProductImage: 'Pick a product image',
    pickImageHint: 'Choose the image with the clearest view of the product',
    cropImage: 'Crop the product area',
    cropHint: 'Crop around the product for best results',
    skipCrop: 'Skip (use full image)',
    cropAndContinue: 'Crop & Continue',
    removingBg: 'Removing background...',
    downloadingModel: 'Downloading AI model (first time only)...',
    analyzingImage: 'Analyzing image...',
    bgRemoved: 'Background removed!',
    looksGood: 'Looks good! Continue',
    redo: 'Redo',
    uploadRoomPhoto: 'Upload a room photo',
    roomPhotoHint: 'Take a photo of your room or desk where you want to place the product',
    placeInRoom: 'Place product in room',
    download: 'Download',
    backToEdit: 'Back to Edit',
    done: 'Done',
    resetPosition: 'Reset',
    flip: 'Flip',
  },
  zh: {
    // Navigation
    home: '首頁',
    list: '禮物畫廊',
    form: '表單',
    faq: '幫助中心',
    about: '關於',
    blog: '部落格',
    birthdays: '生日日曆',
    myOrders: '我的訂單',
    profile: '個人資料',
    admin: '管理員',
    cart: '購物車',
    
    // Common
    login: '登入',
    logout: '登出',
    loading: '載入中',
    save: '儲存',
    cancel: '取消',
    edit: '編輯',
    delete: '刪除',
    add: '新增',
    update: '更新',
    search: '搜尋',
    
    // DIY List
    diyWishlistCentral: 'DIY 願望清單中心',
    loadingDiyProjects: '正在載入 DIY 專案...',
    addToCart: '加入購物車',
    addedToCart: '已加入購物車',
    
    // Cart
    yourCart: '您的購物車',
    cartEmpty: '您的購物車是空的',
    browseProjects: '瀏覽我們精彩的 DIY 專案並開始創作！',
    exploreProjects: '探索專案',
    proceedToCheckout: '前往結帳',
    loginToCheckout: '登入以結帳',
    continueShopping: '← 繼續購物',
    loginToSaveCart: '登入以儲存您的購物車並提交請求！',
    
    // Birthday Calendar
    birthdayCalendar: '生日日曆 🎂',
    upcomingBirthdays: '即將到來的生日（未來30天）',
    calendarView: '日曆檢視',
    allBirthdays: '所有生日',
    addBirthday: '新增生日',
    editBirthday: '編輯生日',
    addNewBirthday: '新增生日',
    noBirthdaysYet: '還沒有生日',
    startAddingBirthdays: '開始新增您朋友的生日！',
    loginToManageBirthdays: '登入以新增、編輯或刪除生日',
    loadingBirthdays: '正在載入生日...',
    today: '今天',
    in: '還有',
    day: '天',
    days: '天',
    todayExclaim: '🎉 今天！',
    
    // Form fields
    name: '姓名',
    birthday: '生日',
    notes: '備註',
    notesOptional: '備註（選填）',
    giftIdeasPlaceholder: '禮物想法、喜好等',
    required: '必填',
    
    // Days of week
    sun: '週日',
    mon: '週一',
    tue: '週二',
    wed: '週三',
    thu: '週四',
    fri: '週五',
    sat: '週六',
    
    // Months
    january: '一月',
    february: '二月',
    march: '三月',
    april: '四月',
    may: '五月',
    june: '六月',
    july: '七月',
    august: '八月',
    september: '九月',
    october: '十月',
    november: '十一月',
    december: '十二月',
    
    // Messages
    confirmDelete: '您確定要刪除此生日嗎？',
    errorSaving: '儲存生日時發生錯誤，請重試。',
    errorDeleting: '刪除生日時發生錯誤，請重試。',
    
    // Announcement
    welcomeMessage: '歡迎來到 Ariel 的新網站',
    
    // 404 Page
    pageNotFoundTitle: '找不到頁面',
    pageNotFoundDescription: '抱歉，您尋找的頁面不存在或已被移動。',
    goHome: '返回首頁',
    browseDIY: '瀏覽 DIY 專案',
    popularPages: '熱門頁面：',
    
    // Admin Dashboard
    adminDashboard: '管理員儀表板',
    orders: '訂單',
    manageOrders: '管理訂單',
    viewCustomers: '查看客戶',
    approveRequests: '批准請求',
    orderStatus: '訂單狀態',
    pending: '待處理',
    inProgress: '進行中',
    completed: '已完成',
    cancelled: '已取消',
    totalOrders: '總訂單數',
    pendingRequests: '待處理請求',
    upcomingBirthdaysCount: '即將到來的生日',
    customers: '客戶',
    projects: '專案',
    manageProjects: '管理專案',
    additionalRequests: '額外請求',
    approveRequest: '批准',
    rejectRequest: '拒絕',
    requestReason: '請求原因',
    customerName: '客戶姓名',
    customerEmail: '客戶電子郵件',
    orderDate: '訂單日期',
    birthdayDate: '生日日期',
    customization: '客製化',
    colors: '顏色',
    size: '尺寸',
    personalization: '個人化',
    specialRequests: '特殊要求',
    noOrders: '尚無訂單',
    noRequests: '無額外請求',
    noBirthdays: '無生日',
    noCustomers: '尚無客戶',
    addProject: '新增專案',
    editProject: '編輯專案',
    deleteProject: '刪除專案',
    projectName: '專案名稱',
    description: '描述',
    materials: '材料',
    estimatedTime: '預估時間',
    categories: '類別',
    images: '圖片',
    confirmDeleteProject: '您確定要刪除此專案嗎？',
    projectAdded: '專案新增成功',
    projectUpdated: '專案更新成功',
    projectDeleted: '專案刪除成功',
    orderUpdated: '訂單狀態已更新',
    requestApproved: '請求已批准',
    requestRejected: '請求已拒絕',
    filterByStatus: '按狀態篩選',
    allStatuses: '所有狀態',
    viewDetails: '查看詳情',
    orderDetails: '訂單詳情',
    totalItems: '總項目數',
    loggedInAs: '登入身份',
    signOut: '登出',
    statistics: '統計',
    recentOrders: '最近訂單',
    allOrders: '所有訂單',
    allProjects: '所有專案',
    allCustomers: '所有客戶',
    orderHistory: '訂單歷史',
    noOrderHistory: '無訂單歷史',

    // Room Visualizer
    roomVisualizer: '房間模擬器',
    seeInRoom: '看看它在你的房間裡的樣子',
    pickProductImage: '選擇產品圖片',
    pickImageHint: '選擇產品最清晰的圖片',
    cropImage: '裁切產品區域',
    cropHint: '裁切產品周圍以獲得最佳效果',
    skipCrop: '跳過（使用完整圖片）',
    cropAndContinue: '裁切並繼續',
    removingBg: '正在移除背景...',
    downloadingModel: '正在下載 AI 模型（僅首次需要）...',
    analyzingImage: '正在分析圖片...',
    bgRemoved: '背景已移除！',
    looksGood: '看起來不錯！繼續',
    redo: '重做',
    uploadRoomPhoto: '上傳房間照片',
    roomPhotoHint: '拍攝你想放置產品的房間或桌面照片',
    placeInRoom: '將產品放入房間',
    download: '下載',
    backToEdit: '回到編輯',
    done: '完成',
    resetPosition: '重置',
    flip: '翻轉',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, default to English
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    // Update localStorage when language changes
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'zh' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
