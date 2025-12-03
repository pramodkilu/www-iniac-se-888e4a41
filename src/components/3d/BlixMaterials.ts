import * as THREE from "three";

// BLIX Brand Colors with realistic materials
export const createBlixMaterials = () => {
  // Orange pillar material - glossy plastic look
  const orangePlastic = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    roughness: 0.3,
    metalness: 0.1,
    envMapIntensity: 0.5,
  });

  // Teal connector material
  const tealPlastic = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    roughness: 0.35,
    metalness: 0.1,
    envMapIntensity: 0.5,
  });

  // Metal shaft material - brushed steel
  const metalShaft = new THREE.MeshStandardMaterial({
    color: 0xb8c4ce,
    roughness: 0.2,
    metalness: 0.9,
    envMapIntensity: 0.8,
  });

  // Rubber wheel material
  const rubberWheel = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9,
    metalness: 0.0,
  });

  // Wheel hub material
  const wheelHub = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.4,
    metalness: 0.6,
  });

  // Orange hub accent
  const orangeHub = new THREE.MeshStandardMaterial({
    color: 0xff6b35,
    roughness: 0.3,
    metalness: 0.2,
  });

  return {
    orangePlastic,
    tealPlastic,
    metalShaft,
    rubberWheel,
    wheelHub,
    orangeHub,
  };
};

// Create realistic P7X11 U-shaped pillar
export const createP7X11Pillar = (materials: ReturnType<typeof createBlixMaterials>) => {
  const pillarGroup = new THREE.Group();
  
  // Main U-shape with rounded edges using ExtrudeGeometry
  const shape = new THREE.Shape();
  const width = 0.5;
  const height = 1.4;
  const thickness = 0.12;
  const radius = 0.03;
  
  // Create U-shape path
  shape.moveTo(-width/2 + radius, 0);
  shape.lineTo(-width/2 + radius, height);
  shape.quadraticCurveTo(-width/2, height, -width/2, height - radius);
  shape.lineTo(-width/2, radius);
  shape.quadraticCurveTo(-width/2, 0, -width/2 + radius, 0);
  shape.lineTo(-width/2 + thickness, 0);
  shape.lineTo(-width/2 + thickness, height - thickness);
  shape.lineTo(width/2 - thickness, height - thickness);
  shape.lineTo(width/2 - thickness, 0);
  shape.lineTo(width/2 - radius, 0);
  shape.quadraticCurveTo(width/2, 0, width/2, radius);
  shape.lineTo(width/2, height - radius);
  shape.quadraticCurveTo(width/2, height, width/2 - radius, height);
  shape.lineTo(-width/2 + radius, height);
  
  const extrudeSettings = {
    steps: 1,
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
  };
  
  // Use simpler box geometry for better performance
  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.4, 0.12),
    materials.orangePlastic
  );
  leftArm.position.set(-0.19, 0, 0);
  leftArm.castShadow = true;
  leftArm.receiveShadow = true;
  
  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.4, 0.12),
    materials.orangePlastic
  );
  rightArm.position.set(0.19, 0, 0);
  rightArm.castShadow = true;
  rightArm.receiveShadow = true;
  
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.12, 0.12),
    materials.orangePlastic
  );
  base.position.set(0, -0.64, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  
  pillarGroup.add(leftArm, rightArm, base);
  
  // Add holes along the arms (realistic BLIX holes)
  const holeGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 16);
  const holeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    roughness: 0.8,
    metalness: 0.0,
  });
  
  for (let i = 0; i < 7; i++) {
    const holeY = -0.5 + (i * 0.17);
    
    // Left arm holes
    const holeLeft = new THREE.Mesh(holeGeom, holeMaterial);
    holeLeft.position.set(-0.19, holeY, 0);
    holeLeft.rotation.x = Math.PI / 2;
    pillarGroup.add(holeLeft);
    
    // Right arm holes
    const holeRight = new THREE.Mesh(holeGeom, holeMaterial);
    holeRight.position.set(0.19, holeY, 0);
    holeRight.rotation.x = Math.PI / 2;
    pillarGroup.add(holeRight);
  }
  
  return pillarGroup;
};

