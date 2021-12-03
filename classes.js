class smockParticles {
  constructor(scene) {
    const loader = new THREE.TextureLoader();
    // instantiate the particle group object
    const particleGroup = new SPE.Group({
      texture: {
        // Particle material
        value: loader.load("smock.png"),
      },
      // mixed mode
      blending: THREE.NormalBlending,
      // greatest amount
      maxParticleCount: 3000,
      // Is it affected by fog
      fog: true,
    });

    // particle generator
    const emitter = new SPE.Emitter({
      // The life cycle
      maxAge: {value: 28 },
      // particle position and spread
      position: {
        value: new THREE.Vector3(-0.35, 1.25, 0),
        spread: new THREE.Vector3(0.1, 0.05, 0.1),
      },
      // particle size and spread
      size: {
        value: [0.5, 1, 5],
        spread: [0, 0.1, 0.2],
      },
      // acceleration on three axes
      acceleration: {
        value: new THREE.Vector3(0, 0.002, 0),
      },
      // Rotate around the Y axis
      rotation: {
        axis: new THREE.Vector3(0, -1, 0),
        spread: new THREE.Vector3(0, 0, 0),
        angle: (720 * Math.PI) / 180,
      },
      velocity: {
        value: new THREE.Vector3(0.03, 0.06, 0.03),
        spread: new THREE.Vector3(0.025, 0.04, 0.025),
      },
      opacity: {
        value: [0.2, 0.4, 0],
      },
      color: {
        value: [new THREE.Color(0xaaaaaa), new THREE.Color(0xffffff)],
        spread: [new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(0, 0, 0)],
      },
      // Number of particles generated
      particleCount: 2500,
    });

    particleGroup.addEmitter(emitter);
    scene.add(particleGroup.mesh);
    this.emitter = emitter;
    this.particleGroup = particleGroup;

    this.stop = function () {
      emitter.enabled = false;
      emitter.disable();
    };

    this.start = function () {
      emitter.enabled = true;
      emitter.enable();
    };

    this.update = function (delta) {
      if (particleGroup) {
        particleGroup.tick(delta);
      }
    };
  }
}

class snowParticles {
  constructor(scene) {
    const loader = new THREE.TextureLoader();
    const particleGroup = new SPE.Group({
      texture: {
        value: loader.load("snow.png"),
      },
      fog: true,
      maxParticleCount: 3000,
    });

    const emitter = new SPE.Emitter({
      maxAge: {
        value: 16,
      },
      position: {
        value: new THREE.Vector3(0, 6, 0),
        spread: new THREE.Vector3(9, 0, 9),
      },
      rotation: {
      },
      acceleration: {
        value: new THREE.Vector3(0, -0.02, 0),
      },

      velocity: {
        value: new THREE.Vector3(0, -0.04, 0),
        spread: new THREE.Vector3(0.5, -0.01, 0.2),
      },

      color: {
        value: [new THREE.Color(0xccccff)],
      },

      opacity: {
        value: [1, 0.5],
      },

      size: {
        value: [0.05, 0.1],
        spread: [0.05, 0.1],
      },
      activeMultiplier: 0.5,
      particleCount: 3000,
    });

    particleGroup.addEmitter(emitter);
    emitter.enabled = true;
    scene.add(particleGroup.mesh);
    particleGroup.tick(16);
    this.emitter = emitter;
    this.particleGroup = particleGroup;
    this.stop = function () {
      emitter.disable();
    };
    this.start = function () {
      emitter.enable();
    };
    this.update = function (delta) {
      if (particleGroup) {
        particleGroup.tick(delta);
      }
    };
  }
}

class House {
  constructor(scene) {
    const textureLoader = new THREE.TextureLoader();
    // big house object
    const house = new THREE.Object3D();
    house.position.set(0, -0.02, 0);
    // First add the large object to the scene, and then slowly add other sub-objects
    scene.add(house);

    // Dim and not bright material
    var material = new THREE.MeshLambertMaterial({
      color: 0xff1111,
      wireframe: false,
    });
    // Pure color monochrome material
    var basicMaterial = new THREE.MeshBasicMaterial({
      color: 0xff1111,
      wireframe: false,
    });

    // Create the ground without receiving shadows
    // const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
    const uniforms = {
      resolution: {value: new THREE.Vector2(10, 10) },
      scale: {value: new THREE.Vector2(40, 40) },
      offset: {value: new THREE.Vector2(0, 0) },
    };
    const floorMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const floorGeometry = new THREE.PlaneBufferGeometry(10, 10, 1, 1);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    floor.receiveShadow = false;
    // Create a semi-transparent ground covering the ground to receive shadows
    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
    const shadowPlane = new THREE.Mesh(floorGeometry, shadowMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    shadowPlane.position.y = 0.001;
    scene.add(shadowPlane);

    // Create a pyramid-shaped roof
    const size = 0.25;
    const roofGeometry = new THREE.CylinderBufferGeometry(0, size * 3, size * 3, 4);
    // scale: {value: new THREE.Vector2(20, 20) },
    const grass = textureLoader.load("wood.jpg");
    // const cylinder = new THREE.Mesh(roofGeometry, basicMaterial.clone());
    grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
    grass.repeat.set(20,20);
    const ctexture = new THREE.MeshLambertMaterial({ map: grass });
    const cylinder = new THREE.Mesh(roofGeometry, ctexture);
    // cylinder.material.color.setHex(0xffffff);
    cylinder.rotation.y = (45 * Math.PI) / 180;
    cylinder.position.set(0, 0.8 + 0.35, 0);
    house.add(cylinder);

    // Create a rectangular chimney
    const chimneyGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
    const chimney = new THREE.Mesh(chimneyGeometry, basicMaterial.clone());
    chimney.material.color.setHex(0x222222);
    chimney.position.set(-0.35, 1.05, 0);
    house.add(chimney);

    // Create a hole in the middle of the chimney
    const holeGeometry = new THREE.CylinderBufferGeometry(0.08, 0.08, 0.1, 8);
    const hole = new THREE.Mesh(holeGeometry, material.clone());
    hole.material.color.setHex(0x222222);
    hole.position.set(0, 0.151, 0);
    chimney.add(hole);

    // Create windows
    const windowgeometry = new THREE.BoxGeometry(0.2, 0.2, 0.06);
    // move to the wall
    windowgeometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0.25, -0.0, -0.48)
    );
    const window = new THREE.Mesh(windowgeometry, material.clone());
    window.material.color.setHex(0xffffff);
    window.material.transparent = true;
    // The window is transparent
    window.material.opacity = 0.4;
    window.position.set(0, 0.4, 0.02);
    house.add(window);

