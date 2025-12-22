"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconSearch } from "@tabler/icons-react"

interface ListingFiltersProps {
  filterLabel?: string
  filterValue?: string
  onFilterChange: (value: string | undefined) => void
  filterOptions: { id: string; name: string }[]
  onSearch?: () => void
  onClear: () => void
  showSearchButton?: boolean
}

export function ListingFilters({
  filterLabel = "Filter",
  filterValue,
  onFilterChange,
  filterOptions,
  onSearch,
  onClear,
  showSearchButton = true
}: ListingFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          {filterLabel && (
            <label className="text-sm font-medium whitespace-nowrap">{filterLabel}</label>
          )}
          <Select
            value={filterValue}
            onValueChange={onFilterChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          {showSearchButton && onSearch && (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={onSearch}
            >
              <IconSearch className="h-4 w-4" />
              Search
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}