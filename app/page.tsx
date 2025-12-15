"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { HomeDataTable } from "@/components/home-data-table"
import { SectionCards } from "@/components/section-cards"
import Container from "@/components/layout/container"
import { ErrorState } from "@/components/error-state"
import { useDashboard } from "@/lib/hooks/useDashboard"

export default function Home() {
  const { data: dashboardData, isLoading, error } = useDashboard()

  if (error) {
    return (
      <Container>
        <ErrorState message="Error loading dashboard data" />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <HomeDataTable data={dashboardData?.users || []} isLoading={isLoading} />
      </div>
    </Container>
  )
}
