"use client"

import { useMemo } from "react"
import { VitalStatsData } from "@/lib/api/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"

interface VitalStatsChartProps {
  data: VitalStatsData[]
  vitalType: string
}

// Custom tooltip component defined outside render
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}${entry.payload.unit ? ` ${entry.payload.unit}` : ''}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function VitalStatsChart({ data, vitalType }: VitalStatsChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
      systolic: item.systolic,
      diastolic: item.diastolic,
      unit: item.unit,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data])

  const getChartColor = (vitalType: string) => {
    const type = vitalType.toLowerCase()
    if (type.includes('blood pressure')) return '#ef4444' // red
    if (type.includes('heart rate')) return '#f59e0b' // amber
    if (type.includes('temperature')) return '#10b981' // emerald
    if (type.includes('glucose')) return '#8b5cf6' // violet
    if (type.includes('weight')) return '#06b6d4' // cyan
    if (type.includes('oxygen')) return '#3b82f6' // blue
    return '#6366f1' // indigo (default)
  }

  const color = getChartColor(vitalType)

  // Blood pressure chart (dual line)
  if (vitalType.toLowerCase().includes('blood pressure')) {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Systolic"
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Diastolic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Weight chart (area chart)
  if (vitalType.toLowerCase().includes('weight')) {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={CustomTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Temperature, glucose, etc. (bar chart for discrete values)
  if (vitalType.toLowerCase().includes('temperature') || vitalType.toLowerCase().includes('glucose')) {
    return (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={CustomTooltip} />
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Default line chart for other vital types
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={CustomTooltip} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}