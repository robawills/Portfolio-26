import React, { Suspense, useMemo, useRef, useState } from 'react';

import { Center, Environment, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import classNames from 'classnames/bind';
import * as THREE from 'three';

import styles from './Hand3D.module.scss';

const cx = classNames.bind(styles);

const MAX_ROTATION = 0.4;
const LERP_SPEED = 0.05;
const BACKGROUND_COLOR = '#f5f2ed';

const ANI_HAND_PATH = '/blend/three-finger-hand.glb';

interface Pose {
  label: string;
  frame: number;
  yaw?: number;
  wave?: boolean;
}

const WAVE_AMPLITUDE = 0.15;
const WAVE_SPEED = 3.5;

const POSES: Pose[] = [
  { label: 'Pose 1', frame: 1, yaw: Math.PI, wave: true },
  { label: 'Peace', frame: 135, yaw: Math.PI },
  { label: 'Phone', frame: 170, yaw: (Math.PI * -20) / 180 },
  { label: 'Horns', frame: 200, yaw: Math.PI },
  { label: 'Middle', frame: 230, yaw: (Math.PI * -20) / 180 },
];

const ANIMATION_FPS = 24;
const POSE_LERP = 0.08;
const POSE_SNAP_EPSILON = 0.005;

interface AnimatedHandProps {
  material: THREE.Material;
  initialRotation?: [number, number, number];
  poseIndex: number;
}

const AnimatedHand = ({
  material,
  initialRotation = [0, 0, 0],
  poseIndex,
}: AnimatedHandProps): React.ReactElement => {
  const { scene, animations } = useGLTF(ANI_HAND_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0);

  const targetTime = POSES[poseIndex].frame / ANIMATION_FPS;

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  React.useEffect(() => {
    if (animations.length === 0) return;

    const mixer = new THREE.AnimationMixer(scene);
    mixerRef.current = mixer;

    const action = mixer.clipAction(animations[0]);
    action.play();
    action.time = POSES[0].frame / ANIMATION_FPS;
    action.paused = true;
    mixer.update(0);
    actionRef.current = action;

    return () => {
      mixer.stopAllAction();
    };
  }, [scene, animations]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      mouseTarget.current.x =
        ((e.clientX / window.innerWidth) * 2 - 1) * MAX_ROTATION;
      mouseTarget.current.y =
        ((e.clientY / window.innerHeight) * 2 - 1) * MAX_ROTATION;

      if (isDragging.current) {
        dragOffset.current.x += (e.clientX - dragStart.current.x) * 0.01;
        dragOffset.current.y += (e.clientY - dragStart.current.y) * 0.01;
        dragStart.current.x = e.clientX;
        dragStart.current.y = e.clientY;
        lastDragTime.current = Date.now();
      }
    };

    const handleMouseDown = (e: MouseEvent): void => {
      isDragging.current = true;
      dragStart.current.x = e.clientX;
      dragStart.current.y = e.clientY;
    };

    const handleMouseUp = (): void => {
      isDragging.current = false;
      lastDragTime.current = Date.now();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const RETURN_DELAY = 1500;
  const RETURN_SPEED = 0.02;

  useFrame(({ clock }) => {
    if (mixerRef.current && actionRef.current) {
      const current = actionRef.current.time;
      const next =
        Math.abs(current - targetTime) < POSE_SNAP_EPSILON
          ? targetTime
          : THREE.MathUtils.lerp(current, targetTime, POSE_LERP);
      actionRef.current.time = next;
      mixerRef.current.update(0);
    }

    if (!groupRef.current) return;

    const timeSinceDrag = Date.now() - lastDragTime.current;
    if (!isDragging.current && timeSinceDrag > RETURN_DELAY) {
      dragOffset.current.x = THREE.MathUtils.lerp(
        dragOffset.current.x,
        0,
        RETURN_SPEED
      );
      dragOffset.current.y = THREE.MathUtils.lerp(
        dragOffset.current.y,
        0,
        RETURN_SPEED
      );
    }

    const poseYaw = POSES[poseIndex].yaw ?? 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      initialRotation[1] + mouseTarget.current.x + dragOffset.current.x + poseYaw,
      LERP_SPEED
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      initialRotation[0] + mouseTarget.current.y + dragOffset.current.y,
      LERP_SPEED
    );

    const waveTarget = POSES[poseIndex].wave
      ? Math.sin(clock.elapsedTime * WAVE_SPEED) * WAVE_AMPLITUDE
      : 0;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      waveTarget,
      LERP_SPEED
    );
  });

  return (
    <group ref={groupRef} scale={1.95}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
};

const createSmoothBalloonMaterial = (): THREE.MeshPhysicalMaterial => {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#003DFF',
    roughness: 0.35,
    metalness: 0.05,
    clearcoat: 0.55,
    clearcoatRoughness: 0.3,
    reflectivity: 0.6,
    envMapIntensity: 1.3,
    sheen: 0.6,
    sheenRoughness: 0.4,
    sheenColor: new THREE.Color('#003DFF'),
    flatShading: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalNormal;
      varying vec3 vLocalPos;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
      vLocalNormal = normal;
      vLocalPos = position;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalNormal;
      varying vec3 vLocalPos;

      float seamLine(float angle, float width) {
        float a = atan(vLocalNormal.z, vLocalNormal.x);
        float d = abs(sin(a - angle));
        return 1.0 - smoothstep(0.0, width, d);
      }

      float hash13(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      float valueNoise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float n000 = hash13(i);
        float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
        float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
        float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
        float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
        float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
        float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
        float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
        float x00 = mix(n000, n100, f.x);
        float x10 = mix(n010, n110, f.x);
        float x01 = mix(n001, n101, f.x);
        float x11 = mix(n011, n111, f.x);
        float y0 = mix(x00, x10, f.y);
        float y1 = mix(x01, x11, f.y);
        return mix(y0, y1, f.z);
      }

      float fbm(vec3 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * valueNoise(p);
          p *= 2.1;
          a *= 0.5;
        }
        return v;
      }`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `vec3 baseColor = diffuse;

      float seam = 0.0;
      seam = max(seam, seamLine(0.0, 0.04));
      seam = max(seam, seamLine(1.0472, 0.04));
      seam = max(seam, seamLine(2.0944, 0.04));
      seam = max(seam, seamLine(3.1416, 0.04));
      seam = max(seam, seamLine(4.1888, 0.04));
      seam = max(seam, seamLine(5.236, 0.04));

      float hSeam = 1.0 - smoothstep(0.0, 0.04, abs(vLocalNormal.y));
      seam = max(seam, hSeam);

      // Procedural wrinkle / crease field
      float wrinkleLarge = fbm(vLocalPos * 14.0);
      float wrinkleSmall = fbm(vLocalPos * 42.0 + 13.7);
      float wrinkle = mix(wrinkleLarge, wrinkleSmall, 0.35);

      // Creases = sharp dark lines where the noise is at its midband
      float crease = smoothstep(0.38, 0.46, wrinkle) - smoothstep(0.46, 0.54, wrinkle);

      vec3 seamColor = baseColor * 0.5;
      vec3 creaseColor = baseColor * 0.75;
      vec3 finalColor = mix(baseColor, seamColor, seam * 0.6);
      finalColor = mix(finalColor, creaseColor, crease * 0.7);

      // Subtle overall surface variation
      finalColor *= (0.9 + wrinkleLarge * 0.2);

      vec4 diffuseColor = vec4(finalColor, opacity);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'float roughnessFactor = roughness;',
      `float wrinkleLargeR = fbm(vLocalPos * 14.0);
      float wrinkleSmallR = fbm(vLocalPos * 42.0 + 13.7);
      float wrinkleR = mix(wrinkleLargeR, wrinkleSmallR, 0.35);
      float creaseR = smoothstep(0.38, 0.46, wrinkleR) - smoothstep(0.46, 0.54, wrinkleR);
      float roughnessFactor = roughness + seam * 0.5 + creaseR * 0.2;`
    );
  };

  return material;
};

