import Home from './screens/Home.jsx'
import { useWater } from './state/useWater.js'

export default function App() {
  const water = useWater()
  if (!water.state) return null
  return (
    <main className="app">
      <Home
        state={water.state}
        onAdd={(ml) => water.addDrink(ml)}
        onCustomSize={(ml) => water.updateSettings({ customSize: ml })}
      />
    </main>
  )
}
