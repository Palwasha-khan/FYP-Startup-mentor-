import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-[#bf5353] rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-[#bf5353] rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-[#bf5353] rounded-full animate-bounce delay-300"></div>
      </div>
       <p className="text-[#bf5353] font-semibold">Loading, please wait...</p>
    </div>
  );
};

export default Loader;