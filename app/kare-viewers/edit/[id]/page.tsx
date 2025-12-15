"use client"

import { use } from "react"
import Container from "@/components/layout/container"
import { KareViewerForm } from "@/components/kare-viewer-form"
import { useKareViewers } from "@/lib/hooks/useKareViewers"
import { IconLoader } from "@tabler/icons-react"

export default function EditKareViewerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: viewers = [], isLoading, error } = useKareViewers()
  
  const viewer = viewers.find(v => v.id === id)

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <IconLoader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading viewer data...</span>
        </div>
      </Container>
    )
  }

  if (error || !viewer) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">Viewer not found or error loading data</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <KareViewerForm mode="edit" initialValues={viewer} />
    </Container>
  )
}
