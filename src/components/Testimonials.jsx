import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);


const StarRating = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={`${i < rating ? 'fill-gold text-gold' : 'text-gray-600'} transition-colors duration-300`}
                />
            ))}
        </div>
    );
};

const Testimonials = () => {
    const testimonials = useStore((state) => state.testimonials);
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardsRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-obsidian">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-crimson/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4"
                    >
                        Audience <span className="text-transparent text-stroke-gold">Voices</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-gray-400 text-lg tracking-widest uppercase"
                    >
                        What the world is saying about ABC Cinema
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 cursor-default"
                        >
                            <Quote className="absolute top-6 right-8 text-gold/20 group-hover:text-gold/40 transition-colors duration-500" size={40} />

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full border-2 border-gold/30 object-cover"
                                />
                                <div>
                                    <h4 className="text-white font-bold tracking-tight">{review.name}</h4>
                                    <p className="text-xs text-gold uppercase tracking-widest">{review.role}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6 italic">
                                "{review.content}"
                            </p>

                            <div className="pt-6 border-t border-white/5">
                                <StarRating rating={review.rating} />
                            </div>

                            {/* Highlight Border on Hover */}
                            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold/30 transition-colors duration-500 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
