# Navigation

Scene-based routing with a history stack.

## API

| Action | Description |
|--------|-------------|
| `navigate(id, transition?)` | Go to scene by ID, push current to history |
| `back()` | Go to previous scene in history |
| `home()` | Go to the `start` scene, clear history |

## State

```ts
{
  activeScene: string
  history: string[]
  transition: 'none' | 'fade' | 'dissolve'
}
```

## Usage

Access via `useXXR()` hook:

```tsx
const { navigate, back, home, activeScene } = useXXR()
```

Or declaratively via `<Hotspot to="scene-id">`.
