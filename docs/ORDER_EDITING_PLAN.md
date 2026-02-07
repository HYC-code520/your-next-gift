# Order Editing Feature Implementation Plan

## Overview
Allow users to edit pending orders (items, quantities, details) and cancel orders, with email notifications to admin.

## Features
1. **Edit items & quantities** - Add/remove items, change quantities
2. **Edit personal details** - Update notes (email/birthday year are locked after order)
3. **Cancel orders** - Cancel pending orders with confirmation
4. **Email notifications** - Admin notified when orders are edited/cancelled

---

## Implementation Steps

### Step 1: Database Migration
**Create:** `backend/supabase/enable-order-editing.sql`

- Add `notes` column to orders table
- Add RLS policies for order_items (UPDATE, DELETE, INSERT) restricted to pending orders
- Restrict order UPDATE policy to pending orders only

### Step 2: Create Update Notification Edge Function
**Create:** `backend/supabase/functions/notify-order-updated/index.ts`

- Copy pattern from `notify-new-order/index.ts`
- Handle UPDATE events on orders table
- Email includes: change type (modified/cancelled), old vs new item count, customer info
- Different styling for cancellations (red) vs edits (blue)

### Step 3: Deploy & Configure Webhook
- Deploy Edge Function: `supabase functions deploy notify-order-updated`
- Add webhook in Supabase Dashboard:
  - Table: `orders`
  - Event: `UPDATE`
  - Function: `notify-order-updated`

### Step 4: Update MyOrders.jsx
**Modify:** `frontend/src/components/MyOrders.jsx`

**New imports:**
- `Edit, Trash2, Plus, Minus, AlertTriangle` from lucide-react

**New state:**
```javascript
const [editingOrder, setEditingOrder] = useState(null);
const [editedItems, setEditedItems] = useState([]);
const [editedNotes, setEditedNotes] = useState('');
const [saving, setSaving] = useState(false);
const [showCancelConfirm, setShowCancelConfirm] = useState(null);
```

**New functions:**
- `startEditing(order)` - Enter edit mode for pending order
- `cancelEditing()` - Exit edit mode without saving
- `updateItemQuantity(itemId, newQty)` - Change item quantity
- `removeItem(itemId)` - Remove item from order
- `saveOrderChanges(orderId)` - Save all changes to database
- `cancelOrder(orderId)` - Cancel the order

**UI changes to `renderOrderCard`:**
- Add Edit/Cancel buttons for pending orders
- Show edit mode UI when `editingOrder === order.id`
- Quantity +/- controls for each item
- Remove item button
- Notes textarea
- Save/Cancel buttons
- Cancel order confirmation modal

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `backend/supabase/enable-order-editing.sql` | Create | RLS policies for editing |
| `backend/supabase/functions/notify-order-updated/index.ts` | Create | Email on order update |
| `frontend/src/components/MyOrders.jsx` | Modify | Add edit UI and logic |

---

## UI Flow

```
Pending Order Card
├── [Edit Order] button → Enter edit mode
│   ├── Item list with +/- quantity controls
│   ├── Remove item buttons
│   ├── Notes textarea
│   ├── [Save Changes] → API calls → Email to admin
│   └── [Cancel] → Discard changes
│
└── [Cancel Order] button → Confirmation modal
    ├── [Yes, Cancel] → Update status → Email to admin
    └── [No, Keep Order] → Close modal
```

---

## Restrictions
- Only **pending** orders can be edited/cancelled
- Cannot remove last item (minimum 1 item required)
- Birthday year and email are read-only (set at checkout time)

---

## Verification
1. Place a test order
2. Go to My Orders, click "Edit Order" on pending order
3. Change item quantity, verify it updates
4. Remove an item, verify it's removed
5. Add notes, save changes
6. Check admin email for update notification
7. Cancel an order, verify status changes and email received
