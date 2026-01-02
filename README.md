# Carissa Michae — Model Portfolio & Booking Site

A cinematic, responsive portfolio website designed to showcase professional modeling work across **commercial, editorial, and lifestyle** categories. Built with visual storytelling, accessibility, and performance in mind.

---

## 📸 Screenshots

> Add screenshots to `/screenshots` and update filenames below.

| Enter Page | Home Page |
|-----------|-----------|
| ![Enter Page](screenshots/enter-page.jpg) | ![Home Page](screenshots/home-page.jpg) |

| Portfolio (Lightbox) | Contact Page |
|---------------------|--------------|
| ![Portfolio Lightbox](screenshots/portfolio-lightbox.jpg) | ![Contact Page](screenshots/contact-page.jpg) |

---

## ✨ Features

### Cinematic Enter Experience
- Full-screen **background video**
- Smooth **zoom-through transition** into the homepage
- Overlay text and call-to-action remain readable across devices
- Mobile-safe playback (`muted`, `autoplay`, `playsinline`)

### Home Page
- Full-viewport hero layout
- Cinematic typography and call-to-action buttons
- Footer visually blends into the hero image
- Mobile experience is **locked to viewport** (no drag, no scroll bleed)

### Portfolio
- Categorized tabs:
  - Headshots
  - Full-Body Shots
  - Profile Shots
- Responsive image grid
- **Lightbox viewer**:
  - Click-to-enlarge
  - Background blur
  - Left / right navigation
  - Close button
  - Keyboard support
  - Navigation stays within the active category

### About Page
- Editorial-style biography
- Vertically balanced two-column layout
- Stats card aligned with text
- Mobile spacing handled independently

### Contact Page
- Professional booking form powered by **Formspree**
- Desktop-only fit-to-screen layout
- Mobile scrolling preserved
- Inline success and error messaging

---

## 📱 Mobile vs Desktop Behavior

This site intentionally behaves differently across devices.

### Mobile
- Enter page and home page are locked to the viewport
- No dragging, panning, or scroll bleed
- Lightbox and forms remain scroll-safe

### Desktop
- Natural scrolling where appropriate
- Contact page fits screen height on large displays only

These behaviors are handled via **media queries** and **page-specific body classes**, without affecting other pages.

---

## 🧠 Accessibility & UX

- Semantic HTML structure
- ARIA attributes for:
  - Tabs
  - Dialogs (lightbox)
  - Navigation
- Keyboard navigation supported
- Motion kept smooth and intentional (no infinite transforms)

---

## 🗂️ Project Structure