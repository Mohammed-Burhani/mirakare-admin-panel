import {
  IconActivity,
  IconHeartbeat,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg dark:border-blue-800">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconShieldCheck className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Total</div>
          </div>
          <CardDescription className="text-blue-100">
            Kare Admins
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-cyan-200 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg dark:border-cyan-800">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconUsers className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Active</div>
          </div>
          <CardDescription className="text-cyan-100">
            Kare Givers
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            40
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-amber-200 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg dark:border-amber-800">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconHeartbeat className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Enrolled</div>
          </div>
          <CardDescription className="text-amber-100">
            Kare Recipients
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-rose-200 bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg dark:border-rose-800">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconActivity className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Recorded</div>
          </div>
          <CardDescription className="text-rose-100">Vitals</CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            589K
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
