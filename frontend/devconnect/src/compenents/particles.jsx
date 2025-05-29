import React from 'react'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
function particles() {
    const particlesInit = async (main) => {
    await loadFull(main);
  };
  return (
    <Particles
  id="tsparticles"
  init={particlesInit}
  options={{
    background: { color: { value: "#000000" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize: true,
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        enable: true,
        distance: 120,
        color: "#ffffff",
        opacity: 0.1,      // very faint links
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 0.3,       // very slow movement
        direction: "none",
        outModes: { default: "bounce" },
      },
      number: {
        value: 50,        // fewer particles
        density: { enable: true, area: 800 },
      },
      opacity: {
        value: 0.15,      // very low opacity for subtle effect
      },
      size: {
        value: { min: 1, max: 3 },
      },
      shape: { type: "circle" },
      collisions: { enable: false },
    },
    detectRetina: true,
  }}
  className="absolute top-0 left-0 w-full h-full z-0"
/>
  )
}

export default particles
