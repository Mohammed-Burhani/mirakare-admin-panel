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
    <div className="grid grid-cols-2 gap-2 px-4 sm:grid-cols-1 sm:gap-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card relative overflow-hidden border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg dark:border-slate-600">
        <div className="absolute -right-1 -top-1 size-8 rounded-full bg-white/10 sm:size-24 sm:-right-4 sm:-top-4" />
        <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-white/5 sm:size-32 sm:-bottom-6 sm:-right-6" />
        <CardHeader className="relative py-2 sm:py-6">
          <div className="mb-1 flex items-center justify-between sm:mb-2">
            <div className="rounded bg-white/20 p-1 backdrop-blur-sm sm:rounded-lg sm:p-2">
              <IconShieldCheck className="size-3 sm:size-6" />
            </div>
            <div className="text-[10px] font-medium opacity-90 sm:text-xs">Total</div>
          </div>
          <CardDescription className="text-slate-200 text-[10px] sm:text-sm">
            Kare Admins
          </CardDescription>
          <CardTitle className="text-lg font-bold tabular-nums sm:text-4xl @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-sky-300 bg-gradient-to-br from-sky-400 to-sky-500 text-white shadow-lg dark:border-sky-600">
        <div className="absolute -right-1 -top-1 size-8 rounded-full bg-white/10 sm:size-24 sm:-right-4 sm:-top-4" />
        <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-white/5 sm:size-32 sm:-bottom-6 sm:-right-6" />
        <CardHeader className="relative py-2 sm:py-6">
          <div className="mb-1 flex items-center justify-between sm:mb-2">
            <div className="rounded bg-white/20 p-1 backdrop-blur-sm sm:rounded-lg sm:p-2">
              <IconUsers className="size-3 sm:size-6" />
            </div>
            <div className="text-[10px] font-medium opacity-90 sm:text-xs">Active</div>
          </div>
          <CardDescription className="text-sky-100 text-[10px] sm:text-sm">
            Kare Givers
          </CardDescription>
          <CardTitle className="text-lg font-bold tabular-nums sm:text-4xl @[250px]/card:text-5xl">
            40
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg dark:border-slate-500">
        <div className="absolute -right-1 -top-1 size-8 rounded-full bg-white/10 sm:size-24 sm:-right-4 sm:-top-4" />
        <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-white/5 sm:size-32 sm:-bottom-6 sm:-right-6" />
        <CardHeader className="relative py-2 sm:py-6">
          <div className="mb-1 flex items-center justify-between sm:mb-2">
            <div className="rounded bg-white/20 p-1 backdrop-blur-sm sm:rounded-lg sm:p-2">
              <IconHeartbeat className="size-3 sm:size-6" />
            </div>
            <div className="text-[10px] font-medium opacity-90 sm:text-xs">Enrolled</div>
          </div>
          <CardDescription className="text-slate-200 text-[10px] sm:text-sm">
            Kare Recipients
          </CardDescription>
          <CardTitle className="text-lg font-bold tabular-nums sm:text-4xl @[250px]/card:text-5xl">
            1
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="@container/card relative overflow-hidden border-sky-400 bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg dark:border-sky-500">
        <div className="absolute -right-1 -top-1 size-8 rounded-full bg-white/10 sm:size-24 sm:-right-4 sm:-top-4" />
        <div className="absolute -bottom-2 -right-2 size-12 rounded-full bg-white/5 sm:size-32 sm:-bottom-6 sm:-right-6" />
        <CardHeader className="relative py-2 sm:py-6">
          <div className="mb-1 flex items-center justify-between sm:mb-2">
            <div className="rounded bg-white/20 p-1 backdrop-blur-sm sm:rounded-lg sm:p-2">
              <IconActivity className="size-3 sm:size-6" />
            </div>
            <div className="text-[10px] font-medium opacity-90 sm:text-xs">Recorded</div>
          </div>
          <CardDescription className="text-sky-100 text-[10px] sm:text-sm">Vitals</CardDescription>
          <CardTitle className="text-lg font-bold tabular-nums sm:text-4xl @[250px]/card:text-5xl">
            589K
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
