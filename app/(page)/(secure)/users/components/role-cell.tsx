'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { RoleSelectModal } from './modals/role-select-modal'
import { roles } from '../data/data'

interface RoleCellProps {
  roleValues: string[]
  isEditing: boolean
  error?: string
  onChange: (value: string[]) => void
}

export const RoleCell = ({ roleValues, isEditing, error, onChange }: RoleCellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentRoles = Array.isArray(roleValues) ? roleValues : ['guest']
  
  if (isEditing) {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="flex flex-wrap gap-1 flex-1">
            {currentRoles.map((roleValue) => {
              const roleData = roles.find(r => r.value === roleValue)
              return (
                <Badge 
                  key={roleValue}
                  variant={roleValue === 'admin' ? 'destructive' : roleValue === 'dev' ? 'outline' : 'secondary'}
                >
                  {roleData?.label || roleValue}
                </Badge>
              )
            })}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setIsModalOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Edit roles</span>
          </Button>
        </div>
        
        {error && <div className="text-xs text-red-500">{error}</div>}
        
        <RoleSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedRoles={currentRoles}
          onSave={onChange}
        />
      </div>
    )
  }
  
  // Display only (not editing)
  return (
    <div className="flex flex-wrap gap-1">
      {currentRoles.map((roleValue) => {
        const roleData = roles.find(r => r.value === roleValue)
        return (
          <Badge 
            key={roleValue}
            variant={roleValue === 'admin' ? 'destructive' : roleValue === 'dev' ? 'outline' : 'secondary'}
          >
            {roleData?.label || roleValue}
          </Badge>
        )
      })}
    </div>
  )
}
