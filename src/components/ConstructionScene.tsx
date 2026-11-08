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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
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
    rimLight.position.set(-4, 3.5, -2);
    scene.add(rimLight);
    const coolLight = new THREE.PointLight(0x9bb6c4, 12, 20, 2);
    coolLight.position.set(4, 2, 5);
    scene.add(coolLight);

    const concrete = new THREE.MeshStandardMaterial({ color: 0xb0b8b8, metalness: 0.42, roughness: 0.48 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x536166, metalness: 0.76, roughness: 0.3 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x9cb6c1, metalness: 0.68, roughness: 0.16, transparent: true, opacity: 0.64, transmission: 0.08 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xd66b38, emissive: 0xd66b38, emissiveIntensity: 1.9, metalness: 0.35, roughness: 0.28 });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xe2e6e3, transparent: true, opacity: 0.42 });
    const parts: Part[] = [];
    const edgeGeometries = new Map<string, THREE.EdgesGeometry>();

    const addPart = (geometry: THREE.BufferGeometry, material: THREE.Material, position: THREE.Vector3, scale: THREE.Vector3, delay: number, offset: THREE.Vector3, rotation = new THREE.Euler()) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position).add(offset);
      mesh.scale.copy(scale);
      mesh.rotation.copy(rotation);
      world.add(mesh);
      let edgeGeometry = edgeGeometries.get(geometry.uuid);
      if (!edgeGeometry) {
        edgeGeometry = new THREE.EdgesGeometry(geometry, 18);
        edgeGeometries.set(geometry.uuid, edgeGeometry);
      }
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      edges.position.copy(mesh.position);
      edges.scale.copy(scale);
      edges.rotation.copy(rotation);
      world.add(edges);
      parts.push({ mesh, edges, from: mesh.position.clone(), to: position.clone(), fromRotation: rotation.clone(), explodeOffset: offset.clone(), delay });
    };

    const slab = new THREE.BoxGeometry(5.1, 0.16, 4.7);
    const column = new THREE.BoxGeometry(0.16, 1, 0.16);
    const beam = new THREE.BoxGeometry(1, 0.13, 0.13);
    const panel = new THREE.BoxGeometry(1.18, 1.12, 0.09);
    const core = new THREE.BoxGeometry(1.12, 4.85, 1.08);

    addPart(slab, steel, new THREE.Vector3(0, -0.16, 0), new THREE.Vector3(1.12, 1, 1.08), 0.02, new THREE.Vector3(0, -2.5, 0), new THREE.Euler(0.08, 0.2, -0.08));
    addPart(core, concrete, new THREE.Vector3(-0.18, 2.24, -0.1), new THREE.Vector3(1, 1, 1), 0.12, new THREE.Vector3(0, 2.8, -0.8), new THREE.Euler(0.12, -0.22, 0.08));

    for (let floor = 0; floor < 4; floor += 1) {
      const y = floor * 1.46 + 0.12;
      const height = floor === 3 ? 0.72 : 1.42;
      addPart(slab, floor === 3 ? concrete : steel, new THREE.Vector3(0, y, 0), new THREE.Vector3(1, 1, 1), 0.18 + floor * 0.1, new THREE.Vector3(floor % 2 ? -3 : 3, 1.8 + floor * 0.4, floor % 2 ? 2.2 : -2.4), new THREE.Euler(0.1, floor % 2 ? -0.18 : 0.16, floor % 2 ? 0.06 : -0.06));
      [[-2.34, -2.12], [2.34, -2.12], [-2.34, 2.12], [2.34, 2.12]].forEach(([x, z], index) => {
        addPart(column, concrete, new THREE.Vector3(x, y + height / 2, z), new THREE.Vector3(1, height, 1), 0.32 + floor * 0.1 + index * 0.018, new THREE.Vector3((index % 2 ? 1 : -1) * 2.5, 0.9, (index < 2 ? -1 : 1) * 2.8));
      });
      [-1.55, 0, 1.55].forEach((x, index) => {
        addPart(beam, steel, new THREE.Vector3(x, y + height, -2.12), new THREE.Vector3(1.55, 1, 1), 0.4 + floor * 0.1 + index * 0.02, new THREE.Vector3((index - 1) * 2.2, 1.6, -2));
        if (floor < 3) addPart(panel, glass, new THREE.Vector3(x, y + 0.73, -2.24), new THREE.Vector3(1, 1, 1), 0.56 + floor * 0.09 + index * 0.025, new THREE.Vector3((index - 1) * 2.5, 0.4, -3.2), new THREE.Euler(0.08, 0, 0));
      });
    }

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 5.2, 0.035), orange);
    spine.position.set(2.52, 2.2, -2.15);
    world.add(spine);

    const datum = new THREE.Group();
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xb8c4c7, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    [3.8, 4.5, 5.2].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 4, 160), ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.34 + index * 0.012;
      datum.add(ring);
    });
    world.add(datum);

    const grid = new THREE.GridHelper(18, 36, 0x8b989d, 0x536066);
    grid.position.y = -0.36;
    (Array.isArray(grid.material) ? grid.material : [grid.material]).forEach((material) => {
      material.transparent = true;
      material.opacity = 0.17;
    });
    world.add(grid);

    const count = 144;
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = Math.random() * 7 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    basePositions.set(positions);
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xd68a5c, size: 0.026, transparent: true, opacity: 0.68, depthWrite: false, blending: THREE.AdditiveBlending }));
    world.add(dust);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const cameraHome = camera.position.clone();
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
      if (sceneState && nextSceneState !== currentSceneState) {
        sceneState.textContent = nextSceneState;
        currentSceneState = nextSceneState;
      }
      parts.forEach((part) => {
        const t = easeOut(THREE.MathUtils.clamp((eased - part.delay) / (1 - part.delay), 0, 1));
        basePosition.lerpVectors(part.from, part.to, t);
        part.mesh.position.copy(basePosition).addScaledVector(part.explodeOffset, explode * t);
        part.mesh.rotation.set(part.fromRotation.x * (1 - t), part.fromRotation.y * (1 - t), part.fromRotation.z * (1 - t));
        part.edges.position.copy(part.mesh.position);
        part.edges.rotation.copy(part.mesh.rotation);
      });
      edgeMaterial.opacity = 0.42 + scrollProgress * 0.3;
      edgeMaterial.color.lerpColors(edgeNeutral, edgeBlueprint, scrollProgress);
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      world.rotation.y = -0.24 + pointer.x + scrollProgress * 0.42 + Math.sin(elapsed * 0.18) * 0.035;
      world.rotation.x = pointer.y + scrollProgress * 0.08;
      world.position.y = Math.sin(elapsed * 0.36) * 0.055 + scrollProgress * 0.28;
      camera.position.lerpVectors(cameraHome, cameraEnd, scrollProgress);
      camera.lookAt(0, 2.05 + scrollProgress * 0.24, 0);
      dust.rotation.y = elapsed * 0.018;
      const attribute = dustGeometry.attributes.position as THREE.BufferAttribute;
      const array = attribute.array as Float32Array;
      for (let i = 0; i < count; i += 1) array[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(elapsed * 0.28 + seeds[i]) * 0.022;
      attribute.needsUpdate = true;
      renderer.render(scene, camera);
    };

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const animate = (now: number) => {
      if (document.hidden || !isHeroVisible()) { raf = 0; return; }
      if (!startedAt) startedAt = now;
      if (!lastFrame || now - lastFrame >= 1000 / 30) {
        render(now);
        lastFrame = now;
      }
      raf = requestAnimationFrame(animate);
    };
    const startLoop = () => {
      if (!reducedMotion && !document.hidden && !raf && isHeroVisible()) {
        lastFrame = 0;
        raf = requestAnimationFrame(animate);
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else {
        startLoop();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    onScroll();
    startLoop();

    if (reducedMotion) {
      startedAt = performance.now();
      render(startedAt);
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", onScroll);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      world.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      edgeGeometries.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="skol-construction-scene" ref={hostRef} aria-hidden="true">
      <div className="skol-scene-vignette" />
      <div className="skol-scene-scan" />
      <div className="skol-scene-label skol-scene-label-top"><span>SKOL / STRUCTURE STUDY</span><i /><span>01 — 04</span></div>
      <div className="skol-scene-label skol-scene-label-side"><span>FRAME SYSTEM</span><span>CONCRETE / STEEL / GLASS</span></div>
      <div className="skol-scene-reticle"><i /><i /><i /><i /></div>
      <div className="skol-scene-coordinate">SPATIAL MODEL <b>·</b> <span className="skol-scene-state">ASSEMBLED STRUCTURE</span></div>
    </div>
  );
};

export default ConstructionScene;
