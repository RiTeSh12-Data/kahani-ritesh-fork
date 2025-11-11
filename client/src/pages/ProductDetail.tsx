import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileQuestion, Star, ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

const testimonials: Record<string, any[]> = {
  "military-veterans": [
    {
      name: "Vikram Singh",
      relationship: "Son of Army Veteran",
      rating: 5,
      text: "My father finally shared stories from his Kashmir deployment. These memories would have been lost forever.",
    },
    {
      name: "Meera Kapoor",
      relationship: "Granddaughter",
      rating: 5,
      text: "My grandfather's Air Force stories brought our family closer. We learned so much about his courage.",
    },
  ],
  "grandparent-chronicles": [
    {
      name: "Anjali Deshmukh",
      relationship: "Granddaughter",
      rating: 5,
      text: "My grandmother shared stories about partition that she'd never told anyone. Priceless memories.",
    },
  ],
  "career-life-lessons": [
    {
      name: "Rahul Mehta",
      relationship: "Son",
      rating: 5,
      text: "My father's 40-year career in engineering came alive through these questions. Inspirational stories.",
    },
  ],
  "immigration-culture": [
    {
      name: "Priya Patel",
      relationship: "Daughter",
      rating: 5,
      text: "Mom's journey from Gujarat to America in the 1970s is now preserved forever. Amazing experience.",
    },
  ],
  "healthcare-heroes": [
    {
      name: "Dr. Amit Kumar",
      relationship: "Son of Retired Doctor",
      rating: 5,
      text: "Dad's 35 years as a surgeon documented beautifully. His patient stories are truly touching.",
    },
  ],
  "entrepreneur-legacy": [
    {
      name: "Neha Shah",
      relationship: "Daughter",
      rating: 5,
      text: "Dad's journey from a small shop to a national brand is now documented. Invaluable business lessons.",
    },
  ],
};

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const { toast } = useToast();
  const productId = params?.id || "";

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json();
    },
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId: product.id, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" data-testid="link-back-to-products">
            <Button data-testid="button-back-to-products">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productTestimonials = testimonials[product.id] || [];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" data-testid="link-back">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative rounded-lg overflow-hidden bg-muted h-[500px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="img-product-hero"
            />
          </div>

          <div>
            <Badge variant="secondary" className="mb-4" data-testid="badge-category">
              {product.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-product-name">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-secondary text-secondary"
                  />
                ))}
                <span className="ml-2 text-muted-foreground" data-testid="text-rating">
                  5.0 ({productTestimonials.length * 20} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-primary" data-testid="text-price">
                ₹{product.price}
              </span>
              <div className="text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileQuestion className="h-4 w-4" />
                  <span>{product.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{product.durationDays} days</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2" data-testid={`feature-${index}`}>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleAddToCart}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">About This Pack</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Sample Questions</h2>
                <div className="space-y-4">
                  {product.sampleQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 rounded-lg bg-muted/50"
                      data-testid={`sample-question-${index}`}
                    >
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground">{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6">What Families Say</h3>
                <div className="space-y-6">
                  {productTestimonials.map((testimonial, index) => (
                    <div key={index} className="border-b last:border-0 pb-6 last:pb-0" data-testid={`testimonial-${index}`}>
                      <div className="flex gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic mb-2">"{testimonial.text}"</p>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.relationship}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
