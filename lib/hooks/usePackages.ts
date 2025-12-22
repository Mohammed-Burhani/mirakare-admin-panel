import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Package {
  id: number
  name: string
  type: string
  isActive: boolean
  durationInMonths: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  price: number
  description: string
  features: string[]
  createdDate: string
}

interface CreatePackageData {
  name: string
  type: string
  isActive: boolean
  durationInMonths: number
  noOfKareReceivers: number
  noOfKareGivers: number
  noOfKareViewers: number
  price: number
  description: string
  features: string[]
}

interface UpdatePackageData extends CreatePackageData {
  id: number
}

// Package Types (based on the dropdown in the image)
export const PACKAGE_TYPES = [
  { id: "family", name: "Family" },
  { id: "organization", name: "Organization" },
  { id: "enterprise", name: "Enterprise" },
  { id: "custom", name: "Custom" },
]

// Mock data for testing
const mockPackages: Package[] = [
  {
    id: 1,
    name: "Basic Family Plan",
    type: "family",
    isActive: true,
    durationInMonths: 12,
    noOfKareReceivers: 2,
    noOfKareGivers: 4,
    noOfKareViewers: 6,
    price: 29.99,
    description: "Perfect for small families with basic care monitoring needs",
    features: [
      "Basic vital monitoring",
      "Mobile app access",
      "Email notifications",
      "24/7 support"
    ],
    createdDate: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Premium Organization Plan",
    type: "organization",
    isActive: true,
    durationInMonths: 24,
    noOfKareReceivers: 10,
    noOfKareGivers: 20,
    noOfKareViewers: 50,
    price: 199.99,
    description: "Comprehensive solution for healthcare organizations",
    features: [
      "Advanced analytics",
      "Custom reporting",
      "API access",
      "Priority support",
      "Multi-location support",
      "Admin dashboard"
    ],
    createdDate: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Enterprise Solution",
    type: "enterprise",
    isActive: true,
    durationInMonths: 36,
    noOfKareReceivers: 100,
    noOfKareGivers: 200,
    noOfKareViewers: 500,
    price: 999.99,
    description: "Full-scale enterprise solution with unlimited features",
    features: [
      "Unlimited users",
      "Custom integrations",
      "Dedicated support",
      "White-label options",
      "Advanced security",
      "Custom workflows",
      "Training included"
    ],
    createdDate: "2024-02-01T09:45:00Z",
  },
  {
    id: 4,
    name: "Starter Family Plan",
    type: "family",
    isActive: false,
    durationInMonths: 6,
    noOfKareReceivers: 1,
    noOfKareGivers: 2,
    noOfKareViewers: 3,
    price: 19.99,
    description: "Entry-level plan for individual users",
    features: [
      "Basic monitoring",
      "Mobile access",
      "Email alerts"
    ],
    createdDate: "2024-02-10T16:20:00Z",
  },
]

// API functions (using mock data for now)
const fetchPackages = async (type?: string): Promise<Package[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  if (type) {
    return mockPackages.filter(pkg => pkg.type === type)
  }
  return mockPackages
}

const createPackage = async (data: CreatePackageData): Promise<Package> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const newPackage: Package = {
    id: Math.max(...mockPackages.map(pkg => pkg.id)) + 1,
    ...data,
    createdDate: new Date().toISOString(),
  }
  mockPackages.push(newPackage)
  return newPackage
}

const updatePackage = async (data: UpdatePackageData): Promise<Package> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockPackages.findIndex(pkg => pkg.id === data.id)
  if (index !== -1) {
    mockPackages[index] = { ...mockPackages[index], ...data }
    return mockPackages[index]
  }
  throw new Error("Package not found")
}

const deletePackage = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockPackages.findIndex(pkg => pkg.id === id)
  if (index !== -1) {
    mockPackages.splice(index, 1)
  } else {
    throw new Error("Package not found")
  }
}

// Custom hook
export function usePackages(type?: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['packages', type],
    queryFn: () => fetchPackages(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updatePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createPackage: createMutation,
    updatePackage: updateMutation,
    deletePackage: deleteMutation,
  }
}