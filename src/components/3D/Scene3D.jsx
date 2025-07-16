import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const mesh = useRef();
  const light = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 2000; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ],
        scale: Math.random() * 0.5 + 0.1
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.elapsedTime) * 10;
      light.current.position.z = Math.cos(state.clock.elapsedTime) * 10;
    }
  });

  return (
    <>
      <pointLight ref={light} intensity={1} color="#00ffff" />
      <group ref={mesh}>
        {particles.map((particle, i) => (
          <Sphere key={i} position={particle.position} args={[0.02]} scale={particle.scale}>
            <meshStandardMaterial color="#00ffff" emissive="#001122" />
          </Sphere>
        ))}
      </group>
    </>
  );
};

const FloatingCube = ({ position, color = "#00ffff", size = 1 }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.5;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Box ref={mesh} position={position} args={[size, size, size]}>
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
      />
    </Box>
  );
};

const Scene3D = ({ children, showParticles = true }) => {
  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: -1,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        {showParticles && <ParticleField />}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        
        <FloatingCube position={[-15, 5, -10]} color="#00ffff" size={2} />
        <FloatingCube position={[15, -5, -15]} color="#ff00ff" size={1.5} />
        <FloatingCube position={[0, 10, -20]} color="#00ff00" size={1} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="ui-overlay">
        {children}
      </div>
    </div>
  );
};

export default Scene3D;