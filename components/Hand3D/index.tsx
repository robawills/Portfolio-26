"use client";

import React, { Suspense, useMemo, useRef } from "react";

import { Environment, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import classNames from "classnames/bind";
import * as THREE from "three";

import breakpoints from "@/constants/breakpoints";
import { HAND_POSES, useHandPose } from "@/context/HandPose";

import styles from "./Hand3D.module.scss";

const cx = classNames.bind(styles);

// THREE r183 deprecated `Clock` in favour of `Timer`. @react-three/fiber 9.x
// still constructs a `new THREE.Clock()` in its store on every Canvas mount,
// which prints a one-shot console.warn we can't intercept any other way.
// Silence just that string; everything else passes through unchanged.
// Remove once R3F adopts THREE.Timer.
if (
  typeof window !== "undefined" &&
  !(window as unknown as {__clockWarnSilenced?: boolean}).__clockWarnSilenced
) {
  (window as unknown as {__clockWarnSilenced: boolean}).__clockWarnSilenced =
    true;
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      message.includes("THREE.Clock: This module has been deprecated")
    ) {
      return;
    }
    original.apply(console, args as Parameters<typeof console.warn>);
  };
}

const MAX_ROTATION = 0.4;
const LERP_SPEED = 0.05;

const ANI_HAND_PATH = "/blend/three-finger-hand.glb";

interface Pose {
  label: string;
  frame: number;
  yaw?: number;
  wave?: boolean;
}

const WAVE_AMPLITUDE = 0.15;
const WAVE_SPEED = 3.5;

// Subtle, always-on idle motion so the hand never feels frozen.
// Each axis uses a different frequency so the motion never repeats.
const IDLE_AMP_X = 0.012;
const IDLE_AMP_Y = 0.015;
const IDLE_AMP_Z = 0.008;
const IDLE_FREQ_X = 0.55;
const IDLE_FREQ_Y = 0.4;
const IDLE_FREQ_Z = 0.7;

const POSES: Pose[] = [
  { label: "Pose 1", frame: 1, yaw: Math.PI, wave: true },
  { label: "Peace", frame: 135, yaw: Math.PI },
  { label: "Phone", frame: 170, yaw: (Math.PI * -20) / 180 },
  { label: "Horns", frame: 200, yaw: Math.PI },
  { label: "Middle", frame: 230, yaw: (Math.PI * -20) / 180 },
];

const ANIMATION_FPS = 24;
const POSE_LERP = 0.12;

interface BoneSnapshot {
  bone: THREE.Bone;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
}

interface AnimatedHandProps {
  /** Material applied to every mesh in the imported GLTF scene. */
  material: THREE.Material;
  /** Starting Euler rotation `[x, y, z]` (radians) for the hand group. Defaults to `[0, 0, 0]`. */
  initialRotation?: [number, number, number];
  /** Index into the internal `POSES` table — which keyframe the bones lerp toward. */
  poseIndex: number;
}

