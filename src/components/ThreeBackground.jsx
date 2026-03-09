import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CinematicBackground = () => {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Subtle rotation based on mouse
            const x = (state.mouse.x * Math.PI) / 20;
            const y = (state.mouse.y * Math.PI) / 20;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sparkles
                    count={200}
                    scale={15}
                    size={2}
                    speed={0.2}
                    opacity={0.8}
                    color="#FFD700"
                />
            </Float>

            <mesh scale={50}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color="#050505"
                    side={THREE.BackSide}
                    roughness={0.5}
                />
            </mesh>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#DC143C" />
            <spotLight
                position={[0, 10, 10]}
                angle={0.4}
                penumbra={1}
                intensity={3}
                castShadow
            />
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <color attach="background" args={['#050505']} />
                <CinematicBackground />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;



