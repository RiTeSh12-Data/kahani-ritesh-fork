import { useState, useEffect } from "react";

export function useCart() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return cartCount;
}
