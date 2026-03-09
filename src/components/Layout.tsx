import * as React from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FilmReelLoader from './FilmReelLoader';
import { motion, AnimatePresence } from 'framer-motion';
import Cursor from './Cursor';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);

    // Integrated Lenis Hook Logic
    React.useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        } as any);

        lenis.on('scroll', ScrollTrigger.update);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
        };
    }, []);

    // Simulate initial load for cinematic effect
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-obsidian text-white overflow-hidden">
            <Cursor />
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                        className="fixed inset-0 z-50 bg-obsidian"
                    >
                        <FilmReelLoader />
                    </motion.div>
                ) : (
                    <motion.main
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {children}
                    </motion.main>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;
