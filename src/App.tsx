import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

import styled from "styled-components";

import "./App.css";

const OrbitControls = require("three-orbit-controls")(THREE);

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: start;
`;

const Tools = styled.div`
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.canvas`
  height: 100%;
  flex-grow: 1;
`;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState((undefined as unknown) as THREE.Scene);
  const [camera, setCamera] = useState(
    (undefined as unknown) as THREE.PerspectiveCamera
  );
  const [renderer, setRenderer] = useState(
    (undefined as unknown) as THREE.WebGLRenderer
  );

  const [rayCaster] = useState(new THREE.Raycaster());
  const [zPlane, setZPlane] = useState(new THREE.Mesh());
  const [pickPosition, setPickPosition] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState(new THREE.Vector2());

  useEffect(() => {
    const handleResize = () => {
      console.log("resize");
      if (canvasRef.current && camera && renderer && scene) {
        const width = canvasRef.current?.clientWidth;
        const height = canvasRef.current?.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        renderer.render(scene, camera);
        console.log({ width, height });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      if (canvasRef.current) {
        const width = canvasRef.current?.clientWidth;
        const height = canvasRef.current?.clientHeight;

        const rect = canvasRef.current.getBoundingClientRect();
        let x = ((event.clientX - rect.left) * width) / rect.width;
        let y = ((event.clientY - rect.top) * height) / rect.height;

        x = (x / width) * 2 - 1;
        y = (y / height) * -2 + 1; // flip y-coord
        const pt = new THREE.Vector2(x, y);
        setMouse(new THREE.Vector2(x, y));

        // https://jsfiddle.net/prisoner849/x7gvvywo/
        if (zPlane) {
          rayCaster.setFromCamera(pt, camera);
          // console.log(pt);
          const intersectObjects = rayCaster.intersectObjects([zPlane]);
          if (intersectObjects.length) {
            const obj = intersectObjects[0];
            console.log(obj);
          }
        }

        // console.log({ x, y });
      }
    };

    window.addEventListener("resize", handleResize, false);
    window.addEventListener("mousemove", handleMouseMove, false);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [camera, renderer, scene]);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("gray");
    setScene(scene);
  }, []);

  useEffect(() => {
    if (!scene || !canvasRef.current) {
      return;
    }

    const width = canvasRef.current?.clientWidth || 200;
    const height = canvasRef.current?.clientHeight || 200;

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    setCamera(camera);

    // init graphic
    let planeGeo = new THREE.PlaneGeometry(60, 60);
    var plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({
        color: "lightgreen",
      })
    );
    setZPlane(plane);
    scene.add(plane);

    // const controls = new OrbitControls(camera);

    var renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(width, height);
    renderer.setClearColor(0x999999);
    setRenderer(renderer);
    // canvasRef.current?.appendChild(renderer.domElement);

    console.log(THREE);
    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    renderer.render(scene, camera);

    // var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // cube.position.z = -5;
    // scene.add(cube);
    // // camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    // renderer.render(scene, camera);

    // animate();
  }, [scene]);

  const handleAddCube = () => {
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = -5;
    scene.add(cube);
    render();
  };

  const handleAddLine = () => {
    let points = [];
    const w = 10;
    const h = 10;
    points.push(new THREE.Vector3(-w, -h, 0));
    points.push(new THREE.Vector3(-w, h, 0));
    points.push(new THREE.Vector3(w, h, 0));
    points.push(new THREE.Vector3(w, -h, 0));
    points.push(new THREE.Vector3(-w, -h, 0));
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(-w, h, 0));
    // var geometry = new THREE.BoxGeometry(2, 2, 2);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);

    var material = new THREE.MeshBasicMaterial({ color: "red" });
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    render();
  };

  const handleAddCircle = () => {
    // const geometry = new THREE.CircleGeometry(5, 32);
    // var material = new THREE.MeshBasicMaterial({ color: "yellow" });
    // var mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    var material = new THREE.MeshBasicMaterial({ color: "yellow" });
    const radius = 30;
    const segments = 32;
    const geometry = new THREE.CircleGeometry(radius, segments);
    geometry.vertices.shift();
    scene.add(new THREE.LineLoop(geometry, material));
    render();
  };

  const handleAddPlane = () => {
    const geometry = new THREE.PlaneGeometry(80, 80);
    geometry.rotateX(-Math.PI / 2);
    var material = new THREE.MeshBasicMaterial({ color: "green" });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    render();
  };

  const handleOnClick = (ev: any) => {
    console.log("Click:", ev);
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  return (
    <Container>
      <Tools>
        <button onClick={handleAddPlane}>Plane</button>
        <button onClick={handleAddCube}>Cube</button>
        <button onClick={handleAddLine}>Line</button>
        <button onClick={handleAddCircle}>Circle</button>
      </Tools>
      <Canvas ref={canvasRef} onClick={handleOnClick}></Canvas>
    </Container>
  );
}

export default App;
