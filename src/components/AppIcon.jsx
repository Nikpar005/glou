const ICONS = ['classic', 'night', 'sunset', 'mint']

export default function AppIcon({ id = 'classic', size = 64 }) {
  const name = ICONS.includes(id) ? id : 'classic'
  return <img src={`/icons/${name}.png`} width={size} height={size} alt="" style={{ borderRadius: size * 0.24 }} />
}
