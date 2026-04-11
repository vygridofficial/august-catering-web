'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { AbstractTree } from './AbstractTree';

export function SceneWrapper() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <Environment preset="city" />
      <AbstractTree />
    </Canvas>
  );
}
