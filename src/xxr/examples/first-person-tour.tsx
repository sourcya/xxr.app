import { XXR, Scene, Panel, Hotspot, Floor, Hero, Model, Assets, GLB, FBX } from '../index'
import helmetUrl from './assets/damaged-helmet.glb?url'
import duckUrl from './assets/duck.glb?url'
import foxUrl from './assets/fox.glb?url'
import wolfUrl from './assets/animated-wolf.glb?url'
import livingRoomUrl from './assets/living-room.fbx?url'

export const FirstPersonTour = () => (
  <XXR start="lobby" withXR withLoading withProgress>
    <Assets onAllLoaded={() => console.log('[museum] all exhibits loaded')}>
      <GLB id="helmet" src={helmetUrl} />
      <GLB id="duck" src={duckUrl} />
      <GLB id="fox" src={foxUrl} />
      <GLB id="wolf" src={wolfUrl} />
      <FBX id="living-room" src={livingRoomUrl} />
    </Assets>

    {/* Lobby — museum entrance with directory */}
    <Scene id="lobby" background={{ type: 'preset', value: 'city' }} lighting="studio">
      <Hero as="first-person" speed={4} />
      <Floor size={30} grid gridSize={2} color="#222" opacity={0.5} />

      <Panel at="front" height="eye">
        <h1 style={{ margin: '0 0 8px', fontSize: 22 }}>Virtual Museum</h1>
        <p style={{ margin: '0 0 12px', opacity: 0.7, fontSize: 13 }}>
          <strong>Click</strong> to look around, <strong>WASD</strong> to walk.
          Press <strong>Esc</strong> to release mouse. Click hotspots to visit galleries.
        </p>
        <div style={{ fontSize: 12, opacity: 0.5, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
          <div>Ancient Gallery — historical artifacts</div>
          <div>Nature Hall — wildlife exhibits</div>
          <div>Design Studio — product showcase</div>
        </div>
      </Panel>

      <Model asset="helmet" at="center" scale={0.6} grounded />

      <Hotspot at="front-left" to="ancient">Ancient Gallery</Hotspot>
      <Hotspot at="front-right" to="nature">Nature Hall</Hotspot>
      <Hotspot at="right" to="design">Design Studio</Hotspot>
    </Scene>

    {/* Ancient Gallery — dim lighting, proximity info panels */}
    <Scene id="ancient" background={{ type: 'preset', value: 'warehouse' }} lighting="dim">
      <Hero as="first-person" speed={3} mouseSensitivity={0.8} />
      <Floor size={40} teleportable color="#1a1a1a" opacity={0.6} />

      <Model asset="helmet" at="center" scale={2} grounded castShadow />

      <Panel at="front-right" readable near={4}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Battle-Worn Helmet</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          A PBR-rendered artifact from an ancient battlefield.
          Notice the dents and scratches — each tells a story of survival.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 11, opacity: 0.4 }}>
          Walk closer to read exhibit descriptions.
        </p>
      </Panel>

      <Model asset="duck" at="front-left" scale={0.5} grounded />
      <Panel at="front-left" height="eye" readable near={3}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Ceremonial Duck</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Rubber artifacts were common in early trade routes.
        </p>
      </Panel>

      <Model asset="duck" at="back-right" scale={0.4} grounded />

      <Hotspot at="back" to="lobby">Back to Lobby</Hotspot>
      <Hotspot at="left" to="nature">Nature Hall</Hotspot>
    </Scene>

    {/* Nature Hall — outdoor feel with animated wildlife */}
    <Scene id="nature" background={{ type: 'preset', value: 'forest' }} lighting="outdoor">
      <Hero as="first-person" speed={4} />
      <Floor size={60} teleportable color="#2d4a1e" opacity={0.3} contactShadows />

      <Model asset="fox" at="center" scale={0.02} animate grounded />
      <Panel at="center" height="eye" readable near={5}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Red Fox</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          <em>Vulpes vulpes</em> — the most widespread wild carnivore.
          Observe the animated walking cycle.
        </p>
      </Panel>

      <Model asset="wolf" at="right" scale={0.01} animate grounded />
      <Panel at="right" height="eye" readable near={5}>
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Grey Wolf</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          <em>Canis lupus</em> — apex predator of temperate forests.
          This specimen demonstrates skeletal animation.
        </p>
      </Panel>

      <Model asset="duck" at="front-left" scale={0.6} grounded />
      <Panel at="front-left" height="eye" readable near={3}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Rubber Duck</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          An invasive species found in bathrooms worldwide.
        </p>
      </Panel>

      <Hotspot at="back" to="lobby">Back to Lobby</Hotspot>
      <Hotspot at="back-left" to="ancient">Ancient Gallery</Hotspot>
      <Hotspot at="front" to="design">Design Studio</Hotspot>
    </Scene>

    {/* Design Studio — product showcase with varied placements */}
    <Scene id="design" background={{ type: 'preset', value: 'studio' }} lighting="studio">
      <Hero as="first-person" speed={3} />
      <Floor size={30} teleportable color="#333" opacity={0.4} grid gridSize={1} />

      <Model asset="living-room" at="back" scale={0.008} grounded />

      <Model asset="duck" at="front-left" scale={1.2} grounded lookAt="camera" />
      <Model asset="duck" at="front-right" scale={0.8} grounded lookAt="camera" />
      <Model asset="duck" at="center" scale={1.5} grounded lookAt="camera" />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Product Line</h2>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
          Three sizes available: S, M, and L.
          Each model faces the viewer using <code>lookAt="camera"</code>.
        </p>
      </Panel>

      <Panel at="back" height="eye" readable near={6}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Showroom Environment</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Background furniture loaded from FBX format.
          Grid floor helps with spatial awareness.
        </p>
      </Panel>

      <Hotspot at="back-left" to="lobby">Back to Lobby</Hotspot>
      <Hotspot at="left" to="nature">Nature Hall</Hotspot>
    </Scene>
  </XXR>
)
