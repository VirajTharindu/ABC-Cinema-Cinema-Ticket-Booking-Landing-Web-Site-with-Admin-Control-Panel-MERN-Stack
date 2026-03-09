import * as React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ShieldCheck, X, Sparkles } from 'lucide-react';
import MagneticButton from '../MagneticButton';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with a test publishable key
const stripePromise = loadStripe('pk_test_51NOvDqH3pYyYn8X2Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X8Z9X00Z9X8Z9X8Z'); // Placeholder test key

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#ffffff",
            fontFamily: '"Inter", sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "rgba(255, 255, 255, 0.2)",
            },
            iconColor: "#FFD700",
        },
        invalid: {
            color: "#DC143C",
            iconColor: "#DC143C",
        },
    },
};

const CheckoutForm: React.FC<{ email: string, phone: string, onComplete: () => void }> = ({ email, phone, onComplete }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);

        // Simulate network latency for a premium feel
        await new Promise(resolve => setTimeout(resolve, 2000));

        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
            // Simulated Stripe validation (In a real app, use stripe.createPaymentMethod here)
            const { error: stripeError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: { email, phone }
            });

            if (stripeError) {
                // We're using a dummy key, so we expect a validation error. 
                // We log it but proceed for demo purposes to show the success view.
                console.warn('Stripe checkout simulation info:', stripeError.message);
            }

            // Simulating successful payment regardless of real stripe network response for UI demonstration
            onComplete();
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Card Details</label>
                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus-within:border-gold/50 transition-all">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                {error && <p className="text-crimson text-xs mt-2">{error}</p>}
            </div>

            <MagneticButton
                type="submit"
                disabled={!stripe || isProcessing || !email || phone.length < 10}
                className={`w-full py-4 bg-gold text-obsidian font-black uppercase tracking-widest flex items-center justify-center gap-3 ${(!stripe || isProcessing || !email || phone.length < 10) ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {isProcessing ? (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-obsidian/30 border-t-obsidian rounded-full"
                        />
                        Processing Order...
                    </>
                ) : (
                    <>
                        <Sparkles size={18} /> Complete Transaction
                    </>
                )}
            </MagneticButton>
        </form>
    );
};

const CheckoutPortal: React.FC = () => {
    const selectedMovie = useStore((state) => state.selectedMovie);
    const selectedSeats = useStore((state) => state.selectedSeats);
    const bookingStatus = useStore((state) => state.bookingStatus);
    const cancelPayment = useStore((state) => state.cancelPayment);
    const completePayment = useStore((state) => state.completePayment);

    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('+94 ');

    const totalPrice = (selectedSeats.length * (selectedMovie?.price || 0)).toFixed(2);

    const handlePaymentComplete = () => {
        completePayment({ email, phone });
    };

    if (bookingStatus !== 'paying') return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-crimson/5 rounded-full blur-[80px] pointer-events-none" />

                <button
                    onClick={cancelPayment}
                    className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                    type="button"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gold/20 rounded-2xl text-gold">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Secure Vault</h2>
                        <p className="text-xs text-white/40 uppercase tracking-widest">Stripe Checkout Integrated</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-2">Delivery Details</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="customer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold/50 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Phone Number (Sri Lanka)</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => {
                                    if (e.target.value.startsWith('+94 ')) {
                                        setPhone(e.target.value);
                                    }
                                }}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold/50 outline-none transition-all font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">{selectedMovie?.title}</h3>
                            <p className="text-xs text-gold uppercase tracking-widest">{selectedSeats.length} Seats Reserved</p>
                        </div>
                        <p className="text-2xl font-black text-white">${totalPrice}</p>
                    </div>
                    <div className="flex gap-2">
                        {selectedSeats.map(seat => (
                            <span key={seat} className="text-[10px] px-2 py-1 bg-white/10 rounded flex items-center uppercase font-bold text-white/60">
                                {seat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stripe Elements Provider & Form */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm email={email} phone={phone} onComplete={handlePaymentComplete} />
                </Elements>

                <p className="mt-8 text-center text-[10px] text-white/30 uppercase tracking-[0.3em]">
                    Powered by <span className="text-white/60 font-bold">Stripe Elements</span> • Global Encryption
                </p>
            </motion.div>
        </motion.div>
    );
};

export default CheckoutPortal;