// Create realistic CT2 connector
export const createCT2Connector = (materials: ReturnType<typeof createBlixMaterials>) => {
  const connectorGroup = new THREE.Group();
  
  // Main body - cylinder with grooves
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.25, 24),
    materials.tealPlastic
  );
  body.castShadow = true;
  body.receiveShadow = true;
  
  // Flanges at ends
  const flangeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 24);
  const flange1 = new THREE.Mesh(flangeGeom, materials.tealPlastic);
  flange1.position.y = 0.11;
  flange1.castShadow = true;
  
  const flange2 = new THREE.Mesh(flangeGeom, materials.tealPlastic);
  flange2.position.y = -0.11;
  flange2.castShadow = true;
  
  connectorGroup.add(body, flange1, flange2);
  
  return connectorGroup;
};

// Create realistic SH170 shaft
export const createSH170Shaft = (materials: ReturnType<typeof createBlixMaterials>, length = 1.7) => {
  const shaftGroup = new THREE.Group();
  
  // Main shaft cylinder
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, length, 24),
    materials.metalShaft
  );
  shaft.rotation.z = Math.PI / 2;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  
  // End caps
  const capGeom = new THREE.SphereGeometry(0.045, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const cap1 = new THREE.Mesh(capGeom, materials.metalShaft);
  cap1.position.x = length / 2;
  cap1.rotation.z = -Math.PI / 2;
  
  const cap2 = new THREE.Mesh(capGeom, materials.metalShaft);
  cap2.position.x = -length / 2;
  cap2.rotation.z = Math.PI / 2;
  
  shaftGroup.add(shaft, cap1, cap2);
  
  return shaftGroup;
};

// Create realistic BLIX wheel
export const createBlixWheel = (materials: ReturnType<typeof createBlixMaterials>) => {
  const wheelGroup = new THREE.Group();
  
  // Outer tire - torus shape for realistic wheel
  const tireGeom = new THREE.TorusGeometry(0.35, 0.12, 16, 32);
  const tire = new THREE.Mesh(tireGeom, materials.rubberWheel);
  tire.rotation.x = Math.PI / 2;
  tire.castShadow = true;
  tire.receiveShadow = true;
  wheelGroup.add(tire);
  
  // Inner rim
  const rimGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32);
  const rim = new THREE.Mesh(rimGeom, materials.wheelHub);
  rim.rotation.z = Math.PI / 2;
  rim.castShadow = true;
  wheelGroup.add(rim);
  
  // Hub center - orange BLIX accent
  const hubGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 16);
  const hub = new THREE.Mesh(hubGeom, materials.orangeHub);
  hub.rotation.z = Math.PI / 2;
  wheelGroup.add(hub);
  
  // Spokes
  const spokeGeom = new THREE.BoxGeometry(0.02, 0.2, 0.04);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const spoke = new THREE.Mesh(spokeGeom, materials.wheelHub);
    spoke.position.set(0, Math.cos(angle) * 0.14, Math.sin(angle) * 0.14);
    spoke.rotation.x = angle;
    wheelGroup.add(spoke);
  }
  
  // Tread pattern
  const treadGeom = new THREE.BoxGeometry(0.08, 0.02, 0.12);
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const tread = new THREE.Mesh(treadGeom, new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.95,
    }));
    tread.position.set(
      0,
      Math.cos(angle) * 0.44,
      Math.sin(angle) * 0.44
    );
    tread.rotation.x = angle + Math.PI / 2;
    wheelGroup.add(tread);
  }
  
  return wheelGroup;
};

