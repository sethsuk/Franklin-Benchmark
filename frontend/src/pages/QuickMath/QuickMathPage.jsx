import React, { useState, useEffect } from "react";
import QuickMathGame from "./QuickMathGame";

import Header from '../../components/Header/Header';

export default function QuickMathPage() {
  const [userData, setUserData] = useState(null);

  return (
    <div className="p-6">
      <Header userData={userData} setUserData={setUserData} />
      <h1 className="text-3xl font-bold text-center mb-6">Quick Math</h1>
      <QuickMathGame />
    </div>
  );
}