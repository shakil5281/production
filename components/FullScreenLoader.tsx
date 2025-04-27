// components/FullScreenLoader.tsx
import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="w-full absolute top-0 left-0 h-screen flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );
};

export default FullScreenLoader;
