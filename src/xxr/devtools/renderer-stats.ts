export type RendererStats = {
  /** Frames per second */
  readonly fps: number
  /** Average frame time in milliseconds */
  readonly frameTime: number
  /** Number of draw calls this frame */
  readonly drawCalls: number
  /** Number of triangles rendered */
  readonly triangles: number
  /** Number of geometries in GPU memory */
  readonly geometries: number
  /** Number of textures in GPU memory */
  readonly textures: number
  /** Number of active shader programs */
  readonly programs: number
}

export const EMPTY_STATS: RendererStats = {
  fps: 0,
  frameTime: 0,
  drawCalls: 0,
  triangles: 0,
  geometries: 0,
  textures: 0,
  programs: 0,
}
