import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const MagneticButton = ({ children, className = "", onClick }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.5, y: y * 0.5 }); // Magnetic strength
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const text = typeof children === 'string' ? children : '';

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative overflow-hidden group ${className}`} // Add class for styling
            onClick={onClick}
        >
            <span className="relative z-10 block px-6 py-3 font-bold uppercase tracking-wider text-obsidian bg-gold mix-blend-normal hover:bg-white transition-colors duration-300">
                {children}
            </span>
            {/* Glow effect or background */}
        </motion.button>
    );
};

export default MagneticButton;
