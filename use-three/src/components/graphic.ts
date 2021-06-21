import * as THREE from "three";

import { LineNode } from "./Node";

export const createSceneLine = (line: LineNode): THREE.Object3D => {
  const material = new THREE.MeshBasicMaterial({
    color: line.color,
    wireframe: false,
  });

  let tObj: THREE.Object3D;
  if (line.width > 0) {
    const v1 = new THREE.Vector2(line.x2 - line.x1, line.y2 - line.y1);
    v1.normalize();
    v1.multiplyScalar(line.width / 2);
    const vdX = v1.y;
    const vdY = -v1.x;

    const shape = new THREE.Shape();
    shape.moveTo(line.x1 + vdX, line.y1 + vdY);
    shape.lineTo(line.x2 + vdX, line.y2 + vdY);
    shape.lineTo(line.x2 - vdX, line.y2 - vdY);
    shape.lineTo(line.x1 - vdX, line.y1 - vdY);

    let geometry = new THREE.ShapeGeometry(shape);
    tObj = new THREE.Mesh(geometry, material);
  } else {
    let points = [];

    points.push(
      new THREE.Vector3(line.x1, line.y1, 0),
      new THREE.Vector3(line.x2, line.y2, 0)
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: line.color });

    tObj = new THREE.Line(geometry, material);
  }
  tObj.name = line.id;
  return tObj;
};

export const exchangeSceneObject = (
  scene: THREE.Scene,
  newObj: THREE.Object3D
) => {
  const foundIdx = scene.children.findIndex((o) => o.name === newObj.name);
  if (foundIdx >= 0) {
    const oldObj = scene.children[foundIdx];
    console.log(oldObj.id, newObj.id);
    // const id = oldObj.id;
    // newObj.id = id;
    scene.children.splice(foundIdx, 1, newObj);
  }
};
