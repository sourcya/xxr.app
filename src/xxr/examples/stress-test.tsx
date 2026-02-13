import { XXR, Scene, Floor, Assets, GLB, StressGrid } from '../index'
import helmetUrl from './assets/damaged-helmet.glb?url'
import duckUrl from './assets/duck.glb?url'

export const StressTest = () => (
  <XXR
    start="stress"
    devtools
    withStats
    withStressTest
    shadows="soft"
    performance={{
      dpr: [1, 2],
      adaptiveDpr: true,
      adaptiveEvents: true,
    }}
    camera={{ position: [0, 8, 12], target: [0, 0, 0], fov: 60 }}
    orbit={{ minDistance: 3, maxDistance: 50, enableDamping: true }}
  >
    <Assets>
      <GLB id="helmet" src={helmetUrl} />
      <GLB id="duck" src={duckUrl} />
    </Assets>

    <Scene
      id="stress"
      background={{ type: 'color', value: '#0a0a14' }}
      lighting={{
        ambient: 0.3,
        directional: 0.8,
        direction: [5, 10, 5],
        shadows: { enabled: true, mapSize: 2048 },
      }}
    >
      <Floor size={100} color="#1a1a2a" opacity={0.5} grid gridSize={2.5} />
      <StressGrid asset="helmet" spacing={2.5} />
    </Scene>
  </XXR>
)
