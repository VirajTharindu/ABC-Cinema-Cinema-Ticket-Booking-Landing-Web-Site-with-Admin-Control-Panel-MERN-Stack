import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import './LiquidDistortionMaterial'; // Import for side effects (R3F extend)
import MagneticButton from '../MagneticButton';
import { useStore } from '../../store/useStore';

import { Movie } from '../../domain/types';

interface ThreeMovieCardProps {
    movie: Movie;
    position: [number, number, number];
}

const ThreeMovieCard: React.FC<ThreeMovieCardProps> = ({ movie, position }) => {
    const meshRef = React.useRef<THREE.Mesh>(null);
    const materialRef = React.useRef<any>(null);
    const texture = useTexture(movie.image);
    const setSelectedMovie = useStore((state) => state.setSelectedMovie);

    const [hovered, setHovered] = React.useState(false);
    const [mousePos, setMousePos] = React.useState(new THREE.Vector2(0, 0));

    // Memoize target vectors for performance (avoiding GC in useFrame)
    const scaleTarget = React.useMemo(() => new THREE.Vector3(1.05, 1.05, 1.05), []);
    const scaleReset = React.useMemo(() => new THREE.Vector3(1, 1, 1), []);

    // Handle perspective tilt and shader uniforms
    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return;

        // Smooth hover transition for shader
        const targetHover = hovered ? 1 : 0;
        materialRef.current.uHover = THREE.MathUtils.lerp(materialRef.current.uHover, targetHover, delta * 5);
        materialRef.current.uTime = state.clock.getElapsedTime();

        // Perspective Tilt
        if (hovered) {
            const targetRotationX = -mousePos.y * 0.2;
            const targetRotationY = mousePos.x * 0.2;
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, Math.min(delta * 10, 1));
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, Math.min(delta * 10, 1));

            // Scale up slightly on hover
            meshRef.current.scale.lerp(scaleTarget, Math.min(delta * 10, 1));
        } else {
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, Math.min(delta * 5, 1));
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, Math.min(delta * 5, 1));
            meshRef.current.scale.lerp(scaleReset, Math.min(delta * 5, 1));
        }
    });

    const handlePointerMove = (e: any) => {
        // Normalize mouse position relative to the card (-0.5 to 0.5)
        if (!e.uv) return;
        const x = e.uv.x - 0.5;
        const y = e.uv.y - 0.5;
        setMousePos(new THREE.Vector2(x, y));
        if (materialRef.current) {
            materialRef.current.uMouse = new THREE.Vector2(e.uv.x, e.uv.y);
        }
    };

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onPointerMove={handlePointerMove}
                onClick={() => setSelectedMovie(movie)}
            >
                <planeGeometry args={[3, 4.5, 32, 32]} />
                <React.Suspense fallback={<meshBasicMaterial color="#111" />}>
                    <liquidDistortionMaterial
                        ref={materialRef}
                        uTexture={texture}
                        transparent
                    />
                </React.Suspense>

                {/* Morph Trigger - DOM element that Framer Motion can track for layoutId transitions */}
                <Html
                    transform
                    occlude
                    style={{
                        width: '300px',
                        height: '450px',
                        pointerEvents: 'none',
                    }}
                >
                    <motion.div
                        layoutId={`movie-card-${movie.id}`}
                        className="w-full h-full opacity-0"
                    />
                </Html>

                {/* Quick Book CTA - Using HTML for accessibility and ease of styling */}
                <Html
                    position={[0, -1.8, 0.1]}
                    center
                    distanceFactor={10}
                    style={{
                        pointerEvents: 'none',
                        opacity: hovered ? 1 : 0,
                        transform: `translateY(${hovered ? 0 : 20}px)`,
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                >
                    <div className="w-[200px] flex flex-col items-center pointer-events-auto">
                        <h3 className="text-xl font-bold text-white uppercase tracking-tighter mb-2 text-center drop-shadow-lg">
                            {movie.title}
                        </h3>
                        <MagneticButton
                            className="w-full text-xs py-1"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setSelectedMovie(movie);
                            }}
                        >
                            Quick Book
                        </MagneticButton>
                    </div>
                </Html>
            </mesh>
        </group>
    );
};

export default ThreeMovieCard;
