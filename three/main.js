import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import SplineLoader from '@splinetool/loader';

// camera
const camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -100000, 100000);
camera.position.set(100, 0, 100);
camera.quaternion.setFromEuler(new THREE.Euler(-0.14, -0.52, -0.07));

// scene
const scene = new THREE.Scene();

// spline scene
const loader = new SplineLoader();
loader.load(
    'https://prod.spline.design/gHsdhuKGbvwDH03e/scene.splinecode',
    (splineScene) => {
        scene.add(splineScene);
        // manage color if need

        // let yellow = new THREE.MeshPhongMaterial({ color: 0xf5e942 })
        // let green = new THREE.MeshPhongMaterial({ color: 0x2b884a })
        // const cube = scene.getObjectByName("cube")
        // const ball = scene.getObjectByName("ball")
        // cube.material = yellow
        // ball.material = green
    }
);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// scene settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

scene.background = new THREE.Color('#1B1B1C');
renderer.setClearAlpha(1);

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.125;

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.left = window.innerWidth / - 2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / - 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
    controls.update();
    renderer.render(scene, camera);
}

// click interaction
renderer.domElement.addEventListener("click", onclick, true);
let selectedObject;
var raycaster = new THREE.Raycaster();
function onclick(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true); //array
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        // set matrix to update on change
        selectedObject.matrixAutoUpdate = true;
        console.log(selectedObject);
        switch (selectedObject.name) {
            case 'ball':
                selectedObject.material = new THREE.MeshPhongMaterial({ color: 0xf5e942 })
                gsap.to(selectedObject.position, { duration: .5, y: 100, ease: Power1.easeOut, });
                break;
            case 'cube':
                gsap.to(camera, {
                    duration: 1,
                    zoom: 2,
                    onUpdate: function () {

                        camera.updateProjectionMatrix();

                    }
                });
                gsap.to(camera.position, { duration: 1, x: -125, y: 25, z: 60, ease: Power1.easeOut, });
                break;
            default:
                return
        }
    }
}