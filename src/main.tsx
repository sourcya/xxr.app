import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { LandingPage } from './pages/landing'
import { ExperienceViewer } from './pages/experience-viewer'
import { ExampleList, ExamplePage } from './xxr/examples/showcase'
import { DocsPage } from './xxr/docs/page'

const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/x/:id', Component: ExperienceViewer },
  { path: '/xxr', Component: ExampleList },
  { path: '/xxr/docs', Component: DocsPage },
  { path: '/xxr/docs/:slug', Component: DocsPage },
  { path: '/xxr/:exampleId', Component: ExamplePage },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
