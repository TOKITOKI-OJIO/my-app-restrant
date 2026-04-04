interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  spec?: string;
}

const CART_KEY = 'restaurant_cart';

export const cartUtils = {
  // 获取购物车数据
  getCart: (): CartItem[] => {
    try {
      const cartData = localStorage.getItem(CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('获取购物车数据失败:', error);
      return [];
    }
  },

  // 保存购物车数据
  saveCart: (cart: CartItem[]): void => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('保存购物车数据失败:', error);
    }
  },

  // 添加商品到购物车
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }): void => {
    const cart = cartUtils.getCart();
    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // 如果商品已存在，增加数量
      cart[existingItemIndex].quantity += item.quantity || 1;
    } else {
      // 如果商品不存在，添加新商品
      cart.push({ ...item, quantity: item.quantity || 1 });
    }

    cartUtils.saveCart(cart);
  },

  // 从购物车移除商品
  removeFromCart: (itemId: number): void => {
    const cart = cartUtils.getCart();
    const updatedCart = cart.filter((item) => item.id !== itemId);
    cartUtils.saveCart(updatedCart);
  },

  // 更新购物车商品数量
  updateQuantity: (itemId: number, quantity: number): void => {
    if (quantity <= 0) {
      cartUtils.removeFromCart(itemId);
      return;
    }

    const cart = cartUtils.getCart();
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    cartUtils.saveCart(updatedCart);
  },

  // 清空购物车
  clearCart: (): void => {
    localStorage.removeItem(CART_KEY);
  },

  // 计算购物车总价
  getTotalPrice: (): number => {
    const cart = cartUtils.getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // 计算购物车商品总数
  getTotalQuantity: (): number => {
    const cart = cartUtils.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
};