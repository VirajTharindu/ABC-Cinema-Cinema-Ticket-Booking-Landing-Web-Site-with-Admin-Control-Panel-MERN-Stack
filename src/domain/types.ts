export interface Movie {
    id: number | string;
    title: string;
    image: string;
    genre: string;
    price: number;
    rating?: number;
    duration?: string;
}

export interface Ticket {
    id: string;
    movie: Movie;
    seats: string[];
    date: string;
    time: string;
    hall: string;
    price: number;
    customer?: {
        email: string;
        phone: string;
    };
}

export interface Transaction {
    id: string;
    ticketId: string;
    type: 'booking' | 'cancellation';
    amount: number;
    date: string;
    movieTitle: string;
}

export interface CustomTestimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar: string;
}

export type BookingStatus = 'idle' | 'paying' | 'success' | 'failed';

export interface StoreState {
    view: 'home' | 'booking' | 'admin' | 'profile';
    selectedMovie: Movie | null;
    selectedSeats: string[];
    bookingStatus: BookingStatus;
    tickets: Ticket[];
    cancelledTickets: Ticket[];
    transactions: Transaction[];
    activeComm: { type: 'sms' | 'email'; data: any } | null;
    contactEmail: string;
    contactPhone: string;
    testimonials: CustomTestimonial[];

    setView: (view: StoreState['view']) => void;
    setSelectedMovie: (movie: Movie) => void;
    closeBooking: () => void;
    toggleSeat: (seatId: string) => void;
    startPayment: () => void;
    cancelPayment: () => void;
    completePayment: (contactData: { email: string; phone: string }) => void;
    cancelTicket: (ticketId: string) => void;
    setComm: (comm: StoreState['activeComm']) => void;
    resetBooking: () => void;
    addFeedback: (feedback: Omit<CustomTestimonial, 'id' | 'role' | 'avatar'>) => void;
}
