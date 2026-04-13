import { addMonths, eachDayOfInterval, endOfMonth, startOfMonth, endOfWeek, startOfWeek, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'

export function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth])

  const calendarDays = useMemo(() => {
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
  }, [monthStart])

  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1))
  const prevMonth = () => setCurrentMonth(prev => subMonths(prev, 1))
  
  const selectDate = (date: Date) => setSelectedDate(date)

  return {
    currentMonth,
    selectedDate,
    monthStart,
    calendarDays,
    nextMonth,
    prevMonth,
    selectDate,
    setCurrentMonth, // Expose in case needed
  }
}
