import { IconStar } from './icons'

function StarRating({ value, onChange, size = 20 }) {
  const interactive = typeof onChange === 'function'

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange && onChange(n)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={String(n)}
        >
          <IconStar
            width={size}
            height={size}
            className={n <= value ? 'text-gold fill-current' : 'text-gray-300 fill-current'}
          />
        </button>
      ))}
    </div>
  )
}

export default StarRating
