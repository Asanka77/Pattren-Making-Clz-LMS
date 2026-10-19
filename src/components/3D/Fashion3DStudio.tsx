import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  RotateCw, 
  Compass, 
  Layers, 
  Ruler, 
  Wind, 
  Eye, 
  Palette, 
  Maximize2, 
  Minimize2,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

// Fabric material presets
interface FabricPreset {
  id: string;
  nameEn: string;
  nameSi: string;
  color: number;
  sheenColor: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  patternType: 'brocade' | 'velvet' | 'silk' | 'geometric' | 'linen';
  descriptionEn: string;
  descriptionSi: string;
}

const FABRIC_PRESETS: FabricPreset[] = [
  {
    id: 'ceylon-gold-brocade',
    nameEn: 'Royal Ceylon Gold Brocade',
    nameSi: 'රාජකීය රන් සාරි බ්‍රෝකේඩ්',
    color: 0x8a1020, // Crimson red base with gold zari
    sheenColor: 0xdfb56c,
    roughness: 0.35,
    metalness: 0.45,
    clearcoat: 0.6,
    patternType: 'brocade',
    descriptionEn: 'Heritage Sri Lankan metallic zari jacquard with radiant micro-threaded luster.',
    descriptionSi: 'ශ්‍රී ලාංකීය සාම්ප්‍රදායික රන් නූල් විවීම සහ උසස් මැහුම් තාක්ෂණය.',
  },
  {
    id: 'sapphire-velvet',
    nameEn: 'Midnight Sapphire Velvet',
    nameSi: 'මිඩ්නයිට් නිල් වෙල්වට්',
    color: 0x0c2340,
    sheenColor: 0x4182d0,
    roughness: 0.6,
    metalness: 0.15,
    clearcoat: 0.2,
    patternType: 'velvet',
    descriptionEn: 'Deep plush velvet with luminous directional nap and soft atmospheric sheen.',
    descriptionSi: 'මෘදු වෙල්වට් පදාර්ථය සහ සුඛෝපභෝගී සන්ධ්‍යා ඇඳුම් නිමාව.',
  },
  {
    id: 'ai-emerald-parametric',
    nameEn: 'Parametric AI Emerald Silk',
    nameSi: 'AI තාක්ෂණික මරකත සිල්ක්',
    color: 0x0f422b,
    sheenColor: 0x5cdbb5,
    roughness: 0.25,
    metalness: 0.5,
    clearcoat: 0.8,
    patternType: 'geometric',
    descriptionEn: 'Algorithmic geometric pleating designed with generative fashion workflows.',
    descriptionSi: 'AI පරිගණක තාක්ෂණයෙන් ජනනය කළ නවීන ජ්‍යාමිතික මෝස්තර රටා.',
  },
  {
    id: 'raw-silk-ivory',
    nameEn: 'Atelier Raw Silk Ivory',
    nameSi: 'සුදු රෝ සිල්ක් ඇටලියර්',
    color: 0xede4d3,
    sheenColor: 0xffffff,
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3,
    patternType: 'linen',
    descriptionEn: 'Organic pure mulberry silk weave with tactile slub and breathable structure.',
    descriptionSi: 'ස්වාභාවික මල්බරි සිල්ක් නූල් සහ අතින් නිමවන ලද couture වයනය.',
  },
];

// Interactive 3D Hotspots on the garment
interface GarmentHotspot {
  id: string;
  nameEn: string;
  nameSi: string;
  position: [number, number, number];
  titleEn: string;
  titleSi: string;
  detailEn: string;
  detailSi: string;
  moduleRef: string;
}

