"use client"
import React, { useState } from "react"
import "@/app/globals.css"
import {
  Dumbbell,
  Flame,
  Goal,
  HandFist,
  BicepsFlexed,
  Footprints,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const DashBoard = () => {
  const [stage, setStage] = useState("beginner")
  const router = useRouter();

  const handleNavigation = (item,stage) => {
    console.log(item);
    if (item === "push") {
      router.push(`/pushSeries/${stage}`)
    } else if (item === "pull") {
      router.push(`/pullSeries/${stage}`)
    } else {
      router.push(`/legSeries/${stage}`)
    }
  }

  const intensity = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  }

  const stageAccent = {
    beginner: "text-emerald-400",
    intermediate: "text-amber-400",
    advanced: "text-red-400",
  }

  return (
    <div className="h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center px-6 py-6 gap-6">

      {/* TOP SELECTOR */}
      <div className="flex gap-3">
        {["beginner", "intermediate", "advanced"].map((e) => (
          <Button
            key={e}
            onClick={() => setStage(e)}
            className={`
              capitalize rounded-xl px-5 py-2 text-sm font-medium
              transition border
              ${stage === e
                ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                : "bg-transparent border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }
            `}
          >
            {e}
            <span className="ml-2">
              {e === "beginner" ? <Goal size={16} /> :
                e === "intermediate" ? <Dumbbell size={16} /> :
                  <Flame size={16} />}
            </span>
          </Button>
        ))}
      </div>

      {/* CARDS */}
      <div className="w-full max-w-md flex flex-col gap-4 mt-4">

        {[
          { name: "push", icon: BicepsFlexed },
          { name: "pull", icon: HandFist },
          { name: "legs", icon: Footprints },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.name,stage)}
              className="
                w-full rounded-2xl border border-zinc-800
                bg-zinc-900/40 backdrop-blur
                p-5 flex flex-col gap-4
                hover:border-zinc-700 transition
                cursor-pointer
              "
            >

              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-zinc-800 ${stageAccent[stage]}`}>
                    <Icon size={20} />
                  </div>

                  <div className="text-lg font-semibold capitalize">
                    {item.name}
                  </div>
                </div>

                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {stage}
                </div>
              </div>

              {/* INTENSITY */}
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <Zap
                    key={i}
                    size={16}
                    className={
                      i <= intensity[stage]
                        ? stageAccent[stage]
                        : "text-zinc-700"
                    }
                  />
                ))}
              </div>

              {/* FOOTER TEXT */}
              <div className="text-sm text-zinc-400">
                {stage === "beginner"
                  ? "Focus on form and consistency"
                  : stage === "intermediate"
                    ? "Build strength and volume"
                    : "Maximize performance and intensity"}
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DashBoard