interface Hand3DProps {
  className?: string;
}

const Hand3D = ({ className }: Hand3DProps): React.ReactElement => {
  const smoothBalloonMaterial = useMemo(
    () => createSmoothBalloonMaterial(),
    []
  );
  const [poseIndex, setPoseIndex] = useState(0);

  return (
    <div className={cx('wrapper', className)}>
      <div className={cx('canvasContainer')}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <color attach="background" args={[BACKGROUND_COLOR]} />
          <ambientLight intensity={0.5} color="#fff4e6" />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            color="#fff1d6"
          />
          <directionalLight
            position={[-5, 3, -2]}
            intensity={0.4}
            color="#d8e6f0"
          />
          <Suspense fallback={null}>
            <AnimatedHand
              material={smoothBalloonMaterial}
              initialRotation={[0, -Math.PI / 2 + Math.PI / 2, 0]}
              poseIndex={poseIndex}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
        <div className={cx('poseControls')}>
          {POSES.map((pose, index) => (
            <button
              key={pose.label}
              type="button"
              className={cx('poseButton', {
                poseButtonActive: index === poseIndex,
              })}
              onClick={() => setPoseIndex(index)}
              onMouseEnter={() => setPoseIndex(index)}
              onFocus={() => setPoseIndex(index)}
            >
              {pose.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

useGLTF.preload(ANI_HAND_PATH);

export default Hand3D;
