'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-react'
import { RoleCell } from './role-cell'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { statuses, roles } from '../data/data'
export const columns: ColumnDef<IUser>[] = [
  {
    id: 'index',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='#' className='text-center'/>
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row, table }) => {
      // Access meta object directly from the table parameter
      const meta = table.options.meta as any;
      const isEditing = meta?.editingRowId === row.id;
      
      if (isEditing) {
        const error = meta?.validationErrors?.email;
        
        return (
          <div className="space-y-1">
            <Input 
              className={`h-8 w-full ${error ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0' : ''}`}
              value={Object.prototype.hasOwnProperty.call(meta?.editableValues || {}, 'email') ? meta.editableValues.email : row.getValue('email')}
              onChange={(e) => meta?.handleInputChange('email', e.target.value)}
            />
            {error && (
              <div className="text-xs text-red-500">{error}</div>
            )}
          </div>
        );
      }
      
      return (
        <div>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('email')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='First Name' />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const isEditing = meta?.editingRowId === row.id;
      
      if (isEditing) {
        const error = meta?.validationErrors?.firstName;
        
        return (
          <div className="space-y-1">
            <Input 
              className={`h-8 w-full ${error ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0' : ''}`}
              value={Object.prototype.hasOwnProperty.call(meta?.editableValues || {}, 'firstName') ? meta.editableValues.firstName : row.getValue('firstName')}
              onChange={(e) => meta?.handleInputChange('firstName', e.target.value)}
            />
            {error && (
              <div className="text-xs text-red-500">{error}</div>
            )}
          </div>
        );
      }
      
      return (
        <div>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('firstName')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Name' />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const isEditing = meta?.editingRowId === row.id;
      
      if (isEditing) {
        const error = meta?.validationErrors?.lastName;
        
        return (
          <div className="space-y-1">
            <Input 
              className={`h-8 w-full ${error ? 'border-red-500 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 border-2 focus-visible:!ring-0 focus-visible:!ring-offset-0 ' : ''}`}
              value={Object.prototype.hasOwnProperty.call(meta?.editableValues || {}, 'lastName') ? meta.editableValues.lastName : row.getValue('lastName')}
              onChange={(e) => meta?.handleInputChange('lastName', e.target.value)}
            />
            {error && (
              <div className="text-xs text-red-500">{error}</div>
            )}
          </div>
        );
      }
      
      return (
        <div>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('lastName')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row, table }) => {
      // Display code for status - simplified without editing functionality
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      );

      if (!status) {
        return null;
      }
      
      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Roles' />
    ),
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const isEditing = meta?.editingRowId === row.id;
      const roleValues = row.getValue('role') as string[];
      
      // Only use editableValues if this specific row is being edited
      const currentRoles = isEditing && Array.isArray(meta?.editableValues?.role)
        ? meta.editableValues.role
        : Array.isArray(roleValues) 
          ? roleValues 
          : ['guest'];
      
      return (
        <RoleCell 
          roleValues={currentRoles}
          isEditing={isEditing}
          error={meta?.validationErrors?.role}
          onChange={(newRoles) => meta?.handleInputChange('role', newRoles)}
        />
      );
    },
    filterFn: (row, id, value) => {
      const roles = row.getValue(id) as string[];
      return Array.isArray(roles) && Array.isArray(value) && value.some((v: string) => roles.includes(v));
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta as any;
      const isEditing = meta?.editingRowId === row.id;
      
      if (isEditing) {
        return (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => meta?.handleConfirmEditing(row)}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => meta?.handleCancelEditing()}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      }
      
      return <DataTableRowActions row={row} table={table} />;
    },
  },
]