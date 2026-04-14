import type { Todo } from '@/api'
import { Download, Info, Trash2, Upload } from 'lucide-react'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/api'
import { cn } from '@/lib/utils'

interface DataToolbarProps {
  todos: Array<Todo>
  onRefresh?: () => void
}

export function DataToolbar({
  todos,
  onRefresh,
}: DataToolbarProps) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 导出数据为 JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file)
      return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const importedTodos = JSON.parse(content) as Array<Todo>

        // 验证数据格式
        if (!Array.isArray(importedTodos)) {
          alert(t('dataToolbar.invalidFileFormat'))
          return
        }

        // 转换日期字符串为 Date 对象
        const validTodos = importedTodos.map(todo => ({
          ...todo,
          date: new Date(todo.date),
        }))

        // 清空现有数据并导入新数据
        await api.todos.clear()
        await api.todos.bulkAdd(validTodos)

        onRefresh?.()

        alert(t('dataToolbar.importSuccess', { count: validTodos.length }))
      }
      catch (error) {
        console.error('Import error:', error)
        alert(t('dataToolbar.importFailed'))
      }
    }
    reader.readAsText(file)

    // 重置 input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 清空所有数据
  const handleClearAll = async () => {
    if (todos.length === 0) {
      alert(t('dataToolbar.noDataToClear'))
      return
    }

    const confirmed = window.confirm(
      t('dataToolbar.clearAllConfirm', { count: todos.length }),
    )

    if (confirmed) {
      await api.todos.clear()
      onRefresh?.()
      alert(t('dataToolbar.allDataCleared'))
    }
  }

  // 统计信息
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-start xl:justify-end gap-4 lg:gap-6 w-full">
        <div className="flex flex-wrap items-center justify-start xl:justify-end gap-4 flex-1 min-w-0">
          {/* 统计信息 */}
          <div className="flex items-center bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.2)] overflow-x-auto max-w-full hide-scrollbar">
            <div className="flex items-center px-4 py-2 bg-white/5 rounded-xl border border-white/5 mr-2 shrink-0 transition-all duration-300 hover:bg-white/10">
              <Info className="w-4 h-4 text-indigo-400 mr-2" />
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider mr-2">{t('dataToolbar.total')}</span>
              <span className="text-white font-bold bg-indigo-500/20 px-2 py-0.5 rounded-md text-sm shadow-inner">{stats.total}</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-white/5 rounded-xl border border-white/5 mr-2 shrink-0 transition-all duration-300 hover:bg-white/10">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider mr-2">{t('dataToolbar.done')}</span>
              <span className="text-green-400 font-bold bg-green-500/20 px-2 py-0.5 rounded-md text-sm shadow-inner">{stats.completed}</span>
            </div>
            <div className="flex items-center px-4 py-2 bg-white/5 rounded-xl border border-white/5 shrink-0 transition-all duration-300 hover:bg-white/10">
              <span className="text-white/60 text-xs font-semibold uppercase tracking-wider mr-2">{t('dataToolbar.pending')}</span>
              <span className="text-yellow-400 font-bold bg-yellow-500/20 px-2 py-0.5 rounded-md text-sm shadow-inner">{stats.pending}</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto grid grid-cols-3 md:flex">
          <button
            onClick={handleExport}
            disabled={todos.length === 0}
            className={cn(
              'group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300',
              'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-indigo-500/20 disabled:hover:bg-indigo-500/10'
            )}
            title={t('dataToolbar.exportAllTodos')}
          >
            <Download className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="text-sm hidden sm:inline-block tracking-wide">{t('dataToolbar.export')}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300',
              'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
            )}
            title={t('dataToolbar.importTodos')}
          >
            <Upload className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="text-sm hidden sm:inline-block tracking-wide">{t('dataToolbar.import')}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <button
            onClick={handleClearAll}
            disabled={todos.length === 0}
            className={cn(
              'group flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300',
              'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-red-500/20 disabled:hover:bg-red-500/10'
            )}
            title={t('dataToolbar.clearAllTodos')}
          >
            <Trash2 className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-red-400" />
            <span className="text-sm hidden sm:inline-block tracking-wide">{t('dataToolbar.clear')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
