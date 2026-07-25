'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Calendar, Users, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { IRISH_COUNTIES, AGE_RANGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  variant?: 'default' | 'hero' | 'compact'
  className?: string
}

export function SearchBar({ variant = 'default', className }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [county, setCounty] = useState<string>('')
  const [date, setDate] = useState<Date | undefined>()
  const [ageRange, setAgeRange] = useState<string>('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (county) params.set('county', county)
    if (date) params.set('date', format(date, 'yyyy-MM-dd'))
    if (ageRange) params.set('age', ageRange)
    
    router.push(`/discover?${params.toString()}`)
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/95 p-4 shadow-soft-xl backdrop-blur sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="What activity are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0 sm:h-14"
            />
          </div>

          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* County */}
          <Select value={county} onValueChange={setCounty}>
            <SelectTrigger className="h-12 w-full border-0 bg-transparent shadow-none focus:ring-0 sm:h-14 sm:w-[160px]">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <SelectValue placeholder="Location" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ireland</SelectItem>
              {IRISH_COUNTIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 w-full justify-start gap-2 border-0 font-normal hover:bg-transparent sm:h-14 sm:w-[160px]"
              >
                <Calendar className="h-5 w-5 text-muted-foreground" />
                {date ? format(date, 'MMM d') : 'Any date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* Age */}
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger className="h-12 w-full border-0 bg-transparent shadow-none focus:ring-0 sm:h-14 sm:w-[140px]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <SelectValue placeholder="Age" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ages</SelectItem>
              {AGE_RANGES.map((range) => (
                <SelectItem key={range.label} value={`${range.min}-${range.max}`}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button 
            onClick={handleSearch}
            size="lg"
            className="h-12 w-full rounded-full bg-highlight px-8 font-semibold text-highlight-foreground hover:bg-highlight/90 sm:h-14 sm:w-auto"
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search activities, sports, classes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-9"
        />
      </div>
      
      <Select value={county} onValueChange={setCounty}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="County" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ireland</SelectItem>
          {IRISH_COUNTIES.map((c) => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={ageRange} onValueChange={setAgeRange}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder="Age" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All ages</SelectItem>
          {AGE_RANGES.map((range) => (
            <SelectItem key={range.label} value={`${range.min}-${range.max}`}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  )
}
