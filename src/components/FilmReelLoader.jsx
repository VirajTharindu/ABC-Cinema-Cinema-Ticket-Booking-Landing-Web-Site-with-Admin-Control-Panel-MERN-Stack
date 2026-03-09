import React from 'react';
import { motion } from 'framer-motion';

const FilmReelLoader = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-obsidian flex flex-col items-center justify-center p-8">
            <div className="relative w-32 h-32 mb-8">
                {/* Reel Circle */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-8 border-gold/20 rounded-full"
                >
                    {/* Spoke holes */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-4 h-4 bg-obsidian rounded-full border border-gold/30"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-2.5rem)`
                            }}
                        />
                    ))}
                    {/* Inner detail */}
                    <div className="absolute inset-4 border-2 border-gold/40 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-gold/60 rounded-full" />
                    </div>
                </motion.div>

                {/* Animated Film Strip */}
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 overflow-visible"
                    initial="hidden"
                    animate="visible"
                >
                    <motion.path
                        d="M 50,0 Q 80,40 50,80 T 50,160"
                        fill="none"
                        stroke="#FFD700"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: 1,
                            opacity: 1,
                            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                </motion.svg>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <h2 className="text-xl font-bold text-white uppercase tracking-[0.5em] mb-2">Setting the Stage</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Curating your experience...</p>
            </motion.div>
        </div>
    );
};

export default FilmReelLoader;
