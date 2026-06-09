"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight, Flame, Goal } from "lucide-react"

const Page = () => {
  const params = useParams()
  const level = params.level
  const router = useRouter();

  const [days, setDays] = useState([])

  useEffect(() => {
    const handleDays = async () => {
      const api = await fetch("/api/legDays");
      const res = await api.json();
      const actualExerDatesArray = res.allLegDaysDates.filter(e => e.level === level)

      setDays(actualExerDatesArray || [])
    }

    handleDays()
  }, [])

  useEffect(() => {
    console.log(days);
  }, [days])

  const levelAccent = {
    beginner: "text-emerald-400",
    intermediate: "text-amber-400",
    advanced: "text-red-400",
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 px-6 py-6 flex flex-col items-center gap-6">

      {/* HEADER */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">
            Leg Series
          </h1>
          <p className="text-sm text-zinc-500 capitalize">
            {level} level workout plan
          </p>
        </div>

        <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-800 ${levelAccent[level] || "text-zinc-300"}`}>
          <Flame size={22} />
        </div>
      </div>

      {/* STATS CARD */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
            <Goal size={20} />
          </div>

          <div>
            <div className="text-sm text-zinc-400">Total Days</div>
            <div className="text-xl font-semibold">{days.length}</div>
          </div>
        </div>

        <div className="text-xs uppercase tracking-wider text-zinc-500">
          {level}
        </div>
      </div>

      {/* DAYS LIST */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {days.map((e, i) => (
          <div
            key={i}
            onClick={() => { router.push(`/startWorkout/legWorkout/${level}?day=${e.day}&id=${e._id}`) }}
            className="
              w-full rounded-2xl border border-zinc-800
              bg-zinc-900/40 backdrop-blur
              p-5 flex items-center justify-between
              hover:border-zinc-700 transition
              cursor-pointer
            "
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-zinc-800 ${levelAccent[level] || "text-zinc-300"}`}>
                <CalendarDays size={20} />
              </div>

              <div>
                <div className="text-lg font-semibold">
                  Day {e.day}
                </div>
                <div className="text-sm text-zinc-500">
                  Leg workout session
                </div>
              </div>
            </div>

            {e.completed ? <><Button className={`  ${levelAccent[level]}`}>COMPLETED</Button></> : <ChevronRight size={20} className="text-zinc-600" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page