'use client'

import { create } from 'zustand'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

// Define the table state interface
export interface TableState {
  rowSelection: Record<string, boolean>;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  editingRowId: string | null;
  editableValues: Record<string, any>;
  validationErrors: Record<string, string>;
  isCreatingNewUser: boolean;
}

// Define the store interface
interface TableStore extends TableState {
  // Row selection actions
  setRowSelection: (selection: Record<string, boolean>) => void;
  
  // Column visibility actions
  setColumnVisibility: (visibility: VisibilityState) => void;
  
  // Column filters actions
  setColumnFilters: (filters: ColumnFiltersState) => void;
  
  // Sorting actions
  setSorting: (sorting: SortingState) => void;
  
  // Editing row actions
  startEditing: (id: string, values: Record<string, any>) => void;
  cancelEditing: () => void;
  confirmEditing: () => void;
  
  // Creating user actions
  startCreatingUser: () => void;
  cancelCreatingUser: () => void;
  confirmCreatingUser: () => void;
  
  // Editable values actions
  updateEditableValue: (key: string, value: string | string[]) => void;
  
  // Validation error actions
  setValidationErrors: (errors: Record<string, string>) => void;
  clearValidationError: (key: string) => void;
}

export const useTableStore = create<TableStore>((set) => ({
  // Initial state
  rowSelection: {},
  columnVisibility: {},
  columnFilters: [],
  sorting: [],
  editingRowId: null,
  editableValues: {},
  validationErrors: {},
  isCreatingNewUser: false,
  
  // Row selection actions
  setRowSelection: (selection) => set({ rowSelection: selection }),
  
  // Column visibility actions
  setColumnVisibility: (visibility) => set({ columnVisibility: visibility }),
  
  // Column filters actions
  setColumnFilters: (filters) => set({ columnFilters: filters }),
  
  // Sorting actions
  setSorting: (sorting) => set({ sorting: sorting }),
  
  // Editing row actions
  startEditing: (id, values) => set({ 
    editingRowId: id, 
    editableValues: values,
    validationErrors: {} 
  }),
  
  cancelEditing: () => set({ 
    editingRowId: null, 
    editableValues: {},
    validationErrors: {} 
  }),
  
  confirmEditing: () => set({ 
    editingRowId: null, 
    editableValues: {},
    validationErrors: {} 
  }),
  
  // Creating user actions
  startCreatingUser: () => set({
    isCreatingNewUser: true,
    editableValues: {
      email: '',
      firstName: '',
      lastName: '',
      status: 'pending',
      role: ['guest']
    },
    validationErrors: {}
  }),
  
  cancelCreatingUser: () => set({
    isCreatingNewUser: false,
    editableValues: {},
    validationErrors: {}
  }),
  
  confirmCreatingUser: () => set({
    isCreatingNewUser: false,
    editableValues: {},
    validationErrors: {}
  }),
  
  // Editable values actions
  updateEditableValue: (key, value) => set((state) => {
    // Clear validation error for this field when user makes changes
    const updatedErrors = { ...state.validationErrors };
    if (updatedErrors[key]) {
      delete updatedErrors[key];
    }
    
    return { 
      editableValues: {
        ...state.editableValues,
        [key]: value
      },
      validationErrors: updatedErrors
    };
  }),
  
  // Validation error actions
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  
  clearValidationError: (key) => set((state) => {
    const newErrors = { ...state.validationErrors };
    delete newErrors[key];
    return { validationErrors: newErrors };
  })
}));
