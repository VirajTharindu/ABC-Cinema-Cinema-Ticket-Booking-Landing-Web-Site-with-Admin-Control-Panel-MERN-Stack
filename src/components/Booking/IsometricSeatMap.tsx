import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

interface SeatSVGProps {
    id: string;
    x: number;
    y: number;
    type: 'balcony' | 'standard';
    isSelected: boolean;
    onClick: () => void;
}

const SeatSVG: React.FC<SeatSVGProps> = ({ x, y, type, isSelected, onClick }) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleAction = (e: React.MouseEvent<SVGGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const rippleX = e.clientX - rect.left;
        const rippleY = e.clientY - rect.top;

        const newRipple: Ripple = { id: Date.now(), x: rippleX, y: rippleY };
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 1000);

        onClick();
    };

    return (
        <g
            transform={`translate(${x}, ${y})`}
            onClick={handleAction}
            className="cursor-pointer transition-all duration-300"
        >
            {/* Seat Base */}
            <motion.rect
                width="30"
                height="30"
                rx="6"
                fill={isSelected ? '#FFD700' : (type === 'balcony' ? 'rgba(220, 20, 60, 0.4)' : 'rgba(255, 255, 255, 0.1)')}
                stroke={isSelected ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth="1"
                whileHover={{ scale: 1.1, filter: 'brightness(1.5)' }}
                animate={{
                    scale: isSelected ? 1.05 : 1,
                    boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
                }}
            />

            {/* Ripple Effect */}
            <AnimatePresence>
                {ripples.map(ripple => (
                    <motion.circle
                        key={ripple.id}
                        cx={ripple.x}
                        cy={ripple.y}
                        initial={{ r: 0, opacity: 0.8 }}
                        animate={{ r: 40, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none fill-gold/40"
                    />
                ))}
            </AnimatePresence>
        </g>
    );
};

const IsometricSeatMap: React.FC = () => {
    const toggleSeat = useStore((state) => state.toggleSeat);
    const selectedSeats = useStore((state) => state.selectedSeats);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const rows = 6;
    const cols = 10;
    const spacing = 40;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            setTilt({ x: x * 15, y: y * -15 }); // Increased sensitivity slightly
        };

        const handleGyro = (e: DeviceOrientationEvent) => {
            if (!e.beta || !e.gamma) return;
            // Beta: front-to-back tilt (-180 to 180), Gamma: left-to-right tilt (-90 to 90)
            const x = (e.gamma / 45); // Roughly -1 to 1 range
            const y = ((e.beta - 45) / 45); // Center around a typical 45 degree holding angle
            setTilt({ x: x * 10, y: y * -10 });
        };

        window.addEventListener('mousemove', handleMouseMove);
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleGyro);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleGyro);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center perspective-1000"
        >
            <motion.div
                style={{
                    rotateX: 45 + tilt.y,
                    rotateZ: -45 + tilt.x,
                    transformStyle: 'preserve-3d'
                }}
                className="relative"
            >
                <svg width={cols * spacing} height={rows * spacing} viewBox={`0 0 ${cols * spacing} ${rows * spacing}`} className="overflow-visible">
                    {/* Screen Indicator */}
                    <rect
                        x="0"
                        y="-60"
                        width={cols * spacing}
                        height="10"
                        fill="rgba(255,255,255,0.1)"
                        className="animate-pulse"
                    />

                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        Array.from({ length: cols }).map((_, colIndex) => {
                            const id = `${rowIndex}-${colIndex}`;
                            return (
                                <SeatSVG
                                    key={id}
                                    id={id}
                                    x={colIndex * spacing}
                                    y={rowIndex * spacing}
                                    type={rowIndex < 2 ? 'balcony' : 'standard'}
                                    isSelected={selectedSeats.includes(id)}
                                    onClick={() => toggleSeat(id)}
                                />
                            );
                        })
                    ))}
                </svg>
            </motion.div>

            {/* Labeling */}
            <div className="absolute top-10 flex flex-col items-center">
                <div className="w-48 h-1 bg-white/20 rounded-full mb-2 blur-[1px]" />
                <span className="text-[10px] text-white/30 tracking-[0.5em] uppercase font-light">Screen This Way</span>
            </div>
        </div>
    );
};

export default IsometricSeatMap;
