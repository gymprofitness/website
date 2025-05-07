import React from "react";

function PulsatingDotsSpinner({
  parentHeight,
}: {
  parentHeight: number | string;
}) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: parentHeight }}
    >
      <div className="flex space-x-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-primary rounded-full animate-[pulse_1.2s_ease-in-out_infinite]"
            style={{
              animationDelay: `${i * 0.15}s`,
              transform: `scale(${1 + (i % 2) * 0.2})`,
              opacity: 0.7 + (i % 3) * 0.1,
            }}
          >
            <div
              className="absolute w-full h-full rounded-full bg-primary opacity-30 animate-ping"
              style={{ animationDuration: "1.5s" }}
            ></div>
          </div>
        ))}
      </div>
      <div className="absolute mt-12 text-xs text-primary font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
}

export default PulsatingDotsSpinner;
