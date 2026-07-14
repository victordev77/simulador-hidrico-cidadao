import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const SCENE_COLORS = {
  water: 0x0f6f86,
  cyan: 0x69f0ff,
  hex: 0x8ce7ff,
  sphere: 0xdceff3,
  vapor: 0xcff7ff,
  sun: 0xffe1a1
};

export class WaterScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scenario = "none";
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x061017, 8, 34);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.camera.position.set(0, 7.4, 12);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.vapor = new THREE.Group();
    this.coverGroup = new THREE.Group();
    this.root.add(this.coverGroup, this.vapor);

    this.createLights();
    this.createReservoir();
    this.createAtmosphere();
    this.setScenario("none");
    this.resize();
    this.animate();

    window.addEventListener("resize", () => this.resize());
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
    this.root.add(this.water);

    this.rippleLines = new THREE.Group();

    for (let i = 0; i < 7; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1 + i * 0.68, 1.015 + i * 0.68, 128),
        new THREE.MeshBasicMaterial({
          color: SCENE_COLORS.cyan,
          transparent: true,
          opacity: 0.08
        })
      );

      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.012 + i * 0.002;
      this.rippleLines.add(ring);
    }

    this.root.add(this.rippleLines);
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

  setScenario(scenario) {
    this.scenario = scenario;
    this.coverGroup.clear();
    this.vapor.clear();

    if (scenario === "hex") this.createHexCover();
    if (scenario === "sphere") this.createSphereCover();

    this.createVapor(scenario);
  }

  createHexCover() {
    const geometry = new THREE.CylinderGeometry(0.43, 0.43, 0.055, 6);

    const material = new THREE.MeshPhysicalMaterial({
      color: SCENE_COLORS.hex,
      roughness: 0.24,
      metalness: 0.16,
      transparent: true,
      opacity: 0.86,
      clearcoat: 1
    });

    const spacingX = 0.76;
    const spacingZ = 0.66;

    for (let row = -8; row <= 8; row += 1) {
      for (let col = -8; col <= 8; col += 1) {
        const x = col * spacingX + (row % 2) * spacingX * 0.5;
        const z = row * spacingZ;

        if (Math.hypot(x, z) < 5.58) {
          const tile = new THREE.Mesh(geometry, material);
          tile.position.set(x, 0.11, z);
          tile.rotation.y = Math.PI / 6;
          tile.castShadow = true;
          tile.receiveShadow = true;
          this.coverGroup.add(tile);
        }
      }
    }
  }

  createSphereCover() {
    const geometry = new THREE.SphereGeometry(0.23, 24, 16);

    const material = new THREE.MeshPhysicalMaterial({
      color: SCENE_COLORS.sphere,
      roughness: 0.18,
      metalness: 0.03,
      clearcoat: 1,
      transparent: true,
      opacity: 0.92
    });

    const dx = 0.52;
    const dz = (dx * Math.sqrt(3)) / 2;

    for (let row = -11; row <= 11; row += 1) {
      for (let col = -11; col <= 11; col += 1) {
        const x = col * dx + (row % 2) * dx * 0.5;
        const z = row * dz;

        if (Math.hypot(x, z) < 5.52) {
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(x, 0.24, z);
          sphere.castShadow = true;
          sphere.receiveShadow = true;
          sphere.userData.phase = Math.random() * Math.PI * 2;
          this.coverGroup.add(sphere);
        }
      }
    }
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
      opacity: scenario === "none" ? 0.34 : 0.18
    });

    const geometry = new THREE.SphereGeometry(0.035, 10, 10);

    for (let i = 0; i < count; i += 1) {
      const radius = Math.sqrt(Math.random()) * 5.6;
      const angle = Math.random() * Math.PI * 2;

      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.cos(angle) * radius,
        0.22 + Math.random() * 2.7,
        Math.sin(angle) * radius
      );

      particle.userData.baseY = particle.position.y;
      particle.userData.speed = 0.16 + Math.random() * 0.28;
      this.vapor.add(particle);
    }
  }

  resize() {
    const width = this.canvas.clientWidth || 900;
    const height = this.canvas.clientHeight || 560;

    this.camera.aspect = width / height;
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
  }

  animate() {
    const elapsed = this.clock.getElapsedTime();

    this.root.rotation.y = Math.sin(elapsed * 0.14) * 0.1;
    this.water.position.y = Math.sin(elapsed * 1.2) * 0.018;
    this.rippleLines.rotation.z = elapsed * 0.035;

    this.windLines.children.forEach((line, index) => {
      line.position.x = Math.sin(elapsed * line.userData.speed + index) * 0.35;
      line.material.opacity = 0.2 + Math.sin(elapsed + index) * 0.08;
    });

    this.vapor.children.forEach((particle, index) => {
      particle.position.y += particle.userData.speed * 0.008;
      particle.position.x += Math.sin(elapsed + index) * 0.002;

      if (particle.position.y > 3.6) {
        particle.position.y = 0.22;
      }
    });

    if (this.scenario === "sphere") {
      this.coverGroup.children.forEach((sphere, index) => {
        sphere.position.y =
          0.24 +
          Math.sin(elapsed * 1.4 + sphere.userData.phase + index * 0.01) *
            0.025;
      });
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}