// Create complete BLIX cart assembly
export const createBlixCartAssembly = () => {
  const materials = createBlixMaterials();
  const cartGroup = new THREE.Group();
  
  // Two P7X11 pillars
  const pillar1 = createP7X11Pillar(materials);
  pillar1.position.set(-0.8, 0, 0);
  pillar1.rotation.y = Math.PI / 2;
  cartGroup.add(pillar1);
  
  const pillar2 = createP7X11Pillar(materials);
  pillar2.position.set(0.8, 0, 0);
  pillar2.rotation.y = Math.PI / 2;
  cartGroup.add(pillar2);
  
  // CT2 connectors
  const connector1 = createCT2Connector(materials);
  connector1.position.set(-0.8, -0.7, -0.2);
  cartGroup.add(connector1);
  
  const connector2 = createCT2Connector(materials);
  connector2.position.set(-0.8, -0.7, 0.2);
  cartGroup.add(connector2);
  
  const connector3 = createCT2Connector(materials);
  connector3.position.set(0.8, -0.7, -0.2);
  cartGroup.add(connector3);
  
  const connector4 = createCT2Connector(materials);
  connector4.position.set(0.8, -0.7, 0.2);
  cartGroup.add(connector4);
  
  // SH170 axle shafts
  const axle1 = createSH170Shaft(materials, 0.6);
  axle1.position.set(-0.8, -0.7, 0);
  axle1.rotation.y = Math.PI / 2;
  cartGroup.add(axle1);
  
  const axle2 = createSH170Shaft(materials, 0.6);
  axle2.position.set(0.8, -0.7, 0);
  axle2.rotation.y = Math.PI / 2;
  cartGroup.add(axle2);
  
  // Four wheels
  const wheel1 = createBlixWheel(materials);
  wheel1.position.set(-0.8, -0.7, -0.4);
  cartGroup.add(wheel1);
  
  const wheel2 = createBlixWheel(materials);
  wheel2.position.set(-0.8, -0.7, 0.4);
  cartGroup.add(wheel2);
  
  const wheel3 = createBlixWheel(materials);
  wheel3.position.set(0.8, -0.7, -0.4);
  cartGroup.add(wheel3);
  
  const wheel4 = createBlixWheel(materials);
  wheel4.position.set(0.8, -0.7, 0.4);
  cartGroup.add(wheel4);
  
  // Connecting beam
  const beamGeom = new THREE.BoxGeometry(1.8, 0.1, 0.1);
  const beam = new THREE.Mesh(beamGeom, materials.orangePlastic);
  beam.position.set(0, -0.64, 0);
  beam.castShadow = true;
  cartGroup.add(beam);
  
  return { cartGroup, materials };
};

// Setup professional lighting
export const setupStudioLighting = (scene: THREE.Scene) => {
  // Main key light
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(5, 10, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);
  
  // Fill light (softer, from opposite side)
  const fillLight = new THREE.DirectionalLight(0xffeedd, 0.5);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);
  
  // Rim light (highlights edges)
  const rimLight = new THREE.DirectionalLight(0xaaddff, 0.4);
  rimLight.position.set(0, 5, -10);
  scene.add(rimLight);
  
  // Ambient light (soft overall illumination)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  
  // Hemisphere light (sky/ground color gradient)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);
  
  return { keyLight, fillLight, rimLight, ambientLight, hemiLight };
};

// Create ground/surface with realistic material
export const createSurface = (surfaceType: 'ice' | 'wood' | 'carpet' | 'rough') => {
  const surfaceConfigs = {
    ice: {
      color: 0x88ccff,
      roughness: 0.1,
      metalness: 0.3,
      texture: null,
    },
    wood: {
      color: 0xd4a574,
      roughness: 0.6,
      metalness: 0.0,
      texture: null,
    },
    carpet: {
      color: 0xcc5555,
      roughness: 0.95,
      metalness: 0.0,
      texture: null,
    },
    rough: {
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1,
      texture: null,
    },
  };
  
  const config = surfaceConfigs[surfaceType];
  
  const surfaceGeom = new THREE.PlaneGeometry(12, 5);
  const surfaceMat = new THREE.MeshStandardMaterial({
    color: config.color,
    roughness: config.roughness,
    metalness: config.metalness,
    side: THREE.DoubleSide,
  });
  
  const surface = new THREE.Mesh(surfaceGeom, surfaceMat);
  surface.rotation.x = -Math.PI / 2;
  surface.receiveShadow = true;
  
  return { surface, material: surfaceMat };
};
