import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeBackground from './ThreeBackground';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef<HTMLElement>(null);
    const videoTextRef = useRef<HTMLDivElement>(null);
    const textRevealRef = useRef<HTMLDivElement>(null);
    const cinematicVideoRef = useRef<HTMLVideoElement>(null);

    // Cinematic Video Source (High-quality abstract/theatrical)
    const videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-theatre-curtain-opening-42403-large.mp4";

    useEffect(() => {
        if (!heroRef.current || !videoTextRef.current || !textRevealRef.current) return;

        const ctx = gsap.context(() => {
            // Scroll Reveal: Expand the video-masked text
            gsap.timeline({
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    pin: true,
                    invalidateOnRefresh: true,
                }
            })
                .to(videoTextRef.current, {
                    scale: 5,
                    opacity: 0,
                    duration: 2,
                    ease: "power2.inOut"
                })
                .to(textRevealRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, "-=1.5");
        }, heroRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === heroRef.current) st.kill();
            });
        };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    };

    const letterVariants = {
        hidden: { y: 200, opacity: 0, rotateX: 90 },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }
        }
    };

    return (
        <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-obsidian">
            {/* Background 3D Scene */}
            <ThreeBackground />

            {/* Cinematic Video Background (Visible on reveal) */}
            <video
                ref={cinematicVideoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Main Cinematic Title with Video Masking */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center">
                <div ref={videoTextRef} className="perspective-2000">
                    <motion.h1
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-[10vw] md:text-[15vw] font-black tracking-tighter leading-none select-none uppercase"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')`, // Stable gold/obsidian texture
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
                        }}
                    >
                        {"ABC CINEMA".split("").map((char, i) => (
                            <motion.span key={i} variants={letterVariants} className="inline-block">
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </motion.h1>
                </div>

                <motion.div
                    ref={textRevealRef}
                    initial={{ opacity: 0, y: 50 }}
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                    <p className="text-2xl md:text-4xl text-white font-light tracking-[1em] uppercase mix-blend-difference">
                        Experience <span className="text-gold font-bold">Immersion</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                >
                    <span className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-4">Discover More</span>
                    <div className="w-[1px] h-20 bg-gradient-to-b from-gold to-transparent" />
                </motion.div>
            </div>

            {/* Overlay Gradient for cinematic depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian pointer-events-none z-10" />
        </section>
    );
};

export default Hero;

