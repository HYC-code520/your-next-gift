# Birthday Year System Setup

## Overview
The Birthday Year System allows users to order their birthday gift once per year, with a 6-month advance ordering window.

## Rules
- Users can order starting **6 months before** their birthday
- Order window closes **on their birthday**
- Each order is tagged with a "birthday year" (e.g., 2026)
- Users can only order once per birthday year
- Additional requests can still be made (pending approval)

## Setup Instructions

### 1. Run Database Migration
Execute the SQL script in your Supabase SQL Editor:

```bash
backend/supabase/add-birthday-year-tracking.sql
```

This will:
- Add `birthday_year` column to `orders` table
- Add `birthday` column to `profiles` table
- Create necessary indexes

### 2. Set User Birthdays
Users need to set their birthday in their profile. You can either:

**Option A: Add a profile page** (recommended)
- Create a user profile page where users can set their birthday
- Update the `profiles` table with their birthday

**Option B: Set manually in Supabase**
```sql
UPDATE profiles 
SET birthday = '2000-07-15'  -- YYYY-MM-DD format
WHERE user_id = 'user-uuid-here';
```

### 3. Test the System

#### Test Scenario 1: Within Order Window
```sql
-- Set birthday to 6 months from now
UPDATE profiles 
SET birthday = CURRENT_DATE + INTERVAL '6 months'
WHERE user_id = 'your-test-user-id';
```
- User should see green banner: "Order Window Open! 🎉"
- User can add items to cart

#### Test Scenario 2: Outside Order Window
```sql
-- Set birthday to 2 months from now (before 6-month window)
UPDATE profiles 
SET birthday = CURRENT_DATE + INTERVAL '2 months'
WHERE user_id = 'your-test-user-id';
```
- User should see blue banner with "Order window not yet open"
- User cannot add items to cart

#### Test Scenario 3: Already Ordered
1. Place an order within the window
2. Try to add another item
- User should see alert: "Already ordered for [year] birthday"

## Features

### For Users
- **Order Window Banner** - Shows on the LIST page
  - Green: Window is open, can order
  - Blue: Window closed, shows when next window opens
  - Yellow: No birthday set, prompts to add one

- **Validation** - Prevents ordering outside window
  - Clear error messages
  - Shows next available order date

### For Admin
- **Birthday Year Badge** - Shows on each order
  - Purple badge: "🎂 2026 Birthday"
  - Helps track which birthday year each gift is for

- **Order Filtering** - Can filter by birthday year (future enhancement)

## Files Modified

### New Files
- `frontend/src/utils/birthdayYearLogic.js` - Core logic
- `frontend/src/components/OrderWindowBanner.jsx` - UI banner
- `backend/supabase/add-birthday-year-tracking.sql` - Database schema
- `docs/BIRTHDAY_YEAR_SETUP.md` - This file

### Modified Files
- `frontend/src/context/CartContext.jsx` - Added validation
- `frontend/src/components/DiyList.jsx` - Added banner
- `frontend/src/components/admin/OrdersManager.jsx` - Added birthday year display

## Future Enhancements

### Recommended Additions
1. **User Profile Page**
   - Let users set/update their birthday
   - Show order history by birthday year
   - Show next order window

2. **Email Notifications**
   - Notify users when order window opens
   - Reminder 1 month before birthday

3. **Admin Filters**
   - Filter orders by birthday year
   - See upcoming birthdays
   - Track order fulfillment by birthday

4. **Birthday Calendar Integration**
   - Auto-populate from existing birthday calendar
   - Sync birthday updates

## Troubleshooting

### Issue: "Please set your birthday in your profile"
**Solution**: User needs to add their birthday to the `profiles` table

### Issue: "Order window not yet open"
**Solution**: User's birthday is less than 6 months away. This is expected behavior.

### Issue: Order placed but no birthday_year
**Solution**: The order was placed before this system was implemented. You can manually update:
```sql
UPDATE orders 
SET birthday_year = 2026  -- Set appropriate year
WHERE id = 'order-id-here';
```

## Example Timeline

User's birthday: **July 15, 2026**

```
Jan 15, 2026  → Order window OPENS (6 months before)
                ✅ User can order 2026 birthday gift

July 15, 2026 → User's BIRTHDAY! 🎂
                ❌ Order window CLOSES

July 16, 2026 → Window closed for 2026
                ℹ️ Next window: Jan 15, 2027 (for 2027 birthday)

Jan 15, 2027  → Order window OPENS for 2027 birthday
                ✅ User can order 2027 birthday gift
```

## Success Criteria
- ✅ Users can only order during their 6-month window
- ✅ Users can only order once per birthday year
- ✅ Clear messaging about when they can order
- ✅ Admin can see which birthday year each order is for
- ✅ System prevents duplicate orders for same birthday year
