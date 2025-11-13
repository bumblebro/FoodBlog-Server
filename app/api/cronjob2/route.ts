//@ts-ignore

export const revalidate = 0;

import { subSections } from "@/libs/Section";
import axios from "axios";
import slugify from "slugify";
import { CONVERT } from "../humanizee/Convert";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import puppeteer from "puppeteer";
import UPLOAD from "../upload2/Upload";
import gis from "async-g-i-s";

const prisma = new PrismaClient().$extends(withAccelerate());

let timestorun = 1;
let successCount = 0;
let failedCount = 0;

const REGEX = /\["(\bhttps?:\/\/[^"]+)",(\d+),(\d+)\],null/g;

// Sleep helper
function sleep(ms: any) {
  // console.log(`⏳ Waiting ${ms / 1000 / 60} min before next request...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Converts unicode escapes to normal strings
const unicodeToString = (content: any) =>
  content.replace(/\\u[\dA-F]{4}/gi, (match: any) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
  );

// Scrape image URLs from Google Images
async function fetchImageUrls(searchTerm: any) {
  if (!searchTerm || typeof searchTerm !== "string")
    throw new TypeError("searchTerm must be a string.");

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
      "--headless=new",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    const searchUrl = `https://www.google.com/search?tbm=isch&tbs=il:cl&q=${encodeURIComponent(
      searchTerm
    )}`;
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    const content = await page.content();
    const results = [];
    let result;
    while ((result = REGEX.exec(content))) {
      results.push({
        url: unicodeToString(result[1]),
        height: +result[2],
        width: +result[3],
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw new Error("Error fetching image URLs");
  } finally {
    const pages = await browser.pages();
    await Promise.all(pages.map((p) => p.close()));
    console.log("✅ All pages closed");
    await browser.close();
    const childProcess = browser.process();
    if (childProcess) childProcess.kill(9);
  }
}

// Get a valid image URL
async function image(query: any) {
  try {
    // const results = await fetchImageUrls(query);
    const results = await gis(query);
    // console.log(results.slice(0, 10));
    // console.log(`Image results`, results);
    const url = results.find((item) => {
      const isHttps = item.url.startsWith("https:");
      const isNotFromBlockedSource =
        !/(Shutterstock|Instagram|Facebook|Stockcake|TikTok|GettyImages|AdobeStock|iStock|Alamy|123RF|EnvatoElements|Depositphotos|Dreamstime|Pond5|CanvaPro)/i.test(
          item.url
        );
      const hasImageExtension = /\.(jpe?g|png|gif|webp|bmp)$/i.test(item.url);
      return isHttps && isNotFromBlockedSource && hasImageExtension;
    });
    // console.log(`Got Image`, url);
    return url;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// ------------------- MAIN PROCESS -------------------

// async function Upload2(randomKeyword) {
//   async function startProcess() {
//     try {
//       const blogs = await UPLOAD({ query: randomKeyword });
//       const covertedBlog = JSON.parse(blogs);

//       // Validation
//       if (
//         covertedBlog.pageTitle.includes("[") ||
//         covertedBlog.pageTitle.includes("]") ||
//         covertedBlog.pageTitle.includes("Image Query")
//       )
//         throw new Error("Invalid title");

//       covertedBlog.recipeDescription.detailedDescription.forEach((item) => {
//         if (
//           item.description.includes("[") ||
//           item.description.includes("]") ||
//           item.description.includes("Image Query")
//         )
//           throw new Error("Invalid description");
//       });

//       // Main image
//       if (!covertedBlog.imageQuery || covertedBlog.imageQuery === "null") {
//         console.log("❌ Missing image query — retrying in 2 min...");
//         await sleep(30000);
//         return await startProcess();
//       }

//       let mainImg = await image(covertedBlog.imageQuery);
//       if (!mainImg?.url) {
//         console.log("❌ No valid image found for:", covertedBlog.imageQuery);
//         console.warn("⚠️ Main image failed — retrying with 'food' suffix...");
//         mainImg = await image(`${covertedBlog.imageQuery} food`);

//         if (!mainImg?.url) {
//           console.warn(
//             "⚠️ Main image failed again — retrying with 'recipe dish' suffix..."
//           );
//           mainImg = await image(`${covertedBlog.imageQuery} recipe dish`);
//           if (!mainImg?.url) throw new Error("Main image fetch failed");
//         }
//       }
//       // Step images
//       const results = await Promise.all(
//         covertedBlog.recipeDescription.detailedDescription.map(async (item) => {
//           if (!item.imageQuery || item.imageQuery === "null") {
//             return {
//               description: item.description,
//               url: "null",
//               alt: "null",
//             };
//           }
//           let stepImg = await image(item.imageQuery);
//           if (!stepImg?.url) {
//             console.log("❌ No step image found for:", item.imageQuery);
//             console.warn("⚠️ Retrying with 'recipe step' suffix...");
//             stepImg = await image(`${item.imageQuery} recipe step`);

//             if (!stepImg?.url) {
//               console.warn(
//                 "⚠️ Step image failed again — retrying with 'food cooking step' suffix..."
//               );
//               stepImg = await image(`${item.imageQuery} food cooking step`);
//               if (!stepImg?.url) throw new Error("Step image fetch failed");
//             }
//           }
//           return {
//             description: item.description,
//             url: stepImg?.url || "null",
//             alt: item.imageQuery,
//           };
//         })
//       );

//       // Upload to DB
//       const reqres = {
//         section: "Others",
//         title: slugify(covertedBlog.pageTitle),
//         imagealt: covertedBlog.imageQuery,
//         imageurl: mainImg.url,
//         subsection: "Others",
//         subsubsection: "Others",
//         content: results,
//         instructions: covertedBlog.instructions,
//         recipedetails: covertedBlog.recipeDetails,
//         recipedescription: covertedBlog.recipeDescription.shortDescription,
//         author: covertedBlog.author,
//         quote: covertedBlog.quote,
//         seo: covertedBlog.seo,
//         faq: covertedBlog.faq,
//         equipments: covertedBlog.equipments,
//         slug: `Others/Others/Others/${slugify(covertedBlog.pageTitle)}`,
//       };
//       // return { success: true, data: reqres };

//       console.log(`title`, slugify(covertedBlog.pageTitle));
//       const newBlog = await prisma.foodBlogs.create({ data: reqres });

//       // ✅ Construct the response object
//       const domain = process.env.NEXT_PUBLIC_BASE_API_URL; // change this to your domain
//       const author = covertedBlog.author || "Admin";
//       const url = `${domain}/Others/Others/Others/${slugify(
//         covertedBlog.pageTitle
//       )}`;
//       const id = slugify(covertedBlog.pageTitle);

//       const responseObject = {
//         title: DeSlugify(newBlog.title),
//         id: url,
//         link: url,
//         description: newBlog.recipedescription,
//         author: [author],
//         contributor: [author],
//         date: new Date(Date.now() - 60 * 60 * 1000), // 1 hour before now
//         category: [
//           { name: id },
//           { name: newBlog.subsection },
//           { name: newBlog.subsubsection },
//         ],
//         image: {
//           type: "image/png",
//           url:
//             domain +
//             `/api/og?title=${encodeURIComponent(
//               newBlog.title
//             )}&cover=${encodeURIComponent(newBlog.imageurl)}`,
//         },
//         randomKeyword: randomKeyword,
//       };

//       console.log("✅ UPLOAD SUCCESSFUL:", newBlog.title);
//       failedCount = 0;
//       return responseObject;

//       // successCount++;
//       // if (successCount < timestorun) {
//       //   await sleep(120000);
//       //   return await startProcess();
//       // } else {
//       //   console.log("🎉 All uploads completed successfully!");
//       //   return "Success";
//       // }
//     } catch (error) {
//       console.error("⚠️ Error occurred, retrying...", error);
//       failedCount++;
//       console.log("failed count", failedCount);
//       if (failedCount >= 2) {
//         throw new Error("Process failed twice, aborting.");
//         // return null;
//       } else {
//         await sleep(30000);
//         return await startProcess();
//       }
//     } finally {
//       await prisma.$disconnect();
//     }
//   }

async function Upload2(randomKeyword: any) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(
        `🚀 Attempt ${attempt} started for keyword: ${randomKeyword}`
      );

      const blogs = await UPLOAD({ query: randomKeyword });
      //@ts-ignore
      const covertedBlog = JSON.parse(blogs);

      // ---------- Validation ----------
      if (
        covertedBlog.pageTitle.includes("[") ||
        covertedBlog.pageTitle.includes("]") ||
        covertedBlog.pageTitle.includes("Image Query")
      ) {
        throw new Error("Invalid title");
      }

      //@ts-ignore
      covertedBlog.recipeDescription.detailedDescription.forEach((item) => {
        if (
          item.description.includes("[") ||
          item.description.includes("]") ||
          item.description.includes("Image Query")
        ) {
          throw new Error("Invalid description");
        }
      });

      // ---------- Main Image ----------
      if (!covertedBlog.imageQuery || covertedBlog.imageQuery === "null") {
        console.log("❌ Missing image query — retrying in 30 sec...");
        await sleep(30000);
        continue; // skip to the next attempt early
      }

      let mainImg = await image(covertedBlog.imageQuery);
      if (!mainImg?.url) {
        console.warn("⚠️ Main image failed — retrying with suffix...");
        mainImg = await image(`${covertedBlog.imageQuery} food`);
        if (!mainImg?.url)
          mainImg = await image(`${covertedBlog.imageQuery} recipe dish`);
        if (!mainImg?.url) {
          throw new Error("Main image fetch failed");
        }
      }

      // ---------- Step Images ----------
      const results = await Promise.all(
        //@ts-ignore
        covertedBlog.recipeDescription.detailedDescription.map(async (item) => {
          if (!item.imageQuery || item.imageQuery === "null") {
            return { description: item.description, url: "null", alt: "null" };
          }

          let stepImg = await image(item.imageQuery);
          if (!stepImg?.url) {
            console.warn("⚠️ Retrying step image with suffix...");
            stepImg = await image(`${item.imageQuery} recipe step`);
            if (!stepImg?.url)
              stepImg = await image(`${item.imageQuery} food cooking step`);
            if (!stepImg?.url) {
              throw new Error("Step image fetch failed");
            }
          }

          return {
            description: item.description,
            url: stepImg?.url || "null",
            alt: item.imageQuery,
          };
        })
      );

      // ---------- Upload to DB ----------
      const reqres = {
        section: "Others",
        title: slugify(covertedBlog.pageTitle),
        imagealt: covertedBlog.imageQuery,
        imageurl: mainImg.url,
        subsection: "Others",
        subsubsection: "Others",
        content: results,
        instructions: covertedBlog.instructions,
        recipedetails: covertedBlog.recipeDetails,
        recipedescription: covertedBlog.recipeDescription.shortDescription,
        author: covertedBlog.author,
        quote: covertedBlog.quote,
        seo: covertedBlog.seo,
        faq: covertedBlog.faq,
        equipments: covertedBlog.equipments,
        slug: `Others/Others/Others/${slugify(covertedBlog.pageTitle)}`,
      };

      console.log(`📝 Creating DB entry for:`, slugify(covertedBlog.pageTitle));
      const newBlog = await prisma.foodBlogs.create({ data: reqres });

      // ---------- Construct Response ----------
      const domain = process.env.NEXT_PUBLIC_BASE_API_URL;
      const author = covertedBlog.author || "Admin";
      const url = `${domain}/Others/Others/Others/${slugify(
        covertedBlog.pageTitle
      )}`;
      const id = slugify(covertedBlog.pageTitle);

      const responseObject = {
        title: DeSlugify(newBlog.title),
        id: url,
        link: url,
        description: newBlog.recipedescription,
        author: [author],
        contributor: [author],
        date: new Date(Date.now() - 60 * 60 * 1000),
        category: [
          { name: id },
          { name: newBlog.subsection },
          { name: newBlog.subsubsection },
        ],
        image: {
          type: "image/png",
          url:
            domain +
            `/api/og?title=${encodeURIComponent(
              newBlog.title
            )}&cover=${encodeURIComponent(newBlog.imageurl)}`,
        },
        randomKeyword,
      };

      console.log("✅ Upload successful:", newBlog.title);
      return responseObject; // **Important**: return here — exit the loop and function on success
    } catch (err) {
      //@ts-ignore
      console.warn(`⚠️ Attempt ${attempt} failed:`, err.message);

      if (attempt === 3) {
        console.error("❌ Process failed thrice — aborting.");
        // throw err; // **Important**: throw the error to propagate it out of the function
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
          attempts: attempt,
          keyword: randomKeyword,
        };
      }

      console.log("⏳ Retrying in 90 seconds...");
      await sleep(90000);
    } finally {
      await prisma.$disconnect();
    }
  }

  // **Optional**: If loop ends without return or throw, you might throw to signal something went wrong
  // throw new Error("Upload2 failed after all attempts");
}

//   // ✅ Important: return the awaited promise chain
//   const result = await startProcess();
//   return result; // ensures the response propagates up
// }

// ------------------- API Route -------------------

export async function GET() {
  try {
    console.warn(
      "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"
    );
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = today.toLocaleDateString("en-US", options);

    console.log(formattedDate); // Output̀: "September 19, 2024"
    // const { searchParams } = new URL(req.url);
    // const query = searchParams.get("q");
    // console.log(`📦 Received query:`, query);
    // Parse the JSON array from env
    // const keywords = JSON.parse(process.env.NEXT_PUBLIC_KEYWORDS || "[]");
    // const envVar = process.env.NEXT_PUBLIC_KEYWORDS || "[]";
    // let keywords: string[] = [];

    // try {
    //   // Try parsing normally first
    //   keywords = JSON.parse(envVar);
    // } catch {
    //   // If it fails, try unescaping and parsing again
    //   try {
    //     const cleaned = envVar
    //       .replace(/^"+|"+$/g, "") // remove surrounding quotes
    //       .replace(/\\"/g, '"'); // unescape quotes
    //     keywords = JSON.parse(cleaned);
    //   } catch (err) {
    //     console.error("⚠️ Failed to parse even after cleaning:", err);
    //     throw new Error("Invalid NEXT_PUBLIC_KEYWORDS format");
    //   }
    // }

    const keywords = process.env.NEXT_PUBLIC_KEYWORDS?.split("|") || [];

    if (!Array.isArray(keywords) || keywords.length === 0) {
      throw new Error("NEXT_PUBLIC_KEYWORDS is empty or invalid");
    }

    // Pick a random keyword
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    console.log(`📦 Selected random keyword:`, randomKeyword);

    // Use your Upload2 logic
    const data = await Upload2(randomKeyword);

    console.warn(
      "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"
    );
    // .
    // return Response.json(data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("❌ API ERROR:", error);
    // const err = error as Error;
    // const message = err.message || "Unknown error";
    // const stackLine = err.stack ? err.stack.split("\n")[1].trim() : "";
    // console.error(
    // `❌ API ERROR: ${message}${stackLine ? ` at ${stackLine}` : ""}`
    // );
    //@ts-ignore
    // return Response.json({ error: error?.message || "Something went wrong" });
    console.warn(
      "✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"
    );
    const message = (error as Error)?.message || "Something went wrong";
    return new Response(JSON.stringify({ error: message }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function DeSlugify(slug: string) {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
