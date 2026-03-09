# 🔍 Feature Deep Dive: ABC Cinema

This document explores the technical implementation of the two most critical features in ABC Cinema: the **3D Seat Selection Map** and the **Secure Booking Funnel**.

## 🧊 3D Seat Selection Map

The seat map is not just a 2D grid; it's a dynamic 3D environment rendered using **React Three Fiber**.

### **Implementation Strategy:**
- **Instance Mesh:** Seats are rendered as instances to keep the draw call count low, ensuring 60FPS even on mobile devices.
- **Raycasting:** Uses Three.js raycasting to detect seat clicks. When a user clicks a seat, the UUID is passed to the **Zustand store** to toggle selection.
- **Dynamic Lighting:** Points lights and ambient occlusion are used to give the "Premium Immersive" hall feel.

```javascript
// Simplified logic for seat interaction
const toggleSeat = (id) => {
  if (selectedSeats.includes(id)) {
    removeSeat(id);
  } else {
    addSeat(id);
  }
};
```

## 💳 Secure Booking & Stripe Funnel

The booking flow is designed as a state machine to prevent race conditions and double-bookings.

### **The Funnel Phases:**
1. **Idle:** User browses movies.
2. **Selection:** Multi-seat selection with real-time price calculation.
3. **Checkout Portal:** Secure Stripe portal injection.
4. **Processing:** Transitioning to `paying` state in the store, disabling further UI interactions.
5. **Success/Failure:** Result handling with automatic PDF ticket generation on success.

### **Payment Security:**
- We utilize **Stripe Elements** for a secure, branded checkout experience.
- The transaction ID is cross-referenced with the local `uuid` before the ticket is finalized.

## 📑 Dynamic Ticket Generation

Instead of waiting for a server email, ABC Cinema uses **jsPDF** to generate a "Digital Pass" instantly.
- **Unique Identifiers:** Each ticket gets a `TCK-XXXX` ID.
- **Dynamic Content:** Movie Title, Seat Numbers, Hall Name, and Price are injected into a custom-styled PDF template.