const AnimatedHand = ({
  material,
  initialRotation = [0, 0, 0],
  poseIndex,
}: AnimatedHandProps): React.ReactElement => {
  const { scene, animations } = useGLTF(ANI_HAND_PATH);

  // useGLTF caches the scene globally, so a remount can land with bones in any
  // pose. Reset to the rest pose during render and measure the centering
  // offset once — applied below as a static position so we never re-measure a
  // skinned bbox at a wrong moment.
  const restCenteringOffset = useMemo(() => {
    const offset = new THREE.Vector3(0, 0, 0);
    if (animations.length === 0) return offset;
    const mixer = new THREE.AnimationMixer(scene);
    const action = mixer.clipAction(animations[0]);
    action.play();
    action.paused = true;
    action.time = POSES[0].frame / ANIMATION_FPS;
    mixer.update(0);
    mixer.stopAllAction();
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene, true);
    box.getCenter(offset);
    return offset.negate();
  }, [scene, animations]);

  const groupRef = useRef<THREE.Group>(null);
  const poseSnapshotsRef = useRef<BoneSnapshot[][]>([]);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const timerRef = useRef<THREE.Timer | null>(null);
  if (timerRef.current === null) timerRef.current = new THREE.Timer();
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastDragTime = useRef(0);
  const [isMobile, setIsMobile] = React.useState(false);

  // On mobile we ignore the pose system and pointer-driven rotation —
  // the hand just sits in the wave pose (index 0) and does its idle drift.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${breakpoints.s - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectivePoseIndex = isMobile ? 0 : poseIndex;

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
    const action = mixer.clipAction(animations[0]);
    action.play();
    action.paused = true;

    const snapshots: BoneSnapshot[][] = POSES.map((pose) => {
      action.time = pose.frame / ANIMATION_FPS;
      mixer.update(0);

      const snapshot: BoneSnapshot[] = [];
      scene.traverse((node) => {
        const bone = node as THREE.Bone;
        if (bone.isBone) {
          snapshot.push({
            bone,
            position: bone.position.clone(),
            quaternion: bone.quaternion.clone(),
            scale: bone.scale.clone(),
          });
        }
      });
      return snapshot;
    });

    poseSnapshotsRef.current = snapshots;

    action.time = POSES[0].frame / ANIMATION_FPS;
    mixer.update(0);

    return () => {
      mixer.stopAllAction();
    };
  }, [scene, animations]);

  React.useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const isBelowModelMidpoint = e.clientY > window.innerHeight / 2;

      mouseTarget.current.x =
        ((e.clientX / window.innerWidth) * 2 - 1) * MAX_ROTATION;

      if (isBelowModelMidpoint) {
        mouseTarget.current.y =
          ((e.clientY / window.innerHeight) * 2 - 1) * MAX_ROTATION;
      } else {
        mouseTarget.current.y = 0;
      }

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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMobile]);

  const RETURN_DELAY = 1500;
  const RETURN_SPEED = 0.02;

  useFrame(() => {
    const timer = timerRef.current!;
    timer.update();
    const target = poseSnapshotsRef.current[effectivePoseIndex];
    if (target) {
      for (let i = 0; i < target.length; i++) {
        const snap = target[i];
        snap.bone.position.lerp(snap.position, POSE_LERP);
        snap.bone.quaternion.slerp(snap.quaternion, POSE_LERP);
        snap.bone.scale.lerp(snap.scale, POSE_LERP);
      }
    }

    if (!groupRef.current) return;

    const timeSinceDrag = Date.now() - lastDragTime.current;
    if (!isDragging.current && timeSinceDrag > RETURN_DELAY) {
      dragOffset.current.x = THREE.MathUtils.lerp(
        dragOffset.current.x,
        0,
        RETURN_SPEED,
      );
      dragOffset.current.y = THREE.MathUtils.lerp(
        dragOffset.current.y,
        0,
        RETURN_SPEED,
      );
    }

    const time = timer.getElapsed();
    const idleX = Math.sin(time * IDLE_FREQ_X) * IDLE_AMP_X;
    const idleY = Math.sin(time * IDLE_FREQ_Y + 0.6) * IDLE_AMP_Y;
    const idleZ = Math.sin(time * IDLE_FREQ_Z + 1.2) * IDLE_AMP_Z;

    const poseYaw = POSES[effectivePoseIndex].yaw ?? 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      initialRotation[1] +
        mouseTarget.current.x +
        dragOffset.current.x +
        poseYaw +
        idleY,
      LERP_SPEED,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      initialRotation[0] + mouseTarget.current.y + dragOffset.current.y + idleX,
      LERP_SPEED,
    );

    const waveTarget = POSES[effectivePoseIndex].wave
      ? Math.sin(time * WAVE_SPEED) * WAVE_AMPLITUDE
      : 0;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      waveTarget + idleZ,
      LERP_SPEED,
    );
  });

  return (
    <group ref={groupRef} scale={2.1} position={[0, -0.5, 0]}>
      <group position={restCenteringOffset}>
        <primitive object={scene} />
      </group>
    </group>
  );
};

