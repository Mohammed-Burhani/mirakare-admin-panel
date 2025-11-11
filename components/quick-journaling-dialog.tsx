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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconX, IconPlus, IconPencil, IconTrash, IconCheck } from "@tabler/icons-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface QuickJournalingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientName: string
}

const observationCategories = [
  "Mood & Behavior",
  "Health Events",
  "Sleep & Rest",
  "Bathroom & Hygiene",
  "Pain or Illness Signs",
  "Eating & Drinking",
  "Movement & Mobility",
  "Communication",
  "Other Observations",
]

const activityCategories = [
  "Entertainment",
  "Exercise",
  "Meals",
  "Medication",
  "Therapy",
  "Toileting",
  "Other Activity",
  "Bathing",
  "Education",
]

const mockObservations = [
  {
    id: 1,
    category: "Pain or Illness Signs",
    description: "Chest feels congested",
  },
  { id: 2, category: "Communication", description: "Not paying attention" },
  { id: 3, category: "Communication", description: "Very engaged" },
  { id: 4, category: "Eating & Drinking", description: "Spitting out food a lot" },
  { id: 5, category: "Sleep & Rest", description: "Snoozing during the day" },
]

const mockActivities = [
  { id: 1, category: "Medication", description: "Amoxicillin" },
  { id: 2, category: "Meals", description: "Breakfast" },
  { id: 3, category: "Exercise", description: "Morning walk" },
]

type ItemType = "observation" | "activity"

interface Item {
  id: number
  category: string
  description: string
}

export function QuickJournalingDialog({
  open,
  onOpenChange,
}: QuickJournalingDialogProps) {
  const [activeTab, setActiveTab] = useState<ItemType>("observation")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [description, setDescription] = useState("")
  const [observations, setObservations] = useState(mockObservations)
  const [activities, setActivities] = useState(mockActivities)
  const [editingId, setEditingId] = useState<number | null>(null)

  const resetForm = useCallback(() => {
    setSelectedCategory("")
    setDescription("")
    setEditingId(null)
  }, [])

  const handleSubmit = useCallback((type: ItemType) => {
    if (!selectedCategory || !description.trim()) return

    if (editingId) {
      // Edit existing
      const updateFn = (items: Item[]) =>
        items.map((item) =>
          item.id === editingId
            ? { ...item, category: selectedCategory, description: description.trim() }
            : item
        )
      
      if (type === "observation") {
        setObservations(updateFn)
      } else {
        setActivities(updateFn)
      }
    } else {
      // Add new
      const newItem: Item = {
        id: Date.now(),
        category: selectedCategory,
        description: description.trim(),
      }
      
      if (type === "observation") {
        setObservations((prev) => [...prev, newItem])
      } else {
        setActivities((prev) => [...prev, newItem])
      }
    }
    
    resetForm()
  }, [selectedCategory, description, editingId, resetForm])

  const handleEdit = useCallback((item: Item) => {
    setEditingId(item.id)
    setSelectedCategory(item.category)
    setDescription(item.description)
    // Scroll to top to show form
    document.querySelector('[data-form-container]')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleDelete = useCallback((id: number, type: ItemType) => {
    if (type === "observation") {
      setObservations((prev) => prev.filter((o) => o.id !== id))
    } else {
      setActivities((prev) => prev.filter((a) => a.id !== id))
    }
    // Clear form if deleting the item being edited
    if (editingId === id) {
      resetForm()
    }
  }, [editingId, resetForm])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, type: ItemType) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit(type)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      resetForm()
    }
  }, [handleSubmit, resetForm])

  const isFormValid = selectedCategory && description.trim()

  const renderForm = (type: ItemType, categories: string[]) => (
    <Card key={`form-${type}`} className="border-2 bg-muted/30" data-form-container>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${type}-category`} className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id={`${type}-category`} className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="py-2.5">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${type}-description`} className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`${type}-description`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, type)}
              placeholder="Enter description..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to submit, Esc to cancel
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => handleSubmit(type)}
              disabled={!isFormValid}
              className="flex-1"
            >
              {editingId ? (
                <>
                  <IconCheck className="mr-2 h-4 w-4" />
                  Update {type === "observation" ? "Observation" : "Activity"}
                </>
              ) : (
                <>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add {type === "observation" ? "Observation" : "Activity"}
                </>
              )}
            </Button>
            {editingId && (
              <Button 
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderItemsList = (items: Item[], type: ItemType) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Saved {type === "observation" ? "Observations" : "Activities"} ({items.length})
        </h3>
      </div>
      
      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No {type === "observation" ? "observations" : "activities"} added yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the form above to create your first entry.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(90vh-500px)] min-h-[300px] pr-4">
          <div className="space-y-2">
            {items.map((item) => (
              <Card 
                key={item.id} 
                className={`transition-all hover:shadow-md ${
                  editingId === item.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="shrink-0 mt-0.5">
                      {item.category}
                    </Badge>
                    <p className="flex-1 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      >
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(item.id, type)}
                        title="Delete"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Configure Quick Journaling
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Create reusable templates for observations and activities
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

        <div className="px-6 py-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => {
              setActiveTab(v as ItemType)
              resetForm()
            }} 
            className="w-full"
          >
            <TabsList className="mb-6 grid w-full max-w-sm grid-cols-2">
              <TabsTrigger value="observation">
                Observations
              </TabsTrigger>
              <TabsTrigger value="activities">
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="observation" className="space-y-6 mt-0">
              {renderForm("observation", observationCategories)}
              {renderItemsList(observations, "observation")}
            </TabsContent>

            <TabsContent value="activities" className="space-y-6 mt-0">
              {renderForm("activity", activityCategories)}
              {renderItemsList(activities, "activity")}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
