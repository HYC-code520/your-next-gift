/**
 * Birthday Year Logic Utilities
 * 
 * Rules:
 * - Users can order their birthday gift starting 6 months before their birthday
 * - Order window closes on their birthday
 * - Each order is for a specific "birthday year"
 */

/**
 * Get the current birthday year for a user
 * @param {string} birthdayDate - User's birthday in 'YYYY-MM-DD' format
 * @returns {number} - The birthday year (e.g., 2026)
 */
export function getCurrentBirthdayYear(birthdayDate) {
  if (!birthdayDate) return null;
  
  const today = new Date();
  const birthday = new Date(birthdayDate);
  
  // Get this year's birthday
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  );
  
  // If today is before this year's birthday, the current birthday year is this year
  // If today is on or after this year's birthday, the current birthday year is next year
  if (today < thisYearBirthday) {
    return today.getFullYear();
  } else {
    return today.getFullYear() + 1;
  }
}

/**
 * Get the order window for a specific birthday year
 * @param {string} birthdayDate - User's birthday in 'YYYY-MM-DD' format
 * @param {number} birthdayYear - The birthday year
 * @returns {object} - { startDate, endDate, isOpen }
 */
export function getOrderWindow(birthdayDate, birthdayYear) {
  if (!birthdayDate || !birthdayYear) {
    return { startDate: null, endDate: null, isOpen: false };
  }
  
  const birthday = new Date(birthdayDate);
  
  // End date is the birthday in the specified year
  const endDate = new Date(
    birthdayYear,
    birthday.getMonth(),
    birthday.getDate()
  );
  
  // Start date is 6 months before the birthday
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 6);
  
  const today = new Date();
  const isOpen = today >= startDate && today <= endDate;
  
  return {
    startDate,
    endDate,
    isOpen
  };
}

/**
 * Check if user can order for a specific birthday year
 * @param {string} birthdayDate - User's birthday in 'YYYY-MM-DD' format
 * @param {number} birthdayYear - The birthday year to check
 * @param {array} existingOrders - Array of user's existing orders with birthday_year
 * @returns {object} - { canOrder, reason, window }
 */
export function canOrderForBirthdayYear(birthdayDate, birthdayYear, existingOrders = []) {
  if (!birthdayDate) {
    return {
      canOrder: false,
      reason: 'No birthday date set',
      window: null
    };
  }
  
  const window = getOrderWindow(birthdayDate, birthdayYear);
  
  // Check if window is open
  if (!window.isOpen) {
    return {
      canOrder: false,
      reason: window.startDate > new Date() 
        ? 'Order window not yet open'
        : 'Order window has closed',
      window
    };
  }
  
  // Check if user already ordered for this birthday year
  const hasOrderedForYear = existingOrders.some(
    order => order.birthday_year === birthdayYear
  );
  
  if (hasOrderedForYear) {
    return {
      canOrder: false,
      reason: `Already ordered for ${birthdayYear} birthday`,
      window
    };
  }
  
  return {
    canOrder: true,
    reason: null,
    window
  };
}

/**
 * Format date for display
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Get user-friendly message about order window
 * @param {string} birthdayDate
 * @param {array} existingOrders
 * @returns {object} - { message, canOrder, birthdayYear }
 */
export function getOrderWindowMessage(birthdayDate, existingOrders = []) {
  if (!birthdayDate) {
    return {
      message: 'Please set your birthday in your profile to order gifts.',
      canOrder: false,
      birthdayYear: null
    };
  }
  
  const currentYear = getCurrentBirthdayYear(birthdayDate);
  const check = canOrderForBirthdayYear(birthdayDate, currentYear, existingOrders);
  
  if (check.canOrder) {
    return {
      message: `Order by ${formatDate(check.window.endDate)}`,
      canOrder: true,
      birthdayYear: currentYear
    };
  }
  
  // If can't order for current year, check next year
  const nextYear = currentYear + 1;
  const nextWindow = getOrderWindow(birthdayDate, nextYear);
  
  if (check.reason === 'Order window has closed') {
    return {
      message: `Your ${currentYear} birthday window has closed. You can order your ${nextYear} birthday gift starting ${formatDate(nextWindow.startDate)}.`,
      canOrder: false,
      birthdayYear: nextYear,
      nextWindowStart: nextWindow.startDate
    };
  }
  
  if (check.reason === 'Order window not yet open') {
    return {
      message: `Your ${currentYear} birthday gift ordering opens on ${formatDate(check.window.startDate)}.`,
      canOrder: false,
      birthdayYear: currentYear,
      nextWindowStart: check.window.startDate
    };
  }
  
  if (check.reason?.includes('Already ordered')) {
    return {
      message: `You've already ordered your ${currentYear} birthday gift! Your ${nextYear} birthday gift will be available starting ${formatDate(nextWindow.startDate)}.`,
      canOrder: false,
      birthdayYear: nextYear,
      nextWindowStart: nextWindow.startDate
    };
  }
  
  return {
    message: check.reason || 'Unable to order at this time.',
    canOrder: false,
    birthdayYear: currentYear
  };
}