const GARMENT_HOTSPOTS: GarmentHotspot[] = [
  {
    id: 'neckline',
    nameEn: 'Dart & Contour Bodice',
    nameSi: 'ඩාර්ට් සහ ශරීර හැඩගැස්ම',
    position: [0, 1.45, 0.42],
    titleEn: 'Haute Couture French Darting',
    titleSi: 'ප්‍රංශ ඩාර්ට් තාක්ෂණය',
    detailEn: 'Contour waist shaping engineered for precise anatomical curvature without puckering.',
    detailSi: 'ශරීරයේ ස්වභාවික හැඩයට 100% ක් ගැලපෙන අයුරින් ඩාර්ට් හැසිරවීම (Modules 01-08).',
    moduleRef: 'Module 04: Bodice Draping',
  },
  {
    id: 'waist',
    nameEn: 'Anatomical Waist Cincher',
    nameSi: 'අනුපාතික ඉණ සැකසුම',
    position: [0.35, 0.9, 0.25],
    titleEn: 'Seamless Silhouette Waistline',
    titleSi: 'නිවැරදි ඉණ වට පරිධිය',
    detailEn: 'Reinforced waist stay keeping tension balanced across flowing drape panels.',
    detailSi: 'ඇඳුමේ බර සමබරව රඳවන සහ ඉණේ හැඩය මතුකරන ව්‍යුහගත පටි තාක්ෂණය (Module 09).',
    moduleRef: 'Module 09: Waist & Skirt',
  },
  {
    id: 'drape',
    nameEn: 'Bias-Cut Cascading Flare',
    nameSi: 'බායස් කැපුම් රැලි රටා',
    position: [-0.48, 0.15, 0.5],
    titleEn: '45-Degree True Bias Flow',
    titleSi: 'අංශක 45 බායස් රෙදි හැඩගැස්ම',
    detailEn: 'Diagonal grain draping creating fluid movement that responds organically to steps.',
    detailSi: 'රෙදි කෙඳි අංශක 45 කෝණයට කපා ඇඟ වැටෙන සුමට රැලි සහ ගලායන නිමාව (Modules 14-18).',
    moduleRef: 'Module 16: Bias Cut Draping',
  },
  {
    id: 'hem',
    nameEn: 'Sculpted Horsehair Hemline',
    nameSi: 'අලංකාර පහළ වාටිය (Couture Hem)',
    position: [0.55, -0.9, 0.6],
    titleEn: 'Architectural Flare Hem',
    titleSi: 'ගෘහනිර්මාණාත්මක වාටි නිමාව',
    detailEn: 'Structured hem facing providing dramatic volume without heavy understructures.',
    detailSi: 'රෙදි පතුල රවුමට ලස්සනට පිම්බී සිටින අයුරින් හොර්ස්හෙයාර් වාටි මැසීමේ කලාව (Module 22).',
    moduleRef: 'Module 22: Haute Couture Finishing',
  },
];

