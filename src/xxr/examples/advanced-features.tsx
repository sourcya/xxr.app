import { XXR, Scene, Panel, Hotspot, Floor, Model, Light, Assets, GLB } from '../index'
import helmetUrl from './assets/damaged-helmet.glb?url'
import duckUrl from './assets/duck.glb?url'
import foxUrl from './assets/fox.glb?url'
import wolfUrl from './assets/animated-wolf.glb?url'

export const AdvancedFeatures = () => (
  <XXR start="backgrounds" devtools withXR withLoading withProgress>
    <Assets
      onAllLoaded={() => console.log('[advanced] all assets loaded')}
    >
      <GLB
        id="helmet"
        src={helmetUrl}
        onLoad={() => console.log('[advanced] helmet loaded')}
        onError={(err) => console.error('[advanced] helmet error:', err)}
      />
      <GLB id="duck" src={duckUrl} />
      <GLB id="fox" src={foxUrl} />
      <GLB id="wolf" src={wolfUrl} />
    </Assets>

    {/* Scene 1: Background Types Showcase */}
    <Scene
      id="backgrounds"
      background={{ type: 'color', value: '#1a1a2e' }}
      lighting="outdoor"
    >
      <Floor size={20} color="#111" opacity={0.5} />

      <Model asset="helmet" at="center" scale={1.5} grounded castShadow receiveShadow />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Background Types</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.85 }}>
          Current: <code>color: #1a1a2e</code>
        </p>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
          Navigate to see preset and other background types.
          Devtools are enabled — check the overlays.
        </p>
      </Panel>

      <Hotspot at="front-right" to="bg-preset">Preset Background</Hotspot>
      <Hotspot at="right" to="placement">Placement Grid</Hotspot>
    </Scene>

    {/* Scene 1b: Preset Background */}
    <Scene
      id="bg-preset"
      background={{ type: 'preset', value: 'sunset' }}
      lighting="outdoor"
      transition="dissolve"
    >
      <Floor size={30} teleportable color="#444" opacity={0.2} />

      <Model asset="duck" at="front-left" scale={0.8} animate grounded />
      <Model asset="duck" at="front-right" scale={0.8} animate grounded />

      <Panel at="center" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Drei Preset Background</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.85 }}>
          Current: <code>preset: sunset</code>
        </p>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>
          Drei provides 10 HDR environment presets.
          Dissolve transition was used to enter this scene.
        </p>
      </Panel>

      <Hotspot at="back" to="backgrounds">Color Background</Hotspot>
      <Hotspot at="front" to="placement">Placement Grid</Hotspot>
    </Scene>

    {/* Scene 2: Placement System — all 9 slots + heights */}
    <Scene
      id="placement"
      background={{ type: 'preset', value: 'warehouse' }}
      lighting="studio"
      transition="fade"
    >
      <Floor size={40} grid gridSize={1} color="#2a2a2a" opacity={0.4} />

      {/* All 9 placement slots at ground height */}
      <Model asset="helmet" at="front" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="front-left" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="front-right" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="left" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="right" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="back" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="back-left" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="back-right" height="ground" scale={0.6} grounded />
      <Model asset="helmet" at="center" height="ground" scale={0.6} grounded />

      {/* Height demonstrations */}
      <Model asset="duck" at="front" height="eye" scale={0.3} />
      <Model asset="duck" at="front" height="overhead" scale={0.3} />

      <Panel at="center" height="eye">
        <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>Placement System</h2>
        <p style={{ margin: '0 0 6px', fontSize: 12, opacity: 0.8 }}>
          9 helmets at all slot positions (ground height).
          Front column also shows eye + overhead ducks.
        </p>
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          <div>Slots: front, front-left, front-right, left, right, center, back, back-left, back-right</div>
          <div>Heights: ground, eye, overhead</div>
        </div>
      </Panel>

      <Hotspot at="center" height="overhead" to="lighting">Lighting Lab</Hotspot>
      <Hotspot at="back" height="eye" to="backgrounds">Backgrounds</Hotspot>
    </Scene>

    {/* Scene 3: Lighting Lab — presets and custom config */}
    <Scene
      id="lighting"
      background={{ type: 'color', value: '#0d0d0d' }}
      lighting={{
        ambient: 0.2,
        ambientColor: '#4fc3f7',
        directional: 1.2,
        directionalColor: '#ff9800',
        direction: [3, 8, 2],
        shadows: { enabled: true, mapSize: 2048, bias: -0.0001, radius: 2 },
      }}
    >
      <Floor size={30} contactShadows color="#111" opacity={0.6} />

      <Model asset="helmet" at="center" scale={2} grounded castShadow receiveShadow />
      <Model asset="duck" at="front-left" scale={1} grounded castShadow />
      <Model asset="fox" at="front-right" scale={0.02} animate grounded castShadow />

      <Light type="point" at={[3, 4, 0]} color="#ff6b9d" intensity={2} />
      <Light type="point" at={[-3, 4, 0]} color="#4fc3f7" intensity={2} />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Lighting Lab</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.85 }}>
          Custom lighting config with colored ambient + directional.
          Two point lights add dramatic color accents.
        </p>
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          <div>Ambient: 0.2 (#4fc3f7)</div>
          <div>Directional: 1.2 (#ff9800)</div>
          <div>Shadows: 2048px, radius 2</div>
          <div>Point lights: pink + cyan</div>
        </div>
      </Panel>

      <Hotspot at="back" to="placement">Placement Grid</Hotspot>
      <Hotspot at="right" to="lighting-presets">Lighting Presets</Hotspot>
      <Hotspot at="front" to="camera-lab">Camera Lab</Hotspot>
    </Scene>

    {/* Scene 3b: Lighting presets comparison */}
    <Scene
      id="lighting-presets"
      background={{ type: 'preset', value: 'studio' }}
      lighting="studio"
      transition="fade"
    >
      <Floor size={20} color="#333" opacity={0.3} />

      <Model asset="helmet" at="front-left" scale={1} grounded castShadow />
      <Model asset="helmet" at="center" scale={1} grounded castShadow />
      <Model asset="helmet" at="front-right" scale={1} grounded castShadow />

      <Panel at="front-left" height="eye">
        <div style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }}>Studio</div>
      </Panel>
      <Panel at="center" height="eye">
        <div style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }}>Outdoor</div>
      </Panel>
      <Panel at="front-right" height="eye">
        <div style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }}>Dim</div>
      </Panel>

      <Panel at="front" height="overhead">
        <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>Lighting Presets</h2>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Same helmet under 3 preset labels.
          Current scene uses &quot;studio&quot; preset globally.
        </p>
      </Panel>

      <Hotspot at="back" to="lighting">Custom Lighting</Hotspot>
    </Scene>

    {/* Scene 4: Camera & Orbit Lab */}
    <Scene
      id="camera-lab"
      background={{ type: 'preset', value: 'night' }}
      lighting="dim"
      camera={{ position: [0, 3, 8], target: [0, 0.5, 0], fov: 50 }}
      orbit={{
        minDistance: 3,
        maxDistance: 12,
        maxPolarAngle: Math.PI * 0.6,
        minPolarAngle: Math.PI * 0.2,
        enableDamping: true,
        dampingFactor: 0.05,
      }}
      cameraTransition="smooth"
      cameraTransitionDuration={1.5}
    >
      <Floor size={40} teleportable grid gridSize={2} color="#1a1a2a" opacity={0.5} />

      <Model asset="wolf" at="center" scale={0.015} animate grounded castShadow />
      <Model asset="duck" at="front-left" scale={0.8} grounded lookAt="center" />
      <Model asset="duck" at="front-right" scale={0.8} grounded lookAt="center" />

      <Panel at="right" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Camera & Orbit</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.85 }}>
          Custom camera: elevated position, narrow FOV (50).
          Smooth camera transition over 1.5 seconds.
        </p>
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          <div>Orbit: distance 3-12, polar constrained</div>
          <div>Damping: 0.05 factor</div>
          <div>Models use lookAt=&quot;center&quot;</div>
          <div>Animated wolf at center</div>
        </div>
      </Panel>

      <Hotspot at="back" to="lighting">Lighting Lab</Hotspot>
      <Hotspot at="front" to="backgrounds">Back to Start</Hotspot>
    </Scene>
  </XXR>
)
