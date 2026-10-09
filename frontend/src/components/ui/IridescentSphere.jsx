import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Sphere, MeshReflectorMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Hook to detect active tailwind dark mode
function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Observer for class changes on html element
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// Orbiting colorful lights to create the liquid swirl reflections
function AnimatedLights() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[3, 2, 2]} color="#00ffff" intensity={20} distance={15} />
      <pointLight position={[-3, -2, -2]} color="#ff00ff" intensity={20} distance={15} />
      <pointLight position={[2, -3, 2]} color="#ffffff" intensity={10} distance={15} />
    </group>
  );
}

function SphereMesh({ isDark }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation of the sphere itself
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 128, 128]} position={[0, 0, 0]}>
        <meshPhysicalMaterial
          roughness={isDark ? 0.05 : 0.1}
          metalness={isDark ? 0.9 : 0.7}
          transmission={isDark ? 0.1 : 0.0}
          ior={1.5}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          clearcoat={1}
          clearcoatRoughness={0.05}
          color={isDark ? "#ffffff" : "#111111"}
          emissive={isDark ? "#050505" : "#000000"}
        />
      </Sphere>
    </Float>
  );
}

export function IridescentSphere({ className }) {
  const isDark = useIsDarkTheme();

  return (
    <div className={`w-full h-full cursor-grab active:cursor-grabbing ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={[isDark ? '#030303' : '#fafafa']} />
        
        <ambientLight intensity={isDark ? 0.5 : 1.5} />
        <AnimatedLights />
        
        {/* Local Environment to avoid network hanging */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <sphereGeometry args={[10, 32, 32]} />
              <meshBasicMaterial color={isDark ? "#111111" : "#ffffff"} side={THREE.BackSide} />
            </mesh>
            <pointLight position={[5, 5, 5]} intensity={10} color="#ff00ff" />
            <pointLight position={[-5, -5, -5]} intensity={10} color="#00ffff" />
          </group>
        </Environment>

        <SphereMesh isDark={isDark} />
        
        {/* Reflective Ground Plane */}
        <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={isDark ? 50 : 20}
            roughness={isDark ? 0.4 : 0.6}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={isDark ? "#050505" : "#e0e0e0"}
            metalness={isDark ? 0.8 : 0.3}
          />
        </mesh>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent going too far below the ground
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
