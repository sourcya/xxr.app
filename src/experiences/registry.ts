import type { ComponentType } from 'react'

export type ExperienceEntry = {
  readonly id: string
  readonly component: () => Promise<{ Experience: ComponentType }>
}

export const experiences: readonly ExperienceEntry[] = [
  {
    id: 'fa8b6595-3d82-452e-a8d0-7f186027d901',
    component: () => import('./fa8b6595-3d82-452e-a8d0-7f186027d901/index'),
  },
]

export const findExperience = (id: string): ExperienceEntry | undefined =>
  experiences.find((e) => e.id === id)
