'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { roles } from '../../data/data'

interface RoleSelectModalProps {
  isOpen: boolean
  onClose: () => void
  selectedRoles: string[]
  onSave: (selectedRoles: string[]) => void
}

export const RoleSelectModal = ({
  isOpen,
  onClose,
  selectedRoles,
  onSave
}: RoleSelectModalProps) => {
  // Initialize with selected roles or guest as default
  const [selected, setSelected] = useState<string[]>(selectedRoles?.length ? selectedRoles : ['guest'])

  // Update local state when props change
  useEffect(() => {
    if (selectedRoles?.length) {
      setSelected(selectedRoles)
    }
  }, [selectedRoles])

  const handleToggleRole = (role: string, checked: boolean) => {
    if (checked) {
      setSelected(prev => [...prev, role])
    } else {
      if (selected.length > 1) {
        setSelected(prev => prev.filter(r => r !== role))
      }
    }
  }

  const handleSave = () => {
    const rolesToSave = selected.length > 0 ? selected : ['guest']
    onSave(rolesToSave)
    onClose()
  }
  const allRolesSelected = roles.length === selected.length && roles.every(role => selected.includes(role.value));
  
  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelected(roles.map(role => role.value));
    } else {
      setSelected(['guest']);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select User Roles</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2 border-b pb-2 mb-2">
            <Checkbox 
              id="select-all-roles"
              checked={allRolesSelected}
              onCheckedChange={handleSelectAllChange}
            />
            <label
              htmlFor="select-all-roles"
              className="text-sm font-medium leading-none"
            >
              Select All Roles
            </label>
          </div>
          {roles.map((role) => (
            <div key={role.value} className="flex items-center space-x-2">
              <Checkbox 
                id={`role-${role.value}`} 
                checked={selected.includes(role.value)}
                onCheckedChange={(checked) => handleToggleRole(role.value, checked === true)}
                // Disable unchecking if it's the only role selected
                disabled={selected.length === 1 && selected.includes(role.value)}
              />
              <label 
                htmlFor={`role-${role.value}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.label}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
