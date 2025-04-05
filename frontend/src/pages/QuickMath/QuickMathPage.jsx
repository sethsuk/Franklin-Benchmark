import React from "react";
import QuickMathGame from "./QuickMathGame";

export default function QuickMathPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Quick Math</h1>
      <QuickMathGame />
    </div>
  );
}