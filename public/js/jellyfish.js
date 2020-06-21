var scene = new THREE.Scene();
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var graph = new THREE.Object3D();
scene.add(graph);

var camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.5,
  500
);

var renderer = new THREE.WebGLRenderer({ alpha: true });
var color = new THREE.Color("#ffffff");

var texture = new THREE.TextureLoader().load("../assets/head.png");
var lineTexture = new THREE.TextureLoader().load("../assets/line.png");
texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.offset.set(0, 0);
texture.repeat.set(4, 1);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = 50;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
camera.position.z = 80;

var jellyfish = new THREE.Group();
var segments = [];

// draw top
var sg = new THREE.SphereGeometry(
  8,
  50,
  6,
  0,
  2 * Math.PI,
  0,
  0.48 * Math.PI,
  2 * Math.PI,
  2 * Math.PI
);

var sm = new THREE.MeshBasicMaterial({
  wireframe: false,
  map: texture,
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,
});
var head = new THREE.Mesh(sg, sm);

var tops = sg.vertices;

// noisy head bottom
for (let i = 0; i < tops.length; i++) {
  var x = tops[i].x;
  var y = tops[i].y;
  var z = tops[i].z;
  var value3d = new SimplexNoise().noise3d(x, y, z);
  tops[i].y = tops[i].y + value3d / 10;
}

// animate head
for (let i = 0; i < tops.length; i++) {
  var x = tops[i].x;
  var y = tops[i].y;
  var z = tops[i].z;

  let tl = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true });
  tl.to(tops[i], {
    duration: 1.5,
    y: y + i * 0.003,
    x: x + x * 0.1,
    z: z + z * 0.1,
    ease: "power1.inOut",
  });
}

jellyfish.add(head);
jellyfish.rotateX(0.2);

scene.add(jellyfish);

let tl = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true }).delay(0.3);
tl.to(jellyfish.position, { duration: 1.5, y: -2, ease: "power1.inOut" });

var animate = function (time) {
  requestAnimationFrame(animate);
  scene.position.y += 0.01;

  sg.verticesNeedUpdate = true;
  sg.uvsNeedUpdate = true;
  renderer.render(scene, camera);
};
animate();
