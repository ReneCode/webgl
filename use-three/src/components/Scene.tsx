import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BaseNode, LineNode } from "./Node";

const style = { height: 550 };
class Scene extends React.Component {
  root: HTMLDivElement | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.OrthographicCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  controls: any;
  requestId: number = 0;

  viewSize: number = 900;
  ascpectRatio: number = 1;

  nodes: BaseNode[] = [];

  cube: THREE.Mesh | undefined;

  componentDidMount() {
    this.sceneSetup();
    this.addCustomObjects();
    this.renderGraphic();
    // this.startAnnimationLoop();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("wheel", this.handleWheel, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("wheel", this.handleWheel);
  }

  sceneSetup = () => {
    if (!this.root) {
      return;
    }
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;

    this.viewSize = 110;
    this.ascpectRatio = width / height;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#eee");

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    const viewPort = {
      aspectRatio: width / height,
      left: (-this.ascpectRatio * this.viewSize) / 2,
      right: (this.ascpectRatio * this.viewSize) / 2,
      top: this.viewSize / 2,
      bottom: -this.viewSize / 2,
      near: -100,
      far: 100,
    };
    this.camera = new THREE.OrthographicCamera(
      viewPort.left,
      viewPort.right,
      viewPort.top,
      viewPort.bottom,
      viewPort.near,
      viewPort.far
    );
    this.camera.position.z = 5;

    // this.controls = new OrbitControls(this.camera, this.root);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.root.appendChild(this.renderer.domElement);
  };

  addCustomObjects() {
    if (!this.scene) {
      return;
    }
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshPhongMaterial({
      color: "#f00",
    });
    this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(this.cube);
  }

  handleResize = () => {
    if (!this.scene || !this.root || !this.renderer || !this.camera) {
      return;
    }
    const width = this.root.clientWidth;
    const height = this.root.clientHeight;
    this.ascpectRatio = width / height;

    this.renderer.setSize(width, height);
    this.camera.updateProjectionMatrix();

    this.renderGraphic();
  };

  handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.metaKey || event.ctrlKey) {
      // zoomPinch
      if (this.camera) {
        const MAX_DELTA = 10;
        let delta = Math.min(Math.abs(event.deltaY), MAX_DELTA);
        const sign = Math.sign(event.deltaY);
        delta *= sign;
        const factor = 1 - delta / 100;

        this.camera.zoom *= factor;
        this.camera.updateProjectionMatrix();
        this.renderGraphic();
      }
    } else {
      // panning
      if (this.camera) {
        const deltaDevice = new THREE.Vector3(event.deltaX, -event.deltaY, 0);
        this.camera.position.add(deltaDevice);
        this.renderGraphic();
      }
    }
  };

  startAnnimationLoop = () => {
    if (!this.cube || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.cube.rotation.z += 0.001;

    this.cube.position.x += 0.1;

    this.renderer.render(this.scene, this.camera);
    this.requestId = window.requestAnimationFrame(this.startAnnimationLoop);
  };

  updateCamera = () => {
    if (this.camera) {
      this.camera.left = (-this.ascpectRatio * this.viewSize) / 2;
      this.camera.right = (this.ascpectRatio * this.viewSize) / 2;
      this.camera.top = this.viewSize / 2;
      this.camera.bottom = -this.viewSize / 2;
      this.camera.updateProjectionMatrix();
    }
  };

  createScene = () => {
    if (!this.scene) {
      return;
    }

    const addLine = (line: LineNode) => {
      let points = [];
      points.push(
        new THREE.Vector3(line.x1, line.y1, 0),
        new THREE.Vector3(line.x2, line.y2, 0)
      );
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: line.color });
      this.scene?.add(new THREE.Line(geometry, material));
    };
    for (let node of this.nodes) {
      if (node.type === "LINE") {
        addLine(node as LineNode);
      }
    }
  };

  renderGraphic = () => {
    if (!this.cube || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    this.renderer.render(this.scene, this.camera);
  };

  addLineNode = () => {
    const line = new LineNode();
    line.color = "#4f4";
    line.x1 = Math.random() * 200 + -100;
    line.y1 = Math.random() * 100 + -50;
    line.x2 = Math.random() * 200 + -100;
    line.y2 = Math.random() * 100 + -50;
    line.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)})`;
    this.nodes.push(line);
  };

  onAddElement = () => {
    for (let i = 0; i < 1000; i++) {
      this.addLineNode();
    }

    this.createScene();
    this.renderGraphic();
  };

  onMoveLeft = () => {
    this.camera?.position?.add(new THREE.Vector3(1, 0, 0));
    this.renderGraphic();
  };
  onZoom = (factor: number) => {
    this.viewSize *= factor;
    this.updateCamera();
    this.renderGraphic();
  };

  render() {
    return (
      <div>
        <span>
          <button onClick={this.onAddElement}>add</button>
          <button onClick={this.onMoveLeft}>{"<"}</button>
          <button onClick={() => this.onZoom(1 / 1.1)}>{"zoom-in"}</button>
          <button onClick={() => this.onZoom(1.1)}>{"zoom-out"}</button>
        </span>
        <div
          style={style}
          ref={(ref) => (this.root = ref as HTMLDivElement)}
        ></div>
      </div>
    );
  }
}

export default Scene;
