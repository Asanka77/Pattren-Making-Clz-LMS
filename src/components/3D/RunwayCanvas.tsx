import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface RunwayCanvasProps {
  mode?: 'intro' | 'hero' | 'showcase';
  dressColor?: string;
  accentColor?: string;
  fabricType?: string;
  metallic?: number;
  roughness?: number;
  modelUrl?: string;
  textureUrl?: string;
  lightingIntensity?: number;
  interactive?: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

export const RunwayCanvas: React.FC<RunwayCanvasProps> = ({
  mode = 'hero',
  dressColor = '#6e1322',
  accentColor = '#dfb56c',
  fabricType = 'Silk Velvet',
  metallic = 0.35,
  roughness = 0.25,
  modelUrl,
  textureUrl,
  lightingIntensity = 1.0,
  interactive = true,
  onAnimationComplete,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const isMobile = width < 768;

    // 1. Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080507);
    scene.fog = new THREE.FogExp2(0x080507, 0.038);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15 * lightingIntensity;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Camera Setup (Responsive Positioning - NEVER COVERS TEXT)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Dynamic positioning based on screen size
    const setupCameraPosition = () => {
      const currentWidth = container.clientWidth || width;
      if (mode === 'intro') {
        camera.position.set(0, 1.8, 14.5);
      } else if (mode === 'showcase') {
        camera.position.set(0, 1.45, 5.2);
      } else {
        // HERO MODE:
        // Desktop: model right (+1.5 on X axis), text on left
        // Mobile: model center-bottom so headline is completely unobstructed
        if (currentWidth >= 1024) {
          camera.position.set(0, 1.5, 6.2);
        } else if (currentWidth >= 768) {
          camera.position.set(0, 1.45, 6.8);
        } else {
          camera.position.set(0, 1.35, 7.5);
        }
      }
    };
    setupCameraPosition();

    // 3. Lighting Setup (Cinematic Paris Fashion Week Lighting)
    const ambientLight = new THREE.AmbientLight(0x2d121b, 1.5 * lightingIntensity);
    scene.add(ambientLight);

    // Warm Key Spotlight onto Model
    const keySpot = new THREE.SpotLight(0xfff3db, 4.8 * lightingIntensity);
    keySpot.position.set(0, 7.5, 5);
    keySpot.angle = 0.42;
    keySpot.penumbra = 0.85;
    keySpot.decay = 1.5;
    keySpot.castShadow = true;
    scene.add(keySpot);

    // Moving Left Spotlight
    const leftSpot = new THREE.SpotLight(0xdfb56c, 2.5 * lightingIntensity);
    leftSpot.position.set(-6, 8, 2);
    leftSpot.angle = 0.35;
    leftSpot.penumbra = 0.9;
    scene.add(leftSpot);

    // Moving Right Spotlight
    const rightSpot = new THREE.SpotLight(0x7a1829, 2.8 * lightingIntensity);
    rightSpot.position.set(6, 8, -2);
    rightSpot.angle = 0.35;
    rightSpot.penumbra = 0.9;
    scene.add(rightSpot);

    // Warm Gold Runway Rim Light
    const rimGold = new THREE.DirectionalLight(0xdfb56c, 2.2 * lightingIntensity);
    rimGold.position.set(4, 5, -2);
    scene.add(rimGold);

    // Burgundy Atmosphere Fill
    const backBurgundy = new THREE.DirectionalLight(0x5a101e, 2.0 * lightingIntensity);
    backBurgundy.position.set(-4, 4, -4);
    scene.add(backBurgundy);

    // 4. Runway Architecture (Reflective Floor, Gold Strips, LED Screens)
    const runwayGroup = new THREE.Group();

    // Main Runway Platform
    const runwayWidth = 3.8;
    const runwayLength = 28;
    const runwayGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength, 32, 32);
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x110c0e,
      roughness: 0.1,
      metalness: 0.88,
    });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.receiveShadow = true;
    runwayGroup.add(runway);

    // Runway Edge Gold Light Strips (Left & Right)
    const stripGeo = new THREE.BoxGeometry(0.08, 0.04, runwayLength);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0xdfb56c });

    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.position.set(-runwayWidth / 2, 0.02, 0);
    runwayGroup.add(leftStrip);

    const rightStrip = new THREE.Mesh(stripGeo, stripMat);
    rightStrip.position.set(runwayWidth / 2, 0.02, 0);
    runwayGroup.add(rightStrip);

    // Surrounding Reflective Studio Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050304,
      roughness: 0.45,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    runwayGroup.add(floor);

    // Large Runway Backdrop LED Screen with "CEYLON STYLE STUDIO" Branding
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 512;
    const ctx = textCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0a0608';
      ctx.fillRect(0, 0, 1024, 512);

      // Gold border lines
      ctx.strokeStyle = '#c99a45';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 984, 472);

      ctx.fillStyle = '#dfb56c';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '8px';
      ctx.fillText('HAUTE COUTURE DIGITAL ACADEMY', 512, 160);

      ctx.fillStyle = '#f7f3eb';
      ctx.font = 'bold 56px serif';
      ctx.fillText('CEYLON STYLE STUDIO', 512, 240);

      ctx.fillStyle = '#c99a45';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('PARIS • MILAN • COLOMBO RUNWAY 2026', 512, 310);

      ctx.fillStyle = '#7d7469';
      ctx.font = '16px sans-serif';
      ctx.fillText('DESIGN YOUR SKILL • BUILD YOUR BRAND • CREATE YOUR FUTURE', 512, 360);
    }
    const screenTexture = new THREE.CanvasTexture(textCanvas);
    const screenGeo = new THREE.PlaneGeometry(7.2, 3.6);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const backdropScreen = new THREE.Mesh(screenGeo, screenMat);
    backdropScreen.position.set(0, 2.2, -10.5);
    runwayGroup.add(backdropScreen);

    // Runway Halo Arch
    const archGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 100, Math.PI);
    const archMat = new THREE.MeshBasicMaterial({ color: 0xdfb56c });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 0, -10.4);
    runwayGroup.add(arch);

    // Subtle Audience Silhouettes along both sides of the runway
    const audienceGroup = new THREE.Group();
    const audienceMat = new THREE.MeshBasicMaterial({ color: 0x070406 });
    for (let i = -8; i <= 4; i += 1.8) {
      // Left side audience silhouettes
      const leftPerson = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8), audienceMat);
      leftPerson.position.set(-2.8, 0.45, i);
      audienceGroup.add(leftPerson);
      const leftHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), audienceMat);
      leftHead.position.set(-2.8, 1.0, i);
      audienceGroup.add(leftHead);

      // Right side audience silhouettes
      const rightPerson = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.9, 8), audienceMat);
      rightPerson.position.set(2.8, 0.45, i);
      audienceGroup.add(rightPerson);
      const rightHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), audienceMat);
      rightHead.position.set(2.8, 1.0, i);
      audienceGroup.add(rightHead);
    }
    runwayGroup.add(audienceGroup);

    scene.add(runwayGroup);

    // 5. Floating Gold Particles (Luxury Runway Atmosphere)
    const particleCount = isMobile ? 60 : 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = Math.random() * 5.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 18;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdfb56c,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Realistic 3D Female Fashion Model
    const modelGroup = new THREE.Group();

    // Position offset for Hero Mode (keeps text on left completely visible)
    if (mode === 'intro') {
      modelGroup.position.set(0, 0, -6.5);
    } else if (mode === 'hero' && width >= 1024) {
      modelGroup.position.set(1.5, 0, 0); // Positioned to right half of desktop screen
    } else {
      modelGroup.position.set(0, 0, 0);
    }

    // Material definitions
    const skinColor = new THREE.Color(0xb98c6d); // Elegant South Asian warm golden olive
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55,
      metalness: 0.05,
    });

    const dressMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(dressColor),
      metalness: Number(metallic),
      roughness: Number(roughness),
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      sheen: 0.8,
      sheenColor: new THREE.Color(accentColor),
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accentColor),
      metalness: 0.85,
      roughness: 0.2,
    });

    // Variable to track cloth vertices for simulation
    let skirtPositions: THREE.BufferAttribute | null = null;
    let skirtGeoRef: THREE.ConeGeometry | null = null;

    // Load custom GLB/GLTF if modelUrl provided, else create realistic procedural model
    let loadedCustomModel = false;
    if (modelUrl && (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf'))) {
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          loadedCustomModel = true;
          // Clear any children in modelGroup
          while (modelGroup.children.length > 0) {
            modelGroup.remove(modelGroup.children[0]);
          }
          const root = gltf.scene;
          root.scale.set(1.1, 1.1, 1.1);
          root.position.y = 0;
          root.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                (mesh.material as THREE.MeshStandardMaterial).color.set(dressColor);
              }
            }
          });
          modelGroup.add(root);
        },
        undefined,
        () => {
          // Fallback to procedural model on load failure
          buildProceduralModel();
        }
      );
    } else {
      buildProceduralModel();
    }

    function buildProceduralModel() {
      // Head & Sculpted Elegant Facial Geometry
      const headGeo = new THREE.SphereGeometry(0.18, 32, 24);
      headGeo.scale(0.85, 1.12, 0.95);
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 2.45;
      head.castShadow = true;
      modelGroup.add(head);

      // Haute Couture Hair Bun & Sculpted Waves
      const hairGeo = new THREE.SphereGeometry(0.2, 24, 20);
      hairGeo.scale(0.92, 1.05, 1.15);
      const hairMat = new THREE.MeshStandardMaterial({
        color: 0x140d0c,
        roughness: 0.35,
        metalness: 0.1,
      });
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 2.52, -0.05);
      modelGroup.add(hair);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.22, 16);
      const neck = new THREE.Mesh(neckGeo, skinMat);
      neck.position.y = 2.26;
      modelGroup.add(neck);

      // Sculpted Evening Gown Corset Bodice
      const bodiceGeo = new THREE.CylinderGeometry(0.2, 0.17, 0.45, 24);
      const bodice = new THREE.Mesh(bodiceGeo, dressMat);
      bodice.position.y = 1.95;
      bodice.castShadow = true;
      modelGroup.add(bodice);

      // Gold Embroidered Waist Belt & Sash
      const sashGeo = new THREE.TorusGeometry(0.18, 0.025, 16, 32);
      const sash = new THREE.Mesh(sashGeo, trimMat);
      sash.rotation.x = Math.PI / 2;
      sash.position.y = 1.76;
      modelGroup.add(sash);

      // Flowing Floor-Length Gown Skirt with Realistic Cloth Simulation Geometry
      const skirtGeo = new THREE.ConeGeometry(0.72, 1.75, 32, 16, true);
      skirtGeo.translate(0, -0.875, 0); // Origin at waist
      skirtGeoRef = skirtGeo;
      skirtPositions = skirtGeo.attributes.position as THREE.BufferAttribute;
      const skirt = new THREE.Mesh(skirtGeo, dressMat);
      skirt.position.y = 1.75;
      skirt.castShadow = true;
      modelGroup.add(skirt);

      // Dynamic High-Slit Draped Fabric Wave
      const trainGeo = new THREE.PlaneGeometry(0.85, 1.8, 16, 16);
      trainGeo.translate(0.15, -0.9, 0.2);
      const train = new THREE.Mesh(trainGeo, dressMat);
      train.position.y = 1.75;
      train.rotation.y = -0.2;
      train.castShadow = true;
      modelGroup.add(train);

      // Runway Leg
      const legGeo = new THREE.CylinderGeometry(0.075, 0.055, 1.1, 16);
      const leg = new THREE.Mesh(legGeo, skinMat);
      leg.position.set(0.14, 0.6, 0.08);
      leg.rotation.x = -0.05;
      leg.castShadow = true;
      modelGroup.add(leg);

      // Gold Stiletto Runway Heel
      const shoeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.2);
      const shoe = new THREE.Mesh(shoeGeo, trimMat);
      shoe.position.set(0.14, 0.03, 0.1);
      modelGroup.add(shoe);

      // Arms in Haute Couture Posture
      const armGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.7, 16);
      const leftArm = new THREE.Mesh(armGeo, skinMat);
      leftArm.position.set(-0.28, 1.8, 0);
      leftArm.rotation.z = 0.12;
      modelGroup.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, skinMat);
      rightArm.position.set(0.28, 1.8, 0);
      rightArm.rotation.z = -0.12;
      modelGroup.add(rightArm);

      // Jewelry (Earrings & Choker)
      const earringGeo = new THREE.CylinderGeometry(0.015, 0.005, 0.1, 8);
      const leftEarring = new THREE.Mesh(earringGeo, trimMat);
      leftEarring.position.set(-0.16, 2.38, 0.02);
      modelGroup.add(leftEarring);

      const rightEarring = new THREE.Mesh(earringGeo, trimMat);
      rightEarring.position.set(0.16, 2.38, 0.02);
      modelGroup.add(rightEarring);
    }

    scene.add(modelGroup);

    // 7. Interactive Controls & Mouse Parallax
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallaxX = normX * 0.18;
      mouseParallaxY = normY * 0.1;

      if (isDragging) {
        const delta = e.clientX - prevMouseX;
        targetRotationY += delta * 0.008;
        prevMouseX = e.clientX;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support for Mobile
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!interactive || !isDragging || e.touches.length === 0) return;
      const delta = e.touches[0].clientX - prevMouseX;
      targetRotationY += delta * 0.01;
      prevMouseX = e.touches[0].clientX;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let introTime = 0;
    const introDuration = 6.2; // 5-8 seconds target
    let introFinished = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Moving atmospheric spotlights
      leftSpot.position.x = -6 + Math.sin(time * 0.8) * 1.5;
      rightSpot.position.x = 6 + Math.cos(time * 0.7) * 1.5;

      // Gentle floating gold dust particle drift
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i]) * 0.0025;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Realistic Fabric Waves (Cloth Simulation vertex oscillation)
      if (skirtPositions && skirtGeoRef) {
        const count = skirtPositions.count;
        for (let i = 0; i < count; i++) {
          const y = skirtPositions.getY(i);
          if (y < -0.3) {
            const wave = Math.sin(time * 3.8 + y * 4.2) * 0.022 * (Math.abs(y) / 1.75);
            skirtPositions.setZ(i, skirtPositions.getZ(i) + wave * 0.08);
          }
        }
        skirtPositions.needsUpdate = true;
      }

      // Runway Intro Walk Sequence
      if (mode === 'intro') {
        introTime += delta;
        const progress = Math.min(introTime / introDuration, 1);

        // Smooth natural easing
        const easeProgress = 1 - Math.pow(1 - progress, 2);

        // Model walks forward from far end (-6.5) to hero area (0.5)
        modelGroup.position.z = -6.5 + easeProgress * 7.0;

        // Subtle realistic walking sway
        modelGroup.position.y = Math.sin(time * 4.8) * 0.024;
        modelGroup.rotation.y = Math.sin(time * 2.4) * 0.038;

        // Camera pulls back smoothly
        camera.position.z = 14.5 - easeProgress * 8.0;
        camera.position.y = 1.8 - easeProgress * 0.35;
        keySpot.target = modelGroup;

        if (progress >= 1 && !introFinished) {
          introFinished = true;
          if (onAnimationComplete) onAnimationComplete();
        }
      } else {
        // Hero / Showcase Mode: subtle breathing & interactive rotation
        modelGroup.position.y = Math.sin(time * 1.5) * 0.015;
        modelGroup.rotation.y += (targetRotationY - modelGroup.rotation.y) * 0.08;

        // Subtle mouse parallax
        const currentW = container.clientWidth || width;
        const isDesktop = currentW >= 1024;
        const targetCamX = isDesktop && mode === 'hero' ? 0.3 + mouseParallaxX : mouseParallaxX;

        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (1.5 + mouseParallaxY - camera.position.y) * 0.05;

        if (mode === 'hero' && isDesktop) {
          camera.lookAt(1.0, 1.35, 0);
        } else {
          camera.lookAt(0, 1.35, 0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      setupCameraPosition();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [mode, dressColor, accentColor, fabricType, metallic, roughness, modelUrl, lightingIntensity, interactive, onAnimationComplete]);

  if (!webGLSupported) {
    return (
      <div className={`relative bg-cover bg-center ${className}`} style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85)'
      }}>
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-xs font-mono text-[#dfb56c]">WebGL Accelerated 3D Viewport</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden touch-none ${className}`}
      style={{ cursor: interactive ? 'grab' : 'default' }}
    />
  );
};
