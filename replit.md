# LegacyScribe - Story Preservation Service

## Overview
LegacyScribe is an e-commerce platform designed to help families preserve the life stories of their elders. It delivers structured questions via WhatsApp to facilitate recording and aims to create lasting family legacies by bridging generational gaps. The service offers a seamless user experience from product discovery to story preservation.

## User Preferences
I prefer iterative development with clear communication at each stage. Please ask before making major architectural changes or introducing new external dependencies. I value concise explanations and well-structured code.

## System Architecture
The application features a mobile-first, responsive design with a warm color palette (Primary Blue, Gold Accent, Soft Backgrounds) and the Inter font family, utilizing Shadcn UI with custom theming.

**Technical Stack:**
- **Frontend:** React, TypeScript, Vite, Wouter (routing), TanStack Query (state), React Hook Form, Zod (forms), Tailwind CSS, Shadcn UI
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (via Drizzle ORM)
- **API Communication:** Axios
- **WhatsApp Integration:** Facebook Graph API v22.0

**Key Features:**
- **Landing Page:** A single-page scrollable design with sections for Hero, Value Proposition, How It Works, Testimonials, Albums, FAQs, and a Final CTA.
- **Checkout Pages:**
    - **Regular Checkout:** Allows selection of multiple albums with flexible quantities.
    - **Free Trial Checkout:** Restricted to selecting one album with a fixed quantity of one, featuring an info banner and visual feedback.
- **Routing:** Manages navigation between the landing page, checkout flows, free trial signup, and personalized album galleries.
- **WhatsApp Integration:**
    - Employs a two-entity (Customer/Storyteller) flow using Meta-verified templates for various stages like order confirmation, storyteller onboarding, readiness checks, voice note acknowledgments, and album completion.
    - Implements a conversation state machine (`awaiting_initial_contact`, `awaiting_readiness`, `in_progress`, `completed`) to manage the storytelling process.
    - Handles storyteller association via shareable links, readiness flow with retry logic, question progression (initial question, then every 48 hours after voice note), and voice note handling (saving metadata, downloading media, scheduling next questions).
    - Features a background scheduler for managing scheduled questions, reminders, and retries.
    - Includes webhook verification, idempotency for messages and voice notes, E.164 phone number validation, and API retry logic with exponential backoff.
- **Data Model:** Collects buyer/storyteller names, WhatsApp numbers, and selected albums. Utilizes PostgreSQL for `freeTrials` and `voiceNotes` tables with appropriate indexes.
- **Albums Gallery:** A mobile-first, swipeable vinyl gallery displaying real voice notes from the database.
    - **Route:** `/albums/:trialId`
    - **API Endpoint:** Provides trial metadata and track-specific voice note data.
    - **Components:** `SwipePager` for gesture navigation, `Vinyl` for spinning record animation, `IntroSlide` for album cover, and `TrackSlide` for individual tracks with audio players.
    - **Audio System:** Centralized state management for exclusive playback, auto-pause on navigation, and tab visibility changes.
    - **Accessibility:** Keyboard navigation, touch-friendly elements, and ARIA labels.
- **Security:** HMAC SHA-256 signature verification for webhooks, event-specific idempotency, and amount validation.

## External Dependencies
- **WhatsApp Business API:** For automated messaging and communication.
- **Axios:** HTTP client.
- **Supabase PostgreSQL:** Production database.