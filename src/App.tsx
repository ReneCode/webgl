import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";

import "./App.css";

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

const Canvas = styled.div`
  height: 100%;
  flex-grow: 1;
`;

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState((undefined as unknown) as THREE.Scene);
  const [camera, setCamera] = useState(
    (undefined as unknown) as THREE.PerspectiveCamera
  );
  const [renderer, setRenderer] = useState(
    (undefined as unknown) as THREE.WebGLRenderer
  );

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
      }
    };
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [camera, renderer, scene]);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("gray");
    setScene(scene);
  }, []);

  useEffect(() => {
    if (!scene) {
      return;
    }

    const width = canvasRef.current?.clientWidth || 200;
    const height = canvasRef.current?.clientHeight || 200;
    console.log({ width, height });

    const camera = new THREE.PerspectiveCamera(90, width / height, 1, 100);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    setCamera(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    setRenderer(renderer);
    canvasRef.current?.appendChild(renderer.domElement);

    renderer.render(scene, camera);

    // var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // cube.position.z = -5;
    // scene.add(cube);
    // // camera.position.z = 5;

    // const animate = () => {
    //   requestAnimationFrame(animate);

    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    //   renderer.render(scene, camera);
    // };
    // renderer.render(scene, camera);

    // animate();
  }, [scene]);

  const handleAddCube = () => {
    var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.z = -5;
    scene.add(cube);
    render();
  };

  const handleAddLine = () => {
    let points = [];
    const w = 2;
    const h = 2;
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

  const render = () => {
    renderer.render(scene, camera);
  };

  return (
    <Container>
      <Tools>
        <button onClick={handleAddCube}>Cube</button>
        <button onClick={handleAddLine}>Line</button>
      </Tools>
      <Canvas ref={canvasRef}></Canvas>
    </Container>
  );
}

export default App;
