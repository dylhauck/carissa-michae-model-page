# Carissa Michae — Portfolio Website (Static)

A clean, modern static website for **Carissa Michae** featuring:
- Home (cinematic hero)
- Portfolio (desktop locked 2-row horizontal gallery + mobile-optimized horizontal gallery)
- About
- Contact (Formspree email delivery + inline success/error messaging)

Built with **HTML / CSS / JavaScript** and deployed via **GitHub Pages**.

---

## Live Site
- https://dylhauck.github.io

---

## Pages
- `index.html` — Home
- `portfolio.html` — Portfolio gallery + lightbox
- `about.html` — About + stats layout
- `contact.html` — Booking/contact form (Formspree)

---

## Features

### Portfolio
- **Desktop:** locked layout (no vertical scrolling), **2-row horizontal** gallery
- **Mobile:** optimized horizontal gallery sizing (smaller cards so multiple are visible before swiping)
- **Arrows:** left/right buttons to scroll the gallery (auto-disables at ends)
- **Scroll snapping:** makes the gallery move “picture-by-picture”
- **Lightbox:** click any image to enlarge, use arrows or keyboard to navigate

### Contact
- Form submits via **Formspree**
- Inline success + error messages
- Button shows sending/sent state
- Footer year auto-updates

### Global UI
- Sticky header with active-page underline
- Scroll reveal animations
- Cinematic “Enter → Home” zoom animation

---

## Project Structure

```txt
/
├─ index.html
├─ portfolio.html
├─ about.html
├─ contact.html
├─ styles.css
├─ script.js
└─ images/
   ├─ enter.jpeg
   ├─ fullbody1.JPG
   ├─ new2.jpeg
   ├─ ...
