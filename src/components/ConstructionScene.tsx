import { useEffect, useRef } from "react";
import * as THREE from "three";

type Part = {
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  from: THREE.Vector3;
  to: THREE.Vector3;
  fromRotation: THREE.Euler;
  explodeOffset: THREE.Vector3;
  delay: number;
};

const easeOut = (value: number) => 1 - Math.pow(1 - value, 4);

const ConstructionScene = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(max-width: 1280px)").matches) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sceneState = host.querySelector<HTMLElement>(".skol-scene-state");
    let currentSceneState = "";

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      host.classList.add("is-webgl-unavailable");
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(8.4, 6.1, 11.8);
    camera.lookAt(0, 2.05, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.className = "skol-construction-webgl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);
    scene.add(new THREE.HemisphereLight(0xc9d7df, 0x15191c, 1.9));
    const keyLight = new THREE.DirectionalLight(0xffe2c6, 4.2);
    keyLight.position.set(5, 9, 7);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xd66b38, 18, 18, 2);
    rimLight.position.set(-4, 3.5, -...[truncated]    const cameraHome = camera.position.clone();
    const cameraEnd = new THREE.Vector3(6.7, 5.2, 10.4);
    let scrollProgress = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const bounds = host.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.34;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.18;
    };
    const resetPointer = () => { pointer.targetX = 0; pointer.targetY = 0; };
    const onScroll = () => {
      if (reducedMotion) return;
      const bounds = host.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
      if (!startedAt) startedAt = performance.now();
      if (!document.hidden && isHeroVisible()) render(performance.now());
      startLoop();
    };
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", resetPointer);

    let raf = 0;
    let startedAt = 0;
    let lastFrame = 0;
    const visibilityTarget = host.closest(".skol-cinematic-hero") ?? host;
    const isHeroVisible = () => {
      const bounds = visibilityTarget.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < window.innerHeight;
    };
    const basePosition = new THREE.Vector3();
    const edgeNeutral = new THREE.Color(0xe2e6e3);
    const edgeBlueprint = new THREE.Color(0x9bb6c4);

    const render = (now: number) => {
      const elapsed = reducedMotion ? 0 : (now - startedAt) / 1000;
      const progress = reducedMotion ? 1 : THREE.MathUtils.clamp((elapsed - 0.12) / 2.6, 0, 1);
      const eased = easeOut(progress);
      const explode = easeOut(THREE.MathUtils.clamp((scrollProgress - 0.08) / 0.5, 0, 1)) * 0.72;
      const nextSceneState = scrollProgress < 0.12 ? "ASSEMBLED STRUCTURE" : scrollProgress < 0.52 ? "EXPLODED VIEW" : "BLUEPRINT STUDY";
      if (s...[truncated]