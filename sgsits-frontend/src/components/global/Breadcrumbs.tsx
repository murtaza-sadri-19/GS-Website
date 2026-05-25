import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'

const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const [homeLabel, setHomeLabel] = useState(uiLabelsDefaults.breadcrumbs.homeLabel)

  useEffect(() => {
    uiLabelsService.getUiLabels().then((labels) => {
      setHomeLabel(labels.breadcrumbs.homeLabel)
    })
  }, [])

  const pathnames = location.pathname.split('/').filter((x) => x)

  if (pathnames.length === 0) return null

  const formatLabel = (segment: string) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
  }

  return (
    <nav aria-label="Breadcrumb" className="w-full py-3 mb-6 bg-white px-4 rounded-md border border-slate-200 shadow-sm transition-colors duration-200">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{homeLabel}</span>
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`
          const isLast = index === pathnames.length - 1
          const label = formatLabel(value)

          return (
            <li key={to} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              {isLast ? (
                <span className="font-bold truncate max-w-[200px] sm:max-w-sm" style={{ color: 'var(--color-primary)' }}>
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-[200px]"
                >
                  {label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
