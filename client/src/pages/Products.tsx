import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileQuestion, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Question Pack Catalog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professionally curated question sets designed to capture life's most meaningful stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover-elevate transition-all duration-300 group"
              data-testid={`card-product-${product.id}`}
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  data-testid={`img-product-${product.id}`}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" data-testid={`badge-category-${product.id}`}>
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </CardTitle>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-3xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                    ₹{product.price}
                  </span>
                  <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
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
              </CardHeader>

              <CardContent>
                <CardDescription className="text-base mb-6 min-h-[60px]">
                  {product.description}
                </CardDescription>
                <Link href={`/products/${product.id}`} data-testid={`link-product-detail-${product.id}`}>
                  <Button className="w-full" variant="outline" data-testid={`button-view-details-${product.id}`}>
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Not Sure Which Pack to Choose?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start with our free trial to experience how LegacyScribe works. Try 10 questions with no commitment.
          </p>
          <Link href="/free-trial" data-testid="link-free-trial-cta">
            <Button size="lg" variant="secondary" data-testid="button-start-free-trial">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