export const Fashion3DStudio: React.FC = () => {
  const { isSinhalaMode } = useLanguage();
  const { isLightMode } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [selectedFabric, setSelectedFabric] = useState<FabricPreset>(FABRIC_PRESETS[0]);
  const [viewMode, setViewMode] = useState<'couture' | 'wireframe' | 'measurements'>('couture');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isBreezeActive, setIsBreezeActive] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<GarmentHotspot | null>(null);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'runway' | 'golden'>('studio');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const garmentMeshRef = useRef<THREE.Mesh | null>(null);
  const dressMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const measurementsGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Interaction State
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetCameraDistanceRef = useRef<number>(4.2);

  // Generate procedural fabric texture
  const createFabricTexture = (type: FabricPreset['patternType'], colorHex: number): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base background
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 512, 512);

    if (type === 'brocade') {
      // Golden luxury ornate lattice
      ctx.strokeStyle = '#dfb56c';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.45;
      const size = 32;
      for (let x = 0; x < 512; x += size) {
        for (let y = 0; y < 512; y += size) {
          ctx.beginPath();
          ctx.moveTo(x + size / 2, y);
          ctx.lineTo(x + size, y + size / 2);
          ctx.lineTo(x + size / 2, y + size);
          ctx.lineTo(x, y + size / 2);
          ctx.closePath();
          ctx.stroke();

          // Tiny center floral sparkle
          ctx.fillStyle = '#f7e2a9';
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (type === 'geometric') {
      // Futuristic AI faceted polygon lattice
      ctx.strokeStyle = '#5cdbb5';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.4;
      const step = 48;
      for (let x = 0; x < 512; x += step) {
        for (let y = 0; y < 512; y += step) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + step, y + step / 2);
          ctx.lineTo(x, y + step);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + step, y);
          ctx.lineTo(x, y + step / 2);
          ctx.lineTo(x + step, y + step);
          ctx.stroke();
        }
      }
    } else if (type === 'linen') {
      // Micro slub yarn texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const len = 3 + Math.random() * 8;
        ctx.fillRect(x, y, len, 1);
      }
    } else if (type === 'velvet') {
      // Velvet grain
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  // Build Procedural 3D Garment Geometry with realistic pleats & drape
  const createCoutureGarmentGeometry = () => {
    // Sculpted cascading evening gown geometry
    const radialSegments = 48;
    const heightSegments = 64;
    const geometry = new THREE.CylinderGeometry(0.38, 1.35, 2.6, radialSegments, heightSegments, true);
    
    // Deform vertices to simulate sculpted bodice, waist cinch, and natural flared pleats
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      let x = pos.getX(i);
      let z = pos.getZ(i);

      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);

      // Height ranges from -1.3 (hem) to +1.3 (bust line)
      if (y > 0.4) {
        // Bodice & bust contour
        const bustProtrusion = Math.cos(angle) * 0.06;
        const cinch = 1.0 - Math.sin((y - 0.4) * Math.PI) * 0.08;
        x = Math.cos(angle) * (radius * cinch + Math.max(0, bustProtrusion));
        z = Math.sin(angle) * (radius * cinch * 0.95);
      } else if (y >= -0.2 && y <= 0.4) {
        // Waistline cincher
        const waistCinch = 0.82 + ((y + 0.2) / 0.6) * 0.12;
        x = Math.cos(angle) * radius * waistCinch;
        z = Math.sin(angle) * radius * waistCinch;
      } else {
        // Flared skirt with cascading organic pleats and train
        const depthFactor = ((-y - 0.2) / 1.1); // 0 at waist, 1 at hem
        // 8 deep couture pleats
        const pleatRipple = Math.sin(angle * 7) * (0.09 * depthFactor);
        const biasWave = Math.sin(angle * 3 + y * 2) * (0.05 * depthFactor);
        
        // Elongated back train
        const trainExtension = z < 0 ? Math.abs(z) * 0.35 * depthFactor : 0;

        const newRadius = radius + pleatRipple + biasWave;
        x = Math.cos(angle) * newRadius;
        z = Math.sin(angle) * newRadius - trainExtension;
      }

      pos.setXYZ(i, x, y, z);
    }

    geometry.computeVertexNormals();
    return geometry;
  };

  // Build Mannequin Structure (stand, base, neck, shoulders)
  const buildMannequinStand = () => {
    const group = new THREE.Group();

    // Materials
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb56c,
      metalness: 0.85,
      roughness: 0.25,
    });

    const walnutMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1412,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Circular base with gold bevel
    const baseGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.08, 36);
    const baseMesh = new THREE.Mesh(baseGeo, walnutMaterial);
    baseMesh.position.y = -1.95;
    group.add(baseMesh);

    const baseRingGeo = new THREE.TorusGeometry(0.68, 0.02, 16, 48);
    const baseRingMesh = new THREE.Mesh(baseRingGeo, brassMaterial);
    baseRingMesh.rotation.x = Math.PI / 2;
    baseRingMesh.position.y = -1.95;
    group.add(baseRingMesh);

    // Central brass upright pole
    const poleGeo = new THREE.CylinderGeometry(0.035, 0.035, 3.8, 24);
    const poleMesh = new THREE.Mesh(poleGeo, brassMaterial);
    poleMesh.position.y = 0.0;
    group.add(poleMesh);

    // Neck block and finial
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 32);
    const neckMesh = new THREE.Mesh(neckGeo, walnutMaterial);
    neckMesh.position.y = 1.62;
    group.add(neckMesh);

    const finialGeo = new THREE.SphereGeometry(0.1, 24, 24);
    const finialMesh = new THREE.Mesh(finialGeo, brassMaterial);
    finialMesh.position.y = 1.84;
    group.add(finialMesh);

    // Shoulder caps
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), brassMaterial);
    shoulderL.position.set(-0.46, 1.42, 0);
    shoulderL.scale.set(1, 0.6, 0.8);
    group.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), brassMaterial);
    shoulderR.position.set(0.46, 1.42, 0);
    shoulderR.scale.set(1, 0.6, 0.8);
    group.add(shoulderR);

    return group;
  };

  // Build Measurement Overlay Rings
  const buildMeasurementGuides = () => {
    const group = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0xdfb56c, transparent: true, opacity: 0.85 });

    // Bust line ring (Y = 1.35)
    const bustRing = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 0.44, 0.40, 0, 2 * Math.PI, false, 0).getPoints(64).map(p => new THREE.Vector3(p.x, 1.35, p.y))
    ), lineMat);
    group.add(bustRing);

    // Waist line ring (Y = 0.85)
    const waistRing = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 0.35, 0.33, 0, 2 * Math.PI, false, 0).getPoints(64).map(p => new THREE.Vector3(p.x, 0.85, p.y))
    ), lineMat);
    group.add(waistRing);

    // Hip line ring (Y = 0.25)
    const hipRing = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 0.52, 0.48, 0, 2 * Math.PI, false, 0).getPoints(64).map(p => new THREE.Vector3(p.x, 0.25, p.y))
    ), lineMat);
    group.add(hipRing);

    return group;
  };

  // Update Three.js lighting presets
  const updateLights = (preset: 'studio' | 'runway' | 'golden') => {
    if (!lightsGroupRef.current) return;
    const group = lightsGroupRef.current;
    
    // Remove old lights
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (preset === 'studio') {
      // Balanced 3-point luxury atelier lighting
      const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
      keyLight.position.set(3, 4, 4);
      group.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xedd3c2, 0.9);
      fillLight.position.set(-4, 2, 2);
      group.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xdfb56c, 2.2);
      rimLight.position.set(0, 4, -4);
      group.add(rimLight);

      const ambient = new THREE.AmbientLight(0x231d1f, 1.0);
      group.add(ambient);
    } else if (preset === 'runway') {
      // Dramatic high-contrast spotlight
      const spot = new THREE.SpotLight(0xffffff, 3.5, 12, Math.PI / 4, 0.4, 1);
      spot.position.set(0, 6, 2.5);
      group.add(spot);

      const rimGold = new THREE.DirectionalLight(0xdfb56c, 2.8);
      rimGold.position.set(-2, 3, -3);
      group.add(rimGold);

      const ambient = new THREE.AmbientLight(0x0f0b0d, 0.5);
      group.add(ambient);
    } else {
      // Golden Hour Ceylon Sun
      const sun = new THREE.DirectionalLight(0xf5a242, 2.6);
      sun.position.set(4, 2.5, 3);
      group.add(sun);

      const sky = new THREE.DirectionalLight(0xdfb56c, 1.2);
      sky.position.set(-3, 3, -2);
      group.add(sky);

      const ambient = new THREE.AmbientLight(0x2d1712, 1.2);
      group.add(ambient);
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, targetCameraDistanceRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    // Lights group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;
    updateLights(lightingPreset);

    // Mannequin Group
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // Add wooden/brass stand
    const stand = buildMannequinStand();
    mannequinGroup.add(stand);

    // Garment Material
    const initialTexture = createFabricTexture(selectedFabric.patternType, selectedFabric.color);
    const dressMat = new THREE.MeshPhysicalMaterial({
      color: selectedFabric.color,
      roughness: selectedFabric.roughness,
      metalness: selectedFabric.metalness,
      clearcoat: selectedFabric.clearcoat,
      clearcoatRoughness: 0.15,
      sheen: 0.8,
      sheenColor: selectedFabric.sheenColor,
      sheenRoughness: 0.4,
      map: initialTexture,
      side: THREE.DoubleSide,
    });
    dressMaterialRef.current = dressMat;

    // Garment Mesh
    const dressGeo = createCoutureGarmentGeometry();
    const dressMesh = new THREE.Mesh(dressGeo, dressMat);
    dressMesh.position.y = 0.2;
    mannequinGroup.add(dressMesh);
    garmentMeshRef.current = dressMesh;

    // Measurements overlay
    const measurements = buildMeasurementGuides();
    measurements.position.y = 0.2;
    measurements.visible = viewMode === 'measurements';
    mannequinGroup.add(measurements);
    measurementsGroupRef.current = measurements;

    // Shadow Floor Disc
    const floorGeo = new THREE.CircleGeometry(1.6, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0x050405,
      transparent: true,
      opacity: 0.65,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.98;
    scene.add(floorMesh);

    // Animation Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (autoRotate && !isDraggingRef.current && mannequinGroupRef.current) {
        mannequinGroupRef.current.rotation.y += 0.006;
      }

      // Inertia damping after manual drag
      if (!isDraggingRef.current && mannequinGroupRef.current) {
        mannequinGroupRef.current.rotation.y += rotationVelocityRef.current.x;
        rotationVelocityRef.current.x *= 0.92;
        rotationVelocityRef.current.y *= 0.92;
      }

      // Gentle breeze cloth breathing simulation
      if (isBreezeActive && dressMesh && dressMesh.geometry) {
        const pos = dressMesh.geometry.attributes.position;
        // Subtle sway
        dressMesh.rotation.z = Math.sin(elapsedTime * 1.4) * 0.015;
      }

      // Smooth camera zoom lerp
      if (cameraRef.current) {
        cameraRef.current.position.z += (targetCameraDistanceRef.current - cameraRef.current.position.z) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
    };
  }, []);

  // Update material on fabric preset change
  useEffect(() => {
    if (!dressMaterialRef.current) return;
    const mat = dressMaterialRef.current;
    mat.color.setHex(selectedFabric.color);
    mat.sheenColor.setHex(selectedFabric.sheenColor);
    mat.roughness = selectedFabric.roughness;
    mat.metalness = selectedFabric.metalness;
    mat.clearcoat = selectedFabric.clearcoat;

    // Generate new texture
    const newTex = createFabricTexture(selectedFabric.patternType, selectedFabric.color);
    mat.map = newTex;
    mat.needsUpdate = true;
  }, [selectedFabric]);

  // Update view mode (Wireframe vs Realistic vs Measurements)
  useEffect(() => {
    if (!dressMaterialRef.current || !measurementsGroupRef.current) return;
    
    if (viewMode === 'wireframe') {
      dressMaterialRef.current.wireframe = true;
      measurementsGroupRef.current.visible = false;
    } else if (viewMode === 'measurements') {
      dressMaterialRef.current.wireframe = false;
      measurementsGroupRef.current.visible = true;
    } else {
      dressMaterialRef.current.wireframe = false;
      measurementsGroupRef.current.visible = false;
    }
    dressMaterialRef.current.needsUpdate = true;
  }, [viewMode]);

  // Update lighting
  useEffect(() => {
    updateLights(lightingPreset);
  }, [lightingPreset]);

  // Mouse & Touch Orbit Controls (Interacting strictly in canvas, never leaving or linking out)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !mannequinGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    mannequinGroupRef.current.rotation.y += deltaX * 0.008;
    rotationVelocityRef.current = { x: deltaX * 0.002, y: deltaY * 0.002 };

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    targetCameraDistanceRef.current = Math.min(
      Math.max(targetCameraDistanceRef.current + e.deltaY * 0.003, 2.5),
      5.5
    );
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !mannequinGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    mannequinGroupRef.current.rotation.y += deltaX * 0.01;
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const resetCamera = () => {
    targetCameraDistanceRef.current = 4.2;
    if (mannequinGroupRef.current) {
      mannequinGroupRef.current.rotation.y = 0;
      mannequinGroupRef.current.rotation.x = 0;
    }
  };

  return (
    <section 
      id="3d-studio" 
      className={`py-24 relative overflow-hidden transition-colors duration-300 ${
        isLightMode ? 'bg-[#f5f2eb] text-[#1a1716]' : 'bg-[#0a0708] text-[#f4efe6]'
      }`}
    >
      {/* Ambient background aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#540d18]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#dfb56c]/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#540d18] border border-[#dfb56c]/40 text-[#f7e2a9] text-[11px] font-mono uppercase tracking-[0.22em] mb-4 shadow-lg shadow-[#540d18]/25" data-bg="dark">
            <Sparkles className="w-3.5 h-3.5 text-[#dfb56c] animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {isSinhalaMode ? '3D ඩිජිටල් විලාසිතා අත්දැකීම • DIGITAL ATELIER' : '3D DIGITAL ATELIER • INTERACTIVE HAUTE COUTURE'}
            </span>
          </div>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold font-editorial tracking-tight ${
            isLightMode ? 'text-[#171413]' : 'text-[#f7f3eb]'
          }`}>
            {isSinhalaMode ? 'සජීවී 3D විලාසිතා සහ පැටර්න් ආකෘතිය' : 'REAL-TIME 3D COUTURE & PATTERN STUDIO'}
          </h2>

          <p className={`mt-4 text-sm sm:text-base max-w-2xl mx-auto font-sinhala leading-relaxed ${
            isLightMode ? 'text-[#594f47]' : 'text-[#b8afa2]'
          }`}>
            {isSinhalaMode
              ? 'අංශක 360ක් කැරකැවිය හැකි අපගේ 3D Digital Mannequin ආකෘතිය හරහා රෙදි හැඩගැස්ම (Draping), ඩාර්ට්ස්, බායස් කට් සහ මැහුම් මිණුම් සජීවීව පරීක්ෂා කරන්න.'
              : 'Interact with our real-time 3D haute couture mannequin. Rotate 360°, inspect anatomical pattern grainlines, toggle luxury fabric physics, and examine professional darts.'}
          </p>

          <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-[#c99a45] to-transparent mx-auto mt-6" />
        </div>

        {/* Main 3D Studio Workspace */}
        <div className={`relative rounded-sm border overflow-hidden shadow-2xl transition-all duration-300 ${
          isLightMode 
            ? 'bg-[#ffffff] border-[#c99a45]/40 shadow-[#c99a45]/10' 
            : 'bg-[#120d0f] border-[#c99a45]/30 shadow-black/80'
        } ${isFullscreen ? 'fixed inset-4 z-50 rounded-md border-[#dfb56c]' : ''}`}>

          {/* Top Atelier HUD Bar */}
          <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-4 select-none ${
            isLightMode ? 'bg-[#f7f4ee] border-[#e2d8c3]' : 'bg-[#181113] border-white/10'
          }`}>
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded bg-black/40 border border-[#c99a45]/30 backdrop-blur-sm" data-bg="dark">
              <button
                onClick={() => setViewMode('couture')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'couture'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold shadow-md'
                    : 'text-[#d5cfc4] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'Couture රෙදි' : 'Couture Render'}</span>
              </button>

              <button
                onClick={() => setViewMode('wireframe')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'wireframe'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold shadow-md'
                    : 'text-[#d5cfc4] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'පැටර්න් දැල (Wireframe)' : 'Pattern Mesh'}</span>
              </button>

              <button
                onClick={() => setViewMode('measurements')}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'measurements'
                    ? 'bg-gradient-to-r from-[#dfb56c] to-[#c99a45] text-black font-bold shadow-md'
                    : 'text-[#d5cfc4] hover:text-white'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{isSinhalaMode ? 'මිණුම් රේඛා' : 'Anatomy HUD'}</span>
              </button>
            </div>

            {/* Quick Interactive Toggles */}
            <div className="flex items-center gap-2">
              {/* Auto Turntable Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                  autoRotate
                    ? 'bg-[#540d18] text-[#f7e2a9] border-[#dfb56c]/50'
                    : 'bg-black/40 text-[#a89f91] border-white/10 hover:text-white'
                }`}
                title="Toggle 360° Turntable Rotation"
                data-bg={autoRotate ? "dark" : undefined}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
                <span className="hidden sm:inline">{autoRotate ? '360° SPIN ON' : 'SPIN PAUSED'}</span>
              </button>

              {/* Breeze Dynamic Cloth Toggle */}
              <button
                onClick={() => setIsBreezeActive(!isBreezeActive)}
                className={`px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                  isBreezeActive
                    ? 'bg-[#1e342a] text-[#7ee3b8] border-[#7ee3b8]/40'
                    : 'bg-black/40 text-[#a89f91] border-white/10 hover:text-white'
                }`}
                title="Toggle Cloth Sway Dynamic Simulation"
                data-bg={isBreezeActive ? "dark" : undefined}
              >
                <Wind className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBreezeActive ? 'BREEZE ON' : 'STILL'}</span>
              </button>

              {/* Reset Camera */}
              <button
                onClick={resetCamera}
                className="p-1.5 rounded bg-black/40 text-[#dfb56c] border border-white/10 hover:border-[#dfb56c] transition-colors cursor-pointer"
                title="Reset Camera View"
                data-bg="dark"
              >
                <Compass className="w-4 h-4" />
              </button>

              {/* Fullscreen Expand */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded bg-black/40 text-[#dfb56c] border border-white/10 hover:border-[#dfb56c] transition-colors cursor-pointer"
                title="Toggle Fullscreen 3D Atelier"
                data-bg="dark"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Central 3D Interactive Viewport */}
          <div 
            ref={containerRef} 
            className="relative w-full h-[520px] sm:h-[620px] bg-gradient-to-b from-[#0c090a] via-[#140e10] to-[#0a0708] overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Interaction Hint Overlay */}
            <div className="absolute top-4 left-4 pointer-events-none bg-black/75 backdrop-blur-md px-3 py-1.5 rounded border border-[#dfb56c]/30 text-[11px] font-mono text-[#f7e2a9] flex items-center gap-2 shadow-lg" data-bg="dark">
              <RotateCw className="w-3.5 h-3.5 text-[#dfb56c]" />
              <span>{isSinhalaMode ? 'Drag කර අංශක 360ක් කරකවන්න • Scroll to Zoom' : 'Drag to Rotate 360° • Scroll to Zoom'}</span>
            </div>

            {/* Interactive Hotspot Buttons on Canvas */}
            <div className="absolute inset-0 pointer-events-none">
              {GARMENT_HOTSPOTS.map((hotspot) => (
                <div
                  key={hotspot.id}
                  style={{
                    left: `${50 + hotspot.position[0] * 32}%`,
                    top: `${48 - hotspot.position[1] * 20}%`,
                  }}
                  className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHotspot(hotspot);
                    }}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                      selectedHotspot?.id === hotspot.id
                        ? 'bg-[#dfb56c] text-black scale-125 ring-4 ring-[#dfb56c]/40'
                        : 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] hover:scale-115'
                    }`}
                    title={isSinhalaMode ? hotspot.nameSi : hotspot.nameEn}
                    data-bg="dark"
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-ping absolute" />
                    <span className="text-[10px] font-bold font-mono">✦</span>
                  </button>

                  {/* Hotspot Floating Label */}
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#dfb56c]/40 text-[10px] font-mono text-[#f7e2a9] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl" data-bg="dark">
                    {isSinhalaMode ? hotspot.nameSi : hotspot.nameEn}
                  </div>
                </div>
              ))}
            </div>

            {/* Measurement HUD Badges when Measurements mode is active */}
            {viewMode === 'measurements' && (
              <div className="absolute right-4 top-4 bg-black/85 backdrop-blur-md p-4 rounded border border-[#dfb56c]/50 text-xs font-mono text-[#f7f3eb] space-y-2.5 shadow-2xl max-w-xs animate-in fade-in" data-bg="dark">
                <div className="flex items-center gap-2 pb-2 border-b border-white/20 text-[#dfb56c] font-bold">
                  <Ruler className="w-4 h-4" />
                  <span>{isSinhalaMode ? 'ව්‍යුහගත ශරීර මිණුම් (ANATOMICAL HUD)' : 'ANATOMICAL SPECIFICATIONS'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#a89f91]">Bust Landmark:</span>
                  <span className="text-[#f7e2a9] font-bold">34.0" (86.4 cm)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#a89f91]">Natural Waist:</span>
                  <span className="text-[#f7e2a9] font-bold">26.0" (66.0 cm)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#a89f91]">Full Hip Contour:</span>
                  <span className="text-[#f7e2a9] font-bold">36.5" (92.7 cm)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#a89f91]">Nape to Hem:</span>
                  <span className="text-[#f7e2a9] font-bold">58.0" (147.3 cm)</span>
                </div>
                <div className="pt-2 border-t border-white/10 text-[10px] text-[#dfb56c]/90">
                  {isSinhalaMode ? '✦ මොඩියුල 01: ශරීර මිණුම් ලබාගැනීමේ ප්‍රමිතිය' : '✦ Module 01 Standardized Landmarks'}
                </div>
              </div>
            )}

            {/* Selected Hotspot Deep Detail Card */}
            {selectedHotspot && (
              <div className="absolute left-4 bottom-4 max-w-sm bg-[#181113]/95 backdrop-blur-md p-5 rounded border border-[#dfb56c] shadow-2xl text-left animate-in slide-in-from-bottom-4 duration-200" data-bg="dark">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c]/30">
                    {selectedHotspot.moduleRef}
                  </span>
                  <button
                    onClick={() => setSelectedHotspot(null)}
                    className="text-[#a89f91] hover:text-white text-xs cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>

                <h4 className="text-base font-editorial font-bold text-[#f7e2a9] leading-snug">
                  {isSinhalaMode ? selectedHotspot.titleSi : selectedHotspot.titleEn}
                </h4>

                <p className="mt-2 text-xs text-[#d5cfc4] leading-relaxed font-sinhala">
                  {isSinhalaMode ? selectedHotspot.detailSi : selectedHotspot.detailEn}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
                  <span className="text-[#dfb56c] font-mono flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    {isSinhalaMode ? 'ප්‍රායෝගිකව උගන්වනු ලැබේ' : 'Hands-On Masterclass'}
                  </span>
                  <a
                    href="#register"
                    className="text-[#f7e2a9] hover:underline font-bold"
                  >
                    {isSinhalaMode ? 'ලියාපදිංචිය →' : 'Enroll Now →'}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Atelier Control Panel: Fabrics & Lighting Presets */}
          <div className={`p-4 sm:p-6 border-t ${
            isLightMode ? 'bg-[#f7f4ee] border-[#e2d8c3]' : 'bg-[#150f11] border-white/10'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Fabric Texture Selectors */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-[#dfb56c]" />
                  <span className={`text-xs font-mono uppercase tracking-wider font-bold ${
                    isLightMode ? 'text-[#171413]' : 'text-[#f7e2a9]'
                  }`}>
                    {isSinhalaMode ? 'සුඛෝපභෝගී රෙදි සහ වයන තෝරන්න (HAUTE COUTURE FABRIC PALETTE)' : 'SELECT HAUTE COUTURE FABRIC & WEAVE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {FABRIC_PRESETS.map((fabric) => {
                    const isSelected = selectedFabric.id === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric)}
                        className={`p-3 rounded border text-left transition-all duration-200 cursor-pointer group ${
                          isSelected
                            ? 'bg-[#540d18] border-[#dfb56c] shadow-lg shadow-[#540d18]/40 scale-[1.02]'
                            : isLightMode
                            ? 'bg-white border-[#e0d6c0] hover:border-[#dfb56c]'
                            : 'bg-[#1c1416] border-white/10 hover:border-[#dfb56c]/50'
                        }`}
                        data-bg={isSelected ? "dark" : undefined}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-white/40 shrink-0 shadow-sm"
                            style={{ backgroundColor: `#${fabric.color.toString(16).padStart(6, '0')}` }}
                          />
                          <span className={`text-xs font-bold truncate ${
                            isSelected
                              ? 'text-[#f7e2a9]'
                              : isLightMode
                              ? 'text-[#171413]'
                              : 'text-[#f7f3eb]'
                          }`}>
                            {isSinhalaMode ? fabric.nameSi : fabric.nameEn}
                          </span>
                        </div>
                        <p className={`text-[10px] line-clamp-1 font-mono ${
                          isSelected
                            ? 'text-[#f7e2a9]/90'
                            : isLightMode
                            ? 'text-[#594f47]'
                            : 'text-[#a89f91]'
                        }`}>
                          {isSinhalaMode ? fabric.descriptionSi : fabric.descriptionEn}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lighting Environment Preset */}
              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 border-white/10">
                <span className={`text-xs font-mono uppercase tracking-wider font-bold block mb-3 ${
                  isLightMode ? 'text-[#171413]' : 'text-[#f7e2a9]'
                }`}>
                  {isSinhalaMode ? 'ස්ටූඩියෝ ආලෝකකරණය (LIGHTING)' : 'STUDIO LIGHTING SETUP'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightingPreset('studio')}
                    className={`flex-1 py-2 px-2.5 rounded text-xs font-mono transition-all cursor-pointer ${
                      lightingPreset === 'studio'
                        ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold'
                        : isLightMode
                        ? 'bg-white text-[#594f47] border border-[#e0d6c0] hover:text-black'
                        : 'bg-[#1c1416] text-[#a89f91] border border-white/10 hover:text-white'
                    }`}
                    data-bg={lightingPreset === 'studio' ? "dark" : undefined}
                  >
                    Atelier
                  </button>

                  <button
                    onClick={() => setLightingPreset('runway')}
                    className={`flex-1 py-2 px-2.5 rounded text-xs font-mono transition-all cursor-pointer ${
                      lightingPreset === 'runway'
                        ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold'
                        : isLightMode
                        ? 'bg-white text-[#594f47] border border-[#e0d6c0] hover:text-black'
                        : 'bg-[#1c1416] text-[#a89f91] border border-white/10 hover:text-white'
                    }`}
                    data-bg={lightingPreset === 'runway' ? "dark" : undefined}
                  >
                    Runway Spot
                  </button>

                  <button
                    onClick={() => setLightingPreset('golden')}
                    className={`flex-1 py-2 px-2.5 rounded text-xs font-mono transition-all cursor-pointer ${
                      lightingPreset === 'golden'
                        ? 'bg-[#540d18] text-[#f7e2a9] border border-[#dfb56c] font-bold'
                        : isLightMode
                        ? 'bg-white text-[#594f47] border border-[#e0d6c0] hover:text-black'
                        : 'bg-[#1c1416] text-[#a89f91] border border-white/10 hover:text-white'
                    }`}
                    data-bg={lightingPreset === 'golden' ? "dark" : undefined}
                  >
                    Ceylon Gold
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
