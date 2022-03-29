import { useState, useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Button } from "../Common/Button";
import {
  useToggleTimer,
  useShortBreakTimer,
  useLongBreakTimer,
  usePomodoroTimer,
  useHasStarted,
  useSetPomodoroCounter,
} from "../../store";

export const Timer = () => {
  const { shortBreakLength, defaultShortBreakLength } = useShortBreakTimer();
  const { longBreakLength, defaultLongBreakLength } = useLongBreakTimer();
  const { pomodoroLength, defaultPomodoroLength } = usePomodoroTimer();
  const { hasStarted, setHasStarted } = useHasStarted();
  const [breakLength, setBreakLength] = useState(shortBreakLength);
  const [timer, setTimer] = useState(1500);
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [isSession, setIsSession] = useState(false);
  const [sessionType, setSessionType] = useState("Session");
  const { setIsTimerToggled } = useToggleTimer();
  const { setPomodoroCounter } = useSetPomodoroCounter();

  const audioRef = useRef();

  useEffect(() => {
    setHasStarted(timerIntervalId !== null);
  }, [timerIntervalId]);

  useEffect(() => {
    if (timer === 0) {
      setPomodoroCounter();
      audioRef.current.play();
      if (sessionType === "Session") {
        setSessionType("Break");
        setTimer(breakLength);
      } else {
        setSessionType("Session");
        setTimer(pomodoroLength);
      }
    }
  }, [timer, sessionType]);

  useEffect(() => {
    setTimer(pomodoroLength);
  }, [pomodoroLength]);

  useEffect(() => {
    let time = secondsToTime(timer);
    setTimerMinutes(time[0]);
    setTimerSeconds(time[1]);
  }, [timer]);

  function toggleCountDown() {
    if (hasStarted) {
      // started mode
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
      setTimerIntervalId(null);
    } else {
      // stopped mode
      // create accurate date timer with date
      const newIntervalId = setInterval(() => {
        setTimer((prevTime) => {
          let newTime = prevTime - 1;
          let time = secondsToTime(newTime);
          setTimerMinutes(time[0]);
          setTimerSeconds(time[1]);
          return newTime;
        });
      }, 1000);
      setTimerIntervalId(newIntervalId);
    }
  }

  // return minutes and seconds of seconds
  function secondsToTime(seconds: number) {
    return [Math.floor(seconds / 60), seconds % 60];
  }

  // zero paddings if < 10
  function formatDisplayTime(time: number) {
    if (time < 10) {
      return `0${time}`;
    } else {
      return time;
    }
  }

  function handleBreakLengthChange(e: any) {
    if (hasStarted) return; // guard against change when running

    if (e.target.id === "break-decrement" && breakLength > 60) {
      setBreakLength((prevVal) => prevVal - 60);
    } else if (e.target.id === "break-increment" && breakLength < 3600) {
      setBreakLength((prevVal) => prevVal + 60);
    }
  }

  function handleResetTimer() {
    audioRef?.current?.load();
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    setTimerIntervalId(null);
    defaultPomodoroLength();
    defaultShortBreakLength();
    defaultLongBreakLength();
    setSessionType("Session");
    setTimer(1500);
  }

  function selectShortBreak() {
    if (hasStarted) return; // guard against change when running
    if (sessionType == "Break") {
      return;
    }
    setBreakLength(shortBreakLength);
  }

  function selectLongBreak() {
    if (hasStarted) return; // guard against change when running
    if (sessionType == "Break") {
      return;
    }
    setBreakLength(longBreakLength);
  }

  return (
    <div className="py-2 px-1 mb-2 max-w-sm bg-white text-gray-800 rounded-lg border border-gray-200 shadow-md dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 w-1/2">
      <div className="text-center">
        <div className="text-center p-2 rounded">
          <div className="flex justify-end">
            <IoCloseSharp
              className="text-red-500 cursor-pointer hover:bg-red-200"
              onClick={() => setIsTimerToggled(false)}
            />
          </div>
          {/* Controls */}
          <div className="flex">
            <div className="flex-1 flex-col flex justify-center items-center">
              <Button
                className="text-gray-800 hover:text-white dark:text-white"
                variant="cold"
                onClick={selectShortBreak}
              >
                Short Break
              </Button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
              <Button
                className="text-gray-800 hover:text-white dark:text-white"
                variant="cold"
                onClick={selectLongBreak}
              >
                Long Break
              </Button>
            </div>
          </div>

          {/* Timer */}
          <div className="rounded p-4 inline-block">
            <p id="timer-label">{sessionType}</p>
            <div className="text-9xl font-bold">
              {formatDisplayTime(timerMinutes)}:
              {formatDisplayTime(timerSeconds)}
            </div>
          </div>

          <div className="timer-control">
            <Button
              className="text-gray-800 font-normal hover:text-white dark:text-white"
              onClick={() => toggleCountDown()}
              variant="cold"
            >
              {hasStarted ? "Stop" : "Start"}
            </Button>
            <Button
              className="text-gray-800 font-normal hover:text-white dark:text-white ml-4"
              variant="cold"
              onClick={handleResetTimer}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
      <audio
        id="beep"
        preload="auto"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};
