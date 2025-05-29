import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { tsParticles } from '@tsparticles/engine'
import { loadBasic } from '@tsparticles/basic'

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadBasic(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: {
            value: '#0f172a',
          },
        },
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.5,
            random: true,
          },
          size: {
            value: 3,
            random: true,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: 'none',
            outMode: 'bounce',
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
      }}
    />
  )
}
