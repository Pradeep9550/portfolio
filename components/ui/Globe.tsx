/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Color, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend } from "@react-three/fiber";
import countries from "@/data/globe.json";

// Fixing circular type reference by using `any`
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: any; // changed from JSX.IntrinsicElements["mesh"]
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = { order: number; startLat: number; startLng: number; endLat: number; endLng: number; arcAlt: number; color: string; };

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  ringSpeed?: number;
  ringPropagationSpeed?: number;
};

export const Globe = ({
  positions,
  globeConfig = {},
}: {
  positions: Position[];
  globeConfig?: GlobeConfig;
}) => {
  const globeRef = useRef<ThreeGlobe>(null);
  const camera = useRef(new PerspectiveCamera(75, aspect, 1, 1000));

  const defaultProps = useMemo(() => ({
    pointSize: 1,
    atmosphereColor: "#fff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ringSpeed: 1,
    ringPropagationSpeed: RING_PROPAGATION_SPEED,
    ...globeConfig,
  }), [globeConfig]);

  useEffect(() => {
    camera.current.position.z = cameraZ;
    camera.current.lookAt(new Vector3(0, 0, 0));
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.globeMaterial.color = new Color(defaultProps.globeColor!);
    globeRef.current.globeMaterial.emissive = new Color(defaultProps.emissive!);
    globeRef.current.globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity!;
    globeRef.current.globeMaterial.shininess = defaultProps.shininess!;
    globeRef.current.atmosphereColor = new Color(defaultProps.atmosphereColor!);
    globeRef.current.atmosphereAltitude = defaultProps.atmosphereAltitude!;
    globeRef.current.showAtmosphere = defaultProps.showAtmosphere!;
  }, [defaultProps]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.polygonsData(countries.features);
    globeRef.current.polygonCapColor(() => defaultProps.polygonColor!);
  }, [defaultProps.polygonColor]);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.arcsData(positions);
    globeRef.current.arcLength(defaultProps.arcLength!);
    globeRef.current.arcDashLength(0.4);
    globeRef.current.arcDashGap(0.8);
    globeRef.current.arcDashInitialGap(() => Math.random());
    globeRef.current.arcDashAnimateTime(defaultProps.arcTime!);
    globeRef.current.ringsData(positions);
    globeRef.current.ringMaxRadius(15);
    globeRef.current.ringPropagationSpeed(defaultProps.ringPropagationSpeed!);
    globeRef.current.ringRepeatPeriod(2000);
    globeRef.current.ringColor(() => "rgba(255, 165, 0, 0.4)");
  }, [positions, defaultProps]);

  return (
    <Canvas
      camera={camera.current}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(new Color(defaultProps.globeColor!))}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <primitive ref={globeRef} object={new ThreeGlobe()} />
    </Canvas>
  );
};
