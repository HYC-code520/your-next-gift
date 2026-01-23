import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { getCurrentBirthdayYear, canOrderForBirthdayYear, getOrderWindowMessage } from '../utils/birthdayYearLogic';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBirthday, setUserBirthday] = useState(null);
  const [existingOrders, setExistingOrders] = useState([]);
  const [orderWindowInfo, setOrderWindowInfo] = useState(null);
  const { user } = useAuth();

  // Load cart from localStorage or database
  useEffect(() => {
    loadCart();
    if (user) {
      loadUserBirthdayAndOrders();
    }
  }, [user]);

  const loadUserBirthdayAndOrders = async () => {
    if (!user) return;
    
    try {
      // Fetch user's birthday from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('birthday')
        .eq('id', user.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user birthday:', profileError);
      } else if (profile?.birthday) {
        setUserBirthday(profile.birthday);
        
        // Fetch user's existing orders with birthday_year
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, birthday_year, created_at')
          .eq('user_id', user.id)
          .not('birthday_year', 'is', null);
        
        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
        } else {
          setExistingOrders(orders || []);
          
          // Calculate order window info
          const windowInfo = getOrderWindowMessage(profile.birthday, orders || []);
          setOrderWindowInfo(windowInfo);
        }
      }
    } catch (error) {
      console.error('Error loading birthday and orders:', error);
    }
  };

  const loadCart = async () => {
    setLoading(true);
    
    if (user) {
      // User is logged in - load from database
      await loadCartFromDatabase();
    } else {
      // User not logged in - load from localStorage
      loadCartFromLocalStorage();
    }
    
    setLoading(false);
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  };

  const loadCartFromDatabase = async () => {
    try {
      // First, get or create cart for user
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cartError && cartError.code === 'PGRST116') {
        // Cart doesn't exist, create it
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert([{ user_id: user.id }])
          .select()
          .single();

        if (createError) throw createError;
        cartData = newCart;
      } else if (cartError) {
        throw cartError;
      }

      // Load cart items
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          diy_projects:project_id (
            id,
            project_name,
            description,
            images,
            estimated_time,
            materials
          )
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) throw itemsError;

      // Transform to match cart format
      const transformedCart = cartItems.map(item => ({
        cartItemId: item.id,
        id: item.project_id,
        projectName: item.diy_projects.project_name,
        description: item.diy_projects.description,
        images: item.diy_projects.images,
        estimatedTime: item.diy_projects.estimated_time,
        materials: item.diy_projects.materials,
        quantity: item.quantity,
        customization: item.customization || {
          colors: [],
          size: '',
          personalization: '',
          specialRequests: ''
        },
        recipientName: item.recipient_name || '',
        birthday: item.birthday || '',
        colorPreference: item.color_preference || '',
        additionalNotes: item.additional_notes || '',
      }));

      setCart(transformedCart);

      // Merge any localStorage cart items
      await mergeLocalStorageCart(cartData.id);
    } catch (error) {
      console.error('Error loading cart from database:', error);
      loadCartFromLocalStorage();
    }
  };

  const mergeLocalStorageCart = async (cartId) => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const localCart = JSON.parse(savedCart);
        
        // Add each item from localStorage to database
        for (const item of localCart) {
          await supabase.from('cart_items').insert([{
            cart_id: cartId,
            project_id: item.id,
            quantity: item.quantity || 1,
          }]);
        }
        
        // Clear localStorage
        localStorage.removeItem('cart');
        
        // Reload cart from database
        await loadCartFromDatabase();
      }
    } catch (error) {
      console.error('Error merging localStorage cart:', error);
    }
  };

  const saveCartToLocalStorage = (newCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const addToCart = async (project) => {
    // Validate birthday year window (only for non-additional requests)
    if (user && !project.customization?.isAdditionalRequest) {
      if (!userBirthday) {
        alert('Please set your birthday in your profile before ordering a gift.');
        return;
      }
      
      const currentBirthdayYear = getCurrentBirthdayYear(userBirthday);
      const validation = canOrderForBirthdayYear(userBirthday, currentBirthdayYear, existingOrders);
      
      if (!validation.canOrder) {
        alert(`Unable to order: ${validation.reason}\n\n${orderWindowInfo?.message || ''}`);
        return;
      }
      
      // Add birthday year to the project
      project.birthdayYear = currentBirthdayYear;
    }
    
    // Check if item with same customization already exists
    const existingItem = cart.find(item => 
      item.id === project.id && 
      JSON.stringify(item.customization) === JSON.stringify(project.customization)
    );

    if (existingItem) {
      // Item with same customization already in cart, increase quantity
      await updateQuantity(existingItem.cartItemId || project.id, existingItem.quantity + 1);
    } else {
      // New item or different customization
      const newItem = {
        id: project.id,
        projectName: project.projectName,
        description: project.description,
        images: project.images,
        estimatedTime: project.estimatedTime,
        materials: project.materials,
        quantity: 1,
        customization: project.customization || {
          colors: [],
          size: '',
          personalization: '',
          specialRequests: ''
        },
        recipientName: '',
        birthday: '',
        colorPreference: '',
        additionalNotes: '',
      };

      if (user) {
        // Save to database
        const { data: cartData } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            cart_id: cartData.id,
            project_id: project.id,
            quantity: 1,
            customization: newItem.customization, // Save customization
          }])
          .select()
          .single();

        if (!error) {
          newItem.cartItemId = data.id;
        }
      }

      const newCart = [...cart, newItem];
      setCart(newCart);
      
      if (!user) {
        saveCartToLocalStorage(newCart);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const item = cart.find(i => i.id === itemId || i.cartItemId === itemId);
    
    if (user && item.cartItemId) {
      // Remove from database
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', item.cartItemId);
    }

    const newCart = cart.filter(i => i.id !== itemId && i.cartItemId !== itemId);
    setCart(newCart);
    
    if (!user) {
      saveCartToLocalStorage(newCart);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const item = cart.find(i => i.id === itemId || i.cartItemId === itemId);
    
    if (user && item.cartItemId) {
      // Update in database
      await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', item.cartItemId);
    }

    const newCart = cart.map(i => 
      (i.id === itemId || i.cartItemId === itemId)
        ? { ...i, quantity }
        : i
    );
    setCart(newCart);
    
    if (!user) {
      saveCartToLocalStorage(newCart);
    }
  };

  const updateItemDetails = async (itemId, details) => {
    const item = cart.find(i => i.id === itemId || i.cartItemId === itemId);
    
    if (user && item.cartItemId) {
      // Update in database
      await supabase
        .from('cart_items')
        .update({
          recipient_name: details.recipientName,
          birthday: details.birthday,
          color_preference: details.colorPreference,
          additional_notes: details.additionalNotes,
        })
        .eq('id', item.cartItemId);
    }

    const newCart = cart.map(i =>
      (i.id === itemId || i.cartItemId === itemId)
        ? { ...i, ...details }
        : i
    );
    setCart(newCart);
    
    if (!user) {
      saveCartToLocalStorage(newCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      // Clear from database
      const { data: cartData } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (cartData) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cartData.id);
      }
    }

    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartCount = () => {
    // Only count the main gift (not additional requests pending approval)
    const mainGift = cart.find(item => !item.customization?.isAdditionalRequest);
    return mainGift ? 1 : 0;
  };

  // Check if cart already has items (for the "one gift" flow)
  const hasItems = () => {
    return cart.length > 0;
  };

  // Replace all items in cart with a new one
  const replaceCart = async (project) => {
    await clearCart();
    await addToCart(project);
  };

  // Add item as additional request (with reason)
  const addAsAdditionalRequest = async (project, reason) => {
    const projectWithReason = {
      ...project,
      customization: {
        ...(project.customization || {}),
        additionalItemReason: reason,
        isAdditionalRequest: true,
      }
    };
    await addToCart(projectWithReason);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemDetails,
    clearCart,
    getCartCount,
    hasItems,
    replaceCart,
    addAsAdditionalRequest,
    userBirthday,
    orderWindowInfo,
    existingOrders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
