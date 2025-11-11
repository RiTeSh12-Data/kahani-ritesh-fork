import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Cart() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [couponCode, setCouponCode] = useState("");

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const updateCart = (newCart: typeof cart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter((item) => item.productId !== productId);
    updateCart(newCart);
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "FIRST10") {
      toast({
        title: "Coupon applied!",
        description: "10% discount has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
    }
  };

  if (!products) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4" data-testid="text-empty-cart">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start preserving precious memories by adding a question pack to your cart.
          </p>
          <Link href="/products" data-testid="link-browse-products">
            <Button size="lg" data-testid="button-browse-products">
              Browse Question Packs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => item.product && (
              <Card key={item.productId} data-testid={`cart-item-${item.productId}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                      data-testid={`img-cart-item-${item.productId}`}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg" data-testid={`text-cart-item-name-${item.productId}`}>
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.questionCount} questions • {item.product.durationDays} days
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          data-testid={`button-remove-${item.productId}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, -1)}
                            data-testid={`button-decrease-${item.productId}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-8 text-center" data-testid={`text-quantity-${item.productId}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, 1)}
                            data-testid={`button-increase-${item.productId}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary" data-testid={`text-item-total-${item.productId}`}>
                            ₹{item.product.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold" data-testid="text-subtotal">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span className="font-semibold" data-testid="text-tax">₹{tax}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary" data-testid="text-total">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      data-testid="input-coupon"
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      data-testid="button-apply-coupon"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg mb-4"
                  onClick={() => setLocation("/checkout")}
                  data-testid="button-proceed-checkout"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Link href="/products" data-testid="link-continue-shopping">
                  <Button variant="ghost" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
