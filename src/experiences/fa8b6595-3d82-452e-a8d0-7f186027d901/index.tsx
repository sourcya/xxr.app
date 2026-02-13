import { XXR, Scene, Panel, Hotspot, Floor, Model, Assets, GLB } from '@xxr'
import helmetUrl from '../../xxr/examples/assets/damaged-helmet.glb?url'
import duckUrl from '../../xxr/examples/assets/duck.glb?url'

export const Experience = () => (
  <XXR start="welcome" withXR withLoading withProgress>
    <Assets>
      <GLB id="helmet" src={helmetUrl} />
      <GLB id="duck" src={duckUrl} />
    </Assets>

    <Scene id="welcome" background={{ type: 'preset', value: 'sunset' }} lighting="outdoor">
      <Floor size={30} teleportable contactShadows color="#3a5a2c" opacity={0.25} />

      <Model asset="helmet" at="center" scale={1.5} grounded castShadow />

      <Panel at="front" height="eye">
        <h1 style={{ margin: '0 0 8px', fontSize: 22 }}>Welcome</h1>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          A sample XXR experience. Click a hotspot to explore.
        </p>
      </Panel>

      <Hotspot at="front-right" to="gallery">Gallery</Hotspot>
    </Scene>

    <Scene id="gallery" background={{ type: 'preset', value: 'studio' }} lighting="studio">
      <Floor size={20} color="#222" opacity={0.4} />

      <Model asset="duck" at="front-left" scale={1.2} grounded lookAt="camera" />
      <Model asset="duck" at="center" scale={1.5} grounded lookAt="camera" />
      <Model asset="duck" at="front-right" scale={1.2} grounded lookAt="camera" />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Duck Gallery</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          Three ducks, each facing the viewer.
        </p>
      </Panel>

      <Hotspot at="back" to="welcome">Back</Hotspot>
    </Scene>
  </XXR>
)
