import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

const REGEX = /\["(\bhttps?:\/\/[^"]+)",(\d+),(\d+)\],null/g;

/**
 * Converts unicode escape sequences to string
 * @param {string} content
 * @returns {string}
 */
const unicodeToString = (content) =>
  content.replace(/\\u[\dA-F]{4}/gi, (match) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
  );

/**
 * Fetches image URLs from Google Image Search
 * @param {String} searchTerm Search term to search
 * @returns {Promise<[{url: string, height: number, width: number}]>}
 */
async function fetchImageUrls(searchTerm) {
  if (!searchTerm || typeof searchTerm !== "string")
    throw new TypeError("searchTerm must be a string.");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        "--disable-gpu",
        "--window-size=1920,1080",
        "--no-sandbox",
        "--no-zygote",
        "--disable-setuid-sandbox",
        "--single-process",
      ],
    });
    const page = await browser.newPage();

    // Set the user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    // Navigate to Google Image Search
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      searchTerm
    )}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    // Extract the page content
    const content = await page.content();

    // Process the page content
    const results = [];
    let result;

    while ((result = REGEX.exec(content))) {
      results.push({
        url: unicodeToString(result[1]),
        height: +result[2],
        width: +result[3],
      });
    }

    try {
      // const pages = await browser.pages();
      const pages = await browser.pages();

      await Promise.all(pages.map((p: any) => p.close()));
      console.log("All pages closed");
    } catch (err) {
      console.error("Error closing pages:", err);
    } finally {
      await browser.close(); // Ensure browser is properly closed
      console.log("Browser closed");
    }

    return results;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw new Error("Error fetching image URLs");
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const results = await fetchImageUrls(body.query);
    // console.log(`res`, results);
    // console.log(results.slice(0, 10));

    const url = results.find((item) => item.url.startsWith("https:"));
    console.log(`url`, url);
    return Response.json({ results: url });
  } catch (e) {
    console.error(e);
    return Response.json({ e });
  }
}

// import { NextRequest } from "next/server";
// // import gis from "g-i-s";
// import gis from "async-g-i-s";

// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   try {
//     const results = await gis(body.query, {
//       query: { safe: "on" },
//       userAgent:
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     });
//     console.log(`res`, results);
//     console.log(results.slice(0, 10));

//     const url = results.find((item) => item.url.startsWith("https:"));

//     return Response.json({ results: url });
//   } catch (e) {
//     console.error(e);
//     return Response.json({ e });
//   }
// }
