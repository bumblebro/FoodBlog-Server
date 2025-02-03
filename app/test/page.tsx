"use client";

import axios from "axios";
import { useState } from "react";
import { KEYWORDTEST } from "../api/keywordtest/Keyword";

function Test() {
  async function run() {
    let primaryKeywords = await KEYWORDTEST("car");
    console.log(`pri`, primaryKeywords);
  }

  return (
    <h1
      onClick={() => {
        run();
      }}
    >
      Hello
    </h1>
  );
}
export default Test;
