
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DigitalConstellation: React.FC = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 600;

    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

            vel[i * 3] = (Math.random() - 0.5) * 0.005;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
        }
        return [pos, vel];
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const posAttr = pointsRef.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            posAttr.array[i * 3] += velocities[i * 3];
            posAttr.array[i * 3 + 1] += velocities[i * 3 + 1];
            posAttr.array[i * 3 + 2] += velocities[i * 3 + 2];

            if (Math.abs(posAttr.array[i * 3]) > 10) velocities[i * 3] *= -1;
            if (Math.abs(posAttr.array[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
            if (Math.abs(posAttr.array[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#00d4ff"
                transparent
                opacity={0.1}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
};
