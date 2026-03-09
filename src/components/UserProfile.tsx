import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { User, Ticket, History, DollarSign, X, Trash2, ShieldCheck, CreditCard, Download, Mail, Smartphone } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { generateTicketPDF } from '../services/PDFService';
import CommunicationOverlay from './CommunicationOverlay';

import { Ticket as TicketType } from '../domain/types';

const UserProfile: React.FC = () => {
    const setView = useStore((state) => state.setView);
    const tickets = useStore((state) => state.tickets);
    const cancelledTickets = useStore((state) => state.cancelledTickets);
    const transactions = useStore((state) => state.transactions);
    const cancelTicket = useStore((state) => state.cancelTicket);
    const setComm = useStore((state) => state.setComm);
    const activeComm = useStore((state) => state.activeComm);

    const handleCancelAction = (ticket: TicketType) => {
        // 1. Process Ledger/Store update
        cancelTicket(ticket.id);

        // 2. Auto Download Cancellation Receipt
        setTimeout(() => {
            generateTicketPDF(ticket, true);
        }, 1000);

        // 3. Auto Trigger Simulated Notifications
        setTimeout(() => {
            setComm({
                type: 'email',
                data: {
                    ...ticket,
                    movieTitle: ticket.movie.title,
                    amount: -ticket.price,
                    isCancellation: true,
                    customer: ticket.customer
                }
            });
        }, 2500);

        setTimeout(() => {
            setComm({
                type: 'sms',
                data: {
                    ...ticket,
                    movieTitle: ticket.movie.title,
                    amount: -ticket.price,
                    isCancellation: true,
                    customer: ticket.customer
                }
            });
        }, 6000);
    };

    const [activeTab, setActiveTab] = React.useState('active'); // 'active' | 'history' | 'payments'

    const containerVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 }
        },
        exit: { opacity: 0, x: 100 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-[70] w-full md:w-[500px] bg-obsidian/80 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col"
        >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                        <User size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Cinephile Profile</h2>
                        <p className="text-[10px] text-gold uppercase tracking-[0.3em]">Verified Member</p>
                    </div>
                </div>
                <button
                    onClick={() => setView('home')}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-4 gap-2">
                {[
                    { id: 'active', label: 'Active', icon: Ticket },
                    { id: 'history', label: 'History', icon: History },
                    { id: 'payments', label: 'Payments', icon: DollarSign }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border ${activeTab === tab.id
                            ? 'bg-gold/10 border-gold/30 text-gold font-bold'
                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence mode="wait">
                    {/* Active Bookings */}
                    {activeTab === 'active' && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {tickets.length === 0 ? (
                                <div className="py-20 text-center opacity-30">
                                    <Ticket size={48} className="mx-auto mb-4" />
                                    <p className="text-xs uppercase tracking-widest">No active bookings</p>
                                </div>
                            ) : (
                                tickets.map(ticket => (
                                    <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:bg-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-white font-bold">{ticket.movie.title}</h4>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                                    {ticket.date} • {ticket.time}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleCancelAction(ticket)}
                                                className="p-2 bg-crimson/10 text-crimson rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-crimson hover:text-white"
                                                title="Cancel Booking"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => generateTicketPDF(ticket)}
                                                className="p-1.5 text-white/20 hover:text-gold transition-colors"
                                                title="Download Receipt"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <span className="text-sm font-bold text-gold">${ticket.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* History / Cancelled */}
                    {activeTab === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {cancelledTickets.length === 0 ? (
                                <div className="py-20 text-center opacity-30">
                                    <History size={48} className="mx-auto mb-4" />
                                    <p className="text-xs uppercase tracking-widest">No history yet</p>
                                </div>
                            ) : (
                                cancelledTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 opacity-60 grayscale-[0.5]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-white font-bold">{ticket.movie.title}</h4>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                                                    {ticket.date} • {ticket.time}
                                                </p>
                                            </div>
                                            <span className="text-[9px] px-2 py-1 bg-crimson/20 text-crimson rounded uppercase font-bold">Cancelled</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => generateTicketPDF(ticket, true)}
                                                className="p-1.5 text-white/20 hover:text-gold transition-colors"
                                                title="Download Credit Note"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <span className="text-sm font-bold text-white/40">${ticket.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* Payments */}
                    {activeTab === 'payments' && (
                        <motion.div
                            key="payments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            {transactions.length === 0 ? (
                                <div className="py-20 text-center opacity-30">
                                    <DollarSign size={48} className="mx-auto mb-4" />
                                    <p className="text-xs uppercase tracking-widest">No transactions logs</p>
                                </div>
                            ) : (
                                transactions.map(trx => (
                                    <div key={trx.id} className="bg-black/20 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${trx.type === 'booking' ? 'bg-green-500/10 text-green-400' : 'bg-crimson/10 text-crimson'}`}>
                                                {trx.type === 'booking' ? <CreditCard size={16} /> : <Trash2 size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white leading-tight">{trx.movieTitle}</p>
                                                <p className="text-[9px] text-white/30 uppercase tracking-tighter mt-1">{trx.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setComm({ type: 'email', data: { id: trx.ticketId, movieTitle: trx.movieTitle, amount: trx.amount, isCancellation: trx.type === 'cancellation' } })}
                                                className="p-1.5 text-white/10 hover:text-white transition-colors"
                                            >
                                                <Mail size={12} />
                                            </button>
                                            <button
                                                onClick={() => setComm({ type: 'sms', data: { id: trx.ticketId, movieTitle: trx.movieTitle, amount: trx.amount, isCancellation: trx.type === 'cancellation', seats: 'A1, A2' } })}
                                                className="p-1.5 text-white/10 hover:text-white transition-colors"
                                            >
                                                <Smartphone size={12} />
                                            </button>
                                            <div className="text-right ml-2">
                                                <p className={`text-sm font-black ${trx.type === 'booking' ? 'text-white' : 'text-crimson'}`}>
                                                    {trx.type === 'booking' ? '-' : '+'}${Math.abs(trx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">Stripe Verified</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {activeComm && (
                    <CommunicationOverlay
                        type={activeComm.type}
                        data={activeComm.data}
                        onClose={() => setComm(null)}
                    />
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="p-8 border-t border-white/10 bg-black/40">
                <div className="flex items-center gap-3 text-white/40 mb-6">
                    <ShieldCheck size={16} className="text-gold" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">End-to-end encrypted session</span>
                </div>
                <MagneticButton className="w-full bg-white text-obsidian font-black uppercase tracking-widest py-4 text-xs">
                    Account Settings
                </MagneticButton>
            </div>
        </motion.div>
    );
};

export default UserProfile;
