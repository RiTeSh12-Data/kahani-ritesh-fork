# Guide: Adding a New Album

This guide walks you through all the steps needed to add a new album to the Kahani system.

## Overview

When adding a new album, you need to update **6 files** across the codebase:

1. **Backend**: Album questions definition
2. **Frontend**: Album display components (3 files)
3. **Frontend**: Demo book data (optional, for interactive demo)
4. **Frontend**: Default album selection

---

## Step-by-Step Instructions

### 1. Add Questions to Backend (`shared/albumQuestions.ts`)

**File**: `shared/albumQuestions.ts`

Add your new album to the `albumQuestions` object with your desired number of questions (currently all albums have 15, but any number works).

```typescript
export const albumQuestions: AlbumQuestions = {
  // ... existing albums ...
  
  "Your New Album Name": [
    "Question 1?",
    "Question 2?",
    // ... add your desired number of questions
    "Question N?"
  ]
};
```

**Important**: 
- **Album name must match exactly across all files** - The album name is used as a dictionary key to look up questions. If it doesn't match, `getQuestionsForAlbum()` returns an empty array and questions won't be found.
- **Question count** - Albums can have any number of questions. The system dynamically uses `getTotalQuestionsForAlbum()` to determine the count. Currently, all existing albums have 15 questions, but you're free to use a different number.
- **Questions ending with "?"** - This is a style convention, not a technical requirement. Questions are just strings and the code doesn't validate the format.

---

### 2. Add to Landing Page Albums Section (`client/src/components/SectionFourAlbums.tsx`)

**File**: `client/src/components/SectionFourAlbums.tsx`

Add your album to the `defaultAlbums` array:

```typescript
const defaultAlbums: AlbumCard[] = [
  // ... existing albums ...
  
  {
    id: 4, // Increment from last album
    title: "Your New Album Name", // Must match albumQuestions key exactly
    description: "A compelling description of what this album covers",
    imageSrc: "https://images.unsplash.com/photo-XXXXX?w=800&q=80", // Find a relevant image
    imageAlt: "Your New Album Name",
    questions: [
      // Copy the same questions from albumQuestions.ts
      "Question 1?",
      "Question 2?",
      // ... all questions (must match albumQuestions.ts)
    ]
  }
];
```

**Fields to update**:
- `id`: Next sequential number (4, 5, 6, etc.)
- `title`: Must match exactly with `albumQuestions.ts`
- `description`: Marketing description for the album
- `imageSrc`: Unsplash or other image URL
- `imageAlt`: Same as title
- `questions`: Same 15 questions as in `albumQuestions.ts`

---

### 3. Add to Checkout Page (`client/src/pages/Checkout.tsx`)

**File**: `client/src/pages/Checkout.tsx`

Add your album to the `albums` array:

```typescript
const albums: Album[] = [
  // ... existing albums ...
  
  {
    id: 4, // Must match SectionFourAlbums.tsx id
    title: "Your New Album Name", // Must match exactly
    description: "Short description for checkout page",
    imageSrc: "https://images.unsplash.com/photo-XXXXX?w=800&q=80", // Same image as above
    imageAlt: "Your New Album Name",
  },
];
```

**Also update**:
- The `quantities` state default (if needed):
```typescript
const [quantities, setQuantities] = useState<Record<number, number>>({
  1: 1,
  2: 1,
  3: 1,
  4: 1, // Add new album
});
```

---

### 4. Add to Free Trial Checkout Page (`client/src/pages/FreeTrialCheckout.tsx`)

**File**: `client/src/pages/FreeTrialCheckout.tsx`

Add your album to the `albums` array (same structure as Checkout.tsx):

```typescript
const albums: Album[] = [
  // ... existing albums ...
  
  {
    id: 4, // Must match other files
    title: "Your New Album Name", // Must match exactly
    description: "Description for free trial page",
    imageSrc: "https://images.unsplash.com/photo-XXXXX?w=800&q=80", // Same image
    imageAlt: "Your New Album Name",
  },
];
```

---

### 5. Update Default Album in Free Trial Form (Optional)

**File**: `client/src/pages/FreeTrial.tsx`

If you want your new album to be the default selection, update line 38:

```typescript
selectedAlbum: albumFromUrl || "Your New Album Name", // Change default here
```

Otherwise, leave it as is - users can still select the new album via URL parameter.

---

