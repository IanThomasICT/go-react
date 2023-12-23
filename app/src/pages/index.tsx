import { useQuery } from "@tanstack/react-query";
import viteLogo from "/vite.svg";
import { useState } from "react";

export default function MainPage() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState<string>();

  // Local API routes (No need for CORS configuration)
  const greeting = useQuery({
    queryKey: ["greeting"],
    queryFn: () => fetch("/api/greeting").then((res) => res.text()),
  });

  const catFact = useQuery({
    queryKey: ["cat-fact"],
    queryFn: () => fetch("/api/cat-facts/random").then((res) => res.json()),
    refetchInterval: 1000 * 10,
  });

  return (
    <div className="grid justify-center items-center gap-3">
      <a className="mx-auto" href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </a>
      <h1>Go + React</h1>
      <h2>Response from server: "{greeting.isLoading ? "Loading..." : greeting.data}"</h2>
      {catFact.data && (
        <>
          <h2 className="text-3xl font-bold">Random Cat fact from server</h2>
          {catFact.isFetching ? <span>Updating...</span> : <i className="text-sm max-w-[50ch] mx-auto opacity-80">{catFact.data.data.fact}</i>}
        </>
      )}

      <hr className="my-8" />

      <div className="flex justify-evenly items-center">
        <div>
          <div className="text-2xl">
            Who rocks?{" "}
            {input && (
              <>
                <strong>{input}</strong> does!
              </>
            )}
          </div>
          <input type="text" className="mx-auto w-64 text-center p-1 text-lg" value={input ?? ""} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div className="card space-y-3">
          <h3 className="text-lg">Client-side button!</h3>
          <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        </div>
        <img src="https://github.com/egonelbre/gophers/blob/master/.thumb/animation/gopher-dance-long-3x.gif?raw=true" alt="dancing gopher" className="w-28" />
      </div>
    </div>
  );
}