    // dorr cut geometry
    const doorGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
    doorGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.15, -0.1, -0.5));

    var mergeGeometry = new THREE.Geometry();
    mergeGeometry.merge(window.geometry);
    mergeGeometry.merge(doorGeometry);

    // House
    const roomGeometry = new THREE.BoxGeometry(1, 0.8, 1);
    var box = new THREE.Mesh(roomGeometry);
    const cutgeo = box.clone();
    cutgeo.scale.multiplyScalar(0.9);
    // cut inner box
    var cube_bsp = THREE.CSG.fromMesh(box);
    var subtract_bsp = THREE.CSG.fromMesh(cutgeo);
    const emptyCube = cube_bsp.subtract(subtract_bsp);
    // cut door and window
    var sub = new THREE.Mesh(mergeGeometry);
    var subtract_bsp2 = THREE.CSG.fromMesh(sub);
    const result = emptyCube.subtract(subtract_bsp2);

    const houseMesh = THREE.CSG.toMesh(result, box.matrix);
    houseMesh.material = material;
    houseMesh.position.set(0, 0.4, 0);
    house.add(houseMesh);
    // Set the objects of the entire house to receive shadows
    house.traverse(function (object) {
      object.castShadow = true;
    });

    doorGeometry.center();
    // Make the rotation axis of the door at the edge
    doorGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0.2, 0, 0));

    const woodMaterial = material.clone();
    woodMaterial.color.setHex(0x876a14);

    // Create a door handle
    const knobGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16);
    knobGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    knobGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0.3, 0, -0.05));
    doorGeometry.merge(knobGeometry, knobGeometry.matrix, 6);

    const door = new THREE.Mesh(doorGeometry, woodMaterial);
    door.position.set(-0.35, 0.3, -0.45);
    // Open the door 75 degrees
    door.rotation.y = -75 * Math.PI / 180;
    house.add(door);
    door.castShadow = true;

    // Create a mailbox
    const postBoxCapGeometry = new THREE.CylinderGeometry(
      0.04,
      0.04,
      0.22,
      32,
      1,
      false,
      0,
      Math.PI
    );
    // Mailbox box, composed of semi-cylindrical and rectangular parallelepiped
    postBoxCapGeometry.applyMatrix4(
      new THREE.Matrix4().makeRotationZ((90 * Math.PI) / 180)
    );
    postBoxCapGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.2, 0));
    const postBoxGeometry = new THREE.BoxGeometry(0.22, 0.04, 0.08);
    postBoxGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.18, 0));
    postBoxGeometry.merge(postBoxCapGeometry);
    // Mailbox post
    const postBoxPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.16);
    postBoxPoleGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.08, 0));
    const postGeometry = new THREE.Geometry();
    postGeometry.merge(postBoxPoleGeometry, postBoxPoleGeometry.matrix, 0);
    postGeometry.merge(postBoxGeometry, postBoxGeometry.matrix, 1);
    // add different colors to the box and the column
    const poleMaterial = material.clone();
    poleMaterial.color.setHex(0x876a14);
    const boxMaterial = material.clone();
    boxMaterial.color.setHex(0x5b0202);
    const postMaterial = [
      poleMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
      boxMaterial,
    ];
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(0.3, 0, -1);
    post.castShadow = true;
    scene.add(post);

    // Add white lines on highways and highways
    const roadGeometry = new THREE.BoxGeometry(10, 0.01, 1);
    const stripGeometry = new THREE.BoxGeometry(0.7, 0.01, 0.1);
    const total = 6;
    for (let i = 0; i <total; i++) {
      const ht = total / 2;
      const clone = stripGeometry.clone();
      const matrix = new THREE.Matrix4().makeTranslation(i * 1.7-ht-1, 0.01, 0);
      roadGeometry.merge(clone, matrix, 6);
    }
    const asphaltMaterial = basicMaterial.clone();
    asphaltMaterial.color.setHex(0xa1aeb3);
    const stripMaterial = basicMaterial.clone();
    stripMaterial.color.setHex(0xdae0e6);
    const roadMaterial = [
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      asphaltMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
      stripMaterial,
    ];
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    scene.add(road);
    road.position.set(0, 0, -2.5);
  }
}
