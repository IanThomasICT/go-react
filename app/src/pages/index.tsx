import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";

export default function MainPage() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState<string>();
  const [serverOnline, setServerOnline] = useState<boolean>();

  useEffect(() => {
    fetch("/api/greeting").then((res) => {
      setServerOnline(res.headers.get("Content-Type") !== 'text/html');
    })
  }, [])

  // Local API routes (No need for CORS configuration)
  const greeting = useQuery({
    queryKey: ["greeting"],
    queryFn: () => fetch("/api/greeting").then((res) => {
      if (res.headers.get("Content-Type") === 'text/html') throw Error("Failed to retrieve greeting from user")
      return res.text();
    }),
  });

  const catFact = useQuery({
    queryKey: ["cat-fact"],
    queryFn: () => fetch("/api/cat-facts/random").then((res) => res.json()),
    refetchInterval: 1000 * 5,
  });

  return (
    <div className="grid gap-3 p-8 border border-neutral-700 rounded-lg shadow-xl max-w-screen-md max-h-[70dvh] h-full w-full text-center">
      <a className="mx-auto" href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>

      <h1 className="text-5xl">Go + React</h1>

      {!serverOnline ? <h2>Client-only version</h2> :
        <div id="server-content" className="space-y-4 w-full">
          <p>Server is online!</p>
          <p className="p-4 border rounded-sm relative" style={{ borderColor: greeting.isSuccess ? "rgb(127 29 29)" : "rgb(59 130 246" }}>
            Fetching from server: {
              greeting.isLoading ? "Loading..."
                : greeting.isError ? "Failed to reach server"
                  : greeting.data
            }
            <div className="absolute w-56 left-full top-2 border-b border-red-800 text-white font-mono text-right">/api/greeting</div>
          </p>

          <h2 className="block text-3xl font-bold">Random Cat fact from server</h2>
          <p className="p-4 border border-red-800 rounded-sm relative">
            <span className="italic text-sm text-balance mx-auto text-neutral-300">{catFact.isLoading ? "Updating..." : catFact.data.data.fact}</span>
            <div className="not-italic absolute w-72 left-full top-2 border-b border-red-800 text-white font-mono text-right">/api/cat-facts/random</div>
          </p>
        </div>
      }

      <hr className="my-4" />

      <div className="flex justify-evenly items-center">
        <div className="space-y-3">
          <p className="text-2xl">
            Who rocks?{" "}
            {input && <span><strong>{input}</strong> does!</span>}
          </p>
          <input type="text" className="mx-auto w-64 text-center p-1 text-lg placeholder:text-neutral-500 border border-blue-500 outline-none focus:border-indigo-600" value={input ?? ""} onChange={(e) => setInput(e.target.value)} placeholder="Enter your name" />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg">Client-side button!</h3>
          <button className="px-5 py-3 rounded-lg shadow-md shadow-blue-500 border border-blue-500 outline-transparent hover:border-indigo-700" onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        </div>
        <img src="https://github.com/egonelbre/gophers/blob/master/.thumb/animation/gopher-dance-long-3x.gif?raw=true" alt="dancing gopher" className="w-28" />
      </div>
    </div>
  );
}
