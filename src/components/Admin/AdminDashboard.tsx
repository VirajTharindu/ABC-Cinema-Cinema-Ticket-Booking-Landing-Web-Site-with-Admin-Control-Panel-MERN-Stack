import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import { Bell, Activity, Users, DollarSign, X } from 'lucide-react';
import MagneticButton from '../MagneticButton';
import { movies } from '../../data/movieCatalog';

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = "", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
        transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
        className={`bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group hover:border-gold/30 transition-colors duration-500 ${className}`}
    >
        {children}
    </motion.div>
);

const LiveChart: React.FC = () => {
    const [data, setData] = React.useState<number[]>(() => Array.from({ length: 20 }, () => Math.random() * 50 + 20));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setData(prev => [...prev.slice(1), Math.random() * 50 + 20]);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const path = useMemo(() => {
        const xScale = d3.scaleLinear().domain([0, 19]).range([0, 300]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([100, 0]);

        const lineGenerator = d3.line<number>()
            .x((_, i) => xScale(i))
            .y(d => yScale(d))
            .curve(d3.curveMonotoneX);

        return lineGenerator(data) || "";
    }, [data]);

    return (
        <div className="w-full h-32 flex items-center justify-center relative group">
            <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                {/* Background Shadow Path */}
                <motion.path
                    d={path}
                    fill="none"
                    stroke="rgba(255, 215, 0, 0.1)"
                    strokeWidth="4"
                    animate={{ d: path }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
                {/* Main Drawing Path */}
                <motion.path
                    d={path}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, d: path }}
                    transition={{
                        pathLength: { duration: 2, ease: "easeInOut" },
                        d: { duration: 1, ease: "easeInOut" }
                    }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path
                    d={`${path} L 300,100 L 0,100 Z`}
                    fill="url(#gradient)"
                    stroke="none"
                    animate={{ d: `${path} L 300,100 L 0,100 Z` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
};

const NotificationStream: React.FC = () => {
    const transactions = useStore((state) => state.transactions);

    // Mix actual transactions with a few system status items
    const allNotifications = React.useMemo(() => {
        const trxNotifs = transactions.map(t => ({
            id: t.id,
            text: `${t.type === 'booking' ? 'NEW BOOKING' : 'REFUNDED'}: ${t.movieTitle} (${t.id.slice(-4)})`,
            time: "Live"
        }));

        const systemNotifs = [
            { id: 'sys-1', text: "Server Load: 45% - Optimal", time: "2m ago" },
            { id: 'sys-2', text: "System Initialized", time: "5m ago" },
        ];

        return [...trxNotifs, ...systemNotifs].slice(0, 5);
    }, [transactions]);

    return (
        <div className="flex flex-col gap-3 mt-4">
            <AnimatePresence mode="popLayout">
                {allNotifications.map((n) => (
                    <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, x: 50 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            mass: 1
                        }}
                        className={`bg-white/5 border rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors ${n.text.includes('REFUNDED') ? 'border-crimson/20' : 'border-white/5'}`}
                    >
                        <div className="relative">
                            <div className={`w-3 h-3 rounded-full animate-ping absolute inset-0 ${n.text.includes('REFUNDED') ? 'bg-crimson' : 'bg-gold'}`} />
                            <div className={`w-3 h-3 rounded-full relative ${n.text.includes('REFUNDED') ? 'bg-crimson' : 'bg-gold'}`} />
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium tracking-tight leading-tight">{n.text}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{n.time}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const setView = useStore((state) => state.setView);
    const tickets = useStore((state) => state.tickets);
    const cancelledTickets = useStore((state) => state.cancelledTickets);
    const transactions = useStore((state) => state.transactions);
    const cancelTicket = useStore((state) => state.cancelTicket);

    const [activeTab, setActiveTab] = React.useState<'bookings' | 'movies'>('bookings');

    const liveRevenue = useMemo(() => {
        return transactions.reduce((acc, trx) => {
            return acc + trx.amount;
        }, 0);
    }, [transactions]);

    const activeBookingsCount = tickets.length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-obsidian/90 backdrop-blur-2xl p-8 overflow-y-auto"
        >
            <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Mission Control</h1>
                        <p className="text-gold uppercase tracking-widest text-sm">System: Online</p>
                    </div>
                    <MagneticButton onClick={() => setView('home')}>
                        <span className="flex items-center gap-2"><X size={16} /> Exit</span>
                    </MagneticButton>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-auto gap-6">
                    {/* Revenue - Large Card */}
                    <BentoCard className="md:col-span-2 md:row-span-2 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-full bg-gold/20 text-gold mb-4 w-fit"><DollarSign /></div>
                            <span className="text-green-400 text-sm font-bold flex items-center gap-1"><Activity size={12} /> Live Ledger</span>
                        </div>
                        <div>
                            <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-1">Live Revenue</h3>
                            <h2 className="text-5xl font-bold text-white mb-6">
                                ${liveRevenue.toLocaleString()}.00
                            </h2>
                            <LiveChart />
                        </div>
                    </BentoCard>

                    {/* Active Bookings */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.1}>
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 mb-4 w-fit"><Users /></div>
                        <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-1">Active Bookings</h3>
                        <h2 className="text-3xl font-bold text-white">{activeBookingsCount}</h2>
                    </BentoCard>

                    {/* System Status */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.3}>
                        <div className="p-3 rounded-full bg-green-500/20 text-green-400 mb-4 w-fit"><Activity /></div>
                        <h3 className="text-gray-400 uppercase text-xs tracking-widest mb-1">Server Health</h3>
                        <h2 className="text-3xl font-bold text-white">98.2%</h2>
                    </BentoCard>

                    {/* Notifications - Tall Card */}
                    <BentoCard className="md:col-span-1 md:row-span-3 overflow-hidden" delay={0.2}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-full bg-crimson/20 text-crimson"><Bell size={16} /></div>
                            <h3 className="text-white font-bold uppercase tracking-wider">Live Activity</h3>
                        </div>
                        <NotificationStream />
                    </BentoCard>

                    {/* Booking / Movie Management Table - Large Spanning Card */}
                    <BentoCard className="md:col-span-3 md:row-span-2 p-0" delay={0.4}>
                        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`text-sm font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'bookings' ? 'text-white border-gold' : 'text-white/40 border-transparent hover:text-white/70'}`}
                                >
                                    Booking Management
                                </button>
                                <button
                                    onClick={() => setActiveTab('movies')}
                                    className={`text-sm font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'movies' ? 'text-white border-gold' : 'text-white/40 border-transparent hover:text-white/70'}`}
                                >
                                    Movie Catalog
                                </button>
                            </div>
                            <span className="text-[10px] bg-gold/20 text-gold px-3 py-1 rounded-full uppercase font-bold tracking-tighter">Managerial Control Active</span>
                        </div>
                        <div className="overflow-x-auto">
                            {activeTab === 'bookings' ? (
                                <table className="w-full text-left">
                                    <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-4">ID</th>
                                            <th className="px-8 py-4">Customer</th>
                                            <th className="px-8 py-4">Movie</th>
                                            <th className="px-8 py-4">Amount</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {/* Active Tickets */}
                                        {tickets.map(ticket => (
                                            <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-4 font-mono text-xs text-white/60">{ticket.id.slice(-6)}</td>
                                                <td className="px-8 py-4">
                                                    <p className="text-white font-bold leading-none">{ticket.customer?.email || 'Guest User'}</p>
                                                    <p className="text-[10px] text-white/20 mt-1">{ticket.customer?.phone || '+94 00 000 0000'}</p>
                                                </td>
                                                <td className="px-8 py-4 text-white/80">{ticket.movie.title}</td>
                                                <td className="px-8 py-4 font-bold text-gold">${ticket.price.toFixed(2)}</td>
                                                <td className="px-8 py-4">
                                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-[9px] uppercase font-bold">Confirmed</span>
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button
                                                        onClick={() => cancelTicket(ticket.id)}
                                                        className="p-2 bg-crimson/10 text-crimson rounded-lg hover:bg-crimson hover:text-white transition-all group"
                                                    >
                                                        <span className="text-[10px] font-bold uppercase">Cancel Ticket</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Cancelled Tickets */}
                                        {cancelledTickets.map(ticket => (
                                            <tr key={ticket.id} className="border-b border-white/5 opacity-40 grayscale group hover:grayscale-0 hover:bg-white/5 transition-all">
                                                <td className="px-8 py-4 font-mono text-xs">{ticket.id.slice(-6)}</td>
                                                <td className="px-8 py-4">
                                                    <p className="font-bold leading-none">{ticket.customer?.email || 'Guest'}</p>
                                                </td>
                                                <td className="px-8 py-4">{ticket.movie.title}</td>
                                                <td className="px-8 py-4">${ticket.price.toFixed(2)}</td>
                                                <td className="px-8 py-4">
                                                    <span className="px-2 py-0.5 bg-white/10 text-white/40 rounded text-[9px] uppercase font-bold">Refunded</span>
                                                </td>
                                                <td className="px-8 py-4 text-right text-xs text-white/20 uppercase font-black">Archive</td>
                                            </tr>
                                        ))}
                                        {tickets.length === 0 && cancelledTickets.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase tracking-[0.3em] text-xs">No activity yet</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/5">
                                        <tr>
                                            <th className="px-8 py-4">Title</th>
                                            <th className="px-8 py-4">Genre</th>
                                            <th className="px-8 py-4">Duration</th>
                                            <th className="px-8 py-4">Base Price</th>
                                            <th className="px-8 py-4">Rating</th>
                                            <th className="px-8 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {movies.map(movie => (
                                            <tr key={movie.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-4 font-bold text-white flex items-center gap-3">
                                                    <img src={movie.image} alt={movie.title} className="w-8 h-10 object-cover rounded opacity-80" />
                                                    {movie.title}
                                                </td>
                                                <td className="px-8 py-4 text-white/60 text-xs">Sci-Fi / Action</td>
                                                <td className="px-8 py-4 text-white/60 text-xs text-mono">140m</td>
                                                <td className="px-8 py-4 font-bold text-white">${movie.price.toFixed(2)}</td>
                                                <td className="px-8 py-4 text-gold text-xs">★★★★☆</td>
                                                <td className="px-8 py-4 text-right">
                                                    <button className="p-2 border border-white/10 text-white/60 rounded-lg hover:bg-white hover:text-obsidian transition-all">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Edit Movie</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </BentoCard>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
