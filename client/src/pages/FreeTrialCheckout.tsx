import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
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

export default function FreeTrialCheckout() {
  const [, setLocation] = useLocation();
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);

  const handleStartTrial = () => {
    if (selectedAlbumId === null) {
      return;
    }
    const selectedAlbum = albums.find(a => a.id === selectedAlbumId);
    if (!selectedAlbum) return;
    
    console.log("Starting Free Trial with Album:", selectedAlbum.title);
    setLocation(`/free-trial?album=${encodeURIComponent(selectedAlbum.title)}`);
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
              Free Trial - Choose One Album
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </div>

      {/* Album Selection */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
        {/* Trial Info Banner */}
        <div className="mb-8 p-6 bg-[#A35139]/10 rounded-2xl border-2 border-[#A35139]/30">
          <h2 className="text-lg font-bold text-[#1B2632] mb-2">Free Trial Details</h2>
          <ul className="text-[#1B2632]/70 text-sm sm:text-base space-y-1">
            <li>• Select <strong>one album</strong> to try for free</li>
            <li>• You'll receive <strong>1 trial album</strong></li>
          </ul>
        </div>

        <div className="space-y-6">
          {albums.map((album) => {
            const isSelected = selectedAlbumId === album.id;
            
            return (
              <Card 
                key={album.id} 
                className={`overflow-hidden shadow-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-4 ring-[#A35139] ring-opacity-50' 
                    : 'hover-elevate'
                }`}
                onClick={() => setSelectedAlbumId(album.id)}
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
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#A35139]/20 flex items-center justify-center">
                        <div className="bg-[#A35139] text-white rounded-full p-3">
                          <Check className="h-8 w-8" data-testid={`selected-check-${album.id}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Album Content */}
                  <div className="p-6 sm:p-8">
                    {/* Title and Description */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
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
                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="bg-[#A35139] text-white rounded-full p-2">
                            <Check className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quantity Display (Fixed at 1) */}
                    <div className="mt-4 flex items-center gap-2 text-[#1B2632]/70">
                      <span className="font-medium">Quantity:</span>
                      <span className="text-xl font-bold text-[#1B2632]" data-testid={`quantity-${album.id}`}>
                        1
                      </span>
                      <span className="text-sm">(Free Trial)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-8 p-6 bg-[#EEE9DF]/50 rounded-2xl">
          <p className="text-center text-[#1B2632]/70 text-sm sm:text-base">
            Each album contains 15 thoughtfully crafted questions. Select one to experience our story preservation service.
          </p>
        </div>

        {/* Start Free Trial Button */}
        <div className="mt-8">
          <Button
            size="lg"
            className="w-full bg-[#A35139] text-white rounded-2xl shadow-xl border border-[#A35139] disabled:opacity-50"
            onClick={handleStartTrial}
            disabled={selectedAlbumId === null}
            data-testid="button-start-free-trial"
          >
            {selectedAlbumId === null 
              ? "Select an Album to Continue" 
              : "Start Free Trial"}
          </Button>
          {selectedAlbumId === null && (
            <p className="text-center text-[#1B2632]/50 text-sm mt-3">
              Please select one album above to start your free trial
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
