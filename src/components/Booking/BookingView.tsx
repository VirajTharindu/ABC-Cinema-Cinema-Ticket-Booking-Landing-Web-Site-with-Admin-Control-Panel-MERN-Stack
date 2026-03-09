import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import ThreeSeatMap from './ThreeSeatMap';
import MagneticButton from '../MagneticButton';
import { X, Calendar, MapPin, Sparkles } from 'lucide-react';
import CheckoutPortal from './CheckoutPortal';
import SuccessView from './SuccessView';
import { generateTicketPDF } from '../../services/PDFService';

const BookingView: React.FC = () => {
    const selectedMovie = useStore((state) => state.selectedMovie);
    const closeBooking = useStore((state) => state.closeBooking);
    const selectedSeats = useStore((state) => state.selectedSeats);
    const startPayment = useStore((state) => state.startPayment);
    const bookingStatus = useStore((state) => state.bookingStatus);
    const setComm = useStore((state) => state.setComm);
    const tickets = useStore((state) => state.tickets);

    if (!selectedMovie) return null;

    const totalPrice = (selectedSeats.length * selectedMovie.price).toFixed(2);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col md:flex-row bg-obsidian overflow-hidden"
        >
            {/* Morphing Background Poster */}
            <motion.div
                layoutId={`movie-card-${selectedMovie.id}`}
                className="absolute inset-0 z-0 bg-cover bg-center grayscale-[0.5] contrast-[1.2] opacity-40 brightness-50 blur-[2px]"
                style={{ backgroundImage: `url(${selectedMovie.image})` }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
                {/* Left: Movie Info */}
                <div className="w-full md:w-1/3 p-12 flex flex-col justify-between h-1/2 md:h-full">
                    <div>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        >
                            <span className="px-3 py-1 bg-gold/20 text-gold text-[10px] uppercase tracking-widest rounded-full mb-6 inline-block">
                                Now Booking
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                {selectedMovie.title}
                            </h2>
                            <p className="text-gray-400 text-lg uppercase tracking-widest">{selectedMovie.genre}</p>
                        </motion.div>

                        <div className="mt-12 space-y-4">
                            <div className="flex items-center gap-3 text-white/60">
                                <Calendar size={18} className="text-gold" />
                                <span className="text-sm uppercase tracking-widest">February 24, 2026</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                                <MapPin size={18} className="text-gold" />
                                <span className="text-sm uppercase tracking-widest">Hall A • Premium Immersive</span>
                            </div>
                        </div>
                    </div>

                    <MagneticButton onClick={closeBooking} className="w-fit bg-white/5 border border-white/10 text-white hover:bg-white/10 group">
                        <span className="flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest text-xs">
                            <X size={14} /> Close Portal
                        </span>
                    </MagneticButton>
                </div>

                {/* Right: Isometric Seat Map */}
                <div className="flex-1 relative flex flex-col items-center justify-center h-1/2 md:h-full bg-black/20 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        transition={{
                            delay: 0.5,
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                        }}
                        className="w-full h-full"
                    >
                        <ThreeSeatMap />
                    </motion.div>
                    <div className="absolute top-4 left-4 md:left-auto md:right-4 flex gap-4 text-xs font-bold uppercase tracking-widest text-white/50">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white rounded-sm"></div> Standard</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-crimson rounded-sm"></div> Balcony</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gold rounded-sm"></div> Selected</div>
                    </div>
                </div>

                {/* Checkout Bar */}
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="h-24 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-8"
                >
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Total</p>
                        <motion.p
                            key={totalPrice}
                            initial={{ scale: 1.2, color: '#FFD700' }}
                            animate={{ scale: 1, color: '#FFFFFF' }}
                            className="text-3xl font-bold"
                        >
                            ${totalPrice}
                        </motion.p>
                    </div>

                    <MagneticButton
                        onClick={startPayment}
                        className={selectedSeats.length === 0 ? 'opacity-50 pointer-events-none' : ''}
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles size={16} /> Confirm Booking
                        </span>
                    </MagneticButton>
                </motion.div>
            </div>

            {/* Payment & Success Overlays */}
            <AnimatePresence>
                {bookingStatus === 'paying' && <CheckoutPortal key="checkout" />}
                {bookingStatus === 'success' && (
                    <SuccessView
                        key="success"
                        onDownload={() => generateTicketPDF(tickets[tickets.length - 1])}
                        onSendEmail={() => setComm({ type: 'email', data: { ...tickets[tickets.length - 1], movieTitle: tickets[tickets.length - 1].movie.title } })}
                        onSendSMS={() => setComm({ type: 'sms', data: { ...tickets[tickets.length - 1], movieTitle: tickets[tickets.length - 1].movie.title, amount: tickets[tickets.length - 1].price } })}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default BookingView;
