import { Palette } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type Theme, useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const themes: { id: Theme; name: string; color: string }[] = [
  { id: 'default', name: 'Default', color: 'bg-purple-600' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-600' },
  { id: 'forest', name: 'Forest', color: 'bg-emerald-600' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-fuchsia-600' },
  { id: 'sunset', name: 'Sunset', color: 'bg-orange-600' },
  { id: 'dracula', name: 'Dracula', color: 'bg-violet-800' },
]

export function ThemeSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleThemeChange = (themeId: Theme) => {
    setTheme(themeId)
    setIsOpen(false)
  }

  const currentTheme = themes.find(t => t.id === theme) || themes[0]

  return (
    <div className={cn('relative', className)}>
      <button
        id="theme-switcher-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all"
        aria-label="Toggle theme"
        style={{ minWidth: '40px' }}
      >
        <Palette className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden">
          {themes.map(tOption => (
            <button
              key={tOption.id}
              onClick={() => handleThemeChange(tOption.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors',
                theme === tOption.id && 'bg-indigo-50 text-indigo-600',
              )}
            >
              <span className={cn('w-4 h-4 rounded-full shadow-sm', tOption.color)} />
              <span className="font-medium text-gray-800">{tOption.name}</span>
              {theme === tOption.id && (
                <svg className="w-4 h-4 ml-auto text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
