import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    Text,
    Float,
    MeshDistortMaterial,
    ContactShadows,
    PerspectiveCamera,
    Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const INTER_FONT_URL = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf";

const SeatMesh = ({ position, id, type, isSelected }) => {
    const toggleSeat = useStore((state) => state.toggleSeat);
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();

    // Cinematic color palette
    const baseColor = type === 'balcony' ? '#DC143C' : '#333333';
    const activeColor = '#FFD700';

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle pulse if selected
            if (isSelected) {
                const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
                meshRef.current.scale.set(s, s, s);
            }
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSeat(id);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshStandardMaterial
                    color={isSelected ? activeColor : (hovered ? '#444444' : baseColor)}
                    emissive={isSelected ? activeColor : (hovered ? 'gold' : '#000000')}
                    emissiveIntensity={isSelected ? 1.5 : (hovered ? 0.5 : 0)}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
            {/* Seat Backrest */}
            <mesh position={[0, 0.5, -0.3]}>
                <boxGeometry args={[0.8, 1, 0.2]} />
                <meshStandardMaterial
                    color={isSelected ? activeColor : (hovered ? '#444444' : baseColor)}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </group>
    );
};

const CinemaHall = () => {
    const selectedSeats = useStore((state) => state.selectedSeats);

    const rows = 6;
    const cols = 10;
    const spacing = 1.5;

    const seats = useMemo(() => {
        const items = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const id = `${r}-${c}`;
                items.push({
                    id,
                    position: [
                        (c - cols / 2) * spacing + spacing / 2,
                        0.4,
                        (r - rows / 2) * spacing + spacing / 2
                    ],
                    type: r < 2 ? 'balcony' : 'standard',
                    isSelected: selectedSeats.includes(id)
                });
            }
        }
        return items;
    }, [selectedSeats]);

    return (
        <group>
            {/* The Cinematic Screen */}
            <group position={[0, 4, -8]}>
                <mesh>
                    <planeGeometry args={[16, 9]} />
                    <meshStandardMaterial
                        emissive="#FFD700"
                        emissiveIntensity={2}
                        color="#FFD700"
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <Text
                    position={[0, 0, 0.1]}
                    fontSize={1}
                    color="#050505"
                    font={INTER_FONT_URL}
                    anchorX="center"
                    anchorY="middle"
                >
                    ABC CINEMA
                </Text>
                {/* Screen Glow */}
                <rectAreaLight
                    width={16}
                    height={9}
                    intensity={5}
                    color="#FFD700"
                    position={[0, 0, 1]}
                    rotation={[0, Math.PI, 0]}
                />
            </group>

            {/* Hall Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[30, 30]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.5} />
            </mesh>

            {/* Seats Grid */}
            {seats.map((seat) => (
                <SeatMesh key={seat.id} {...seat} />
            ))}

            <ContactShadows
                position={[0, 0, 0]}
                opacity={0.4}
                scale={20}
                blur={2}
                far={4.5}
            />
        </group>
    );
};

const ThreeSeatMap = () => {
    return (
        <div className="w-full h-full relative group cursor-move">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 10, 15]} fov={50} />
                <OrbitControls
                    enablePan={false}
                    minDistance={10}
                    maxDistance={25}
                    maxPolarAngle={Math.PI / 2.1}
                    makeDefault
                />

                <color attach="background" args={['#050505']} />

                {/* Lighting Environment */}
                <ambientLight intensity={0.2} />
                <spotLight
                    position={[10, 15, 10]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                />
                <pointLight position={[-10, 5, -5]} intensity={0.5} color="#DC143C" />

                <CinemaHall />

                <Environment preset="night" />
            </Canvas>

            {/* Instruction Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-light bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                    Drag to Orbit • Scroll to Zoom
                </p>
            </div>
        </div>
    );
};

export default ThreeSeatMap;
