
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TECH_COLORS = {
    cyan: "#00f2ff",
    gold: "#ffcc00",
    white: "#ffffff",
    glow: "#00d4ff"
};

const getSphericalPos = (phi: number, theta: number, radius: number) => {
    return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
    );
};

export const TechGlobe: React.FC = () => {
    const groupRef = useRef<THREE.Group>(null);
    const radius = 2.8;

    // Generate high-quality circuits for the intro
    const circuits = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 40; i++) {
            const points = [];
            let phi = Math.random() * Math.PI;
            let theta = Math.random() * Math.PI * 2;
            const color = Math.random() > 0.9 ? TECH_COLORS.gold : TECH_COLORS.cyan;

            for (let j = 0; j < 8; j++) {
                points.push(getSphericalPos(phi, theta, radius));
                if (Math.random() > 0.5) phi += 0.2;
                else theta += 0.2;
            }
            temp.push({
                points: new THREE.CatmullRomCurve3(points).getPoints(20),
                color,
                endNode: points[points.length - 1]
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Slow majestic rotation for intro
        groupRef.current.rotation.y += 0.003;
        groupRef.current.rotation.z += 0.001;
    });

    return (
        <group ref={groupRef}>
            {circuits.map((c, i) => (
                <group key={i}>
                    <line>
                        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(c.points)} />
                        <lineBasicMaterial color={c.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                    </line>
                    <mesh position={c.endNode}>
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshBasicMaterial color={c.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                    </mesh>
                </group>
            ))}

            {/* Subtle glow core */}
            <mesh>
                <sphereGeometry args={[radius * 0.95, 32, 32]} />
                <meshBasicMaterial color={TECH_COLORS.cyan} wireframe transparent opacity={0.02} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};
