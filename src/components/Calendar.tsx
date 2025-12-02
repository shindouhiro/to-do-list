import React, { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Check, Trash2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { type Todo } from '../db'

export type { Todo }

interface CalendarProps {
  todos: Todo[]
  onAddTodo: (date: Date, text: string) => void
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
}

export function Calendar({ todos, onAddTodo, onToggleTodo, onDeleteTodo }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newTodoText, setNewTodoText] = useState('')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
    setNewTodoText('')
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && newTodoText.trim()) {
      onAddTodo(selectedDate, newTodoText)
      setNewTodoText('')
    }
  }

  const selectedDateTodos = selectedDate
    ? todos.filter((todo) => isSameDay(todo.date, selectedDate))
    : []

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto p-6">
      {/* Calendar Section */}
      <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-white/60 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((day) => {
            const dayTodos = todos.filter((todo) => isSameDay(todo.date, day))
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                className={cn(
                  'aspect-square relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all duration-300 group',
                  !isSameMonth(day, monthStart) && 'opacity-30',
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg scale-105 z-10'
                    : 'hover:bg-white/5 bg-white/5 border border-white/5',
                  isToday(day) && !isSelected && 'border-indigo-400 border-2'
                )}
              >
                <span
                  className={cn(
                    'text-lg font-semibold',
                    isSelected ? 'text-white' : 'text-white/90'
                  )}
                >
                  {format(day, 'd')}
                </span>

                {/* Todo Indicators */}
                <div className="flex gap-1 mt-2">
                  {dayTodos.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white/80' : 'bg-indigo-400'
                      )}
                    />
                  ))}
                  {dayTodos.length > 3 && (
                    <div className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isSelected ? 'bg-white/80' : 'bg-indigo-400'
                    )}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Todo List Section */}
      <div className={cn(
        "w-full lg:w-96 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-xl transition-all duration-500",
        selectedDate ? "opacity-100 translate-x-0" : "opacity-50 translate-x-10 pointer-events-none lg:pointer-events-auto lg:opacity-100 lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-6">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Select a date'}
          </h3>

          {selectedDate ? (
            <>
              <form onSubmit={handleAddTodo} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newTodoText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[500px]">
                {selectedDateTodos.length === 0 ? (
                  <div className="text-center text-white/40 py-8">
                    No tasks for this day
                  </div>
                ) : (
                  selectedDateTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      <button
                        onClick={() => onToggleTodo(todo.id)}
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-white/30 hover:border-indigo-400'
                        )}
                      >
                        {todo.completed && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                      <span
                        className={cn(
                          'flex-1 text-white/90 transition-all',
                          todo.completed && 'line-through text-white/40'
                        )}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => onDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-white/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/40 text-center">
              <p>Select a date to view or add tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
