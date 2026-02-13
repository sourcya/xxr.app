import { XXR, Scene, Panel, Hotspot, Floor, Model, Assets, GLB } from '../index'
import helmetUrl from './assets/damaged-helmet.glb?url'
import duckUrl from './assets/duck.glb?url'
import foxUrl from './assets/fox.glb?url'

export const MultiSlidePresentation = () => (
  <XXR
    start="title"
    withLoading
    withProgress
    camera={{ position: [0, 1.6, 4], target: [0, 1.2, 0] }}
  >
    <Assets onAllLoaded={() => console.log('[presentation] assets ready')}>
      <GLB id="helmet" src={helmetUrl} />
      <GLB id="duck" src={duckUrl} />
      <GLB id="fox" src={foxUrl} />
    </Assets>

    {/* Slide 1: Title */}
    <Scene
      id="title"
      background={{ type: 'color', value: '#0a0a1e' }}
      lighting="dim"
      transition="fade"
    >
      <Floor size={20} visible={false} />

      <Panel at="center" height="eye">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: 28, letterSpacing: -0.5 }}>Acme Corp</h1>
          <p style={{ margin: '0 0 16px', fontSize: 16, opacity: 0.5, fontWeight: 300 }}>
            Product Launch 2026
          </p>
          <div style={{ width: 40, height: 2, background: '#4fc3f7', margin: '0 auto 16px' }} />
          <p style={{ margin: 0, fontSize: 12, opacity: 0.35 }}>
            An immersive presentation built with XXR
          </p>
        </div>
      </Panel>

      <Hotspot at="front-right" to="challenge">Next: The Challenge</Hotspot>
    </Scene>

    {/* Slide 2: The Challenge */}
    <Scene
      id="challenge"
      background={{ type: 'preset', value: 'sunset' }}
      lighting="outdoor"
      transition="dissolve"
      cameraTransition="smooth"
      cameraTransitionDuration={0.8}
    >
      <Floor size={20} visible={false} />

      <Model asset="helmet" at="center" scale={1.8} grounded castShadow />

      <Panel at="left" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>The Challenge</h2>
        <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.85 }}>
          Existing solutions are battle-worn and outdated.
          Teams waste hours on fragmented tools that don&apos;t communicate.
        </p>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, opacity: 0.7 }}>
          <li>40% of time lost to context switching</li>
          <li>3x more errors in handoff processes</li>
          <li>Zero spatial awareness in reviews</li>
        </ul>
      </Panel>

      <Hotspot at="front-left" to="title">Previous</Hotspot>
      <Hotspot at="front-right" to="solution">Next: Our Solution</Hotspot>
    </Scene>

    {/* Slide 3: The Solution — product reveal with auto-rotate */}
    <Scene
      id="solution"
      background={{ type: 'preset', value: 'studio' }}
      lighting="studio"
      transition="fade"
      orbit={{ autoRotate: true, autoRotateSpeed: 1.5, minDistance: 2, maxDistance: 6 }}
      cameraTransition="smooth"
      cameraTransitionDuration={1}
    >
      <Floor size={20} color="#222" opacity={0.3} contactShadows />

      <Model asset="duck" at="center" scale={2} grounded castShadow lookAt="camera" />

      <Panel at="right" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>Introducing DuckPro</h2>
        <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.85 }}>
          One unified platform. Zero rubber-ducking required.
          The model auto-rotates so you can see every angle.
        </p>
        <div style={{ background: 'rgba(79,195,247,0.15)', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
          Auto-rotating orbit camera for product showcase
        </div>
      </Panel>

      <Hotspot at="front-left" to="challenge">Previous</Hotspot>
      <Hotspot at="front-right" to="features">Next: Features</Hotspot>
    </Scene>

    {/* Slide 4: Features — multiple models at placement slots */}
    <Scene
      id="features"
      background={{ type: 'preset', value: 'warehouse' }}
      lighting="studio"
      transition="dissolve"
      cameraTransition="smooth"
      cameraTransitionDuration={0.8}
    >
      <Floor size={30} color="#2a2a2a" opacity={0.4} grid gridSize={2} />

      <Model asset="helmet" at="front-left" height="ground" scale={0.8} grounded castShadow />
      <Model asset="duck" at="center" height="ground" scale={1.2} grounded castShadow />
      <Model asset="helmet" at="front-right" height="ground" scale={0.8} grounded castShadow />

      <Panel at="front-left" height="eye" readable near={4}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Protection</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Enterprise-grade security with battle-tested armor.
        </p>
      </Panel>

      <Panel at="center" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Three Pillars</h2>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Walk closer to each product to learn more.
          Proximity panels reveal details within 4 meters.
        </p>
      </Panel>

      <Panel at="front-right" height="eye" readable near={4}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Durability</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          Built to withstand the toughest production environments.
        </p>
      </Panel>

      <Hotspot at="back-left" to="solution">Previous</Hotspot>
      <Hotspot at="front" to="demo">Next: Live Demo</Hotspot>
    </Scene>

    {/* Slide 5: Interactive Demo — walkable with animated model */}
    <Scene
      id="demo"
      background={{ type: 'preset', value: 'dawn' }}
      lighting="outdoor"
      transition="fade"
    >
      <Floor size={40} teleportable contactShadows color="#3a5a2c" opacity={0.2} />

      <Model asset="fox" at="center" scale={0.025} animate grounded />

      <Panel at="front" height="eye">
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Live Demo</h2>
        <p style={{ margin: '0 0 10px', fontSize: 13, opacity: 0.85 }}>
          Our AI assistant is fully animated and interactive.
          This scene is explorable — click the floor to teleport.
        </p>
      </Panel>

      <Panel at="right" readable near={5}>
        <h3 style={{ margin: '0 0 4px', fontSize: 14 }}>Did You Know?</h3>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
          This animated fox uses skeletal animation with
          automatic AnimationMixer lifecycle management.
        </p>
      </Panel>

      <Model asset="duck" at="front-left" scale={0.5} grounded />
      <Model asset="duck" at="front-right" scale={0.5} grounded />

      <Hotspot at="back" to="features">Previous</Hotspot>
      <Hotspot at="front" to="closing">Next: Closing</Hotspot>
    </Scene>

    {/* Slide 6: Closing — call to action */}
    <Scene
      id="closing"
      background={{ type: 'color', value: '#1a1a2e' }}
      lighting="dim"
      transition="fade"
      cameraTransition="smooth"
      cameraTransitionDuration={1.2}
    >
      <Floor size={20} visible={false} />

      <Panel at="center" height="eye">
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 26 }}>Thank You</h1>
          <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.7 }}>
            Ready to transform your workflow?
          </p>
          <div style={{
            background: 'rgba(79,195,247,0.2)',
            border: '1px solid rgba(79,195,247,0.3)',
            padding: '12px 20px',
            borderRadius: 8,
            fontSize: 13,
          }}>
            contact@acme.corp — Schedule a Demo
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 11, opacity: 0.35 }}>
            Built with XXR — Declarative XR Experiences
          </p>
        </div>
      </Panel>

      <Hotspot at="front-left" to="demo">Previous</Hotspot>
      <Hotspot at="front" to="title">Restart Presentation</Hotspot>
    </Scene>
  </XXR>
)
