'use client';

import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { BuildingForm } from './building-form';
import { UnitForm } from './unit-form';
import { apiFetch } from '@/lib/api';
import { Label } from '@/components/ui/label';

// Types moved to a more appropriate location if shared, here for simplicity
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

// Use the authenticated apiFetch
const fetcher = (url: string) => apiFetch(url).then(async (res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
});

interface UnitSelectorProps {
    onUnitSelect: (unitId: string | null) => void;
    initialLocationId?: string;
    initialBuildingId?: string;
    initialUnitId?: string;
}

export function UnitSelector({ 
    onUnitSelect,
    initialLocationId,
    initialBuildingId,
    initialUnitId 
}: UnitSelectorProps) {
  const { mutate } = useSWRConfig();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(initialLocationId || null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(initialBuildingId || null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(initialUnitId || null);

  const [isBuildingDialogOpen, setIsBuildingDialogOpen] = useState(false);
  const [isUnitDialogOpen, setIsUnitDialogOpen] = useState(false);

  const buildingsUrl = selectedLocation ? `/buildings?where[location][equals]=${selectedLocation}` : null;
  const unitsUrl = selectedBuilding ? `/building-units?where[building][equals]=${selectedBuilding}` : null;

  const { data: locationsData } = useSWR<PayloadResponse<ServiceLocation>>('/service-locations', fetcher);
  const { data: buildingsData } = useSWR<PayloadResponse<Building>>(buildingsUrl, fetcher);
  const { data: unitsData } = useSWR<PayloadResponse<BuildingUnit>>(unitsUrl, fetcher);

  useEffect(() => {
    onUnitSelect(selectedUnit);
  }, [selectedUnit, onUnitSelect]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setSelectedBuilding(null);
    setSelectedUnit(null);
  }

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    setSelectedUnit(null);
  }

  const onBuildingCreated = () => {
    if(buildingsUrl) mutate(buildingsUrl);
    setIsBuildingDialogOpen(false);
  }

  const onUnitCreated = () => {
    if(unitsUrl) mutate(unitsUrl);
    setIsUnitDialogOpen(false);
  }

  return (
    <div className="space-y-4 p-4 border rounded-md">
        <h3 class="text-lg font-medium">Location Details</h3>
        <div className="space-y-2">
            <Label>Service Location</Label>
            <Select onValueChange={handleLocationChange} value={selectedLocation || ''}>
                <SelectTrigger>
                <SelectValue placeholder="Select a service location" />
                </SelectTrigger>
                <SelectContent>
                {locationsData?.docs.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                    {location.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <Label>Building</Label>
            <div className="flex items-center gap-2">
                <Select onValueChange={handleBuildingChange} value={selectedBuilding || ''} disabled={!selectedLocation}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a building" />
                    </SelectTrigger>
                    <SelectContent>
                        {buildingsData?.docs.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                            {building.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Dialog open={isBuildingDialogOpen} onOpenChange={setIsBuildingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={!selectedLocation}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Building</DialogTitle>
                    </DialogHeader>
                    <BuildingForm onSuccess={onBuildingCreated} />
                  </DialogContent>
                </Dialog>
            </div>
        </div>

        <div className="space-y-2">
            <Label>Building Unit</Label>
            <div className="flex items-center gap-2">
                <Select onValueChange={setSelectedUnit} value={selectedUnit || ''} disabled={!selectedBuilding}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {unitsData?.docs.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                            {unit.unitNumber}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Dialog open={isUnitDialogOpen} onOpenChange={setIsUnitDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" disabled={!selectedBuilding}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Unit</DialogTitle>
                    </DialogHeader>
                    <UnitForm buildingId={selectedBuilding} onSuccess={onUnitCreated} />
                  </DialogContent>
                </Dialog>
            </div>
        </div>
    </div>
  );
}
