import { jsPDF } from 'jspdf';

const BRAND_COLOR = [255, 215, 0]; // Gold
const BG_COLOR = [5, 5, 5]; // Obsidian

export const generateTicketPDF = (ticket, isCancellation = false) => {
    const doc = new jsPDF();
    const { id, movie, seats, date, time, hall, price } = ticket;

    // Background
    doc.setFillColor(...BG_COLOR);
    doc.rect(0, 0, 210, 297, 'F');

    // Header Gold Bar
    doc.setFillColor(...BRAND_COLOR);
    doc.rect(0, 0, 210, 40, 'F');

    // Title
    doc.setTextColor(5, 5, 5);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ABC CINEMA", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.text(isCancellation ? "OFFICIAL REFUND RECEIPT" : "OFFICIAL BOOKING RECEIPT", 105, 30, { align: "center" });

    // Transaction Details Box
    doc.setDrawColor(...BRAND_COLOR);
    doc.setLineWidth(0.5);
    doc.rect(15, 50, 180, 200);

    // Labels & Data
    doc.setTextColor(...BRAND_COLOR);
    doc.setFontSize(12);

    let y = 70;
    const addLine = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 25, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), 100, y);
        y += 15;
    };

    addLine("Transaction ID", id);
    addLine("Status", isCancellation ? "CANCELLED / REFUNDED" : "CONFIRMED / PAID");
    addLine("Movie", movie.title);
    addLine("Date", date);
    addLine("Time", time);
    addLine("Hall", hall);
    addLine("Seats", seats.join(", "));
    addLine("Amount", `$${price.toFixed(2)}`);

    if (ticket.customer) {
        y += 5; // Section break
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("DELIVERY INFO", 25, y);
        y += 10;
        doc.setFontSize(12);
        doc.setTextColor(...BRAND_COLOR);
        addLine("Customer Email", ticket.customer.email);
        addLine("Customer Phone", ticket.customer.phone);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for choosing ABC Cinema. Please present this QR at the entrance.", 105, 240, { align: "center" });
    doc.text("© 2026 ABC Cinema Entertainment Group. All Rights Reserved.", 105, 245, { align: "center" });

    // Save PDF
    const filename = isCancellation ? `Cancellation_${id}.pdf` : `Ticket_${id}.pdf`;
    doc.save(filename);
};
