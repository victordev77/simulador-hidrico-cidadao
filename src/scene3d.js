/**
 * Visual original de threeScene.js, commit 6c4cfb0 (v0.1.0).
 * Mesmas dimensões, paleta, luzes e distribuição. Recursos reutilizados,
 * controles e ciclo de vida integrados à SPA. Nenhum cálculo científico aqui.
 */
import * as THREE from "../assets/vendor/three.module.js";
const SCENE_COLORS = { water: 0x0f6f86, cyan: 0x69f0ff, hex: 0x8ce7ff,
  sphere: 0xdceff3, vapor: 0xcff7ff, sun: 0xffe1a1 };
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export class Reservoir3DScene {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.contextLost = false;
    this.quality = options.quality || "auto";
    this.theme = options.theme || "dark";
    this.disposed = false;
    this.isRunning = false;
    this.visible = true;
    this.animId = null;
    this.clock = new THREE.Clock();
    this.orbit = { theta: 0, phi: Math.atan2(12, 7.4), radius: Math.hypot(7.4, 12),
      minRadius: 9, maxRadius: 38, minPhi: .18, maxPhi: 1.42, target: new THREE.Vector3() };
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true, powerPreference: "high-performance"});
    this.applyQualitySettings();
    this.root = new THREE.Group();
    this.coverGroup = new THREE.Group();
    this.vapor = new THREE.Group();
    this.root.add(this.coverGroup, this.vapor);
    this.scene.add(this.root);
    this.createLights();
    this.createReservoir();
    this.createDamStructure();
    this.createAtmosphere();
    this.createHexCover();
    this.createSphereCover();
    this.createVapor("none");
    this.setScenario(options.scenario || "none");
    this.setTheme(this.theme);
    this.bindEvents();
    this.resize();
    this.start();
  }
  createLights() {
    const ambient = new THREE.AmbientLight(0xbbeeff, 0.7);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(SCENE_COLORS.sun, 2.1);
    key.position.set(-4, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);

    const rim = new THREE.PointLight(SCENE_COLORS.cyan, 1.7, 18);
    rim.position.set(5, 3.4, -4);
    this.scene.add(rim);
  }
  createReservoir() {
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(6.4, 6.9, 0.48, 96),
      new THREE.MeshStandardMaterial({
        color: 0x132833,
        roughness: 0.72,
        metalness: 0.06
      })
    );

    basin.position.y = -0.34;
    basin.receiveShadow = true;
    this.root.add(basin);

    this.water = new THREE.Mesh(
      new THREE.CircleGeometry(6, 160),
      new THREE.MeshPhysicalMaterial({
        color: SCENE_COLORS.water,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
        roughness: 0.18,
        metalness: 0.05,
        transmission: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.18
      })
    );

    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = 0;
    this.water.receiveShadow = true;
    this.water.renderOrder = 1;
    this.root.add(this.water);

    this.rippleLines = new THREE.Group();

    for (let i = 0; i < 7; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1 + i * 0.68, 1.015 + i * 0.68, 128),
        new THREE.MeshBasicMaterial({
          color: SCENE_COLORS.cyan,
          transparent: true,
          opacity: 0.08,
          depthWrite: false
        })
      );

      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.035 + i * 0.002;
      ring.renderOrder = 2;
      this.rippleLines.add(ring);
    }

    this.root.add(this.rippleLines);
  }
  createDamStructure() {
    // Follow the existing circular rim; never cut or reshape the water disk.
    // Inspired by the previous wall, crest and white safety posts.
    this.damGroup = new THREE.Group();
    this.damGroup.name = "barragem";
    this.root.add(this.damGroup);
    const start = -Math.PI / 2 - .82;
    const end = -Math.PI / 2 + .82;
    const arcSection = (inner, outer, height, top, material) => {
      const shape = new THREE.Shape();
      shape.absarc(0, 0, inner, start, end, false);
      shape.absarc(0, 0, outer, end, start, true);
      shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height, bevelEnabled: false, curveSegments: 48
      });
      geometry.rotateX(Math.PI / 2);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = top;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.damGroup.add(mesh);
    };
    arcSection(6.08, 6.72, 1.18, .74, new THREE.MeshStandardMaterial({
      color: 0x6e4a30, roughness: .9, metalness: .05
    }));
    arcSection(6.06, 6.74, .08, .82, new THREE.MeshStandardMaterial({
      color: 0x9c8874, roughness: .8
    }));
    const count = 15;
    const posts = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(.04, .04, .28, 8),
      new THREE.MeshStandardMaterial({color: 0xffffff, roughness: .4}), count
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const angle = start + .045 + (end - start - .09) * i / (count - 1);
      dummy.position.set(6.22 * Math.cos(angle), .96, 6.22 * Math.sin(angle));
      dummy.updateMatrix();
      posts.setMatrixAt(i, dummy.matrix);
    }
    posts.instanceMatrix.needsUpdate = true;
    posts.castShadow = true;
    this.damGroup.add(posts);
  }
  createAtmosphere() {
    const windMaterial = new THREE.LineBasicMaterial({
      color: SCENE_COLORS.cyan,
      transparent: true,
      opacity: 0.34
    });

    this.windLines = new THREE.Group();

    for (let i = 0; i < 18; i += 1) {
      const y = 0.45 + (i % 5) * 0.34;
      const z = -4.6 + Math.floor(i / 5) * 2.2;

      const points = [
        new THREE.Vector3(-7, y, z),
        new THREE.Vector3(-2.1, y + 0.16, z + 0.16),
        new THREE.Vector3(4.8, y, z + 0.36)
      ];

      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        windMaterial
      );

      line.userData.speed = 0.35 + (i % 4) * 0.08;
      this.windLines.add(line);
    }

    this.root.add(this.windLines);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 32, 32),
      new THREE.MeshBasicMaterial({ color: SCENE_COLORS.sun })
    );

    sun.position.set(-4.8, 5.6, -2.6);
    this.root.add(sun);
  }
  createSphereCover() {
    const geometry = new THREE.SphereGeometry(.23, 24, 16);
    const material = new THREE.MeshPhysicalMaterial({color: SCENE_COLORS.sphere, roughness: .18, metalness: .03, clearcoat: 1, transparent: true, opacity: .92});
    const positions = [];
    const dx = .52, dz = (dx * Math.sqrt(3)) / 2;
    for (let row = -11; row <= 11; row++) {
      for (let col = -11; col <= 11; col++) {
        const x = col * dx + (row % 2) * dx * .5, z = row * dz;
        if (Math.hypot(x, z) < 5.52) positions.push([x, z]);
      }
    }
    this.instancedSpheres = new THREE.InstancedMesh(geometry, material, positions.length);
    const dummy = new THREE.Object3D();
    positions.forEach(([x,z], i) => {
      dummy.position.set(x, .24, z); dummy.rotation.y = 0; dummy.updateMatrix();
      this.instancedSpheres.setMatrixAt(i, dummy.matrix);
    });
    this.instancedSpheres.castShadow = true;
    this.instancedSpheres.receiveShadow = true;
    this.instancedSpheres.renderOrder = 3;
    this.instancedSpheres.instanceMatrix.needsUpdate = true;
    this.coverGroup.add(this.instancedSpheres);
  }
  createHexCover() {
    const geometry = new THREE.CylinderGeometry(.43, .43, .055, 6);
    const material = new THREE.MeshPhysicalMaterial({color: SCENE_COLORS.hex, roughness: .24, metalness: .16, clearcoat: 1, transparent: true, opacity: .86});
    const positions = [];
    const dx = .76, dz = .66;
    for (let row = -8; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        const x = col * dx + (row % 2) * dx * .5, z = row * dz;
        if (Math.hypot(x, z) < 5.58) positions.push([x, z]);
      }
    }
    this.instancedHex = new THREE.InstancedMesh(geometry, material, positions.length);
    const dummy = new THREE.Object3D();
    positions.forEach(([x,z], i) => {
      dummy.position.set(x, .11, z); dummy.rotation.y = Math.PI / 6; dummy.updateMatrix();
      this.instancedHex.setMatrixAt(i, dummy.matrix);
    });
    this.instancedHex.castShadow = true;
    this.instancedHex.receiveShadow = true;
    this.instancedHex.renderOrder = 3;
    this.instancedHex.instanceMatrix.needsUpdate = true;
    this.coverGroup.add(this.instancedHex);
  }
  createVapor(scenario) {
    const count =
      scenario === "none"
        ? 120
        : scenario === "sphere"
          ? 38
          : 14;

    const material = new THREE.MeshBasicMaterial({
      color: SCENE_COLORS.vapor,
      transparent: true,
      depthWrite: false,
      opacity: scenario === "none" ? 0.34 : 0.18
    });

    const geometry = new THREE.SphereGeometry(0.035, 10, 10);

    for (let i = 0; i < count; i += 1) {
      const radius = Math.sqrt(Math.random()) * 5.6;
      const angle = Math.random() * Math.PI * 2;

      const particle = new THREE.Object3D();
      particle.position.set(
        Math.cos(angle) * radius,
        0.22 + Math.random() * 2.7,
        Math.sin(angle) * radius
      );

      particle.userData.baseY = particle.position.y;
      particle.userData.speed = 0.16 + Math.random() * 0.28;
      this.vapor.add(particle);
    }
    this.vaporMesh = new THREE.InstancedMesh(geometry, material, count);
    this.vaporMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.vaporMesh.frustumCulled = false;
    this.root.add(this.vaporMesh);
    this.updateVaporInstances();
  }
  updateVaporInstances() {
    this.vapor.children.forEach((p, i) => {
      p.updateMatrix();
      this.vaporMesh.setMatrixAt(i, p.matrix);
    });
    this.vaporMesh.instanceMatrix.needsUpdate = true;
  }
  applyQualitySettings() {
    let effectiveDpr = window.devicePixelRatio || 1;
    let shadows = true;

    if (this.quality === "eco") {
      effectiveDpr = 1.0;
      shadows = false;
    } else if (this.quality === "balanced") {
      effectiveDpr = Math.min(effectiveDpr, 1.35);
      shadows = true;
    } else if (this.quality === "high") {
      effectiveDpr = Math.min(effectiveDpr, 2.0);
      shadows = true;
    } else {
      const isMobile = matchMedia("(pointer: coarse)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      effectiveDpr = isMobile ? 1.0 : Math.min(effectiveDpr, 1.4);
      shadows = !isMobile;
    }

    this.renderer.setPixelRatio(effectiveDpr);
    this.renderer.shadowMap.enabled = shadows;
    this.scene?.traverse(o => { if (o.isDirectionalLight) o.castShadow = shadows; });
    if (shadows) {
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }
  updateCameraPosition() {
    const framing = Math.max(1.08, 1.45 / (this.camera.aspect || 1));
    const x = this.orbit.radius * framing * Math.sin(this.orbit.phi) * Math.sin(this.orbit.theta);
    const y = this.orbit.radius * framing * Math.cos(this.orbit.phi);
    const z = this.orbit.radius * framing * Math.sin(this.orbit.phi) * Math.cos(this.orbit.theta);

    this.camera.position.set(
      x + this.orbit.target.x,
      y + this.orbit.target.y,
      z + this.orbit.target.z
    );
    this.camera.lookAt(this.orbit.target);
    this.updateFogRange();
    this.render();
  }
  updateFogRange() {
    if (!this.scene.fog) return;
    const distance = this.camera.position.distanceTo(this.orbit.target);
    // Responsive framing moves the camera back; keep the aerial/mobile view
    // legible instead of fading the entire reservoir into the background.
    this.scene.fog.near = Math.max(8, distance - 6);
    this.scene.fog.far = distance + 20;
  }
  zoomIn() {
    this.orbit.radius = Math.max(this.orbit.minRadius, this.orbit.radius - 2.0);
    this.updateCameraPosition();
  }
  zoomOut() {
    this.orbit.radius = Math.min(this.orbit.maxRadius, this.orbit.radius + 2.0);
    this.updateCameraPosition();
  }
  bindEvents() {
    this.onContextLost = event => {
      event.preventDefault();
      this.contextLost = true;
      this.stop();
      this.options.onContextLost?.();
    };
    this.onContextRestored = () => {
      if (this.disposed) return;
      this.contextLost = false;
      this.applyQualitySettings();
      this.render();
      this.start();
      this.options.onContextRestored?.();
    };
    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
    this.pointers = new Map();
    this.onPointerDown = e => {
      this.pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
      this.canvas.setPointerCapture(e.pointerId);
    };
    this.onPointerMove = e => {
      const prev = this.pointers.get(e.pointerId);
      if (!prev) return;
      const next = {x:e.clientX, y:e.clientY};
      if (this.pointers.size === 2) {
        const other = [...this.pointers.entries()].find(([id]) => id !== e.pointerId)[1];
        const before = Math.hypot(prev.x-other.x, prev.y-other.y);
        const after = Math.hypot(next.x-other.x, next.y-other.y);
        if (after > 0) this.orbit.radius = Math.max(9, Math.min(38, this.orbit.radius * before/after));
      } else {
        this.orbit.theta -= (next.x-prev.x)*.0065;
        // One-finger vertical movement belongs to page scrolling.
        if (e.pointerType !== "touch") this.orbit.phi = Math.max(.18, Math.min(1.42, this.orbit.phi-(next.y-prev.y)*.0065));
      }
      this.pointers.set(e.pointerId,next);
      this.options.onCameraChange?.(null);
      this.updateCameraPosition();
    };
    this.onPointerUp = e => {
      this.pointers.delete(e.pointerId);
      if (this.canvas.hasPointerCapture(e.pointerId)) this.canvas.releasePointerCapture(e.pointerId);
    };
    this.onWheel = e => {
      e.preventDefault();
      this.orbit.radius = Math.max(9, Math.min(38, this.orbit.radius + e.deltaY*.015));
      this.updateCameraPosition();
    };
    for (const [event, fn] of [["pointerdown",this.onPointerDown],["pointermove",this.onPointerMove],["pointerup",this.onPointerUp],["pointercancel",this.onPointerUp],["lostpointercapture",this.onPointerUp]]) this.canvas.addEventListener(event,fn);
    this.canvas.addEventListener("wheel",this.onWheel,{passive:false});
    this.resizeObserver = new ResizeObserver(()=>this.resize());
    this.resizeObserver.observe(this.canvas.parentElement);
    this.observer = new IntersectionObserver(([entry])=>{
      this.visible = entry.isIntersecting;
      this.visible ? this.start() : this.stop();
    });
    this.observer.observe(this.canvas);
    this.onVisibilityChange = ()=> document.hidden ? this.stop() : this.start();
    document.addEventListener("visibilitychange",this.onVisibilityChange);
  }
  setScenario(scenario) {
    this.scenario = scenario;
    this.instancedSpheres.visible = scenario === "sphere";
    this.instancedHex.visible = scenario === "hex";
    const count = scenario === "none" ? 120 : scenario === "sphere" ? 38 : 14;
    this.vapor.children.forEach((p,i)=>p.visible = i < count);
    this.vaporMesh.count = count;
    this.vaporMesh.material.opacity = scenario === "none" ? .34 : .18;
    this.render();
  }
  setTheme(theme) {
    this.theme = theme;
    this.scene.fog = new THREE.Fog(theme === "light" ? 0xeaf3f8 : 0x061017, 8, 34);
    this.updateFogRange();
    this.render();
  }
  setQuality(quality) {
    this.quality = quality;
    this.applyQualitySettings();
    this.render();
  }
  resize() {
    if (this.disposed) return;
    const {clientWidth:width, clientHeight:height} = this.canvas.parentElement;
    if (!width || !height || (this.width === width && this.height === height)) return;
    this.width = width; this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width,height,false);
    this.updateCameraPosition();
  }
  resetCamera() {
    this.setCameraPreset("general");
  }
  setCameraPreset(preset) {
    if (preset === "dam") {
      Object.assign(this.orbit, {theta: Math.PI - .35, phi: 1.02, radius: 12});
      this.orbit.target.set(0, .2, -1.8);
    } else if (preset === "top") {
      Object.assign(this.orbit, {theta: 0, phi: .18, radius: 16});
      this.orbit.target.set(0, 0, 0);
    } else {
      preset = "general";
      Object.assign(this.orbit,{theta:0,phi:Math.atan2(12,7.4),radius:Math.hypot(7.4,12)});
      this.orbit.target.set(0, 0, 0);
    }
    this.updateCameraPosition();
    this.options.onCameraChange?.(preset);
  }
  render() {
    if (!this.disposed && !this.contextLost && this.camera && this.renderer) this.renderer.render(this.scene,this.camera);
  }
  start() {
    if (this.disposed || this.contextLost || this.isRunning || document.hidden || !this.visible) return;
    this.isRunning = true;
    this.clock.start();
    this.animate();
  }
  stop() {
    this.isRunning = false;
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.animId = null;
  }
  animate() {
    if (!this.isRunning || this.disposed) return;
    const dt = Math.min(this.clock.getDelta(), .05);
    // Water, rings and cover matrices stay fixed: no intersecting surfaces,
    // animated opacity or changing highlights. Only original vapor moves.
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.vapor.children.forEach(p=>{
        if (!p.visible) return;
        p.position.y += p.userData.speed * dt * .48;
        if (p.position.y > 3.6) p.position.y = .22;
      });
      this.updateVaporInstances();
      this.render();
      this.animId = requestAnimationFrame(()=>this.animate());
    } else { this.render(); this.isRunning = false; }
  }
  dispose() {
    this.stop(); this.disposed = true;
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    this.resizeObserver.disconnect(); this.observer.disconnect();
    document.removeEventListener("visibilitychange",this.onVisibilityChange);
    for (const [event,fn] of [["pointerdown",this.onPointerDown],["pointermove",this.onPointerMove],["pointerup",this.onPointerUp],["pointercancel",this.onPointerUp],["lostpointercapture",this.onPointerUp],["wheel",this.onWheel]]) this.canvas.removeEventListener(event,fn);
    const geometries = new Set(), materials = new Set();
    this.scene.traverse(o=>{
      if(o.geometry) geometries.add(o.geometry);
      if(o.material) materials.add(o.material);
      if(o.isInstancedMesh) o.dispose();
      if(o.isLight && o.shadow) o.shadow.dispose();
    });
    geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose());
    this.scene.clear(); this.renderer.dispose(); this.renderer.forceContextLoss();
  }
}
export function render2DFallback(canvas, scenario, theme = "dark") {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle = theme === "light" ? "#eaf3f8" : "#061017"; ctx.fillRect(0,0,w,h);
  const r = Math.min(w,h)*.36;
  ctx.fillStyle = "#0f6f86"; ctx.beginPath(); ctx.ellipse(w/2,h/2,r,r*.65,0,0,Math.PI*2);ctx.fill();
  if (scenario !== "none") for(let x=-r;x<r;x+=18) for(let y=-r;y<r;y+=18) {
    if(Math.hypot(x,y)>r-10) continue;
    ctx.fillStyle = scenario === "hex" ? "#8ce7ff" : "#dceff3"; ctx.beginPath();
    if(scenario === "sphere") ctx.ellipse(w/2+x,h/2+y*.65,6,5,0,0,Math.PI*2);
    else for(let i=0;i<6;i++) {const a=i*Math.PI/3;ctx.lineTo(w/2+x+8*Math.cos(a),h/2+y*.65+6*Math.sin(a));}
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = theme === "light" ? "#0f172a" : "#eff8ff";ctx.font="14px sans-serif";ctx.textAlign="center";
  ctx.fillText("Representação 2D · WebGL indisponível",w/2,h-20);
}