### 6. Add Demo Book Data (Optional - for Interactive Demo)

**File**: `shared/demoBookData.ts`

If you want the new album to appear in the interactive demo, add a new entry to `demoBooks`:

```typescript
export const demoBooks: Record<string, DemoBook> = {
  // ... existing demos ...
  
  'your-new-album-slug': { // URL-friendly slug
    id: 'your-new-album-slug',
    title: 'Your New Album Name', // Must match exactly
    subtitle: 'Subtitle for demo',
    coverColor: 'from-purple-600 to-purple-800', // Tailwind gradient
    pages: [
      // Add demo pages with sample content
      {
        id: 1,
        content: {
          type: 'cover',
          title: 'Your New Album Name',
          text: 'Demo description...',
        }
      },
      // ... more demo pages
    ]
  }
};
```

**Note**: This is optional - the album will work without demo data.

---

## Checklist

When adding a new album, verify:

- [ ] Added to `shared/albumQuestions.ts` with exactly 15 questions
- [ ] Added to `client/src/components/SectionFourAlbums.tsx` with all fields
- [ ] Added to `client/src/pages/Checkout.tsx` 
- [ ] Added to `client/src/pages/FreeTrialCheckout.tsx`
- [ ] Album name matches **exactly** across all files (case-sensitive)
- [ ] Album ID is consistent across frontend files
- [ ] Image URLs are valid and relevant
- [ ] All 15 questions match between `albumQuestions.ts` and `SectionFourAlbums.tsx`
- [ ] (Optional) Added demo book data if needed

---

## Testing

After adding a new album:

1. **Test Free Trial Flow**:
   - Go to `/free-trial-checkout`
   - Select the new album
   - Complete the form
   - Verify album name is passed correctly

2. **Test Album Questions**:
   - Create a free trial with the new album
   - Verify questions are sent via WhatsApp correctly
   - Check that all 15 questions appear in sequence

3. **Test Album Gallery**:
   - Complete all questions
   - Verify album link works: `/albums/{trialId}`
   - Check that all questions display correctly

4. **Test Landing Page**:
   - Verify new album appears in the albums section
   - Check that questions preview correctly (first 3 shown)

---

## Example: Adding "Memories & Milestones" Album

Here's a complete example:

### 1. `shared/albumQuestions.ts`
```typescript
"Memories & Milestones": [
  "What was your most memorable birthday celebration?",
  "Describe your wedding day in three words.",
  // ... add your desired number of questions
]
```

### 2. `client/src/components/SectionFourAlbums.tsx`
```typescript
{
  id: 4,
  title: "Memories & Milestones",
  description: "Celebrate the special moments and milestones that defined your journey",
  imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  imageAlt: "Memories & Milestones",
  questions: [/* same questions as in albumQuestions.ts */]
}
```

### 3. `client/src/pages/Checkout.tsx` & `FreeTrialCheckout.tsx`
```typescript
{
  id: 4,
  title: "Memories & Milestones",
  description: "Celebrate special moments and milestones",
  imageSrc: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
  imageAlt: "Memories & Milestones",
}
```

---

## Important Notes

1. **Album Name Consistency**: The album name must be **exactly the same** (case-sensitive) in:
   - `shared/albumQuestions.ts` (object key)
   - All frontend `title` fields
   - Database `selectedAlbum` field (stored as-is)

2. **Question Count**: Albums can have any number of questions. The system dynamically uses `getTotalQuestionsForAlbum()` to determine the count for both the album gallery and completion logic. Currently, all existing albums have 15 questions, but you can use a different number if desired.

3. **ID Consistency**: The `id` field in frontend files should match across:
   - `SectionFourAlbums.tsx`
   - `Checkout.tsx`
   - `FreeTrialCheckout.tsx`

4. **No Database Migration Needed**: The `selectedAlbum` field in the database is a string, so new albums work automatically once added to the code.

---

## Troubleshooting

**Album not appearing?**
- Check that album name matches exactly (case-sensitive)
- Verify ID is consistent across frontend files
- Clear browser cache

**Questions not sending?**
- Verify questions are in `albumQuestions.ts`
- Check that album name in database matches exactly
- Check server logs for errors

**Album gallery not working?**
- Verify `getQuestionByIndex()` can find questions
- Check that album name in trial record matches exactly

---

That's it! Your new album should now be fully integrated into the system.

