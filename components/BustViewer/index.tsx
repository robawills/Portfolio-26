import React, { Suspense, useMemo, useRef } from 'react';

import { Center, ContactShadows, Environment, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import classNames from 'classnames/bind';
import * as THREE from 'three';

import styles from './BustViewer.module.scss';

const cx = classNames.bind(styles);

const HAND_PATH = '/blend/hand.glb';

const MAX_ROTATION = 0.4;
const LERP_SPEED = 0.05;

const BACKGROUND_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const BACKGROUND_FRAGMENT = `
  uniform float uTime;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec3 colorLight = vec3(0.196, 0.188, 0.914);  // #3230E9
    vec3 colorDark = vec3(0.067, 0.051, 0.42);     // #110D6B

    float n1 = snoise(vec3(vUv * 2.0, uTime * 0.15)) * 0.5 + 0.5;
    float n2 = snoise(vec3(vUv * 4.0 + 10.0, uTime * 0.1)) * 0.5 + 0.5;
    float n3 = snoise(vec3(vUv * 1.5 - 5.0, uTime * 0.08)) * 0.5 + 0.5;

    float blend = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    vec3 color = mix(colorDark, colorLight, blend);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const ShaderBackground = (): React.ReactElement => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={BACKGROUND_VERTEX}
        fragmentShader={BACKGROUND_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

const createBalloonMaterial = (): THREE.MeshPhysicalMaterial => {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#c0c0c0',
    roughness: 0.15,
    metalness: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 1,
    envMapIntensity: 2,
    sheen: 0.3,
    sheenColor: new THREE.Color('#ffffff'),
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
      vLocalPos = position;
      vLocalNormal = normal;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;

      float seamLine(float angle, float width) {
        float a = atan(vLocalNormal.z, vLocalNormal.x);
        float d = abs(sin(a - angle));
        return 1.0 - smoothstep(0.0, width, d);
      }`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `vec3 baseColor = diffuse;

      // vertical seams around the model
      float seam = 0.0;
      seam = max(seam, seamLine(0.0, 0.06));
      seam = max(seam, seamLine(1.5708, 0.06));
      seam = max(seam, seamLine(3.1416, 0.06));
      seam = max(seam, seamLine(4.7124, 0.06));

      // horizontal seam
      float hSeam = 1.0 - smoothstep(0.0, 0.06, abs(vLocalNormal.y));
      seam = max(seam, hSeam);

      // darken and roughen along seams
      vec3 seamColor = baseColor * 0.4;
      vec3 finalColor = mix(baseColor, seamColor, seam);

      vec4 diffuseColor = vec4(finalColor, opacity);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'float roughnessFactor = roughness;',
      `float roughnessFactor = roughness + seam * 0.7;`
    );
  };

  return material;
};

const ANI_HAND_PATH = '/blend/ani-hand-smooth.glb';

interface AnimatedHandProps {
  material: THREE.Material;
  initialRotation?: [number, number, number];
}

const AnimatedHand = ({
  material,
  initialRotation = [0, 0, 0],
}: AnimatedHandProps): React.ReactElement => {
  const { scene, animations } = useGLTF(ANI_HAND_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const targetPoseIndex = useRef(0);
  const poseTimes = useRef([0, 20, 40, 60, 80, 100].map((f) => f / 24));
  const mouseTarget = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0);

  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  React.useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;

      const action = mixer.clipAction(animations[0]);
      action.play();

      const poseNames = ['Standby', 'Fist', 'Pointing', 'Spread', 'Thumbs Up', 'Peace'];

      action.time = 0;
      mixer.update(0);
      action.paused = true;
      actionRef.current = action;
      targetPoseIndex.current = 0;

      const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'x' || e.key === 'X') {
          targetPoseIndex.current =
            (targetPoseIndex.current + 1) % poseNames.length;
          if (actionRef.current) {
            actionRef.current.paused = false;
          }
          console.log(`Pose: ${poseNames[targetPoseIndex.current]}`);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        mixer.stopAllAction();
      };
    }
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

  useFrame((_, delta) => {
    if (mixerRef.current && actionRef.current && !actionRef.current.paused) {
      mixerRef.current.update(delta);
      const target = poseTimes.current[targetPoseIndex.current];
      if (actionRef.current.time >= target) {
        actionRef.current.time = target;
        actionRef.current.paused = true;
        mixerRef.current.update(0);
      }
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

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      initialRotation[1] + mouseTarget.current.x + dragOffset.current.x,
      LERP_SPEED
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      initialRotation[0] + mouseTarget.current.y + dragOffset.current.y,
      LERP_SPEED
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
};

interface HandProps {
  modelPath: string;
  material: THREE.Material;
  initialRotation?: [number, number, number];
}

const Hand = ({
  modelPath,
  material,
  initialRotation = [0, 0, 0],
}: HandProps): React.ReactElement => {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [clonedScene, material]);

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

  useFrame(() => {
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

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      initialRotation[1] + mouseTarget.current.x + dragOffset.current.x,
      LERP_SPEED
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      initialRotation[0] + mouseTarget.current.y + dragOffset.current.y,
      LERP_SPEED
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
};

const createSmoothBalloonMaterial = (): THREE.MeshPhysicalMaterial => {
  const material = new THREE.MeshPhysicalMaterial({
    color: '#d0d0d0',
    roughness: 0.15,
    metalness: 0.95,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    reflectivity: 1,
    envMapIntensity: 2.5,
    sheen: 0.2,
    sheenColor: new THREE.Color('#aaaaaa'),
    flatShading: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalNormal;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `#include <worldpos_vertex>
      vLocalNormal = normal;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vLocalNormal;

      float seamLine(float angle, float width) {
        float a = atan(vLocalNormal.z, vLocalNormal.x);
        float d = abs(sin(a - angle));
        return 1.0 - smoothstep(0.0, width, d);
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

      vec3 seamColor = baseColor * 0.5;
      vec3 finalColor = mix(baseColor, seamColor, seam * 0.6);

      vec4 diffuseColor = vec4(finalColor, opacity);`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'float roughnessFactor = roughness;',
      `float roughnessFactor = roughness + seam * 0.5;`
    );
  };

  return material;
};

interface BustViewerProps {
  className?: string;
}

const BustViewer = ({ className }: BustViewerProps): React.ReactElement => {
  const balloonMaterial = useMemo(() => createBalloonMaterial(), []);
  const smoothBalloonMaterial = useMemo(() => createSmoothBalloonMaterial(), []);


  return (
    <div className={cx('wrapper', className)}>
      <div className={cx('canvasContainer')}>
        <Canvas camera={{ position: [0, 0, 2], fov: 45 }}>
          <ShaderBackground />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight
            position={[-5, 3, -2]}
            intensity={0.4}
            color="#7b2d8e"
          />
          <Suspense fallback={null}>
            <Hand
              modelPath={HAND_PATH}
              material={balloonMaterial}
              initialRotation={[0, -Math.PI / 2, 0]}
            />
            <Environment preset="studio" />
          </Suspense>
          <ContactShadows
            position={[0, -1, 0]}
            opacity={1}
            blur={2}
            far={3}
            color="#0a0860"
          />
        </Canvas>
      </div>
      <div className={cx('canvasContainer')}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
          <ShaderBackground />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight
            position={[-5, 3, -2]}
            intensity={0.4}
          />
          <Suspense fallback={null}>
            <AnimatedHand
              material={smoothBalloonMaterial}
              initialRotation={[0, -Math.PI / 2 + Math.PI / 2, 0]}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

useGLTF.preload(HAND_PATH);
useGLTF.preload(ANI_HAND_PATH);

export default BustViewer;
