import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/apiClient'
import {
  ApiResponse,
  GraphData,
  GraphFilterParams,
  VitalType
} from '../api/types'

// =============================================================================
// QUERY KEY FACTORY
// =============================================================================

export const graphQueryKeys = {
  all: ['graph'] as const,
  vitalGraphs: () => [...graphQueryKeys.all, 'vitalGraphs'] as const,
  vitalGraph: (vitalType: VitalType, params: GraphFilterParams) => [...graphQueryKeys.vitalGraphs(), vitalType, params] as const,
}

// =============================================================================
// GRAPH QUERIES FOR ALL VITAL TYPES
// =============================================================================

/**
 * Blood pressure graph data query hook
 * Fetches blood pressure chart data with filter parameters
 */
export const useBloodPressureGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'bloodPressure' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('bloodPressure', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Heart rate graph data query hook
 * Fetches heart rate chart data with filter parameters
 */
export const useHeartRateGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'heartRate' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('heartRate', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Temperature graph data query hook
 * Fetches temperature chart data with filter parameters
 */
export const useTemperatureGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'temperature' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('temperature', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Weight graph data query hook
 * Fetches weight chart data with filter parameters
 */
export const useWeightGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'weight' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('weight', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Blood sugar graph data query hook
 * Fetches blood sugar chart data with filter parameters
 */
export const useBloodSugarGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'bloodSugar' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('bloodSugar', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Oxygen saturation graph data query hook
 * Fetches oxygen saturation chart data with filter parameters
 */
export const useOxygenSaturationGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'oxygenSaturation' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('oxygenSaturation', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * Respiratory rate graph data query hook
 * Fetches respiratory rate chart data with filter parameters
 */
export const useRespiratoryRateGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'respiratoryRate' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('respiratoryRate', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

/**
 * BMI graph data query hook
 * Fetches BMI chart data with filter parameters
 */
export const useBMIGraph = (params: Omit<GraphFilterParams, 'vitalType'>) => {
  const fullParams: GraphFilterParams = { ...params, vitalType: 'bmi' }
  
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph('bmi', fullParams),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', fullParams)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

// =============================================================================
// GENERIC GRAPH QUERY
// =============================================================================

/**
 * Generic vital graph data query hook
 * Fetches chart data for any vital type with filter parameters
 */
export const useVitalGraph = (params: GraphFilterParams) => {
  return useQuery({
    queryKey: graphQueryKeys.vitalGraph(params.vitalType, params),
    queryFn: async (): Promise<GraphData> => {
      const response = await apiClient.post<ApiResponse<GraphData>>('/vital/provider/tryvital/list', params)
      return response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}