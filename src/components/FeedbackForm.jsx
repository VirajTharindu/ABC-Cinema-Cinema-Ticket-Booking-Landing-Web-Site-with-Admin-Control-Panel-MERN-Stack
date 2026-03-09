import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import MagneticButton from './MagneticButton';

const FeedbackForm = () => {
    const addFeedback = useStore((state) => state.addFeedback);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !content || rating === 0) return;

        addFeedback({ name, content, rating });
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setName('');
            setContent('');
            setRating(0);
        }, 3000);
    };

    return (
        <section className="py-32 px-6 bg-obsidian relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Share Your <span className="text-gold">Experience</span>
                    </h2>
                    <p className="text-gray-400 uppercase tracking-widest text-xs">Join the conversation and help us grow</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[40px] backdrop-blur-3xl relative"
                >
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold/50 outline-none transition-all placeholder:text-white/20"
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold ml-1">Experience Rating</label>
                                    <div className="flex gap-4 items-center bg-black/20 w-fit p-4 rounded-2xl border border-white/5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                className="transition-transform active:scale-90"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`${(hover || rating) >= star ? 'fill-gold text-gold' : 'text-white/10'
                                                        } transition-colors duration-200`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                                            {rating ? `${rating} / 5` : 'Rate us'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold ml-1">Your Review</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Tell us about your cinematic journey..."
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-gold/50 outline-none transition-all placeholder:text-white/20 resize-none"
                                        required
                                    />
                                </div>

                                <div className="pt-4">
                                    <MagneticButton
                                        type="submit"
                                        disabled={!name || !content || rating === 0}
                                        className={`w-full py-5 bg-gold text-obsidian font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-opacity ${(!name || !content || rating === 0) ? 'opacity-30 pointer-events-none' : ''}`}
                                    >
                                        <Send size={18} /> Submit Review
                                    </MagneticButton>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-20 text-center flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold mb-6">
                                    <Sparkles size={40} />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Thank You!</h3>
                                <p className="text-gray-400 uppercase tracking-widest text-xs">Your voice has been added to our hall of fame.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-crimson/5 rounded-full blur-[100px] pointer-events-none" />
        </section>
    );
};

export default FeedbackForm;