const createSmoothBalloonMaterial = (): THREE.MeshPhysicalMaterial => {
  const material = new THREE.MeshPhysicalMaterial({
    color: "#1e1e1e",
    roughness: 0.15,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    reflectivity: 0.7,
    envMapIntensity: 0.5,
    sheen: 0,
    sheenRoughness: 0.4,
    sheenColor: new THREE.Color("#1e1e1e"),
    flatShading: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vLocalNormal;
      varying vec3 vLocalPos;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <worldpos_vertex>",
      `#include <worldpos_vertex>
      vLocalNormal = normal;
      vLocalPos = position;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      varying vec3 vLocalNormal;
      varying vec3 vLocalPos;

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
      }`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "vec4 diffuseColor = vec4( diffuse, opacity );",
      `vec3 baseColor = diffuse;

      float wrinkleLarge = fbm(vLocalPos * 14.0);
      float wrinkleSmall = fbm(vLocalPos * 42.0 + 13.7);
      float wrinkle = mix(wrinkleLarge, wrinkleSmall, 0.35);

      float crease = smoothstep(0.38, 0.46, wrinkle) - smoothstep(0.46, 0.54, wrinkle);

      vec3 creaseColor = baseColor * 0.75;
      vec3 finalColor = mix(baseColor, creaseColor, crease * 0.7);

      finalColor *= (0.9 + wrinkleLarge * 0.2);

      vec4 diffuseColor = vec4(finalColor, opacity);`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "float roughnessFactor = roughness;",
      `float wrinkleLargeR = fbm(vLocalPos * 14.0);
      float wrinkleSmallR = fbm(vLocalPos * 42.0 + 13.7);
      float wrinkleR = mix(wrinkleLargeR, wrinkleSmallR, 0.35);
      float creaseR = smoothstep(0.38, 0.46, wrinkleR) - smoothstep(0.46, 0.54, wrinkleR);
      float roughnessFactor = roughness + creaseR * 0.2;`,
    );
  };

  return material;
};

interface Hand3DProps {
  /** Extra class merged onto the wrapper element that hosts the R3F Canvas. */
  className?: string;
}

const PARALLAX_FACTOR = 0.5;

export const Hand3D = ({ className }: Hand3DProps): React.ReactElement => {
  const smoothBalloonMaterial = useMemo(
    () => createSmoothBalloonMaterial(),
    [],
  );
  const { pose, setPose } = useHandPose();
  const poseIndex = Math.max(0, HAND_POSES.indexOf(pose));
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pose state lives above the page in HandPoseProvider, so a hover-driven
  // pose can survive navigation. Snap back to default on mount so the rendered
  // pose matches the bone state <Center> just measured.
  React.useEffect(() => {
    setPose("default");
  }, [setPose]);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    let rafId: number | null = null;
    const update = () => {
      const offset = window.scrollY * (1 - PARALLAX_FACTOR);
      wrapper.style.transform = `translate3d(0, ${offset}px, 0)`;
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    wrapper.style.transform = "translate3d(0, 0, 0)";
    rafId = requestAnimationFrame(update);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cx("wrapper", className)}>
      <div className={cx("canvasContainer")}>
        <Canvas
          camera={{ position: [0, 0, 12], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.08} color="#fff4e6" />
          <directionalLight
            position={[8, 2, 3]}
            intensity={0.35}
            color="#fff1d6"
          />
          <directionalLight
            position={[-6, 1, -2]}
            intensity={0.1}
            color="#d8e6f0"
          />
          <Suspense fallback={null}>
            <AnimatedHand
              material={smoothBalloonMaterial}
              initialRotation={[Math.PI / 18, 0, 0]}
              poseIndex={poseIndex}
            />
            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

useGLTF.preload(ANI_HAND_PATH);

export default Hand3D;
