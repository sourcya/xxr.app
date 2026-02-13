import { XXR, Scene, Panel, Hotspot, Floor, Hero, Model, Assets, GLB, FBX } from '../index'
import foxUrl from './assets/fox.glb?url'
import cesiumManUrl from './assets/cesium-man.glb?url'
import duckUrl from './assets/duck.glb?url'
import wolfUrl from './assets/animated-wolf.glb?url'
import helmetUrl from './assets/damaged-helmet.glb?url'
import livingRoomUrl from './assets/living-room.fbx?url'

export const ThirdPersonTour = () => (
  <XXR start="entrance" withXR withLoading withProgress>
    <Assets onAllLoaded={() => console.log('[sanctuary] all assets ready')}>
      <GLB id="fox" src={foxUrl} />
      <GLB id="cesium-man" src={cesiumManUrl} />
      <GLB id="duck" src={duckUrl} />
      <GLB id="wolf" src={wolfUrl} />
      <GLB id="helmet" src={helmetUrl} />
      <FBX id="living-room" src={livingRoomUrl} />
    </Assets>

    {/* Entrance — park welcome area with fox character */}
    <Scene id="entrance" background={{ type: 'preset', value: 'park' }} lighting="outdoor">
      <Hero as="third-person" character="fox" speed={3} idleClip="Survey" walkClip="Walk" />
      <Floor size={50} teleportable contactShadows color="#3a5a2c" opacity={0.25} />

      <Panel at="front" height="eye">
        <h1 style={{ margin: '0 0 8px', fontSize: 22 }}>Wildlife Sanctuary</h1>
        <p style={{ margin: '0 0 8px', opacity: 0.8, fontSize: 13 }}>
          <strong>Drag mouse</strong> to orbit camera, <strong>WASD</strong> to move.
          The fox turns to face your movement direction.
        </p>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.5 }}>
          Visit the Safari Zone to see other animals,
          or head to the Observatory for a panoramic view.
        </p>
      </Panel>

      <Model asset="duck" at="front-left" scale={0.6} grounded />
      <Model asset="duck" at="front-right" scale={0.6} grounded />

      <Hotspot at="front" to="safari">Safari Zone</Hotspot>
      <Hotspot at="right" to="observatory">Observatory</Hotspot>
    </Scene>

    {/* Safari Zone — animated wildlife in a forest */}
    <Scene id="safari" background={{ type: 'preset', value: 'forest' }} lighting="outdoor">
      <Hero as="third-person" character="fox" speed={4} idleClip="Survey" walkClip="Walk" />
      <Floor size={80} teleportable contactShadows color="#2d4a1e" opacity={0.2} />

      <Model asset="wolf" at="front-right" scale={0.012} animate grounded />
      <Panel at="front-right" height="eye" readable near={6}>
        <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>Grey Wolf Pack</h2>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
          Wolves travel in packs of 6-10. This lone scout patrols
          the forest edge. Animated with skeletal animation.
        </p>
      </Panel>

      <Model asset="duck" at="left" scale={0.8} grounded />
      <Model asset="duck" at="front-left" scale={0.5} grounded />
      <Model asset="duck" at="center" scale={1} grounded />

      <Panel at="center" height="eye" readable near={4}>
        <h2 style={{ margin: '0 0 6px', fontSize: 16 }}>Pond Area</h2>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
          The ducks gather near the central pond.
          Walk closer to read about each species.
        </p>
      </Panel>

      <Hotspot at="back" to="entrance">Back to Entrance</Hotspot>
      <Hotspot at="front" to="observatory">Observatory</Hotspot>
      <Hotspot at="back-right" to="rest-area">Rest Area</Hotspot>
    </Scene>

    {/* Observatory — elevated view, switch to human character */}
    <Scene
      id="observatory"
      background={{ type: 'preset', value: 'sunset' }}
      lighting="studio"
      camera={{ position: [0, 3, 6], target: [0, 1.5, 0], fov: 60 }}
      cameraTransition="smooth"
      cameraTransitionDuration={1.2}
    >
      <Hero as="third-person" character="cesium-man" speed={3} followOffset={[0, 4, -7]} />
      <Floor size={30} teleportable color="#444" opacity={0.4} />

      <Model asset="helmet" at="center" scale={2} grounded lookAt="camera" />

      <Panel at="front-left" height="eye">
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Observatory Deck</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.8 }}>
          Elevated viewpoint with sunset panorama.
          You&apos;re now controlling a human character.
        </p>
        <p style={{ margin: 0, fontSize: 11, opacity: 0.5 }}>
          Camera offset elevated for panoramic view.
          The telescope (helmet prop) tracks your view.
        </p>
      </Panel>

      <Hotspot at="back" to="safari">Safari Zone</Hotspot>
      <Hotspot at="back-right" to="rest-area">Rest Area</Hotspot>
      <Hotspot at="back-left" to="entrance">Entrance</Hotspot>
    </Scene>

    {/* Rest Area — relaxed atmosphere with auto-rotate */}
    <Scene
      id="rest-area"
      background={{ type: 'preset', value: 'apartment' }}
      lighting="dim"
      orbit={{ autoRotate: true, autoRotateSpeed: 0.5, maxDistance: 8, minDistance: 2 }}
    >
      <Hero as="third-person" character="cesium-man" speed={2} rotationSpeed={6} />
      <Floor size={20} color="#2a2a2a" opacity={0.5} />

      <Model asset="living-room" at="center" scale={0.008} grounded />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 6px', fontSize: 18 }}>Visitor Rest Area</h2>
        <p style={{ margin: '0 0 8px', fontSize: 13, opacity: 0.8 }}>
          A cozy lounge loaded from FBX format.
          The camera gently orbits around you.
        </p>
        <p style={{ margin: 0, fontSize: 11, opacity: 0.5 }}>
          Auto-rotate orbit with constrained distance.
          Dim lighting creates a relaxed atmosphere.
        </p>
      </Panel>

      <Hotspot at="left" to="entrance">Back to Entrance</Hotspot>
      <Hotspot at="right" to="safari">Safari Zone</Hotspot>
    </Scene>
  </XXR>
)
