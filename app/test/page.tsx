"use client";

import axios from "axios";
import { KEYWORD } from "../api/keyword/Keyword";
import { useState } from "react";

function Test() {
  const [query, setQuery] = useState<string>("");

  const newtest = async () => {
    const response = await KEYWORD(query);
    console.log(`response`, response);
  };

  return (
    <>
      <input
        className="bg-slate-500"
        title="inp"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        type="text"
        name="d"
        id="d"
      ></input>

      <button onClick={newtest}>Test</button>
    </>
  );
}
export default Test;
