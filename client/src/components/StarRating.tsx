import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: number;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent!",
};

export function StarRating({ value, onChange, size = 48 }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2" data-testid="star-rating-container">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            onMouseEnter={() => setHoverRating(rating)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-all duration-200 hover:scale-110"
            data-testid={`star-${rating}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                rating <= displayRating
                  ? "fill-secondary text-secondary"
                  : "fill-none text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
      </div>
      {displayRating > 0 && (
        <p
          className="text-lg font-medium text-muted-foreground transition-opacity duration-200"
          data-testid="rating-label"
        >
          {ratingLabels[displayRating]}
        </p>
      )}
    </div>
  );
}
