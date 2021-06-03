import React from "react";
import * as THREE from "three";
import { createLine } from "./graphic";
import { BaseNode, LineNode } from "./Node";

const style = { height: 650 };
class Scene extends React.Component {
  root: HTMLDivElement | undefined;
  scene: THREE.Scene | undefined;
  camera: THREE.OrthographicCamera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  controls: any;
  requestId: number = 0;

  viewSize: number = 1000;
  ascpectRatio: number = 1;
  clientWidth: number = 1;
  clientHeight: number = 1;

  nodes: BaseNode[] = [];

  cube: THREE.Mesh | undefined;

  componentDidMount() {
    this.sceneSetup();
    this.addCustomObjects();

    this.createNodes();
    this.createScene();

    this.renderGraphic();
    // this.startAnnimationLoop();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("wheel", this.handleWheel, { passive: false });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("wheel", this.handleWheel);
  }

  getClientSize = () => {
    if (this.root) {
      this.clientWidth = this.root.clientWidth;
      this.clientHeight = this.root.clientHeight;
      this.ascpectRatio = this.clientWidth / this.clientHeight;
    }
  };

  sceneSetup = () => {
    if (!this.root) {
      return;
    }
    this.getClientSize();

    this.viewSize = 110;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#eee");

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    const viewPort = {
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
    this.renderer.setSize(this.clientWidth, this.clientHeight);
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
    this.getClientSize();
    this.renderer.setSize(this.clientWidth, this.clientHeight);

    this.camera.left = (-this.ascpectRatio * this.viewSize) / 2;
    this.camera.right = (this.ascpectRatio * this.viewSize) / 2;
    this.camera.top = this.viewSize / 2;
    this.camera.bottom = -this.viewSize / 2;
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
        const { x, y } = this.screenToWorld(event.deltaX, event.deltaY);
        console.log(x, y);
        const deltaDevice = new THREE.Vector3(event.deltaX, -event.deltaY, 0);
        deltaDevice.multiplyScalar(0.3);
        // const deltaDevice = new THREE.Vector3(x, -y, 0);
        deltaDevice.multiplyScalar(1 / this.camera.zoom);
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

  createNodes = () => {};

  createScene = () => {
    if (!this.scene) {
      return;
    }

    const addLine = (node: LineNode) => {
      if (false) {
        let points = [];

        points.push(
          new THREE.Vector2(5, 6),
          new THREE.Vector2(15, 16),
          new THREE.Vector2(15, 26),
          new THREE.Vector2(5, 6)
          // new THREE.Vector3(3, 2, 0),
          // new THREE.Vector3(13, 12, 0),
          // new THREE.Vector3(12, 23, 0),
          // new THREE.Vector3(2, 8, 0)
        );

        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        console.log(geometry);
        // geometry = new THREE.BoxGeometry(40, 5, 6);

        const material = new THREE.MeshBasicMaterial({
          color: "#e33",
          wireframe: true,
        });
        const obj = new THREE.Mesh(geometry, material);
        this.scene?.add(obj);
      }

      if (true) {
        var material = new THREE.MeshBasicMaterial({
          color: 0xcc2266,
          wireframe: true,
        });

        const v1 = new THREE.Vector2(node.x2 - node.x1, node.y2 - node.y1);
        v1.normalize();
        v1.multiplyScalar(node.width / 2);
        const vdX = v1.y;

        const vdY = -v1.x;

        console.log(node, vdX, vdY);
        const shape = new THREE.Shape();
        shape.moveTo(node.x1 + vdX, node.y1 + vdY);
        shape.lineTo(node.x2 + vdX, node.y2 + vdY);
        shape.lineTo(node.x2 - vdX, node.y2 - vdY);
        shape.lineTo(node.x1 - vdX, node.y1 - vdY);

        let geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        this.scene?.add(mesh);
      }

      // const thickLine = new THREE.LineSegments(geometry, material);

      // let width = line.x2 - line.x1;
      // if (width < 0) {
      //   width = -width;
      // }
      // let height = line.y2 - line.y1;
      // if (height < 0) {
      //   height = -height;
      // }

      // const plane = new THREE.PlaneGeometry(width, height);
      // const mesh = new THREE.Mesh(plane, material);
      // mesh.position.set(line.x1, line.y1, 0);

      // this.scene?.add(mesh);
    };
    for (let node of this.nodes) {
      if (node.type === "LINE") {
        this.scene.add(createLine(node as LineNode));
      }
    }
    const l = new LineNode();
    l.x1 = 0;
    l.y1 = 0;
    l.x2 = 60;
    l.y2 = 20;
    l.width = 10;
    // addLine(l);

    this.scene.add(createLine(l));
  };

  renderGraphic = () => {
    if (!this.cube || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    this.renderer.render(this.scene, this.camera);
  };

  //https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
  screenToWorld = (x: number, y: number): { x: number; y: number } => {
    if (!this.camera) {
      return { x, y };
    }
    let vec = new THREE.Vector3(
      (x / this.clientWidth) * 2 - 1,
      -(y / this.clientHeight) * 2 + 1,
      0
    );
    vec.project(this.camera);

    let nullVec = new THREE.Vector3(0, 0, 0);
    nullVec.project(this.camera);
    return { x: vec.x - nullVec.x, y: vec.y - nullVec.y };
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

  draw = () => {
    this.createScene();
    this.renderGraphic();
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
