import type { Object3D, Material, Texture } from 'three'

/**
 * Recursively dispose of Three.js objects to prevent memory leaks
 * Disposes geometries, materials, and textures
 */
export const disposeObject3D = (object: Object3D | null | undefined): void => {
  if (!object) return

  object.traverse((node: any) => {
    // Dispose geometry
    if (node.geometry) {
      node.geometry.dispose()
    }

    // Dispose materials
    if (node.material) {
      disposeMaterial(node.material)
    }

    // Dispose any additional resources
    if (node.dispose && typeof node.dispose === 'function') {
      node.dispose()
    }
  })

  // Clear children references
  if (object.parent) {
    object.removeFromParent()
  }
}

/**
 * Dispose of a material or array of materials
 */
export const disposeMaterial = (material: Material | Material[]): void => {
  const materials = Array.isArray(material) ? material : [material]

  for (const mat of materials) {
    // Dispose textures in material - use type assertion for material properties
    const matAny = mat as any
    if (matAny.map) disposeTexture(matAny.map)
    if (matAny.lightMap) disposeTexture(matAny.lightMap)
    if (matAny.bumpMap) disposeTexture(matAny.bumpMap)
    if (matAny.normalMap) disposeTexture(matAny.normalMap)
    if (matAny.specularMap) disposeTexture(matAny.specularMap)
    if (matAny.envMap) disposeTexture(matAny.envMap)
    if (matAny.alphaMap) disposeTexture(matAny.alphaMap)
    if (matAny.aoMap) disposeTexture(matAny.aoMap)
    if (matAny.displacementMap) disposeTexture(matAny.displacementMap)
    if (matAny.emissiveMap) disposeTexture(matAny.emissiveMap)
    if (matAny.metalnessMap) disposeTexture(matAny.metalnessMap)
    if (matAny.roughnessMap) disposeTexture(matAny.roughnessMap)

    mat.dispose()
  }
}

/**
 * Dispose of a texture
 */
export const disposeTexture = (texture: Texture | null | undefined): void => {
  if (texture) {
    texture.dispose()
  }
}
