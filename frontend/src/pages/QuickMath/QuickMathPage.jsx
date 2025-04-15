import React from "react";
import Header from "../../components/Header/Header";
import QuickMathGame from "./QuickMathGame";
import { ReactComponent as PennBenchmarkIcon } from "./PennBenchmarkIcon.svg";
import "./QuickMath.css";

export default function QuickMathPage() {
  return (
    <div className="quickmath-page-wrapper">
      <div className="header-row">
        <div className="header-left">
          <div className="hamburger">&#9776;</div>
          <PennBenchmarkIcon className="svg-PennBenchmark" />
          <span className="brand-name">Franklin Benchmark</span>
        </div>
        <Header userData={{}} setUserData={() => {}} />
      </div>

      <div className="quickmath-container">
        <QuickMathGame />
      </div>
    </div>
  );
}