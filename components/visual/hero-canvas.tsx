"use client";

import { Environment, Float, Line, OrbitControls, PerspectiveCamera, Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function NeuralCore() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const nodes = useMemo(() => {
    return Array.from({ length: 34 }, (_, index) => {
      const phi = Math.acos(-1 + (2 * index) / 34);
      const theta = Math.sqrt(34 * Math.PI) * phi;
      const radius = 1.55 + (index % 4) * 0.08;

      return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      );
    });
  }, []);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(600);
    for (let index = 0; index < positions.length; index += 3) {
      const radius = 1.8 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  const lines = useMemo(() => {
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    nodes.forEach((node, index) => {
      nodes.slice(index + 1).forEach((candidate) => {
        if (node.distanceTo(candidate) < 1.02) {
          connections.push([node, candidate]);
        }
      });
    });
    return connections.slice(0, 64);
  }, [nodes]);

  useFrame(({ pointer, clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.12 + pointer.x * 0.28;
      groupRef.current.rotation.x = pointer.y * 0.22;
    }

    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.035;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.4} rotationIntensity={0.45} floatIntensity={0.65}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.14, 4]} />
          <meshStandardMaterial
            color="#3B82F6"
            emissive="#06B6D4"
            emissiveIntensity={0.35}
            metalness={0.25}
            roughness={0.18}
            transparent
            opacity={0.28}
            wireframe
          />
        </mesh>

        {nodes.map((node, index) => (
          <mesh key={`${node.x}-${index}`} position={node}>
            <sphereGeometry args={[0.035 + (index % 3) * 0.01, 16, 16]} />
            <meshStandardMaterial color={index % 2 ? "#8B5CF6" : "#06B6D4"} emissive="#3B82F6" emissiveIntensity={1.2} />
          </mesh>
        ))}

        {lines.map(([start, end], index) => (
          <Line
            key={`${start.x}-${end.x}-${index}`}
            points={[start, end]}
            color={index % 2 ? "#8B5CF6" : "#06B6D4"}
            lineWidth={0.65}
            transparent
            opacity={0.42}
          />
        ))}

        <Points positions={particlePositions} stride={3}>
          <PointMaterial transparent color="#93C5FD" size={0.018} sizeAttenuation depthWrite={false} opacity={0.62} />
        </Points>
      </Float>
    </group>
  );
}

export function HeroCanvas() {
  return (
    <div className="h-[24rem] w-full md:h-[34rem] lg:h-[42rem]" aria-label="Interactive floating neural network visualization">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5.2]} fov={44} />
          <ambientLight intensity={0.55} />
          <pointLight position={[3, 4, 5]} intensity={26} color="#3B82F6" />
          <pointLight position={[-4, -2, 3]} intensity={16} color="#8B5CF6" />
          <NeuralCore />
          <Environment preset="night" />
          <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.25} autoRotate autoRotateSpeed={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
