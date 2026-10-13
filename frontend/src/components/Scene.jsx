import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Stars } from '@react-three/drei';

function Orb() {
 const ref = useRef();
 useFrame((state, delta) => { if (ref.current) { ref.current.rotation.y += delta * 0.14; ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.16; } });
 return <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}><mesh ref={ref} scale={1.45}><icosahedronGeometry args={[1, 5]} /><MeshDistortMaterial color="#d4af37" roughness={0.22} metalness={0.78} distort={0.28} speed={1.7} wireframe={false} /></mesh><mesh scale={1.72}><icosahedronGeometry args={[1, 2]} /><meshBasicMaterial color="#d4af37" wireframe transparent opacity={0.19} /></mesh></Float>;
}
export default function Scene({compact=false}) { return <div className={`scene ${compact?'scene-compact':''}`} aria-label="Interactive 3D gold technology sphere"><Canvas camera={{position:[0,0,5.5],fov:45}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}><ambientLight intensity={1.3}/><pointLight position={[4,4,4]} intensity={30} color="#ffe9a1"/><pointLight position={[-4,-2,1]} intensity={12} color="#a87913"/><Suspense fallback={null}><Stars radius={70} depth={30} count={compact?350:900} factor={3} fade speed={0.5}/><Orb/></Suspense><OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.35}/></Canvas></div>; }
