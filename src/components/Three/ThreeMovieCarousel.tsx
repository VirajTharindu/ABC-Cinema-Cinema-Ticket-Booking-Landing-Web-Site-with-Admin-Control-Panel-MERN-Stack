import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { movies } from '../../data/movieCatalog';
import ThreeMovieCard from './ThreeMovieCard';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

const Scene: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (!groupRef.current) return;

        const ctx = gsap.context(() => {
            // Sync GSAP scroll with Three.js group position
            const totalWidth = (movies.length + 1) * 5;

            // Check if trigger exists in DOM
            const trigger = document.getElementById("three-carousel-trigger");
            if (!trigger) return;

            gsap.to((groupRef.current as THREE.Group).position, {
                x: -totalWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: trigger,
                    start: "top top",
                    end: () => `+=${window.innerHeight * 3}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });
        });

        return () => {
            ctx.revert();
            // Force kill any remaining triggers for this ID
            ScrollTrigger.getAll().forEach(st => {
                const trigger = document.getElementById("three-carousel-trigger");
                if (st.trigger === trigger) st.kill();
            });
        };
    }, []);

    return (
        <group ref={groupRef}>
            {/* Title Section In 3D Space */}
            <group position={[-5, 0, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <planeGeometry args={[10, 5]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>
            </group>

            {movies.map((movie, index) => (
                <Suspense
                    key={movie.id}
                    fallback={
                        <mesh position={[index * 5 + 5, 0, 0]}>
                            <planeGeometry args={[3, 4.5]} />
                            <meshBasicMaterial color="#1a1a11" wireframe />
                        </mesh>
                    }
                >
                    <ThreeMovieCard
                        movie={movie}
                        position={[index * 5 + 5, 0, 0]}
                    />
                </Suspense>
            ))}
        </group>
    );
};

const ThreeMovieCarousel = () => {
    return (
        <section id="three-carousel-trigger" className="relative h-screen w-full bg-obsidian overflow-hidden">
            {/* Overlay Title (keep it HTML for better typography/blend modes) */}
            <div className="absolute inset-0 z-10 pointer-events-none flex items-center px-20">
                <div className="max-w-[50vw]">
                    <h2 className="text-8xl font-bold text-white uppercase leading-none mix-blend-difference">
                        Now <br /> <span className="text-transparent text-stroke-gold">Showing</span>
                    </h2>
                    <p className="mt-8 text-xl text-gray-400 max-w-md">
                        The boundary between digital and reality fades. Explore the immersive collection.
                    </p>
                </div>
            </div>

            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -5]} color="#FFD700" intensity={0.5} />

                    <Suspense fallback={null}>
                        <Scene />
                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
};

export default ThreeMovieCarousel;
