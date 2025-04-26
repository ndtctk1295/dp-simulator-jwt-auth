'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Icons } from '@/app/_components/icons'
import { NewUserRow } from './new-user-row'

// Import Zustand store
import { useTableStore } from '@/app/store/use-table-store'
import { useUserOperations, validateUserForm, validateField } from './utils/user-operations'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const { 
    rowSelection, 
    columnVisibility, 
    columnFilters, 
    sorting, 
    editingRowId, 
    editableValues,
    validationErrors,
    isCreatingNewUser,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    setSorting,
    startEditing,
    cancelEditing,
    confirmEditing,
    startCreatingUser,
    cancelCreatingUser,
    confirmCreatingUser,
    updateEditableValue,
    setValidationErrors,
    clearValidationError
  } = useTableStore();

  // Use the extracted user operations
  const { createUser, updateUser } = useUserOperations();
  // Handle editing functions
  const handleStartEditing = (row: any) => {
    // Always maintain the current status instead of changing it
    const statusValue = row.original.status;
    
    startEditing(row.id, {
      email: row.original.email,
      firstName: row.original.firstName,
      lastName: row.original.lastName,
      status: statusValue, 
      role: row.original.role || ['guest']
    });
  };

  const handleCancelEditing = () => {
    cancelEditing();
  };

  const handleConfirmEditing = async (row: any) => {
    // Use the extracted validation function
    if (!validateUserForm(editableValues, (errors) => {
      setValidationErrors(errors);
    })) {
      return; // Stop submission if validation fails
    }

    const user = row.original as IUser;
    const id = user.id || '';

    // Use the extracted updateUser function
    await updateUser(id, editableValues, () => {
      confirmEditing();
    });
  };

  const handleInputChange = (key: string, value: any) => {
    updateEditableValue(key, value);
    
    // Validate the field immediately using the extracted function
    const error = validateField(key, value);
    
    if (error) {
      setValidationErrors({ ...validationErrors, [key]: error });
    } else {
      clearValidationError(key);
    }
  };

  const handleStartCreatingUser = () => {
    startCreatingUser();
  };

  const handleCancelCreatingUser = () => {
    cancelCreatingUser();
  };

  const handleConfirmCreatingUser = async () => {
    // Use the extracted validation function
    if (!validateUserForm(editableValues, (errors) => {
      setValidationErrors(errors);
    })) {
      return;
    }

    // Use the extracted createUser function
    await createUser(editableValues, () => {
      confirmCreatingUser();
    });
  };

  // Helper functions to handle both direct values and updater functions
  const handleRowSelectionChange = (updater: unknown) => {
    if (typeof updater === 'function') {
      const newValue = (updater as (old: Record<string, boolean>) => Record<string, boolean>)(rowSelection);
      setRowSelection(newValue);
    } else {
      setRowSelection(updater as Record<string, boolean>);
    }
  };

  const handleSortingChange = (updater: unknown) => {
    if (typeof updater === 'function') {
      const newValue = (updater as (old: any) => any)(sorting);
      setSorting(newValue);
    } else {
      setSorting(updater as any);
    }
  };

  const handleColumnFiltersChange = (updater: unknown) => {
    if (typeof updater === 'function') {
      const newValue = (updater as (old: any) => any)(columnFilters);
      setColumnFilters(newValue);
    } else {
      setColumnFilters(updater as any);
    }
  };

  const handleColumnVisibilityChange = (updater: unknown) => {
    if (typeof updater === 'function') {
      const newValue = (updater as (old: any) => any)(columnVisibility);
      setColumnVisibility(newValue);
    } else {
      setColumnVisibility(updater as any);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      editingRowId,
      editableValues,
      validationErrors,
      isCreatingNewUser,
      handleInputChange,
      handleStartEditing,
      handleCancelEditing,
      handleConfirmEditing,
      handleStartCreatingUser,
      handleCancelCreatingUser,
      handleConfirmCreatingUser
    },
    enableRowSelection: true,
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0 } },
  });

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <div className='flex justify-center'>
                    <Icons.spinner className='mr-2 h-4 w-4 animate-spin justify-center' />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* Use the extracted NewUserRow component */}
                {isCreatingNewUser && (
                  <NewUserRow
                    editableValues={editableValues}
                    validationErrors={validationErrors}
                    onInputChange={handleInputChange}
                    onConfirm={handleConfirmCreatingUser}
                    onCancel={handleCancelCreatingUser}
                  />
                )}
                
                {/* Render existing rows */}
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  !isCreatingNewUser && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
