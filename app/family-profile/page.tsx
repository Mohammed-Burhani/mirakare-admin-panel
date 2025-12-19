"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft, IconEdit, IconDeviceFloppy, IconX, IconUser, IconPhone, IconMail, IconMapPin } from "@tabler/icons-react"
import { useFamilyProfile, useUpdateFamilyProfile } from "@/lib/hooks/useFamilyProfile"
import { toast } from "sonner"
import { LoadingState } from "@/components/loading-state"
import { ErrorState } from "@/components/error-state"

export default function FamilyProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  
  const { data: profileData, isLoading, error, refetch } = useFamilyProfile()
  const updateProfileMutation = useUpdateFamilyProfile()
  
  // Initialize form data from profile data
  const getInitialFormData = () => {
    if (profileData) {
      return {
        firstName: profileData.fname || "",
        middleName: profileData.mname || "",
        lastName: profileData.lname || "",
        mobile: profileData.mobile || "",
        email: profileData.email || "",
        addressLine1: profileData.address1 || "",
        addressLine2: profileData.address2 || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipcode || "",
        country: profileData.country || "",
        notes: profileData.notes || ""
      }
    }
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      notes: ""
    }
  }

  const [formData, setFormData] = useState(getInitialFormData)

  // Update form data when profile data changes and not editing
  useEffect(() => {
    if (profileData && !isEditing) {
      setFormData(getInitialFormData())
    }
  }, [profileData?.id, isEditing]) // Only depend on profile ID to avoid unnecessary updates

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        fname: formData.firstName,
        mname: formData.middleName,
        lname: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        address1: formData.addressLine1,
        address2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipCode,
        country: formData.country,
        notes: formData.notes
      })
      
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
      console.error("Update profile error:", error)
    }
  }

  const handleCancel = () => {
    // Reset to original data
    setFormData(getInitialFormData())
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading family profile..." />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorState 
          message="Failed to load family profile" 
          onRetry={() => refetch()}
        />
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9"
            >
              <IconArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Family Profile</h1>
              <p className="text-muted-foreground">View and manage family contact information</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <IconEdit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <IconX className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="gap-2"
                  disabled={updateProfileMutation.isPending}
                >
                  <IconDeviceFloppy className="h-4 w-4" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-4 lg:px-6">
          <Card className="border-2">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <IconUser className="text-primary h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {formData.firstName} {formData.middleName} {formData.lastName}
                  </CardTitle>
                  <CardDescription>Primary Contact Person</CardDescription>
                </div>
              </div>
            </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Personal Information Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <IconUser className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.firstName}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    {isEditing ? (
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                        placeholder="Optional"
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                        {formData.middleName || "—"}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <IconPhone className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      Mobile Number *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.mobile}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <IconMail className="h-4 w-4" />
                      Email *
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                  <IconMapPin className="h-5 w-5 text-primary" />
                  Address
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    {isEditing ? (
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.addressLine1}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    {isEditing ? (
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                      />
                    ) : (
                      <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        {formData.addressLine2}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      ) : (
                        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                          {formData.city}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      {isEditing ? (
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      ) : (
                        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                          {formData.state}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      {isEditing ? (
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        />
                      ) : (
                        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                          {formData.zipCode}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                        />
                      ) : (
                        <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                          {formData.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notes Section */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">Notes</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Information</Label>
                  {isEditing ? (
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Add any additional notes or information..."
                      rows={4}
                    />
                  ) : (
                    <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm min-h-[100px]">
                      {formData.notes || "No additional notes"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Container>
  )
}
