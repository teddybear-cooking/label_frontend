import React, { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Stage, Environment, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { ENABLE_3D_MODEL, ENABLE_DEBUG_MODE } from '../api/config';

function ToothlessModel() {
    const gltf = useLoader(GLTFLoader, '/toothless.glb');
    const modelRef = useRef<THREE.Group>(null!);

    return (
        <Stage
            intensity={1}
            environment="city"
            adjustCamera={false}
        >
            <primitive 
                ref={modelRef} 
                object={gltf.scene} 
                scale={1.5} 
                position={[0, -13, 0]}
                rotation={[0, Math.PI, 0]}
            />
        </Stage>
    );
}

export function ToothlessViewer() {
    // Don't render the 3D model if disabled
    if (!ENABLE_3D_MODEL) {
        return null;
    }

    if (ENABLE_DEBUG_MODE) {
        console.log('Rendering ToothlessViewer - 3D Model enabled');
    }

    return (
        <Canvas
            style={{ height: '250px' }}
            camera={{ position: [-0.12, 2.09, -5.27], fov: 40 }}
            gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1,
                preserveDrawingBuffer: true
            }}
            dpr={[1, 2]}
        >
                    <React.Suspense fallback={null}>
            <ToothlessModel />
            <Environment preset="city" />
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={15}
            />
        </React.Suspense>
        </Canvas>
    );
}

export default ToothlessViewer; 