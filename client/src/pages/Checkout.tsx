import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

interface Album {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const albums: Album[] = [
  {
    id: 1,
    title: "Our Family History",
    description: "Revisit the people, places, and small moments that shaped your earliest memories",
    imageSrc: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
    imageAlt: "Our Family History",
  },
  {
    id: 2,
    title: "Their Life Paths",
    description: "Reflect on your life's journey — the moments, choices, and people that taught you who you are",
    imageSrc: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800&q=80",
    imageAlt: "Their Life Paths",
  },
  {
    id: 3,
    title: "Words of Wisdom",
    description: "Share the wisdom, values, and reflections that your life's journey has taught you",
    imageSrc: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?w=800&q=80",
    imageAlt: "Words of Wisdom",
  },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [quantities, setQuantities] = useState<Record<number, number>>({
    1: 1,
    2: 1,
    3: 1,
  });

  const handleQuantityChange = (albumId: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [albumId]: Math.max(1, (prev[albumId] || 1) + delta),
    }));
  };

  const handleBuyNow = () => {
    const selectedAlbums = albums.filter(album => quantities[album.id] > 0);
    console.log("Buy Now - Selected Albums:", selectedAlbums.map(album => ({
      id: album.id,
      title: album.title,
      quantity: quantities[album.id]
    })));
  };

  const handleFreeTrial = () => {
    console.log("Navigating to Free Trial Album Selection");
    setLocation("/free-trial-checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-[#1B2632] hover-elevate active-elevate-2 px-3 py-2 rounded-lg"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B2632]">
              Choose Your Album
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Album Selection */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
        <div className="space-y-6">
          {albums.map((album) => (
            <Card 
              key={album.id} 
              className="overflow-hidden shadow-lg"
              data-testid={`album-card-${album.id}`}
            >
              <CardContent className="p-0">
                {/* Album Image */}
                <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                  <img
                    src={album.imageSrc}
                    alt={album.imageAlt}
                    className="w-full h-full object-cover"
                    data-testid={`album-image-${album.id}`}
                  />
                </div>

                {/* Album Content */}
                <div className="p-6 sm:p-8">
                  {/* Title and Description */}
                  <div className="mb-6">
                    <h2 
                      className="text-2xl sm:text-3xl font-bold text-[#1B2632] mb-3"
                      data-testid={`album-title-${album.id}`}
                    >
                      {album.title}
                    </h2>
                    <p 
                      className="text-[#1B2632]/70 text-base sm:text-lg leading-relaxed"
                      data-testid={`album-description-${album.id}`}
                    >
                      {album.description}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <span className="text-[#1B2632]/70 font-medium">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(album.id, -1)}
                        disabled={quantities[album.id] <= 1}
                        className="rounded-full"
                        data-testid={`button-decrease-${album.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span 
                        className="text-xl font-bold text-[#1B2632] min-w-[3ch] text-center"
                        data-testid={`quantity-${album.id}`}
                      >
                        {quantities[album.id]}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(album.id, 1)}
                        className="rounded-full"
                        data-testid={`button-increase-${album.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-[#EEE9DF]/50 rounded-2xl">
          <p className="text-center text-[#1B2632]/70 text-sm sm:text-base">
            Need help choosing? Each album contains 15 thoughtfully crafted questions designed to preserve precious memories.
          </p>
        </div>

        {/* Single Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="flex-1 bg-[#1B2632] text-[#EEE9DF] rounded-2xl shadow-xl border border-[#1B2632]"
            onClick={handleBuyNow}
            data-testid="button-buy-now"
          >
            Buy Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-2 border-[#A35139] text-[#A35139] rounded-2xl"
            onClick={handleFreeTrial}
            data-testid="button-free-trial"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
