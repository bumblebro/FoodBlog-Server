"use client";

import axios from "axios";

const image = async () => {
  const response = await axios.post("/api/scrape", { query: "Hello" });
  console.log(`link`, response);
};

function page() {
  return (
    <div>
      <button onClick={image}>Click for image</button>{" "}
    </div>
  );
}

export default page;
