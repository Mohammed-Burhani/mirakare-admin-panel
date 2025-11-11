"use client"

import { useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconTrash, IconX, IconUserPlus, IconUsers } from "@tabler/icons-react"

interface ManageKareGiversDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientName: string
}

const mockKareGivers = [
  "Monica R",
  "Kristin P",
  "Neel K",
  "Gita S",
  "Vik S",
  "Lily S",
  "Nadhiya Sundar",
]

const relationships = [
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Uncle",
  "Aunt",
  "Care Giver",
  "Other",
  "Friend",
  "Son",
  "Daughter",
  "Guardian",
  "Family Member",
]

const mockAssignedGivers = [
  { id: 1, name: "Monica R", relationship: "Care Giver" },
  { id: 2, name: "Kristin P", relationship: "Care Giver" },
  { id: 3, name: "Neel K", relationship: "Friend" },
]

export function ManageKareGiversDialog({
  open,
  onOpenChange,
}: ManageKareGiversDialogProps) {
  const [selectedGiver, setSelectedGiver] = useState("")
  const [selectedRelationship, setSelectedRelationship] = useState("")
  const [assignedGivers, setAssignedGivers] = useState(mockAssignedGivers)

  const resetForm = useCallback(() => {
    setSelectedGiver("")
    setSelectedRelationship("")
  }, [])

  const handleAssign = useCallback(() => {
    if (selectedGiver && selectedRelationship) {
      const newGiver = {
        id: Date.now(),
        name: selectedGiver,
        relationship: selectedRelationship,
      }
      setAssignedGivers((prev) => [...prev, newGiver])
      resetForm()
    }
  }, [selectedGiver, selectedRelationship, resetForm])

  const handleDelete = useCallback((id: number) => {
    setAssignedGivers((prev) => prev.filter((g) => g.id !== id))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleAssign()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      resetForm()
    }
  }, [handleAssign, resetForm])

  const isFormValid = selectedGiver && selectedRelationship
  const availableGivers = mockKareGivers.filter(
    (giver) => !assignedGivers.some((assigned) => assigned.name === giver)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Manage Kare Givers
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Assign care givers and define their relationships
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 shrink-0"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-6">
          {/* Add Form */}
          <Card className="border-2 bg-muted/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <IconUserPlus className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Assign New Kare Giver</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="kareGiver" className="text-sm font-medium">
                      Kare Giver <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={selectedGiver} 
                      onValueChange={setSelectedGiver}
                    >
                      <SelectTrigger 
                        id="kareGiver" 
                        className="h-11"
                        onKeyDown={handleKeyDown}
                      >
                        <SelectValue placeholder="Select a kare giver" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableGivers.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            All givers have been assigned
                          </div>
                        ) : (
                          availableGivers.map((giver) => (
                            <SelectItem key={giver} value={giver} className="py-2.5">
                              {giver}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-sm font-medium">
                      Relationship <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={selectedRelationship}
                      onValueChange={setSelectedRelationship}
                    >
                      <SelectTrigger 
                        id="relationship" 
                        className="h-11"
                        onKeyDown={handleKeyDown}
                      >
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((rel) => (
                          <SelectItem key={rel} value={rel} className="py-2.5">
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleAssign} 
                    disabled={!isFormValid}
                    className="flex-1"
                  >
                    <IconUserPlus className="mr-2 h-4 w-4" />
                    Assign Kare Giver
                  </Button>
                  {(selectedGiver || selectedRelationship) && (
                    <Button 
                      variant="outline"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to assign, Esc to clear
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Givers List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Assigned Kare Givers ({assignedGivers.length})
              </h3>
            </div>

            {assignedGivers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No kare givers assigned yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the form above to assign your first kare giver.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[calc(90vh-500px)] min-h-[200px] pr-4">
                <div className="space-y-2">
                  {assignedGivers.map((giver) => (
                    <Card 
                      key={giver.id} 
                      className="transition-all hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-primary">
                                {giver.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {giver.name}
                              </p>
                              <Badge variant="secondary" className="mt-1 text-xs">
                                {giver.relationship}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                            onClick={() => handleDelete(giver.id)}
                            title="Remove"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
