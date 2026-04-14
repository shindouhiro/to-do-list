import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { DateFilterType } from '@/routes/index'

interface DateFilterProps {
  dateFilter: DateFilterType
  onDateFilterChange: (filter: DateFilterType) => void
}

export function DateFilter({ dateFilter, onDateFilterChange }: DateFilterProps) {
  const { t } = useTranslation()

  const options: { value: DateFilterType; label: string }[] = [
    { value: 'today', label: t('dateFilter.today') },
    { value: 'lastMonth', label: t('dateFilter.lastMonth') },
    { value: 'lastYear', label: t('dateFilter.lastYear') },
    { value: 'all', label: t('dateFilter.all') },
  ]

  return (
    <div className="flex bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.2)] overflow-x-auto hide-scrollbar">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onDateFilterChange(option.value)}
          className={cn(
            'relative px-5 py-2.5 rounded-xl transition-all duration-300 tracking-wide text-xs font-bold flex items-center justify-center gap-2 overflow-hidden group whitespace-nowrap',
            dateFilter === option.value
              ? 'text-white'
              : 'text-white/60 hover:text-white',
          )}
        >
          {dateFilter === option.value ? (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.3)]" />
          ) : (
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
          )}
          <span className="relative z-10">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
