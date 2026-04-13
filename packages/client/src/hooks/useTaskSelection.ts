import { useState } from 'react'

export function useTaskSelection(totalIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const isAllSelected = totalIds.length > 0 && selectedIds.size === totalIds.length
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < totalIds.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    }
    else {
      setSelectedIds(new Set(totalIds))
    }
  }

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    }
    else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const clearSelection = () => setSelectedIds(new Set())

  return {
    selectedIds,
    isAllSelected,
    isSomeSelected,
    toggleSelectAll,
    toggleSelectOne,
    clearSelection,
  }
}
