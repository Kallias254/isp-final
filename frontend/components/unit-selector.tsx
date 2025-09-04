'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

// Assuming these types are defined somewhere
// payload-types.ts might be a good place
interface ServiceLocation {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

interface BuildingUnit {
  id: string;
  unitNumber: string;
}

interface PayloadResponse<T> {
    docs: T[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UnitSelector() {
  const { control, setValue } = useFormContext();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const { data: locations } = useSWR<PayloadResponse<ServiceLocation>>('/api/service-locations', fetcher);
  const { data: buildings } = useSWR<PayloadResponse<Building>>(
    selectedLocation ? `/api/buildings?where[serviceLocation][equals]=${selectedLocation}` : null,
    fetcher
  );
  const { data: units } = useSWR<PayloadResponse<BuildingUnit>>(
    selectedBuilding ? `/api/building-units?where[building][equals]=${selectedBuilding}` : null,
    fetcher
  );

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setSelectedBuilding(null);
    setValue('building', null);
    setValue('buildingUnit', null);
  }

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    setValue('buildingUnit', null);
  }

  return (
    <div className="space-y-4">
        <FormField
          control={control}
          name="serviceLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Location</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handleLocationChange(value);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations?.docs.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="building"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handleBuildingChange(value);
              }} defaultValue={field.value} disabled={!selectedLocation}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a building" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buildings?.docs.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="buildingUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Unit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedBuilding}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {units?.docs.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.unitNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
}
