import type { ComponentType } from 'react'
import { FirstPersonTour } from './first-person-tour'
import { ThirdPersonTour } from './third-person-tour'
import { MultiSlidePresentation } from './multi-slide-presentation'
import { AdvancedFeatures } from './advanced-features'
import { StressTest } from './stress-test'

export type ExampleEntry = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly component: ComponentType
}

export const examples: readonly ExampleEntry[] = [
  {
    id: 'first-person-tour',
    title: 'Museum Tour',
    description: 'First-person WASD walkthrough across themed galleries with proximity exhibits',
    component: FirstPersonTour,
  },
  {
    id: 'third-person-tour',
    title: 'Wildlife Sanctuary',
    description: 'Third-person character exploration with animated wildlife and character switching',
    component: ThirdPersonTour,
  },
  {
    id: 'multi-slide-presentation',
    title: 'Product Launch',
    description: '6-slide cinematic presentation with transitions, auto-rotate, and interactive demo',
    component: MultiSlidePresentation,
  },
  {
    id: 'advanced-features',
    title: 'Feature Showcase',
    description: 'Every DSL feature: backgrounds, placement, lighting, camera, orbit, devtools',
    component: AdvancedFeatures,
  },
  {
    id: 'stress-test',
    title: 'Stress Test',
    description: 'Performance stress test — adjustable model count, real-time GPU/CPU metrics, shadow toggle',
    component: StressTest,
  },
]
