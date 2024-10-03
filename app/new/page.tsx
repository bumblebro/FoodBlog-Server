// Example of a simple form component
"use client";

import { useState } from "react";
import { CONVERT } from "../api/humanizee/Convert";

const HumanizeForm = () => {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await CONVERT(content);
    console.log(`response`, response);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter AI-generated content"
      />
      <button type="submit">Humanize</button>
      {result && <div>Result: {result}</div>}
    </form>
  );
};

export default HumanizeForm;

const content =
  "Downhill longboarding is an exhilarating sport that incorporates speed, skills, and a touch of daring. Whether you're a seasoned rider or a curious beginner, choosing the right longboard for downhill racing is extremely important in terms of both performance and safety. Let's enter the world of downhill longboards and see who the top competitors are for conquering those gravity-defying runs.In longboarding, your board is your selected weapon. A decent setup can make a lot of difference in terms of performance and safety, in a matter of life and death. Here's everything you need to know to choose a perfect downhill longboard";
