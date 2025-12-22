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
      <Card className="@container/card relative overflow-hidden border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg dark:border-slate-600">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconShieldCheck className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Total</div>
          </div>
          <CardDescription className="text-slate-200">
            Kare Admins
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-sky-300 bg-gradient-to-br from-sky-400 to-sky-500 text-white shadow-lg dark:border-sky-600">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconUsers className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Active</div>
          </div>
          <CardDescription className="text-sky-100">
            Kare Givers
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            40
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg dark:border-slate-500">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconHeartbeat className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Enrolled</div>
          </div>
          <CardDescription className="text-slate-200">
            Kare Recipients
          </CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-sky-400 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg dark:border-sky-500">
        <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-white/5" />
        <CardHeader className="relative">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <IconActivity className="size-6" />
            </div>
            <div className="text-xs font-medium opacity-90">Recorded</div>
          </div>
          <CardDescription className="text-sky-100">Vitals</CardDescription>
          <CardTitle className="text-4xl font-bold tabular-nums @[250px]/card:text-5xl">
            589K
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
