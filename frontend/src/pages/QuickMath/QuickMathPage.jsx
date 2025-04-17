import React from "react";
import Header from "../../components/Header/Header";
import QuickMathGame from "./QuickMathGame";
import "./QuickMath.css";

export default function QuickMathPage() {
  return (
    <div className="quickmath-page-wrapper">
      <Header />

      <div className="quickmath-container">
        <QuickMathGame />
      </div>
    </div>
  );
}