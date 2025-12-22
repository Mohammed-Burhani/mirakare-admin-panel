import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { apiClient } from '../api/apiClient'

interface MasterValue {
  id: number
  text: string
  description: string | null
  type: number
  isPublished: boolean
  createdDate: string
}

interface CreateMasterValueData {
  text: string
  description: string | null
  type: number
  isPublished: boolean
}

interface UpdateMasterValueData extends CreateMasterValueData {
  id: number
}

// Master Value Types (based on the dropdown in the image)
export const MASTER_VALUE_TYPES = [
  { id: 1, name: "Contact Type" },
  { id: 2, name: "Activity Category" },
  { id: 3, name: "Relationship" },
  { id: 4, name: "Observation Category" },
]

// Mock data for testing
const mockMasterValues: MasterValue[] = [
  {
    id: 1,
    text: "Emergency Contact",
    description: "Emergency contact person",
    type: 1, // Contact Type
    isPublished: true,
    createdDate: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    text: "Primary Care",
    description: "Primary care physician",
    type: 1, // Contact Type
    isPublished: true,
    createdDate: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    text: "Exercise",
    description: "Physical exercise activities",
    type: 2, // Activity Category
    isPublished: true,
    createdDate: "2024-02-01T09:45:00Z",
  },
  {
    id: 4,
    text: "Medication",
    description: "Medication related activities",
    type: 2, // Activity Category
    isPublished: false,
    createdDate: "2024-02-05T11:20:00Z",
  },
  {
    id: 5,
    text: "Spouse",
    description: "Married partner",
    type: 3, // Relationship
    isPublished: true,
    createdDate: "2024-02-10T16:30:00Z",
  },
  {
    id: 6,
    text: "Child",
    description: "Son or daughter",
    type: 3, // Relationship
    isPublished: true,
    createdDate: "2024-02-12T08:15:00Z",
  },
]

// API functions (using mock data for now)
const fetchMasterValues = async (type?: number): Promise<MasterValue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  if (type) {
    return mockMasterValues.filter(mv => mv.type === type)
  }
  return mockMasterValues
}

const createMasterValue = async (data: CreateMasterValueData): Promise<MasterValue> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const newMasterValue: MasterValue = {
    id: Math.max(...mockMasterValues.map(mv => mv.id)) + 1,
    ...data,
    createdDate: new Date().toISOString(),
  }
  mockMasterValues.push(newMasterValue)
  return newMasterValue
}

const updateMasterValue = async (data: UpdateMasterValueData): Promise<MasterValue> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockMasterValues.findIndex(mv => mv.id === data.id)
  if (index !== -1) {
    mockMasterValues[index] = { ...mockMasterValues[index], ...data }
    return mockMasterValues[index]
  }
  throw new Error("Master value not found")
}

const deleteMasterValue = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockMasterValues.findIndex(mv => mv.id === id)
  if (index !== -1) {
    mockMasterValues.splice(index, 1)
  } else {
    throw new Error("Master value not found")
  }
}

// Custom hook
export function useMasterValues(type?: number) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['master-values', type],
    queryFn: () => fetchMasterValues(type),
    staleTime: 10 * 60 * 1000, // 10 minutes - master values don't change often
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: createMasterValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateMasterValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMasterValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-values'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createMasterValue: createMutation,
    updateMasterValue: updateMutation,
    deleteMasterValue: deleteMutation,
  }
}