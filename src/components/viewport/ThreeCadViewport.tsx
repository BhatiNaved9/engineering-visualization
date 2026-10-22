/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  CadModelDefinition,
  CameraMode,
  DisplayMode,
  ViewOrientation,
} from '../../types/cad';
import {
  Maximize2,
  Minimize2,
  Box,
  Layers,
  Ruler,
  RotateCcw,
  Scissors,
  Grid,
  Eye,
  Camera,
  Compass,
} from 'lucide-react';

interface ThreeCadViewportProps {
  model?: CadModelDefinition;
  customMeshFactory?: (scene: THREE.Scene) => void;
  projectionSystem?: 'first-angle' | 'third-angle';
  allowMeasurement?: boolean;
  allowSection?: boolean;
  allowExplode?: boolean;
  initialOrientation?: ViewOrientation;
  showGrid?: boolean;
  showAxes?: boolean;
  heightClass?: string;
  onMeasurePoint?: (dist: number, p1: THREE.Vector3, p2: THREE.Vector3) => void;
}

export const ThreeCadViewport: React.FC<ThreeCadViewportProps> = ({
  model,
  customMeshFactory,
  allowMeasurement = true,
  allowSection = true,
  allowExplode = true,
  initialOrientation = 'isometric',
  showGrid: defaultShowGrid = true,
  showAxes: defaultShowAxes = true,
  heightClass = 'h-[500px]',
  onMeasurePoint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport Settings State
  const [displayMode, setDisplayMode] = useState<DisplayMode>('shaded-edges');
  const [cameraMode, setCameraMode] = useState<CameraMode>('perspective');
  const [activeOrientation, setActiveOrientation] = useState<ViewOrientation>(initialOrientation);
  const [showGrid, setShowGrid] = useState(defaultShowGrid);
  const [showAxes, setShowAxes] = useState(defaultShowAxes);
  const [sectionEnabled, setSectionEnabled] = useState(false);
  const [sectionAxis, setSectionAxis] = useState<'x' | 'y' | 'z'>('y');
  const [sectionOffset, setSectionOffset] = useState(0);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
  const [measureResult, setMeasureResult] = useState<{
    distance: number;
    dx: number;
    dy: number;
    dz: number;
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const perspCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const currentCameraRef = useRef<THREE.Camera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const clippingPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 0));
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  const measureLineRef = useRef<THREE.Line | null>(null);
  const partMeshesRef = useRef<Map<string, { mesh: THREE.Mesh; edge: THREE.LineSegments; explodeVector: THREE.Vector3; initialPos: THREE.Vector3 }>>(new Map());

  // Mouse interaction state for manual orbit/pan
  const isPointerDownRef = useRef(false);
  const isRightClickRef = useRef(false);
  const previousPointerPosRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const sphericalRef = useRef({ radius: 180, theta: Math.PI / 4, phi: Math.PI / 3 });

  // Update camera position from spherical coordinates
  const updateCameraPosition = useCallback(() => {
    const { radius, theta, phi } = sphericalRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    if (perspCameraRef.current) {
      perspCameraRef.current.position.set(x, y, z);
      perspCameraRef.current.lookAt(target);
    }

    if (orthoCameraRef.current) {
      orthoCameraRef.current.position.set(x, y, z);
      orthoCameraRef.current.lookAt(target);
    }
  }, []);

  // Set standard views (Front, Top, Right, Isometric, etc.)
  const setOrientation = useCallback((orientation: ViewOrientation) => {
    setActiveOrientation(orientation);
    const target = cameraTargetRef.current;
    const r = 180;

    switch (orientation) {
      case 'front':
        sphericalRef.current = { radius: r, theta: 0, phi: Math.PI / 2 };
        break;
      case 'back':
        sphericalRef.current = { radius: r, theta: Math.PI, phi: Math.PI / 2 };
        break;
      case 'top':
        sphericalRef.current = { radius: r, theta: 0, phi: 0.0001 };
        break;
      case 'bottom':
        sphericalRef.current = { radius: r, theta: 0, phi: Math.PI - 0.0001 };
        break;
      case 'right':
        sphericalRef.current = { radius: r, theta: Math.PI / 2, phi: Math.PI / 2 };
        break;
      case 'left':
        sphericalRef.current = { radius: r, theta: -Math.PI / 2, phi: Math.PI / 2 };
        break;
      case 'isometric':
      default:
        sphericalRef.current = { radius: r, theta: Math.PI / 4, phi: Math.PI / 3 };
        break;
    }
    updateCameraPosition();
  }, [updateCameraPosition]);

  // Build model geometry into scene
  const buildModelGeometry = useCallback((scene: THREE.Scene) => {
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      modelGroupRef.current = null;
    }
    partMeshesRef.current.clear();

    const group = new THREE.Group();
    modelGroupRef.current = group;

    if (customMeshFactory) {
      customMeshFactory(scene);
      return;
    }

    if (!model || !model.parts) return;

    model.parts.forEach((part) => {
      let geometry: THREE.BufferGeometry;

      if (part.meshType === 'box') {
        geometry = new THREE.BoxGeometry(
          part.dimensions.length || 30,
          part.dimensions.height || 30,
          part.dimensions.width || 30
        );
      } else if (part.meshType === 'cylinder') {
        geometry = new THREE.CylinderGeometry(
          part.dimensions.radiusTop || 20,
          part.dimensions.radiusBottom || 20,
          part.dimensions.height || 40,
          part.dimensions.radialSegments || 32
        );
      } else if (part.meshType === 'cone') {
        geometry = new THREE.ConeGeometry(
          part.dimensions.radius || 20,
          part.dimensions.height || 40,
          part.dimensions.radialSegments || 32
        );
      } else {
        geometry = new THREE.BoxGeometry(20, 20, 20);
      }

      // Material with CAD clipping plane support
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(part.color),
        roughness: 0.4,
        metalness: 0.35,
        clippingPlanes: sectionEnabled ? [clippingPlaneRef.current] : [],
        clipShadows: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...part.position);
      if (part.rotation) {
        mesh.rotation.set(...part.rotation);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { partId: part.id, partName: part.name };

      // CAD Edges
      const edgesGeom = new THREE.EdgesGeometry(geometry, 25);
      const edgesMat = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1.5,
      });
      const edge = new THREE.LineSegments(edgesGeom, edgesMat);
      mesh.add(edge);

      group.add(mesh);

      partMeshesRef.current.set(part.id, {
        mesh,
        edge,
        explodeVector: new THREE.Vector3(...part.explodeVector),
        initialPos: new THREE.Vector3(...part.position),
      });
    });

    scene.add(group);
  }, [customMeshFactory, model, sectionEnabled]);

  // Main Three.js setup & render loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 400;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError('3D rendering temporarily stopped or WebGL not enabled. Reload the workspace.');
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0x13171f, 1);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Cameras
    const aspect = width / height;
    const perspCamera = new THREE.PerspectiveCamera(45, aspect, 1, 2000);
    perspCameraRef.current = perspCamera;

    const orthoFrustum = 130;
    const orthoCamera = new THREE.OrthographicCamera(
      -orthoFrustum * aspect,
      orthoFrustum * aspect,
      orthoFrustum,
      -orthoFrustum,
      1,
      2000
    );
    orthoCameraRef.current = orthoCamera;

    currentCameraRef.current = cameraMode === 'orthographic' ? orthoCamera : perspCamera;

    // Precision Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(100, 150, 100);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5);
    fillLight.position.set(-100, 80, -100);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.3);
    rimLight.position.set(0, -100, 0);
    scene.add(rimLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(300, 30, 0x334155, 0x1e293b);
    gridHelper.position.y = -80;
    gridHelper.visible = showGrid;
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Coordinate Axes Triad (X=Red, Y=Green, Z=Blue)
    const axesHelper = new THREE.AxesHelper(60);
    axesHelper.position.set(-90, -78, -90);
    axesHelper.visible = showAxes;
    scene.add(axesHelper);
    axesHelperRef.current = axesHelper;

    // Build Model
    buildModelGeometry(scene);
    setOrientation(initialOrientation);

    // Animation Render Loop
    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const cam = cameraMode === 'orthographic' ? orthoCameraRef.current : perspCameraRef.current;
      if (rendererRef.current && sceneRef.current && cam) {
        rendererRef.current.render(sceneRef.current, cam);
      }
    };
    render();

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const newAspect = w / h;

      if (perspCameraRef.current) {
        perspCameraRef.current.aspect = newAspect;
        perspCameraRef.current.updateProjectionMatrix();
      }

      if (orthoCameraRef.current) {
        orthoCameraRef.current.left = -orthoFrustum * newAspect;
        orthoCameraRef.current.right = orthoFrustum * newAspect;
        orthoCameraRef.current.top = orthoFrustum;
        orthoCameraRef.current.bottom = -orthoFrustum;
        orthoCameraRef.current.updateProjectionMatrix();
      }

      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [buildModelGeometry, cameraMode, initialOrientation, setOrientation, showAxes, showGrid]);

  // Update display mode materials (wireframe, hidden lines, transparent)
  useEffect(() => {
    partMeshesRef.current.forEach(({ mesh, edge }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (displayMode === 'wireframe') {
        mat.wireframe = true;
        mat.transparent = false;
        mat.opacity = 1.0;
        edge.visible = false;
      } else if (displayMode === 'transparent') {
        mat.wireframe = false;
        mat.transparent = true;
        mat.opacity = 0.35;
        edge.visible = true;
      } else if (displayMode === 'shaded-edges') {
        mat.wireframe = false;
        mat.transparent = false;
        mat.opacity = 1.0;
        edge.visible = true;
      } else if (displayMode === 'hidden-lines') {
        mat.wireframe = false;
        mat.transparent = true;
        mat.opacity = 0.15;
        edge.visible = true;
      } else {
        // shaded
        mat.wireframe = false;
        mat.transparent = false;
        mat.opacity = 1.0;
        edge.visible = false;
      }
      mat.needsUpdate = true;
    });
  }, [displayMode]);

  // Update Sectioning Plane
  useEffect(() => {
    let normal = new THREE.Vector3(0, -1, 0);
    if (sectionAxis === 'x') normal = new THREE.Vector3(-1, 0, 0);
    if (sectionAxis === 'z') normal = new THREE.Vector3(0, 0, -1);

    clippingPlaneRef.current.set(normal, sectionOffset);

    partMeshesRef.current.forEach(({ mesh }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.clippingPlanes = sectionEnabled ? [clippingPlaneRef.current] : [];
      mat.needsUpdate = true;
    });
  }, [sectionEnabled, sectionAxis, sectionOffset]);

  // Update Explode factor
  useEffect(() => {
    partMeshesRef.current.forEach(({ mesh, explodeVector, initialPos }) => {
      const targetPos = initialPos.clone().add(explodeVector.clone().multiplyScalar(explodeFactor));
      mesh.position.copy(targetPos);
    });
  }, [explodeFactor]);

  // Update Grid / Axes visibility
  useEffect(() => {
    if (gridHelperRef.current) gridHelperRef.current.visible = showGrid;
    if (axesHelperRef.current) axesHelperRef.current.visible = showAxes;
  }, [showGrid, showAxes]);

  // Pointer event handlers for CAD Orbit, Pan, Zoom, and Measure
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    isRightClickRef.current = e.button === 2 || e.shiftKey;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    // Measure Point Raycasting
    if (isMeasuring && canvasRef.current && sceneRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      const cam = cameraMode === 'orthographic' ? orthoCameraRef.current : perspCameraRef.current;
      if (!cam) return;
      raycaster.setFromCamera(mouse, cam);

      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
      const hit = intersects.find((i) => i.object.type === 'Mesh');

      if (hit && hit.point) {
        const pt = hit.point.clone();
        const newPts = [...measurePoints, pt];
        if (newPts.length === 2) {
          const p1 = newPts[0];
          const p2 = newPts[1];
          const distance = Number(p1.distanceTo(p2).toFixed(2));
          const dx = Number(Math.abs(p2.x - p1.x).toFixed(2));
          const dy = Number(Math.abs(p2.y - p1.y).toFixed(2));
          const dz = Number(Math.abs(p2.z - p1.z).toFixed(2));

          setMeasureResult({ distance, dx, dy, dz });
          setMeasurePoints(newPts);
          if (onMeasurePoint) onMeasurePoint(distance, p1, p2);

          // Draw dynamic CAD dimension line
          if (measureLineRef.current && sceneRef.current) {
            sceneRef.current.remove(measureLineRef.current);
          }
          const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
          const line = new THREE.Line(lineGeom, lineMat);
          measureLineRef.current = line;
          sceneRef.current.add(line);
        } else if (newPts.length > 2) {
          setMeasurePoints([pt]);
          setMeasureResult(null);
          if (measureLineRef.current && sceneRef.current) {
            sceneRef.current.remove(measureLineRef.current);
            measureLineRef.current = null;
          }
        } else {
          setMeasurePoints(newPts);
          setMeasureResult(null);
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - previousPointerPosRef.current.x;
    const deltaY = e.clientY - previousPointerPosRef.current.y;
    previousPointerPosRef.current = { x: e.clientX, y: e.clientY };

    if (isRightClickRef.current) {
      // Pan camera target
      const panSpeed = 0.25;
      const cam = cameraMode === 'orthographic' ? orthoCameraRef.current : perspCameraRef.current;
      if (cam) {
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
        cameraTargetRef.current.add(right.multiplyScalar(-deltaX * panSpeed));
        cameraTargetRef.current.add(up.multiplyScalar(deltaY * panSpeed));
        updateCameraPosition();
      }
    } else {
      // Orbit camera around target
      const rotSpeed = 0.007;
      sphericalRef.current.theta -= deltaX * rotSpeed;
      sphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, sphericalRef.current.phi - deltaY * rotSpeed)
      );
      updateCameraPosition();
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    sphericalRef.current.radius = Math.max(30, Math.min(800, sphericalRef.current.radius * zoomFactor));

    if (cameraMode === 'orthographic' && orthoCameraRef.current && containerRef.current) {
      const currentZoom = orthoCameraRef.current.zoom;
      orthoCameraRef.current.zoom = Math.max(0.2, Math.min(5, currentZoom / (zoomFactor - 1 > 0 ? 1.08 : 0.92)));
      orthoCameraRef.current.updateProjectionMatrix();
    }

    updateCameraPosition();
  };

  const resetView = () => {
    cameraTargetRef.current.set(0, 0, 0);
    setOrientation('isometric');
    setExplodeFactor(0);
    setSectionOffset(0);
    setSectionEnabled(false);
    setIsMeasuring(false);
    setMeasurePoints([]);
    setMeasureResult(null);
    if (measureLineRef.current && sceneRef.current) {
      sceneRef.current.remove(measureLineRef.current);
      measureLineRef.current = null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen bg-[#0d1017]' : heightClass} rounded-lg border border-slate-800 bg-[#13171f] overflow-hidden select-none`}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="3D CAD Viewport Canvas"
      />

      {webglError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-40">
          <Box className="w-10 h-10 text-amber-400 mb-2" />
          <h4 className="text-slate-100 font-semibold mb-1">3D Viewport Notice</h4>
          <p className="text-slate-400 text-sm max-w-md">{webglError}</p>
        </div>
      )}

      {/* Top Technical CAD Toolbar */}
      <div className="absolute top-2 left-2 right-2 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none z-10">
        {/* Left: View presets */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded px-1.5 py-1 pointer-events-auto shadow-lg">
          <span className="text-[11px] font-mono text-slate-400 font-semibold px-1 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" /> VIEW
          </span>
          {(['isometric', 'front', 'top', 'right', 'left'] as ViewOrientation[]).map((view) => (
            <button
              key={view}
              onClick={() => setOrientation(view)}
              className={`px-2 py-0.5 text-[11px] font-mono uppercase rounded transition-colors ${
                activeOrientation === view
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={`Switch camera to ${view} view`}
            >
              {view.slice(0, 3)}
            </button>
          ))}
          <button
            onClick={resetView}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded ml-1"
            title="Reset View & Clear Tools"
            aria-label="Reset View"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Display & Camera Controls */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded px-1.5 py-1 pointer-events-auto shadow-lg">
          {/* Camera type */}
          <button
            onClick={() => setCameraMode(cameraMode === 'perspective' ? 'orthographic' : 'perspective')}
            className={`px-2 py-0.5 text-[11px] font-mono rounded flex items-center gap-1 transition-colors ${
              cameraMode === 'orthographic'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle between Perspective and Orthographic Camera"
          >
            <Camera className="w-3 h-3" />
            {cameraMode === 'orthographic' ? 'ORTHO' : 'PERSP'}
          </button>

          <div className="h-3 w-px bg-slate-700" />

          {/* Render Styles */}
          <button
            onClick={() => {
              const modes: DisplayMode[] = ['shaded-edges', 'shaded', 'wireframe', 'hidden-lines', 'transparent'];
              const next = modes[(modes.indexOf(displayMode) + 1) % modes.length];
              setDisplayMode(next);
            }}
            className="px-2 py-0.5 text-[11px] font-mono text-cyan-300 bg-slate-800 rounded hover:bg-slate-700 uppercase"
            title="Cycle Shading Mode (Shaded+Edges, Shaded, Wireframe, Hidden Lines, Transparent)"
          >
            {displayMode}
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1 rounded ${showGrid ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle CAD Grid"
            aria-label="Toggle Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Axes Toggle */}
          <button
            onClick={() => setShowAxes(!showAxes)}
            className={`p-1 rounded ${showAxes ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle Coordinate Axes Triad"
            aria-label="Toggle Axes"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-slate-400 hover:text-slate-100 rounded"
            title="Toggle Fullscreen Viewport"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating CAD Tools Bar (Left / Bottom-Left) */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-2 pointer-events-none z-10">
        {/* Tool trigger buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded p-1 pointer-events-auto shadow-lg">
          {allowSection && (
            <button
              onClick={() => setSectionEnabled(!sectionEnabled)}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono transition-colors ${
                sectionEnabled
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle Section Cutting Plane"
            >
              <Scissors className="w-3.5 h-3.5" />
              SECTION
            </button>
          )}

          {allowExplode && model?.parts && model.parts.length > 1 && (
            <button
              onClick={() => setExplodeFactor(explodeFactor > 0 ? 0 : 0.75)}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono transition-colors ${
                explodeFactor > 0
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Explode Assembly"
            >
              <Layers className="w-3.5 h-3.5" />
              EXPLODE
            </button>
          )}

          {allowMeasurement && (
            <button
              onClick={() => {
                setIsMeasuring(!isMeasuring);
                setMeasurePoints([]);
                setMeasureResult(null);
                if (measureLineRef.current && sceneRef.current) {
                  sceneRef.current.remove(measureLineRef.current);
                  measureLineRef.current = null;
                }
              }}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-mono transition-colors ${
                isMeasuring
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Interactive 3D Distance Measurement"
            >
              <Ruler className="w-3.5 h-3.5" />
              MEASURE
            </button>
          )}
        </div>

        {/* Section Tool Controls Overlay */}
        {sectionEnabled && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-rose-500/30 rounded p-2.5 pointer-events-auto text-xs w-64 shadow-xl">
            <div className="flex items-center justify-between text-rose-300 font-mono mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Scissors className="w-3 h-3" /> CUTTING PLANE
              </span>
              <div className="flex gap-1">
                {(['x', 'y', 'z'] as ('x' | 'y' | 'z')[]).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => setSectionAxis(axis)}
                    className={`px-1.5 py-0.5 font-mono uppercase rounded ${
                      sectionAxis === axis
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {axis}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 text-[10px]">OFFSET:</span>
              <input
                type="range"
                min="-60"
                max="60"
                value={sectionOffset}
                onChange={(e) => setSectionOffset(Number(e.target.value))}
                className="w-full accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="font-mono text-rose-300 text-[10px] w-8 text-right">{sectionOffset}mm</span>
            </div>
          </div>
        )}

        {/* Explode Assembly Slider Overlay */}
        {explodeFactor > 0 && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded p-2.5 pointer-events-auto text-xs w-64 shadow-xl">
            <div className="flex items-center justify-between text-cyan-300 font-mono mb-2">
              <span className="font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" /> EXPLODE DISTANCE
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">{Math.round(explodeFactor * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodeFactor}
              onChange={(e) => setExplodeFactor(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        )}

        {/* Measurement HUD Result */}
        {isMeasuring && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded p-2.5 pointer-events-auto text-xs w-72 shadow-xl">
            <div className="flex items-center justify-between text-amber-300 font-mono mb-1.5">
              <span className="font-semibold flex items-center gap-1">
                <Ruler className="w-3 h-3" /> 3D CALIPER MEASURE
              </span>
              <span className="text-[10px] text-slate-400">
                {measurePoints.length}/2 POINTS
              </span>
            </div>
            {measurePoints.length < 2 ? (
              <p className="text-[11px] text-slate-400 font-mono">
                Click {measurePoints.length === 0 ? 'Point 1' : 'Point 2'} on the 3D surface to measure distance.
              </p>
            ) : measureResult ? (
              <div className="space-y-1 font-mono text-[11px]">
                <div className="text-amber-300 font-semibold text-sm">
                  DISTANCE: {measureResult.distance} mm
                </div>
                <div className="text-slate-400 text-[10px] flex gap-3">
                  <span>ΔX: {measureResult.dx} mm</span>
                  <span>ΔY: {measureResult.dy} mm</span>
                  <span>ΔZ: {measureResult.dz} mm</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Coordinate HUD in Bottom-Right */}
      <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded px-2 py-1 pointer-events-none text-[10px] font-mono text-slate-400 flex items-center gap-2">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> X
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Y (HP)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Z (VP)
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300">ROT: Drag | PAN: Right-Click</span>
      </div>
    </div>
  );
};
