"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";

type Quality = { low: boolean; still: boolean };

function Composition({ q }: { q: Quality }) {
  const group = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (q.still) return;
    const g = group.current;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.2, 3, delta);
    g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.15, 3, delta);
  });

  const seg = q.low ? 24 : 40; // lighter geometry on low-power devices
  const speed = q.still ? 0 : 1;

  return (
    <group ref={group} scale={0.62}>
      {/* Crystal: polished look without the expensive glass "transmission" */}
      <Float speed={1.2 * speed} rotationIntensity={0.35} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshPhysicalMaterial color="#9BD9FE" roughness={0.06} metalness={0.15} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} />
        </mesh>
      </Float>

      {/* Ring: moved further from the crystal so they never touch */}
      <Float speed={0.9 * speed} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[1.85, -1.05, 0]} rotation={[0.6, 0.2, 0]}>
          <torusGeometry args={[0.55, 0.18, seg, seg * 2]} />
          <meshStandardMaterial color="#1177FF" metalness={1} roughness={0.22} />
        </mesh>
      </Float>

      {/* Small sphere */}
      <Float speed={1.5 * speed} floatIntensity={0.9}>
        <mesh position={[-1.75, 1.0, -0.3]}>
          <sphereGeometry args={[0.32, seg, seg]} />
          <meshStandardMaterial color="#C4E8FC" metalness={0.9} roughness={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroOrb() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Lower quality on phones / low-power devices; stay still for reduced-motion visitors
  const q = useMemo<Quality>(() => {
    if (typeof window === "undefined") return { low: false, still: false };
    const small = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return { low: small || cores <= 4, still };
  }, []);

  // Pause the animation while the hero is scrolled off screen
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={visible && !q.still ? "always" : "demand"}
        dpr={q.low ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 5.6], fov: 42 }}
        gl={{ antialias: !q.low, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 4, 5]} intensity={2} color="#E8FCFC" />
        <pointLight position={[-4, -2, 2]} intensity={30} color="#1D9BFF" />
        <Composition q={q} />
        <Environment resolution={q.low ? 64 : 128}>
          <Lightformer form="rect" intensity={4} color="#E8FCFC" position={[0, 3, 4]} scale={[8, 2, 1]} />
          <Lightformer form="circle" intensity={6} color="#1D9BFF" position={[-4, 0, 2]} scale={3} />
          <Lightformer form="rect" intensity={3} color="#1177FF" position={[4, -1, -2]} scale={[3, 6, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}