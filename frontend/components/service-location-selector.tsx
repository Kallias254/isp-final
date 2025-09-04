'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ServiceLocationForm } from './service-location-form'
import { toast } from 'sonner'

export function ServiceLocationSelector({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [locations, setLocations] = React.useState<{ id: string, name: string }[]>([])

  React.useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await fetch('/api/service-locations?limit=100') // Adjust limit as needed
        if (!response.ok) {
          throw new Error('Failed to fetch service locations')
        }
        const data = await response.json()
        setLocations(data.docs || [])
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not fetch service locations.',
          variant: 'destructive',
        })
      }
    }
    fetchLocations()
  }, [])

  const handleNewLocation = (newLocation: { id: string, name: string }) => {
    setLocations((prev) => [...prev, newLocation])
    onChange(newLocation.id)
    setDialogOpen(false)
    setOpen(false)
  }

  return (
    <div className='flex items-center gap-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {value
              ? locations.find((location) => location.id === value)?.name
              : 'Select location...'}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
          <Command>
            <CommandInput placeholder='Search location...' />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {locations.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.name}
                    onSelect={() => {
                      onChange(location.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === location.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {location.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <PlusCircle className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Service Location</DialogTitle>
            <DialogDescription>
              Add a new geographical point for buildings, subscribers, or network devices.
            </DialogDescription>
          </DialogHeader>
          <ServiceLocationForm onSuccess={handleNewLocation} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
