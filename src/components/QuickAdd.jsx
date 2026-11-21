import './QuickAdd.css'

function Glass({ fill }) {
  return (
    <svg viewBox="0 0 32 40" width="28" height="34" aria-hidden="true">
      <path d="M4 4h24l-3 32a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z" fill="#eef7fb" stroke="#0e7c9b" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={`M${6 + (1 - fill) * 2} ${36 - fill * 26}h${20 - (1 - fill) * 4}l-${2 - fill} ${fill * 26 - 1}H8z`} fill="#3aa8d8" />
    </svg>
  )
}

export default function QuickAdd({ sizes, labels, onAdd, onCustom, customLabel }) {
  return (
    <div className="quick">
      {sizes.map((ml, index) => (
        <button key={ml} className="quick-button" onClick={() => onAdd(ml)}>
          <Glass fill={index === 0 ? 0.5 : 0.85} />
          <span>{labels[index]}</span>
        </button>
      ))}
      <button className="quick-button quick-custom" onClick={onCustom}>
        <span className="quick-plus" aria-hidden="true">+</span>
        <span>{customLabel}</span>
      </button>
    </div>
  )
}
