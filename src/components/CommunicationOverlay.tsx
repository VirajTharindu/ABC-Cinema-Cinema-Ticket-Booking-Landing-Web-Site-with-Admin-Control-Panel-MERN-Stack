import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Smartphone, X, CheckCircle, Download, Send } from 'lucide-react';

interface CommunicationOverlayProps {
    type: 'email' | 'sms' | null;
    data: any; // Context-dependent data, can be refined later if needed
    onClose: () => void;
}

const CommunicationOverlay: React.FC<CommunicationOverlayProps> = ({ type, data, onClose }) => {
    if (!type) return null;

    const isEmail = type === 'email';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-obsidian/90 backdrop-blur-2xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 50, rotateX: 20 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                className="relative w-full max-w-lg bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
                {/* Header/Status Bar Mockup */}
                <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                    </div>
                    <span className="text-[10px] text-white/40 font-bold tracking-widest uppercase">
                        {isEmail ? 'Inbox • 1 New Message' : 'Messages • Just Now'}
                    </span>
                    <button onClick={onClose} className="p-1 text-white/20 hover:text-white transition-colors">
                        <X size={14} />
                    </button>
                </div>

                <div className="p-8">
                    {isEmail ? (
                        /* Email Mockup */
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">ABC Cinema Concierge</h3>
                                    <p className="text-xs text-white/40">to: {data.customer?.email || 'cinephile@universe.com'}</p>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                                <h4 className="text-gold font-black uppercase tracking-tighter text-xl">
                                    {data.isCancellation ? 'Your Refund is Ready' : 'Your Digital Ticket'}
                                </h4>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Hello! {data.isCancellation
                                        ? `Your booking for "${data.movieTitle}" has been cancelled. Your refund of $${Math.abs(data.amount).toFixed(2)} is being processed.`
                                        : `Get ready for the show! Your tickets for "${data.movieTitle}" are attached below.`}
                                </p>

                                {!data.isCancellation && (
                                    <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-white/10">
                                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gold">
                                            <Download size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white font-bold">Ticket_{data.id}.pdf</p>
                                            <p className="text-[8px] text-white/40 uppercase tracking-widest">2.4 MB • Branded Bill</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* SMS Mockup */
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-3xl bg-gold/20 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                                <Smartphone size={32} />
                            </div>

                            <div className="bg-gold/10 border border-gold/20 rounded-2xl p-5 w-full relative">
                                <div className="absolute -left-2 top-4 w-4 h-4 bg-gold/10 border-l border-b border-gold/20 rotate-45" />
                                <p className="text-sm text-white leading-relaxed">
                                    <span className="font-bold text-gold">ABC CINEMA (to {data.customer?.phone || 'Guest'}):</span> {data.isCancellation
                                        ? `Refund Confirmed! $${Math.abs(data.amount).toFixed(2)} credited for ${data.movieTitle}. TransID: ${data.id}`
                                        : `Booking Confirmed! ${data.movieTitle}. Seats: ${data.seats}. ID: ${data.id}. Link to QR: abc.show/${data.id}`}
                                </p>
                            </div>

                            <div className="flex gap-2 w-full pt-4">
                                <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-[10px] text-white/20 border border-white/5">
                                    Reply to message...
                                </div>
                                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-obsidian">
                                    <Send size={16} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-2 text-gold mb-4">
                            <CheckCircle size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Transmission Successful</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white text-obsidian font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-full hover:scale-105 transition-transform"
                        >
                            Back to Portal
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CommunicationOverlay;
