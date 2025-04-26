'use client'

import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { RoleCell } from './role-cell'
import { statuses } from '../data/data'

interface NewUserRowProps {
  editableValues: Record<string, any>
  validationErrors: Record<string, string>
  onInputChange: (key: string, value: any) => void
  onConfirm: () => void
  onCancel: () => void
}

export function NewUserRow({
  editableValues,
  validationErrors,
  onInputChange,
  onConfirm,
  onCancel
}: NewUserRowProps) {
  return (
    <TableRow>
      <TableCell className="text-center">New</TableCell>
      <TableCell>
        <div className="space-y-1">
          <Input 
            className={`h-8 w-full ${validationErrors?.email ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0' : ''}`}
            value={editableValues.email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="Enter email"
          />
          {validationErrors?.email && (
            <div className="text-xs text-red-500">{validationErrors.email}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Input 
            className={`h-8 w-full ${validationErrors?.firstName ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0' : ''}`}
            value={editableValues.firstName || ''}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
          {validationErrors?.firstName && (
            <div className="text-xs text-red-500">{validationErrors.firstName}</div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Input 
            className={`h-8 w-full ${validationErrors?.lastName ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0' : ''}`}
            value={editableValues.lastName || ''}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
          {validationErrors?.lastName && (
            <div className="text-xs text-red-500">{validationErrors.lastName}</div>
          )}
        </div>
      </TableCell>      <TableCell>
        <div className="flex w-[100px] items-center">
          {(() => {
            const pendingStatus = statuses.find(s => s.value === 'pending');
            if (pendingStatus?.icon) {
              const Icon = pendingStatus.icon;
              return <Icon className="mr-2 h-4 w-4 text-muted-foreground" />;
            }
            return null;
          })()}
          <span>Pending</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          <RoleCell 
            roleValues={editableValues.role || ['guest']}
            isEditing={true}
            error={validationErrors?.role}
            onChange={(newRoles) => onInputChange('role', newRoles)}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onConfirm}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
