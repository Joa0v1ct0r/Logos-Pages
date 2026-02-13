
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text, Float } from '@react-three/drei';

const TECH_COLORS = {
    cyan: "#00f2ff",
    gold: "#ffcc00",
    white: "#ffffff",
    bg: "#000a1a",
    glow: "#00d4ff"
};

const getSphericalPos = (phi: number, theta: number, radius: number) => {
    return new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
    );
};

// 1. CIRCUIT NETWORK with smooth linear expansion
const CircuitNetwork = ({ radius, progress }: { radius: number, progress: any }) => {
    const linesCount = 70;
    const meshRef = useRef<THREE.Group>(null);

    const lines = useMemo(() => {
        const temp = [];
        for (let i = 0; i < linesCount; i++) {
            const points = [];
            let phi = Math.random() * Math.PI;
            let theta = Math.random() * Math.PI * 2;
            const color = Math.random() > 0.85 ? TECH_COLORS.gold : TECH_COLORS.cyan;

            for (let j = 0; j < 10; j++) {
                points.push(getSphericalPos(phi, theta, radius));
                if (Math.random() > 0.5) phi += 0.15;
                else theta += 0.15;
            }

            temp.push({
                points: new THREE.CatmullRomCurve3(points).getPoints(30),
                color,
                endNode: points[points.length - 1]
            });
        }
        return temp;
    }, [radius]);

    useFrame(() => {
        if (!meshRef.current) return;
        const p = progress.get();
        // Start smaller (0.5) and expand calmly
        const scale = 0.5 + (p * 60);
        meshRef.current.scale.setScalar(scale);
        meshRef.current.position.z = p * 20;
        // Fade out slightly towards the very end
        meshRef.current.visible = p < 0.98;
    });

    return (
        <group ref={meshRef}>
            {lines.map((line, i) => (
                <group key={i}>
                    <line>
                        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints(line.points)} />
                        <lineBasicMaterial color={line.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                    </line>
                    <mesh position={line.endNode}>
                        <sphereGeometry args={[0.035, 8, 8]} />
                        <meshBasicMaterial color={line.color} transparent opacity={0.7} blending={THREE.AdditiveBlending} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// 2. HERO ELEMENTS
const HeroElements = ({ radius, progress }: { radius: number, progress: any }) => {
    const groupRef = useRef<THREE.Group>(null);

    const elements = useMemo(() => [
        { type: '</>', phi: Math.PI / 1.8, theta: 0.2, color: TECH_COLORS.cyan, size: 0.4 },
        { type: '➤', phi: Math.PI / 2.2, theta: -0.5, color: TECH_COLORS.cyan, size: 0.5, rotation: [0, 0, -Math.PI / 4] }
    ], []);

    useFrame(() => {
        if (!groupRef.current) return;
        const p = progress.get();
        // Echo the smaller start
        const scale = 0.5 + (p * 70);
        groupRef.current.scale.setScalar(scale);
        groupRef.current.position.z = p * 25;
    });

    return (
        <group ref={groupRef}>
            {elements.map((el, i) => {
                const pos = getSphericalPos(el.phi, el.theta, radius * 1.02);
                const rotBase = new THREE.Euler().setFromQuaternion(
                    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize())
                );
                return (
                    <group key={i} position={pos} rotation={rotBase}>
                        <Text
                            fontSize={el.size}
                            color={el.color}
                            rotation={el.rotation as any || [0, 0, 0]}
                            material-transparent
                            material-opacity={0.8}
                            material-blending={THREE.AdditiveBlending}
                        >
                            {el.type}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
};

const AsteroidField = () => {
    const count = 30; // More streaks for better effect
    const meshRef = useRef<THREE.Group>(null);

    // Create stable random data
    const asteroids = useMemo(() => Array.from({ length: count }).map(() => ({
        pos: new THREE.Vector3(
            (Math.random() - 0.5) * 150, // Wider X spread
            (Math.random() - 0.5) * 100, // Wider Y spread
            -30 - Math.random() * 50     // Strictly BEHIND globe (Z: -30 to -80)
        ),
        speed: 0.15 + Math.random() * 0.4,
        length: 5 + Math.random() * 15,    // Longer streaks
        width: 0.04 + Math.random() * 0.04,// Much thinner
        opacity: 0.1 + Math.random() * 0.3 // Variable faintness
    })), []);

    useFrame(() => {
        if (!meshRef.current) return;
        meshRef.current.children.forEach((child, i) => {
            const data = asteroids[i];
            child.position.x -= data.speed;

            // Loop asteriods seamlessly
            if (child.position.x < -100) {
                child.position.x = 100;
                child.position.y = (Math.random() - 0.5) * 100;
            }
        });
    });

    return (
        <group ref={meshRef}>
            {asteroids.map((data, i) => (
                <mesh key={i} position={data.pos}>
                    <planeGeometry args={[data.length, data.width]} />
                    <meshBasicMaterial
                        color={TECH_COLORS.cyan}
                        transparent
                        opacity={data.opacity}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            ))}
        </group>
    );
};

const CoreExplosion = ({ progress }: { progress: any }) => {
    const meshRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.PointsMaterial>(null);
    const count = 300;

    const data = useMemo(() => {
        const p = new Float32Array(count * 3);
        const c = new Float32Array(count * 3);
        const color1 = new THREE.Color(TECH_COLORS.gold);
        const color2 = new THREE.Color(TECH_COLORS.glow);

        for (let i = 0; i < count; i++) {
            const r = Math.random();
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);

            const mixed = color1.clone().lerp(color2, Math.random());
            c[i * 3] = mixed.r;
            c[i * 3 + 1] = mixed.g;
            c[i * 3 + 2] = mixed.b;
        }
        return { p, c };
    }, []);

    useFrame(() => {
        if (!meshRef.current || !materialRef.current) return;
        const p = progress.get();

        // 0. Initial State: Invisible
        if (p < 0.05) {
            materialRef.current.opacity = 0;
            return;
        }

        // 1. Explosion/Expansion logic
        // Start expansion slightly later (p - 0.05)
        const adjustedP = Math.max(0, p - 0.05);
        const scale = 0.5 + (adjustedP * 8);
        meshRef.current.scale.setScalar(scale);

        // 2. Opacity Curve: Burst IN then Fade OUT
        // 0.05 to 0.2: Fade In (0 -> 1)
        // 0.2 to 1.0: Fade Out (1 -> 0)
        let opacity = 0;
        if (p < 0.2) {
            opacity = THREE.MathUtils.mapLinear(p, 0.05, 0.2, 0, 1);
        } else {
            opacity = THREE.MathUtils.mapLinear(p, 0.2, 0.9, 1, 0);
        }

        materialRef.current.opacity = Math.max(0, opacity);

        meshRef.current.rotation.y -= 0.005;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={data.p} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={count} array={data.c} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.08}
                vertexColors
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    );
};

const BackgroundStars = ({ progress }: { progress: any }) => {
    const count = 4000; // Denser field
    const meshRef = useRef<THREE.Points>(null);
    const targetRotation = useRef({ x: 0, y: 0 });
    const currentRotation = useRef({ x: 0, y: 0 });

    const pos = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 40 + Math.random() * 30; // Wider spread
            const phi = Math.acos((Math.random() * 2) - 1);
            const theta = Math.random() * Math.PI * 2;
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);
        }
        return p;
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const p = progress.get();

        // 1. Expansion sync with scroll
        meshRef.current.scale.setScalar(1 + p * 0.2);

        // 2. Interactive Parallax (Mouse movement)
        // Opposite direction to mouse for depth effect
        targetRotation.current.x = state.pointer.y * 0.05;
        targetRotation.current.y = state.pointer.x * 0.05;

        currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 0.02);
        currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 0.02);

        meshRef.current.rotation.x = currentRotation.current.x;
        meshRef.current.rotation.y = currentRotation.current.y;

        // Subtle slow continuous drift
        meshRef.current.rotation.z += 0.0003;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.06} color={TECH_COLORS.white} transparent opacity={0.3} sizeAttenuation />
        </points>
    );
};

const CTAText = ({ progress }: { progress: any }) => {
    const textRef = useRef<any>(null);

    useFrame(() => {
        if (!textRef.current) return;
        const p = progress.get();
        // Fade out quickly as scroll starts (visible at 0, gone by 0.15)
        textRef.current.material.opacity = Math.max(0, 1 - p * 6);
        textRef.current.position.y = -5 - (p * 5); // Move down slightly as it fades
    });

    return (
        <Text
            ref={textRef}
            position={[0, -5, 0]} // positioned just below the globe (radius ~3.6)
            fontSize={0.3}
            color={TECH_COLORS.cyan}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
        >
            CONHEÇA O LOGOS PAGES
        </Text>
    );
};

export const LogosGlobe: React.FC<{ progress: any; isDark?: boolean }> = ({ progress }) => {
    const globeRef = useRef<THREE.Group>(null);
    const isDragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });
    const targetRotation = useRef({ x: 0, y: 0.8 });
    const currentRotation = useRef({ x: 0, y: 0.8 });

    const RADIUS = 3.6;

    // Manual Drag Handlers
    const onPointerDown = (e: any) => {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        const onPointerUp = () => { isDragging.current = false; };
        const onPointerMove = (e: any) => {
            if (!isDragging.current) return;
            const deltaX = e.clientX - lastMouse.current.x;
            const deltaY = e.clientY - lastMouse.current.y;

            // Adjust sensitivity here
            targetRotation.current.y += deltaX * 0.008;
            targetRotation.current.x += deltaY * 0.008;

            lastMouse.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointermove', onPointerMove);
        return () => {
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointermove', onPointerMove);
        };
    }, []);

    const isHovering = useRef(false);
    const mousePos = useRef(new THREE.Vector2(0, 0));

    useFrame((state, delta) => {
        if (!globeRef.current) return;

        // 1. Calculate Target Rotation based on Drag
        let targetX = targetRotation.current.x;
        let targetY = targetRotation.current.y;

        // 2. Add Persistent Auto-rotation (Drift)
        // If NOT dragging, slowly rotate the globe on its Y axis
        if (!isDragging.current) {
            targetRotation.current.y += delta * 0.05;
        }

        // 3. Add Subtle Hover Tilt if NOT dragging
        if (!isDragging.current && isHovering.current) {
            const hoverTiltX = -mousePos.current.y * 0.15;
            const hoverTiltY = mousePos.current.x * 0.15;
            targetX += hoverTiltX;
            targetY += hoverTiltY;
        }

        // 4. Smooth Interpolation
        const lerpFactor = isDragging.current ? 0.15 : 0.05;
        currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetX, lerpFactor);
        currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetY, lerpFactor);

        globeRef.current.rotation.x = currentRotation.current.x;
        globeRef.current.rotation.y = currentRotation.current.y;
    });

    return (
        <group>
            <color attach="background" args={[TECH_COLORS.bg]} />
            <BackgroundStars progress={progress} />
            <AsteroidField />
            <CoreExplosion progress={progress} />
            <CTAText progress={progress} />

            <group
                ref={globeRef}
                onPointerOver={() => {
                    isHovering.current = true;
                }}
                onPointerOut={() => {
                    isHovering.current = false;
                    mousePos.current.set(0, 0);
                }}
                onPointerMove={(e) => {
                    if (isDragging.current) return;
                    const x = (e.clientX / window.innerWidth) * 2 - 1;
                    const y = (e.clientY / window.innerHeight) * 2 - 1;
                    mousePos.current.set(x, y);
                }}
            >
                <CircuitNetwork radius={RADIUS} progress={progress} />
                <HeroElements radius={RADIUS} progress={progress} />

                {/* Active invisible hitarea - Handles the drag initiation */}
                <mesh
                    onPointerDown={(e) => {
                        (e as any).stopPropagation();
                        onPointerDown(e);
                    }}
                    onPointerUp={() => {
                        // Removed body cursor reset
                    }}
                >
                    <sphereGeometry args={[RADIUS * 1.2, 32, 32]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
            </group>
        </group>
    );

};
