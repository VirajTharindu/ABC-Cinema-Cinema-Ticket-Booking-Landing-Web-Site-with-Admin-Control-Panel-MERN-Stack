import { create } from 'zustand';

export const useStore = create((set) => ({
    view: 'home', // 'home' | 'booking' | 'admin'
    selectedMovie: null,
    selectedSeats: [],
    bookingStatus: 'idle', // 'idle' | 'paying' | 'success' | 'failed'
    tickets: [],
    cancelledTickets: [],
    transactions: [],
    activeComm: null, // { type: 'sms' | 'email', data: any }
    contactEmail: '',
    contactPhone: '',
    testimonials: [
        {
            id: 1,
            name: "Alex River",
            role: "Cinephile",
            content: "The immersive 3D experience is like nothing I've seen before. Booking a ticket felt like part of the movie itself!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: 2,
            name: "Sarah Chen",
            role: "Tech Enthusiast",
            content: "Seamless transitions and a truly premium feel. The liquid distortion effects on the posters are mesmerizing.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
        },
        {
            id: 3,
            name: "Marcus Thorne",
            role: "Film Critic",
            content: "Finally, a cinema website that matches the magic of the silver screen. Bold, beautiful, and incredibly intuitive.",
            rating: 4,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop"
        }
    ],

    setView: (view) => set({ view }),
    setSelectedMovie: (movie) => set({ selectedMovie: movie, view: 'booking' }),
    closeBooking: () => set({ view: 'home', selectedMovie: null, selectedSeats: [] }),

    toggleSeat: (seatId) => set((state) => {
        const isSelected = state.selectedSeats.includes(seatId);
        if (isSelected) {
            return { selectedSeats: state.selectedSeats.filter(id => id !== seatId) };
        } else {
            return { selectedSeats: [...state.selectedSeats, seatId] };
        }
    }),

    startPayment: () => set({ bookingStatus: 'paying' }),
    cancelPayment: () => set({ bookingStatus: 'idle' }),
    completePayment: (contactData) => set((state) => {
        const newTicket = {
            id: `TCK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            movie: state.selectedMovie,
            seats: state.selectedSeats,
            date: new Date().toLocaleDateString(),
            time: "7:30 PM",
            hall: "Hall A • Premium Immersive",
            price: state.selectedMovie.price * state.selectedSeats.length,
            customer: contactData // { email, phone }
        };
        const newTransaction = {
            id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            ticketId: newTicket.id,
            type: 'booking',
            amount: newTicket.price,
            date: new Date().toLocaleString(),
            movieTitle: newTicket.movie.title
        };
        return {
            bookingStatus: 'success',
            tickets: [...state.tickets, newTicket],
            transactions: [newTransaction, ...state.transactions],
            selectedSeats: [],
            contactEmail: contactData.email,
            contactPhone: contactData.phone
        };
    }),
    cancelTicket: (ticketId) => set((state) => {
        const ticketToCancel = state.tickets.find(t => t.id === ticketId);
        if (!ticketToCancel) return state;

        const newTransaction = {
            id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            ticketId: ticketId,
            type: 'cancellation',
            amount: -ticketToCancel.price,
            date: new Date().toLocaleString(),
            movieTitle: ticketToCancel.movie.title
        };

        return {
            tickets: state.tickets.filter(t => t.id !== ticketId),
            cancelledTickets: [ticketToCancel, ...state.cancelledTickets],
            transactions: [newTransaction, ...state.transactions]
        };
    }),
    setComm: (comm) => set({ activeComm: comm }),
    resetBooking: () => set({ bookingStatus: 'idle', selectedMovie: null, selectedSeats: [] }),
    addFeedback: (feedback) => set((state) => ({
        testimonials: [
            {
                ...feedback,
                id: state.testimonials.length + 1,
                role: "Audience Member",
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.name)}&background=FFD700&color=050505`
            },
            ...state.testimonials
        ]
    })),
}));
