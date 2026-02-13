import { useMemo, useEffect } from 'react'
import { TeleportTarget } from '@react-three/xr'
import { ContactShadows } from '@react-three/drei'
import { GridHelper, Vector3 } from 'three'
import type { FloorProps, Vec3 } from '../core/types'
import { useXXR } from '../core/context'
import { useSceneContext } from '../scene/context'
import { useAsset } from '../assets/context'
import { disposeObject3D } from '../utils/three-disposal'

const DefaultFloorMesh = ({ size, color, opacity }: { size: number; color: string; opacity: number }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <meshStandardMaterial color={color} transparent opacity={opacity} />
  </mesh>
)

const FloorGrid = ({ size, cellSize }: { size: number; cellSize: number }) => {
  const grid = useMemo(() => {
    const divisions = Math.floor(size / cellSize)
    return new GridHelper(size, divisions, '#666', '#444')
  }, [size, cellSize])

  return <primitive object={grid} position={[0, 0.001, 0]} />
}

const AssetFloorMesh = ({ assetId }: { assetId: string }) => {
  const entry = useAsset(assetId)

  const scene = useMemo(() => {
    if (entry?.status !== 'loaded' || !entry.data) return null
    return entry.data.scene ? entry.data.scene.clone() : entry.data.clone?.() ?? null
  }, [entry])

  // Dispose scene on unmount or when scene changes
  useEffect(() => {
    return () => {
      if (scene) {
        disposeObject3D(scene)
      }
    }
  }, [scene])

  if (!scene) return null
  return <primitive object={scene} position={[0, 0, 0]} receiveShadow />
}

export const Floor = ({
  size = 20,
  teleportable = true,
  asset,
  position: floorPos,
  color = '#333',
  opacity = 0.3,
  visible = true,
  grid = false,
  gridSize = 1,
  contactShadows = false,
}: FloorProps) => {
  const { setPlayerPosition } = useXXR()
  const { setGroundY } = useSceneContext()
  const pos: Vec3 = floorPos ?? [0, 0, 0]

  useEffect(() => {
    setGroundY(pos[1])
  }, [pos[1], setGroundY])

  const handleTeleport = (point: Vector3) => {
    setPlayerPosition([point.x, point.y, point.z])
  }

  const floorContent = (
    <group position={pos}>
      {visible && (
        asset
          ? <AssetFloorMesh assetId={asset} />
          : <DefaultFloorMesh size={size} color={color} opacity={opacity} />
      )}
      {grid && <FloorGrid size={size} cellSize={gridSize} />}
      {contactShadows && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={size}
          blur={2}
          far={4}
          resolution={256}
        />
      )}
      {!visible && !asset && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
    </group>
  )

  if (!teleportable) {
    return floorContent
  }

  return (
    <TeleportTarget onTeleport={handleTeleport}>
      {floorContent}
    </TeleportTarget>
  )
}
