import React from 'react';
import { ENABLE_3D_MODEL, ENABLE_DEBUG_MODE } from '../api/config';

export function ToothlessViewer() {
    // Debug logging
    console.log('ToothlessViewer - ENABLE_3D_MODEL:', ENABLE_3D_MODEL);
    console.log('ToothlessViewer - Environment variables:', {
        REACT_APP_ENABLE_3D_MODEL: process.env.REACT_APP_ENABLE_3D_MODEL,
        NODE_ENV: process.env.NODE_ENV
    });
    
    // Don't render the 3D model if disabled
    if (!ENABLE_3D_MODEL) {
        console.log('ToothlessViewer disabled - 3D Model feature is off');
        if (ENABLE_DEBUG_MODE) {
            console.log('ToothlessViewer disabled - 3D Model feature is off');
        }
        return (
            <div style={{ 
                height: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                margin: '20px 0',
                border: '2px dashed #ccc'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>🐉</p>
                    <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>3D Model Disabled</p>
                </div>
            </div>
        );
    }

    // If 3D is enabled, dynamically import and render the 3D components
    // This prevents the loader from executing when 3D is disabled
    return <DynamicToothlessViewer />;
}

// This component only gets defined and used when 3D is enabled
function DynamicToothlessViewer() {
    const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        // Only load 3D libraries when this component is actually used
        Promise.all([
            import('@react-three/fiber'),
            import('@react-three/drei'),
            import('three/examples/jsm/loaders/GLTFLoader'),
            import('three')
        ]).then(([fiber, drei, loader, three]) => {
            const { Canvas, useLoader } = fiber;
            const { Stage, Environment, OrbitControls } = drei;
            const { GLTFLoader } = loader;
            const THREE = three;

            function ToothlessModel() {
                const gltf = useLoader(GLTFLoader, '/toothless.glb');
                const modelRef = React.useRef<any>(null!);

                return React.createElement(Stage, {
                    intensity: 1,
                    environment: "city",
                    adjustCamera: false
                }, React.createElement('primitive', {
                    ref: modelRef,
                    object: gltf.scene,
                    scale: 1.5,
                    position: [0, -13, 0],
                    rotation: [0, Math.PI, 0]
                }));
            }

            function ToothlessCanvas() {
                if (ENABLE_DEBUG_MODE) {
                    console.log('Rendering ToothlessViewer - 3D Model enabled');
                }

                return React.createElement(Canvas, {
                    style: { height: '250px' },
                    camera: { position: [-0.12, 2.09, -5.27], fov: 40 },
                    gl: {
                        antialias: true,
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 1,
                        preserveDrawingBuffer: true
                    },
                    dpr: [1, 2]
                }, 
                    React.createElement(React.Suspense, { fallback: null },
                        React.createElement(ToothlessModel),
                        React.createElement(Environment, { preset: "city" }),
                        React.createElement(OrbitControls, {
                            enablePan: true,
                            enableZoom: true,
                            enableRotate: true,
                            minDistance: 3,
                            maxDistance: 15
                        })
                    )
                );
            }

            setComponent(() => ToothlessCanvas);
        }).catch((err) => {
            console.error('Failed to load 3D components:', err);
            setError('Failed to load 3D model');
        });
    }, []);

    if (error) {
        return (
            <div style={{ 
                height: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#ffe6e6',
                borderRadius: '8px',
                margin: '20px 0',
                border: '2px solid #ffcccc'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#cc0000', fontSize: '14px', margin: '0 0 8px 0' }}>⚠️</p>
                    <p style={{ color: '#cc0000', fontSize: '12px', margin: 0 }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!Component) {
        return (
            <div style={{ 
                height: '250px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                margin: '20px 0'
            }}>
                <p style={{ color: '#666', fontSize: '14px' }}>Loading 3D Model...</p>
            </div>
        );
    }

    return React.createElement(Component);
}

export default ToothlessViewer; 