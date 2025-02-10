// @ts-nocheck

"use client";
import { useState } from "react";

function Page() {
  const [input, setInput] = useState("");
  const [converted, setConverted] = useState("");

  // Function to handle pasting content
  function handlePaste() {
    navigator.clipboard.readText().then((text) => {
      // Process the pasted text
      const lines = text.split("\n").slice(0, 10); // Limit to 20 strings
      const formatted = lines.map((item) => `"${item.trim()}"`).join(", ");

      // Update states
      setInput(lines.join("\n")); // Update the textarea content with the truncated lines
      setConverted(formatted);

      // Copy the formatted text back to the clipboard
      navigator.clipboard
        .writeText(formatted)
        .then(() => {
          console.log("Text copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text to clipboard", err);
        });
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Paste and Limit to 20 Strings
        </h2>

        <div className="flex space-x-4">
          <button
            onClick={handlePaste} // Trigger paste when clicked
            className="py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Paste
          </button>
        </div>

        <textarea
          value={input} // Set the value to input state
          onChange={(e) => setInput(e.target.value)} // Update input as you type
          rows="10"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pasted content will appear here"
        />

        {converted && (
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">
              Converted Text:
            </h3>
            <p className="text-gray-600 break-all">{converted}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
