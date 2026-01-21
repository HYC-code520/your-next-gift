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
    home: 'HOME',
    list: 'LIST',
    form: 'FORM',
    faq: 'FAQ',
    about: 'ABOUT',
    blog: 'BLOG',
    birthdays: 'BIRTHDAYS',
    myOrders: 'MY ORDERS',
    admin: 'ADMIN',
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
    proceedToCheckout: 'Proceed to Checkout',
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
  },
  zh: {
    // Navigation
    home: '首頁',
    list: '清單',
    form: '表單',
    faq: '常見問題',
    about: '關於',
    blog: '部落格',
    birthdays: '生日日曆',
    myOrders: '我的訂單',
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
