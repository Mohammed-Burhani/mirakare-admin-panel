import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Subscriber {
  id: number
  subscriberType: string
  organizationName: string
  organizationNumber: string
  primaryContactFirstName: string
  primaryContactMiddleName: string
  primaryContactLastName: string
  primaryContactMobile: string
  primaryEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipcode: string
  country: string
  websiteUrl: string
  pricePlan: string
  createOrgAdmin: boolean
  notes: string
  createdDate: string
  isActive: boolean
}

interface CreateSubscriberData {
  subscriberType: string
  organizationName: string
  organizationNumber: string
  primaryContactFirstName: string
  primaryContactMiddleName: string
  primaryContactLastName: string
  primaryContactMobile: string
  primaryEmail: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipcode: string
  country: string
  websiteUrl: string
  pricePlan: string
  createOrgAdmin: boolean
  notes: string
}

interface UpdateSubscriberData extends CreateSubscriberData {
  id: number
}

// Subscriber Types (based on the dropdown in the image)
export const SUBSCRIBER_TYPES = [
  { id: "family", name: "Family" },
  { id: "organization", name: "Organization" },
]

// Price Plans (mock data)
export const PRICE_PLANS = [
  { id: "basic", name: "Basic Plan - $29/month" },
  { id: "premium", name: "Premium Plan - $59/month" },
  { id: "enterprise", name: "Enterprise Plan - $99/month" },
  { id: "custom", name: "Custom Plan" },
]

// Mock data for testing
const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    subscriberType: "organization",
    organizationName: "HealthCare Plus Inc.",
    organizationNumber: "HC001",
    primaryContactFirstName: "John",
    primaryContactMiddleName: "A",
    primaryContactLastName: "Smith",
    primaryContactMobile: "555-0123",
    primaryEmail: "john.smith@healthcareplus.com",
    addressLine1: "123 Medical Center Dr",
    addressLine2: "Suite 100",
    city: "Boston",
    state: "MA",
    zipcode: "02101",
    country: "United States",
    websiteUrl: "https://healthcareplus.com",
    pricePlan: "enterprise",
    createOrgAdmin: true,
    notes: "Large healthcare organization with multiple locations",
    createdDate: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: 2,
    subscriberType: "family",
    organizationName: "Johnson Family",
    organizationNumber: "FAM002",
    primaryContactFirstName: "Sarah",
    primaryContactMiddleName: "",
    primaryContactLastName: "Johnson",
    primaryContactMobile: "555-0456",
    primaryEmail: "sarah.johnson@email.com",
    addressLine1: "456 Oak Street",
    addressLine2: "",
    city: "Seattle",
    state: "WA",
    zipcode: "98101",
    country: "United States",
    websiteUrl: "",
    pricePlan: "basic",
    createOrgAdmin: false,
    notes: "Family subscription for elderly care monitoring",
    createdDate: "2024-02-01T14:20:00Z",
    isActive: true,
  },
  {
    id: 3,
    subscriberType: "organization",
    organizationName: "Senior Living Solutions",
    organizationNumber: "SLS003",
    primaryContactFirstName: "Michael",
    primaryContactMiddleName: "R",
    primaryContactLastName: "Davis",
    primaryContactMobile: "555-0789",
    primaryEmail: "m.davis@seniorlivingsolutions.com",
    addressLine1: "789 Care Center Blvd",
    addressLine2: "",
    city: "Phoenix",
    state: "AZ",
    zipcode: "85001",
    country: "United States",
    websiteUrl: "https://seniorlivingsolutions.com",
    pricePlan: "premium",
    createOrgAdmin: true,
    notes: "Assisted living facility network",
    createdDate: "2024-02-10T09:15:00Z",
    isActive: false,
  },
]

// API functions (using mock data for now)
const fetchSubscribers = async (type?: string): Promise<Subscriber[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  if (type) {
    return mockSubscribers.filter(sub => sub.subscriberType === type)
  }
  return mockSubscribers
}

const createSubscriber = async (data: CreateSubscriberData): Promise<Subscriber> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const newSubscriber: Subscriber = {
    id: Math.max(...mockSubscribers.map(sub => sub.id)) + 1,
    ...data,
    createdDate: new Date().toISOString(),
    isActive: true,
  }
  mockSubscribers.push(newSubscriber)
  return newSubscriber
}

const updateSubscriber = async (data: UpdateSubscriberData): Promise<Subscriber> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockSubscribers.findIndex(sub => sub.id === data.id)
  if (index !== -1) {
    mockSubscribers[index] = { ...mockSubscribers[index], ...data }
    return mockSubscribers[index]
  }
  throw new Error("Subscriber not found")
}

const deleteSubscriber = async (id: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  const index = mockSubscribers.findIndex(sub => sub.id === id)
  if (index !== -1) {
    mockSubscribers.splice(index, 1)
  } else {
    throw new Error("Subscriber not found")
  }
}

// Custom hook
export function useSubscribers(type?: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['subscribers', type],
    queryFn: () => fetchSubscribers(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: createSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSubscriber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
    },
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createSubscriber: createMutation,
    updateSubscriber: updateMutation,
    deleteSubscriber: deleteMutation,
  }
}