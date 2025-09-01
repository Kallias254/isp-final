"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export function AddNewButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Plus className="mr-2" />
          Add New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Drawer>
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New Subscriber
            </DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Subscriber</DrawerTitle>
              <DrawerDescription>
                Create a new subscriber record.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {/* Subscriber Form Here */}
              <Label>Name</Label>
              <Input />
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New Lead
            </DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Lead</DrawerTitle>
              <DrawerDescription>Create a new lead.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {/* Lead Form Here */}
              <Label>Name</Label>
              <Input />
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New Ticket
            </DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Ticket</DrawerTitle>
              <DrawerDescription>Create a new support ticket.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {/* Ticket Form Here */}
              <Label>Subject</Label>
              <Input />
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New Expense
            </DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Expense</DrawerTitle>
              <DrawerDescription>Record a new expense.</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {/* Expense Form Here */}
              <Label>Item</Label>
              <Input />
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              New Work Order
            </DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>New Work Order</DrawerTitle>
              <DrawerDescription>
                Create a new work order.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              {/* Work Order Form Here */}
              <Label>Title</Label>
              <Input />
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
