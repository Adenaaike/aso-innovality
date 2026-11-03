"use client";
import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";

function Composition() {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    const g = group.current;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.25, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.3, 3, delta);
  });
  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial color="#9BD9FE" transmission={1} thickness={1.2} roughness={0.08} ior={1.4} />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.8} floatIntensity={1.1}>
        <mesh position={[1.6, -0.9, -0.6]} rotation={[0.6, 0.2, 0]}>
          <torusGeometry args={[0.55, 0.18, 48, 96]} />
          <meshStandardMaterial color="#1177FF" metalness={1} roughness={0.22} />
        </mesh>
      </Float>
      <Float speed={1.5} floatIntensity={1.4}>
        <mesh position={[-1.7, 0.9, -0.8]}>
          <sphereGeometry args={[0.32, 48, 48]} />
          <meshStandardMaterial color="#C4E8FC" metalness={0.9} roughness={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroOrb() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true, alpha: true }} aria-hidden>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#E8FCFC" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#1D9BFF" />
      <Composition />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} color="#E8FCFC" position={[0, 3, 4]} scale={[8, 2, 1]} />
        <Lightformer form="circle" intensity={6} color="#1D9BFF" position={[-4, 0, 2]} scale={3} />
        <Lightformer form="rect" intensity={3} color="#1177FF" position={[4, -1, -2]} scale={[3, 6, 1]} />
      </Environment>
    </Canvas>
  );
}