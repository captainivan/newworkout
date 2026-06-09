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
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const DashBoard = () => {
  const [stage, setStage] = useState("beginner")
  const router = useRouter()

  const handleNavigation = (item, stage) => {
    console.log(item)

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
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8">

      {/* HEADER */}
      <div className="w-full max-w-6xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Workout Dashboard
        </h1>

        <p className="text-zinc-400 text-center mt-2 text-sm sm:text-base">
          Choose your level and start training
        </p>
      </div>

      {/* STAGE SELECTOR */}
      <div className="w-full max-w-4xl flex flex-wrap justify-center gap-3 mb-8">
        {["beginner", "intermediate", "advanced"].map((e) => (
          <Button
            key={e}
            onClick={() => setStage(e)}
            className={`
              capitalize rounded-xl
              px-4 sm:px-5 py-2
              text-sm font-medium
              transition-all duration-300
              border
              flex items-center gap-2
              min-w-[120px]
              
              ${
                stage === e
                  ? "bg-zinc-100 text-zinc-900 border-zinc-100 shadow-lg"
                  : "bg-transparent border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900"
              }
            `}
          >
            {e}

            {e === "beginner" ? (
              <Goal size={16} />
            ) : e === "intermediate" ? (
              <Dumbbell size={16} />
            ) : (
              <Flame size={16} />
            )}
          </Button>
        ))}
      </div>

      {/* WORKOUT CARDS */}
      <div
        className="
          w-full
          max-w-6xl
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >
        {[
          { name: "push", icon: BicepsFlexed },
          { name: "pull", icon: HandFist },
          { name: "legs", icon: Footprints },
        ].map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.name, stage)}
              className="
                group
                rounded-3xl
                border border-zinc-800
                bg-zinc-900/40
                backdrop-blur-md
                p-5 sm:p-6
                flex flex-col
                gap-5
                cursor-pointer
                transition-all
                duration-300
                hover:border-zinc-600
                hover:bg-zinc-900/70
                hover:-translate-y-1
                hover:shadow-2xl
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      p-3
                      rounded-xl
                      bg-zinc-800
                      transition-all
                      duration-300
                      group-hover:scale-110
                      ${stageAccent[stage]}
                    `}
                  >
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold capitalize">
                      {item.name}
                    </h2>
                  </div>
                </div>

                <div className="text-xs uppercase tracking-widest text-zinc-500">
                  {stage}
                </div>
              </div>

              {/* INTENSITY */}
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Zap
                    key={i}
                    size={18}
                    className={`transition-all duration-300 ${
                      i <= intensity[stage]
                        ? stageAccent[stage]
                        : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* DESCRIPTION */}
              <div className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                {stage === "beginner"
                  ? "Focus on form and consistency."
                  : stage === "intermediate"
                  ? "Build strength and training volume."
                  : "Maximize performance and workout intensity."}
              </div>

              {/* CTA */}
              <div className="pt-2 border-t border-zinc-800 text-sm text-zinc-500 group-hover:text-zinc-300 transition">
                Tap to start →
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DashBoard