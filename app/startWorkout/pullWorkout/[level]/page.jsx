"use client"

import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Menu,
  Pause,
  Play,
  StepBack,
  StepForward,
} from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"

const page = () => {
  const [exercise, setExercise] = useState([])
  const [numExercise, setNumExercise] = useState(0)
  const [pause, setPause] = useState(false)
  const [exerBreak, setExerBreak] = useState(false)
  const [exerBreakTime, setExerBreakTime] = useState(20)
  const [timerPhase, setTimerPhase] = useState("idle")
  const [readyTime, setReadyTime] = useState(3)
  const [workoutTime, setWorkoutTime] = useState(0)
  const [finishTimeWorkout, setFinishTimeWorkout] = useState(false);
  const [finishWorkout, setFinishWorkout] = useState(false);
  const [concludeWorkout, setConcludeWorkout] = useState(false);

  const router = useRouter();
  const param = useParams();
  const searchParam = useSearchParams();

  const id = searchParam.get("id")
  const day = searchParam.get("day")

  const workoutAudioRef = useRef(null);
  const bellAudioRef = useRef(null);
  const warmUpAudioRef = useRef(null);

  const playWarmUpAudioRef = () => {
    if (warmUpAudioRef.current) {
      warmUpAudioRef.current.volume = 1;
      warmUpAudioRef.current.play();
    }
  }

  const playBellAudio = () => {
    if (bellAudioRef.current) {
      bellAudioRef.current.volume = 1;
      bellAudioRef.current.play();
    }
  }

  const playWorkoutAudio = () => {
    if (workoutAudioRef.current) {
      workoutAudioRef.current.volume = 0.50
      workoutAudioRef.current.loop = true
      workoutAudioRef.current.play()
    }
  }

  const stopWorkoutAudio = () => {
    if (workoutAudioRef.current) {
      workoutAudioRef.current.pause()
    }
  }

  useEffect(() => { playWorkoutAudio() }, []);

  useEffect(() => {
    if (concludeWorkout) {
      const updateDate = async () => {
        const api = await fetch("/api/pullDays", {
          method: "POST",
          body: JSON.stringify({
            id
          })
        });
        const req = await api.json();
        console.log(req);
      }
      updateDate()
    }
  }, [concludeWorkout])

  useEffect(() => {
    if (numExercise == exercise.length - 1) {
      setFinishWorkout(true)
    } else {
      setFinishWorkout(false)
    }
  }, [numExercise, exercise]);

  useEffect(() => {
    console.log("finish workout =============>", finishWorkout);
  }, [finishWorkout])

  useEffect(() => {
    if (exercise[numExercise]?.exerciseType === "time" && !exerBreak) {
      setTimerPhase("ready")
      setReadyTime(3)
      setWorkoutTime(exercise[numExercise]?.targetRep)
    }
  }, [numExercise, exerBreak, exercise])

  useEffect(() => {
    if (timerPhase !== "ready") return

    if (readyTime <= 0) {
      setTimerPhase("workout")
      return
    }

    if (readyTime == 3) {
      playWarmUpAudioRef()
    }

    const timer = setTimeout(() => {
      setReadyTime((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerPhase, readyTime])

  useEffect(() => {
    if (timerPhase !== "workout") return
    if (pause) return

    if (workoutTime <= 0) {
      setTimerPhase("finished")
      setFinishTimeWorkout(!finishTimeWorkout)
    }

    if (workoutTime == 1) {
      playBellAudio()
    }

    const timer = setTimeout(() => {
      setWorkoutTime((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerPhase, workoutTime, pause])

  useEffect(() => {
    const getExercises = async () => {
      const api = await fetch("/api/getExercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level: param.level }),
      })

      const res = await api.json()
      let filterArray = res.getExercises.filter((e) => e.series === "pull");

      let videoCodedArray = filterArray.map((e) => {
        return {
          ...e,
          videoName: e.exerciseName.replace(" ", "-")
        }
      });
      let finalArray = []

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < videoCodedArray.length; j++) {
          finalArray.push(videoCodedArray[j])
        }
      }

      setExercise(finalArray)
    }

    getExercises()
  }, [])

  useEffect(() => {
    console.log("the array used for coding ---------- ", exercise);
  }, [exercise])

  useEffect(() => {
    if (!exerBreak) return

    if (exerBreakTime <= 0) {
      setExerBreak(false)
      setExerBreakTime(20)
      return
    }

    if (exerBreakTime == 1) {
      playBellAudio()
    }

    const interval = setInterval(() => {
      setExerBreakTime((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [exerBreakTime, exerBreak])

  const StatPill = ({ label, value }) => (
    <p className="px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300">
      <span className="text-zinc-500">{label}: </span>
      <span className="font-semibold text-white">{value}</span>
    </p>
  )

  const heavyFunctionRep = (exerData) => {
    return (
      <div className="h-full w-full max-w-md mx-auto flex flex-col items-center justify-center gap-3 overflow-hidden">
        <div className="text-center shrink-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-400 mb-1">
            Rep Workout
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {exerData.exerciseName}
          </h1>
        </div>

        <div className="w-full rounded-[1.4rem] border border-zinc-800 bg-zinc-900/60 p-2 shrink-0">
          <video
            className="rounded-[1rem] w-full aspect-video max-h-[175px] object-cover"
            src={`/video/${exerData.videoName}.mp4`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <StatPill label="Series" value={exerData.series} />
          <StatPill label="Reps" value={exerData.targetRep} />
          <StatPill label="Sets" value={exerData.sets} />
        </div>

        <div className="w-full rounded-[1.5rem] bg-linear-to-br from-emerald-400/20 to-zinc-900 border border-emerald-400/20 p-5 flex items-center justify-center shrink-0">
          <h1 className="text-6xl font-black text-white leading-none">
            <span className="text-2xl text-emerald-400 mr-1">X</span>
            {exerData.targetRep}
          </h1>
        </div>
      </div>
    )
  }

  const heavyFunctionTime = (exerData) => {
    return (
      <div className="h-full w-full max-w-md mx-auto flex flex-col items-center justify-center gap-3 overflow-hidden">

        <div className="text-center shrink-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-amber-400 mb-1">
            Timed Workout
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {exerData.exerciseName}
          </h1>
        </div>

        <div className="w-full rounded-[1.4rem] border border-zinc-800 bg-zinc-900/60 p-2 shrink-0">
          <video
            className="rounded-[1rem] w-full aspect-video max-h-[175px] object-cover"
            src={`/video/${exerData.videoName}.mp4`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <StatPill label="Series" value={exerData.series} />
          <StatPill label="Sec" value={exerData.targetRep} />
          <StatPill label="Sets" value={exerData.sets} />
        </div>

        <div className="w-full rounded-[1.5rem] bg-linear-to-br from-amber-400/20 to-zinc-900 border border-amber-400/20 p-5 flex flex-col items-center justify-center min-h-[125px] shrink-0">
          {timerPhase === "ready" && (
            <>
              <h3 className="text-zinc-400 text-xs mb-2">
                Get ready for {exerData.exerciseName}
              </h3>
              <p className="text-6xl font-black text-amber-400 leading-none">
                {readyTime}
              </p>
            </>
          )}

          {timerPhase === "workout" && (
            <>
              <h3 className="text-zinc-400 text-xs mb-2">
                {exerData.exerciseName}
              </h3>
              <p className="text-6xl font-black text-white leading-none">
                {workoutTime}
              </p>
            </>
          )}

          {timerPhase === "finished" && (
            <h3 className="text-3xl font-black text-emerald-400">Done!</h3>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,#1f2937_0%,#09090b_45%,#000_100%)] text-white">
      <div className="h-full w-full flex flex-col overflow-hidden">


        <audio ref={workoutAudioRef} src="/audio/workout.mp3" loop />
        <audio ref={bellAudioRef} src="/audio/bell.mp3" />
        <audio ref={warmUpAudioRef} src="/audio/321.mp3" />


        {/* TOP BAR */}
        <div className="h-[58px] w-full flex items-center justify-between px-4 shrink-0">
          <Button
            onClick={() => router.push("/")}
            className="cursor-pointer bg-zinc-900/80 border border-zinc-800 rounded-full p-2.5 flex items-center justify-center active:scale-95 transition">
            <ChevronLeft size={20} />
          </Button>

          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.22em]">
              Day {day}
            </p>
            <h2 className="text-sm font-bold capitalize">
              {param.level} Pull
            </h2>
          </div>

          <div className="cursor-pointer bg-zinc-900/80 border border-zinc-800 rounded-full p-2.5 flex items-center justify-center active:scale-95 transition">
            <Menu size={20} />
          </div>
        </div>

        {concludeWorkout ? (
          <div className="flex-1 w-full px-5 flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-md rounded-[2rem] border border-emerald-400/20 bg-zinc-900/70 backdrop-blur-xl p-6 flex flex-col items-center text-center shadow-2xl">

              <div className="relative mb-5">
                <div className="h-28 w-28 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.25)]">
                  <div className="h-20 w-20 rounded-full bg-emerald-400 flex items-center justify-center text-black text-4xl font-black">
                    ✓
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 h-9 w-9 rounded-full bg-amber-400 text-black flex items-center justify-center text-lg">
                  🔥
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 mb-2">
                Session Complete
              </p>

              <h2 className="text-3xl font-black text-white leading-tight">
                Workout Completed
              </h2>

              <p className="text-sm text-zinc-400 mt-3 max-w-xs">
                Great job! You finished your Day {day} {param.level} pull workout.
              </p>

              <div className="w-full grid grid-cols-3 gap-2 mt-6">
                <div className="rounded-2xl bg-black/40 border border-zinc-800 p-3">
                  <p className="text-xl font-black text-white">{exercise.length}</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Moves</p>
                </div>

                <div className="rounded-2xl bg-black/40 border border-zinc-800 p-3">
                  <p className="text-xl font-black text-emerald-400">100%</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Done</p>
                </div>

                <div className="rounded-2xl bg-black/40 border border-zinc-800 p-3">
                  <p className="text-xl font-black text-amber-400">+1</p>
                  <p className="text-[10px] text-zinc-500 uppercase">Streak</p>
                </div>
              </div>

              <div className="w-full mt-6 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 p-4">
                <p className="text-sm text-zinc-300">
                  Recovery tip: drink water and take a few slow breaths before your next session.
                </p>
              </div>

            </div>
          </div>
        )
          : (

            exerBreak ? (
              <>
                <div className="flex-1 w-full overflow-hidden px-4 flex items-center justify-center">
                  <div className="h-full w-full max-w-md flex flex-col items-center justify-center gap-3 overflow-hidden">
                    <div className="text-center shrink-0">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-400 mb-1">
                        Recovery Time
                      </p>
                      <h1 className="text-2xl font-black">20 sec Break</h1>
                      <p className="text-xs text-zinc-400 mt-1">
                        Upcoming Exercise
                      </p>
                      <p className="text-lg font-bold leading-tight">
                        {exercise[numExercise]?.exerciseName}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
                      <StatPill label="Series" value={exercise[numExercise]?.series} />
                      <StatPill
                        label={exercise[numExercise]?.exerciseType === "reps" ? "Reps" : "Sec"}
                        value={exercise[numExercise]?.targetRep}
                      />
                      <StatPill label="Sets" value={exercise[numExercise]?.sets} />
                    </div>

                    <div className="w-full rounded-[1.4rem] border border-zinc-800 bg-zinc-900/60 p-2 shrink-0">
                      <video
                        className="rounded-[1rem] w-full aspect-video max-h-[165px] object-cover"
                        src={`/video/${exercise[numExercise]?.videoName}.mp4`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      />
                    </div>

                    <div className="h-[145px] w-[145px] rounded-full bg-linear-to-br from-cyan-400/30 to-zinc-950 border border-cyan-400/30 flex items-center justify-center shadow-2xl shrink-0">
                      <span className="text-5xl font-black">{exerBreakTime}</span>
                    </div>
                  </div>
                </div>

                <div className="h-[76px] shrink-0 w-full bg-black/70 backdrop-blur-xl border-t border-zinc-800 px-4 py-3">
                  <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => { setExerBreakTime((prev) => prev + 10) }}
                      className="h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800"
                    >
                      +10 Sec
                    </Button>

                    <Button
                      onClick={() => {
                        setExerBreak(!exerBreak)
                        setExerBreakTime(20)
                      }}
                      className="h-12 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold"
                    >
                      Skip <StepForward className="ml-1" size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 w-full px-4 flex items-center justify-center overflow-hidden">
                  {exercise.length === 0 ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 rounded-full border-4 border-zinc-800 border-t-white animate-spin"></div>
                      <div className="text-zinc-400 text-sm">Loading workout...</div>
                    </div>
                  ) : exercise[numExercise]?.exerciseType === "reps" ? (
                    heavyFunctionRep(exercise[numExercise])
                  ) : (
                    heavyFunctionTime(exercise[numExercise])
                  )}
                </div>

                <div className="h-[76px] shrink-0 w-full bg-black/70 backdrop-blur-xl border-t border-zinc-800 px-4 py-3">
                  <div className="max-w-md mx-auto flex items-center justify-center gap-3">
                    {numExercise < 1 ? (
                      <Button disabled className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800">
                        <StepBack size={18} />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => { setNumExercise(numExercise - 1) }}
                        className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                      >
                        <StepBack size={18} />
                      </Button>
                    )}

                    {finishWorkout ?
                      (<><Button className="h-12 flex-1 rounded-full bg-emerald-400 text-black hover:bg-emerald-300 font-black tracking-wide" onClick={() => { setConcludeWorkout(!concludeWorkout) }}>END WORKOUT</Button></>) :
                      (
                        exercise[numExercise]?.exerciseType === "reps" ? (
                          <Button
                            onClick={() => {
                              setExerBreak(!exerBreak)
                              setNumExercise((prev) => prev + 1)
                              setExerBreakTime(20)
                            }}
                            className="h-12 flex-1 rounded-full bg-emerald-400 text-black hover:bg-emerald-300 font-black tracking-wide"
                          >
                            {exercise.length === 0
                              ? "GET READY"
                              : exercise[numExercise]?.exerciseType === "reps"
                                ? "FINISH"
                                : ""}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              if (finishTimeWorkout) {
                                setExerBreak(!exerBreak)
                                setNumExercise((prev) => prev + 1)
                                setExerBreakTime(20)
                                setFinishTimeWorkout(!finishTimeWorkout)
                              } else {
                                setPause((prev) => !prev)
                              }
                            }}
                            className="h-12 flex-1 rounded-full bg-white text-black hover:bg-zinc-200 font-black tracking-wide"
                          >
                            {exercise.length === 0
                              ? "GET READY"
                              : finishTimeWorkout
                                ? "FINISH"
                                : exercise[numExercise]?.exerciseType === "time"
                                  ? pause
                                    ? <Play size={20} />
                                    : <Pause size={20} />
                                  : ""}
                          </Button>
                        )
                      )}

                    {finishWorkout ?
                      (<></>) : (
                        <>
                          <Button
                            disabled={numExercise === exercise.length - 1 ? true : false}
                            onClick={() => { setNumExercise(numExercise + 1) }}
                            className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                          >
                            <StepForward size={18} />
                          </Button>
                        </>
                      )}
                  </div>
                </div>
              </>
            )
          )}
      </div>
    </div >
  )
}

export default page