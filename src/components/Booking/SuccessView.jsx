import * as React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { CheckCircle, Download, Share2, Calendar, MapPin, Sparkles, Mail, MessageSquare } from 'lucide-react';
import MagneticButton from '../MagneticButton';

const SuccessView = ({ onDownload, onSendEmail, onSendSMS }) => {
    const tickets = useStore((state) => state.tickets);
    const resetBooking = useStore((state) => state.resetBooking);
    const latestTicket = tickets[tickets.length - 1];

    React.useEffect(() => {
        if (latestTicket) {
            // 1. Auto Trigger PDF Download
            const autoDownload = setTimeout(() => {
                onDownload();
            }, 1000);

            // 2. Auto Trigger Notification Cycle (Simulated)
            const autoEmail = setTimeout(() => {
                onSendEmail();
            }, 2500);

            // 3. Auto Trigger SMS Mockup after Email is closed (or after a delay)
            // For simulation purposes, we'll just sequence them
            const autoSMS = setTimeout(() => {
                onSendSMS();
            }, 6000);

            return () => {
                clearTimeout(autoDownload);
                clearTimeout(autoEmail);
                clearTimeout(autoSMS);
            };
        }
    }, [latestTicket]);

    if (!latestTicket) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-obsidian text-white overflow-y-auto"
        >
            <div className="max-w-4xl w-full py-12">
                <div className="flex flex-col items-center mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
                    >
                        <CheckCircle size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center">
                        Welcome to the <span className="text-gold">Silver Screen</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.4em] mt-4 text-xs">Payment Verified • Seat Secured</p>
                </div>

                <div className="relative bg-white/5 border border-white/10 rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl">
                    {/* Left Side: Ticket Visual */}
                    <div className="w-full md:w-2/3 p-10 border-b md:border-b-0 md:border-r border-white/10">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-gold mb-2 block font-bold">Official Ticket</span>
                                <h2 className="text-4xl font-black uppercase leading-none">{latestTicket.movie.title}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Ticket ID</p>
                                <p className="font-mono text-xs font-bold text-white/60">{latestTicket.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-12">
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl h-fit">
                                    <Calendar className="text-gold" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Date</p>
                                    <p className="font-bold text-sm">{latestTicket.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl h-fit">
                                    <Sparkles className="text-gold" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Showtime</p>
                                    <p className="font-bold text-sm">{latestTicket.time}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl h-fit">
                                    <MapPin className="text-gold" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Location</p>
                                    <p className="font-bold text-sm">{latestTicket.hall}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl h-fit">
                                    <Share2 className="text-gold" size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Seats</p>
                                    <p className="font-bold text-sm">{latestTicket.seats.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-8">
                            <MagneticButton onClick={onDownload} className="w-full bg-white text-obsidian font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                                <Download size={18} /> Download PDF Receipt
                            </MagneticButton>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onSendEmail}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest"
                                >
                                    <Mail size={14} /> Send Email
                                </button>
                                <button
                                    onClick={onSendSMS}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest"
                                >
                                    <MessageSquare size={14} /> Send SMS
                                </button>
                            </div>

                            <button
                                onClick={resetBooking}
                                className="w-full bg-transparent hover:bg-white/5 text-white/40 hover:text-white font-bold py-3 rounded-xl transition-all uppercase text-[10px] tracking-widest mt-2"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>

                    {/* Right Side: QR Code Area */}
                    <div className="w-full md:w-1/3 bg-white/5 p-10 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Floating Sparkles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.2, 0.8, 0.2],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                    className="absolute text-gold/40"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                >
                                    <Sparkles size={12 + Math.random() * 8} />
                                </motion.div>
                            ))}
                        </div>
                        <div className="relative group">
                            {/* Simulated QR Code SVG */}
                            <svg width="180" height="180" viewBox="0 0 100 100" className="bg-white p-4 rounded-3xl">
                                <rect width="100" height="100" fill="white" />
                                <path d="M10,10 h20 v20 h-20 z M15,15 h10 v10 h-10 z" fill="black" />
                                <path d="M70,10 h20 v20 h-20 z M75,15 h10 v10 h-10 z" fill="black" />
                                <path d="M10,70 h20 v20 h-20 z M15,75 h10 v10 h-10 z" fill="black" />
                                <path d="M40,10 h10 L40,20 M60,10 h5 M10,40 h10 M30,40 h20 M60,40 h10 M90,40 h5" stroke="black" strokeWidth="2" />
                                <path d="M40,60 h20 v20 h-20 z" fill="gold" />
                                <path d="M40,40 h5 M60,60 h10 M80,80 h10" stroke="black" strokeWidth="2" />
                            </svg>
                            <div className="absolute inset-0 bg-gold/10 blur-2xl group-hover:bg-gold/20 transition-all pointer-events-none" />
                        </div>
                        <p className="mt-8 text-[10px] uppercase tracking-widest text-white/40 text-center leading-relaxed">
                            Scan this entry pass <br /> at the cinema gate
                        </p>
                    </div>

                    {/* Decorative Perforated Edge */}
                    <div className="absolute left-[66.6%] top-0 bottom-0 w-px bg-white/10 hidden md:block">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-obsidian rounded-full" style={{ top: `${i * 5}%` }} />
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex justify-center">
                    <MagneticButton
                        onClick={resetBooking}
                        className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold py-2 px-10 border border-white/10 rounded-full hover:bg-white/5 transition-all"
                    >
                        Back to Home
                    </MagneticButton>
                </div>
            </div>
        </motion.div>
    );
};

export default SuccessView;
