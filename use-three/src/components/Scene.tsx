import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const style = { height: 250 };
class Scene extends React.Component {
  root: HTMLDivElement | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  controls: any;
  requestId: number = 0;

  cube: THREE.Mesh | undefined;

  componentDidMount() {
    this.sceneSetup();
    this.addCustomObjects();
    this.renderGraphic();
    this.startAnnimationLoop();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  sceneSetup = () => {
    if (!this.root) {
      return;
    }
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75, // fov  field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    this.camera.position.z = 5;

    this.controls = new OrbitControls(this.camera, this.root);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.root.appendChild(this.renderer.domElement);
  };

  addCustomObjects() {
    if (!this.scene) {
      return;
    }
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xaa4455,
      emissive: 0x072534,
      // side: THREE.DoubleSide,
      flatShading: true,
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 0, 100);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    for (let light of lights) {
      this.scene.add(light);
    }
  }

  handleResize = () => {
    if (!this.scene || !this.root || !this.renderer || !this.camera) {
      return;
    }
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderGraphic();
  };

  startAnnimationLoop = () => {
    if (!this.cube || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    // this.cube.rotation.z += 0.001;

    // this.cube.position.x += 0.01;

    this.renderer.render(this.scene, this.camera);
    this.requestId = window.requestAnimationFrame(this.startAnnimationLoop);
  };

  renderGraphic = () => {
    if (!this.cube || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={style}
        ref={(ref) => (this.root = ref as HTMLDivElement)}
      ></div>
    );
  }
}

export default Scene;
