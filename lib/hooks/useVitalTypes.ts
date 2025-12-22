import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import httpClient from "@/lib/api/httpClient"

interface VitalType {
  id: number
  name: string
  providerName: string
  createdDate: string
  isActive: boolean
}

interface CreateVitalTypeData {
  name: string
  providerName: string
  isActive: boolean
}

interface UpdateVitalTypeData extends CreateVitalTypeData {
  id: number
}

// Mock data for testing
const mockVitalTypes: VitalType[] = [
  {
    id: 1,
    name: "Blood Pressure",
    providerName: "Omron Healthcare",
    createdDate: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Heart Rate",
    providerName: "Polar",
    createdDate: "2024-01-20T14:15:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Blood Glucose",
    providerName: "Abbott",
    createdDate: "2024-02-01T09:45:00Z",
    isActive: false,
  },
]

// API functions (using mock data for now)
const fetchVitalTypes = async (): Promise<VitalType[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockVitalTypes
}

const createVitalType = async (data: CreateVitalTypeData): Promise<VitalType> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const newVitalType: VitalType = {
    id: Math.max(...mockVitalTypes.map(vt => vt.id)) + 1,
    ...data,
    createdDate: new Date().toISOString(),
  }
  mockVitalTypes.push(newVitalType)
  return newVitalType
}

const updateVitalType = async (data: UpdateVitalTypeData): Promise<VitalType> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockVitalTypes.findIndex(vt => vt.id === data.id)
  if (index !== -1) {
    mockVitalTypes[index] = { ...mockVitalTypes[index], ...data }
    return mockVitalTypes[index]
  }
  throw new Error("Vital type not found")
}

const deleteVitalType = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockVitalTypes.findIndex(vt => vt.id === id)
  if (index !== -1) {
    mockVitalTypes.splice(index, 1)
  } else {
    throw new Error("Vital type not found")
  }
}

// Custom hook
export function useVitalTypes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["vital-types"],
    queryFn: fetchVitalTypes,
  })

  const createMutation = useMutation({
    mutationFn: createVitalType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateVitalType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVitalType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vital-types"] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createVitalType: createMutation,
    updateVitalType: updateMutation,
    deleteVitalType: deleteMutation,
  }
}