// // @ts-nocheck

// // "use server";
// export const revalidate = 0;

// import { subSections } from "@/libs/Section";
// import axios from "axios";
// import slugify from "slugify";
// import { CONVERT } from "../humanizee/Convert";
// ///////////////// DB Upload

// import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";

// const prisma = new PrismaClient().$extends(withAccelerate());

// ///////////////// DB Upload

// let timestorun = 1;

// ///////////////// Google Imageee

// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer";
// import UPLOAD from "../upload2/Upload";

// const REGEX = /\["(\bhttps?:\/\/[^"]+)",(\d+),(\d+)\],null/g;

// /**
//  * Converts unicode escape sequences to string
//  * @param {string} content
//  * @returns {string}
//  */
// const unicodeToString = (content: any) =>
//   content.replace(/\\u[\dA-F]{4}/gi, (match: any) =>
//     String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
//   );

// /**
//  * Fetches image URLs from Google Image Search
//  * @param {String} searchTerm Search term to search
//  * @returns {Promise<[{url: string, height: number, width: number}]>}
//  */
// async function fetchImageUrls(searchTerm: any) {
//   if (!searchTerm || typeof searchTerm !== "string")
//     throw new TypeError("searchTerm must be a string.");
//   const browser = await puppeteer.launch({
//     headless: true,
//     defaultViewport: null,
//     args: [
//       "--disable-gpu",
//       "--window-size=1920,1080",
//       "--no-sandbox",
//       "--no-zygote",
//       "--disable-setuid-sandbox",
//       "--single-process",
//       "--headless=new",
//     ],
//   });

//   try {
//     const page = await browser.newPage();

//     // Set the user agent
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
//     );

//     // Navigate to Google Image Search
//     // const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
//     //   searchTerm +
//     //     " " +
//     //     "Unspash" +
//     //     " " +
//     //     "Freepik" +
//     //     " " +
//     //     "Pixabay" +
//     //     " " +
//     //     "Pexels"
//     // )}`;

//     const searchUrl = `https://www.google.com/search?tbm=isch&tbs=il:cl&q=${encodeURIComponent(
//       searchTerm
//     )}`;

//     await page.goto(searchUrl, { waitUntil: "networkidle2" });

//     // Extract the page content
//     const content = await page.content();

//     // Process the page content
//     const results = [];
//     let result;

//     while ((result = REGEX.exec(content))) {
//       results.push({
//         url: unicodeToString(result[1]),
//         height: +result[2],
//         width: +result[3],
//       });
//     }

//     return results;
//   } catch (error) {
//     console.error("Error fetching image URLs:", error);
//     throw new Error("Error fetching image URLs");
//   } finally {
//     const pages = await browser.pages();
//     await Promise.all(pages.map((p: any) => p.close())); // Close all pages
//     console.log("all pages closed");
//     await browser.close();
//     const childProcess = browser.process();
//     if (childProcess) {
//       childProcess.kill(9);
//     }
//   }
// }

// // Define the sleep function
// function sleep(ms) {
//   console.log(`Waiting for 2 min until next request, Please hold on baby`);
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function image(query: string) {
//   // const body = await req.json();

//   try {
//     const results = await fetchImageUrls(query);
//     // console.log(`res`, results);
//     // console.log(results.slice(0, 10));

//     // const url = results.find((item) => item.url.startsWith("https:"));
//     // let url = results.find(
//     //   (item) =>
//     //     item.url.startsWith("https:") && !item.url.includes("shutterstock")
//     // );

//     //OLD 04-May-2025
//     // let url = results.find(
//     //   (item) =>
//     //     item.url.startsWith("https:") &&
//     //     !/(Shutterstock|Instagram|Facebook|Stockcake|TikTok|GettyImages|AdobeStock|iStock|Alamy|123RF|EnvatoElements|Depositphotos|Dreamstime|Pond5|CanvaPro)/i.test(
//     //       item.url
//     //     )
//     // );

//     // NEW 04-May-2025
//     let url = results.find((item) => {
//       const isHttps = item.url.startsWith("https:");
//       const isNotFromBlockedSource =
//         !/(Shutterstock|Instagram|Facebook|Stockcake|TikTok|GettyImages|AdobeStock|iStock|Alamy|123RF|EnvatoElements|Depositphotos|Dreamstime|Pond5|CanvaPro)/i.test(
//           item.url
//         );
//       const hasImageExtension = /\.(jpe?g|png|gif|webp|bmp)$/i.test(item.url);
//       return isHttps && isNotFromBlockedSource && hasImageExtension;
//     });

//     // let url = results.find(
//     //   (item) =>
//     //     item.url.startsWith("https:") &&
//     //     /unsplash|pixabay|pexels|freepik/i.test(item.url) && // Only allow these sources
//     //     !/(shutterstock|instagram|facebook)/i.test(item.url) // Block known paid/licensed sources
//     // );

//     // if (url && url.url.includes("shutterstock")) {
//     //   throw new Error("Shutterstock images are not allowed.");
//     // }
//     console.log(`url`, url);
//     return url;
//   } catch (e) {
//     console.error(e);
//     return e;
//   }
// }

// ///////////////// Google Imageee

// // const searchImages = async (query: string) => {
// //   const response = await axios.post("/api/scrape", {
// //     query,
// //   });
// //   return response.data.results.url;
// // };

// async function getRandomPath(subSections: any) {
//   const firstLevel = Object.keys(subSections);
//   const randomFirstLevel =
//     firstLevel[Math.floor(Math.random() * firstLevel.length)];
//   const secondLevel = Object.keys(subSections[randomFirstLevel]);
//   const randomSecondLevel =
//     secondLevel[Math.floor(Math.random() * secondLevel.length)];
//   const thirdLevel = subSections[randomFirstLevel][randomSecondLevel];
//   const randomThirdLevel =
//     thirdLevel[Math.floor(Math.random() * thirdLevel.length)];
//   return [randomFirstLevel, randomSecondLevel, randomThirdLevel];
// }
// let successCount = 0;
// let failedCount = 0;

// async function Upload2(query) {
//   // if (successCount == 10) {
//   //   // refreshPage();
//   //   return;
//   // }
//   async function startProcess() {
//     try {
//       // Getting random section
//       // const path = await getRandomPath(subSections);
//       // console.log(`path`, path);

//       const blogs: any = await UPLOAD({
//         query: query,
//       });

//       // const data = await blogs.data;
//       const covertedBlog = await JSON.parse(blogs);
//       if (
//         covertedBlog.pageTitle.includes("[") ||
//         covertedBlog.pageTitle.includes("]") ||
//         covertedBlog.pageTitle.includes("Image Query")
//       ) {
//         throw new Error(
//           'String contains forbidden characters "[" or "]" or "Image Query". in the Title'
//         );
//       }

//       covertedBlog.recipeDescription.detailedDescription.map((item: any) => {
//         if (
//           item.description.includes("[") ||
//           item.description.includes("]") ||
//           item.description.includes("Image Query")
//         ) {
//           throw new Error(
//             'String contains forbidden characters  "[" or "]" or "Image Query". in the description'
//           );
//         }
//       });

//       if (
//         covertedBlog.imageQuery == null ||
//         covertedBlog.imageQuery == "null"
//       ) {
//         await sleep(120000); // Wait for 2 minutes
//         startProcess();
//         return;
//       }
//       let link: string;
//       if (
//         covertedBlog.imageQuery == null ||
//         covertedBlog.imageQuery == "null"
//       ) {
//         console.log("Failed to have imagequery for main");
//         throw new Error("Failed to have imagequery for main");
//       } else {
//         let linkgot: any = await image(covertedBlog.imageQuery);
//         console.log(`linkgot`, linkgot);
//         link = linkgot.url;
//       }

//       // let primaryKeywords = await KEYWORD(covertedBlog.seo.primaryKeywords[0]);
//       // let secondaryKeywords = await KEYWORD(
//       //   covertedBlog.seo.secondaryKeywords[0]
//       // );
//       // console.log(primaryKeywords);
//       // console.log(secondaryKeywords);
//       // let newseo = { ...covertedBlog.seo, primaryKeywords, secondaryKeywords };
//       console.log(`oldseo`, covertedBlog.seo);

//       // console.log(`newseo`, newseo);
//       console.log(covertedBlog);
//       const results = await Promise.all(
//         covertedBlog.recipeDescription.detailedDescription?.map(
//           async (item: {
//             imageQuery: string;
//             // title: string;
//             description: string;
//           }) => {
//             let link: any;
//             if (item.imageQuery == null || item.imageQuery == "null") {
//               link = "null";
//             } else {
//               console.log(`Imageee q`, item.imageQuery);
//               link = await image(item.imageQuery);
//             }

//             // Function to retry humanizing content
//             async function runUntilResponse(item: string) {
//               let response = null;
//               let count = 0;
//               while (response === null) {
//                 if (count >= 4) {
//                   throw new Error("Maximum limit reached for humanizing...");
//                 }
//                 response = await CONVERT(item); // Retry until success or max attempts
//                 if (response === null) {
//                   count++;
//                   console.log("Response is null, retrying...");
//                   // await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay
//                 }
//               }
//               console.log("Got a non-null response:", response);
//               return response;
//             }

//             // const response = await runUntilResponse(item.description); //  Remove for no humanising

//             return {
//               // title: item.title,
//               // description: response, //add for humanising
//               description: item.description, //Remove for no humanising
//               url: link.url,
//               alt: item.imageQuery,
//             };
//           }
//         )
//       );

//       // results.map((item: any) => {
//       //   if (
//       //     item.description.includes("[") ||
//       //     item.description.includes("]") ||
//       //     item.description.includes("}") ||
//       //     item.description.includes("{") ||
//       //     item.description.includes("Image Query")
//       //   ) {
//       //     throw new Error(
//       //       'String contains forbidden characters "[" or "]" or "Image Query". in the description'
//       //     );
//       //   }
//       // });

//       console.log(`UPLOADDDDD START`);
//       if (
//         (covertedBlog.pageTitle,
//         covertedBlog.imageQuery,
//         link,
//         results,
//         covertedBlog.author,
//         covertedBlog.quote,
//         covertedBlog.seo,
//         covertedBlog.recipeDetails,
//         covertedBlog.instructions,
//         covertedBlog.recipeDescription.shortDescription,
//         covertedBlog.faq,
//         covertedBlog.equipments)
//       ) {
//         console.log(`UPLOADDDDD INSIDE`);

//         try {
//           let reqres = {
//             section: "Others",
//             title: slugify(covertedBlog.pageTitle),
//             imagealt: covertedBlog.imageQuery,
//             imageurl: link,
//             subsection: "Others",
//             subsubsection: "Others",
//             content: results,
//             instructions: covertedBlog.instructions,
//             recipedetails: covertedBlog.recipeDetails,
//             recipedescription: covertedBlog.recipeDescription.shortDescription,
//             author: covertedBlog.author,
//             quote: covertedBlog.quote,
//             seo: covertedBlog.seo,
//             faq: covertedBlog.faq,
//             equipments: covertedBlog.equipments,
//             // slug: `${path[0]}/${path[1]}/${path[2]}/${slugify(
//             slug: `Others/Others/Others/${slugify(covertedBlog.pageTitle)}`,
//           };

//           // const body = await req.json();
//           // console.log(body);
//           const newBlog = await prisma.foodBlogs.create({
//             data: reqres,
//           });
//           await prisma.$disconnect();

//           console.log("UPLOAD SUCCESSFULL", newBlog);
//           successCount = successCount + 1;
//           if (successCount < timestorun) {
//             console.log(`SUCCESS COUNT`, successCount);
//             console.log(`FAILED COUNT`, failedCount);
//             await sleep(120000); // Wait for 2 minutes
//             startProcess();
//           } else {
//             console.log(`SUCCESS COUNT`, successCount);
//             console.log(`FAILED COUNT`, failedCount);
//             console.log(
//               `Time: ${new Date().toLocaleString("en-IN", {
//                 timeZone: "Asia/Kolkata",
//               })}`
//             );
//             console.log("COMPLETED");
//             return "Success";
//           }
//         } catch (error) {
//           console.log(`errorrrrrr`, error);
//           failedCount = failedCount + 1;
//           // console.clear(); // Clears the console
//           await sleep(120000); // Wait for 2 minutes
//           startProcess(); // Retry if failed
//         }

//         // const res = await axios.post("/api/dbupload", {
//         //   section: path[0],
//         //   title: slugify(covertedBlog.pageTitle),
//         //   imagealt: covertedBlog.imageQuery,
//         //   imageurl: link,
//         //   subsection: path[1],
//         //   subsubsection: path[2],
//         //   content: results,
//         //   instructions: covertedBlog.instructions,
//         //   recipedetails: covertedBlog.recipeDetails,
//         //   recipedescription: covertedBlog.recipeDescription.shortDescription,
//         //   author: covertedBlog.author,
//         //   quote: covertedBlog.quote,
//         //   seo: covertedBlog.seo,
//         //   faq: covertedBlog.faq,
//         //   equipments: covertedBlog.equipments,
//         //   slug: `${path[0]}/${path[1]}/${path[2]}/${slugify(
//         //     covertedBlog.pageTitle
//         //   )}`,
//         // });
//         // if (res.status) {
//         //   console.log(
//         //     "UPLOAD SUCCESSFULL",
//         //     res.data,
//         //     "STARTING NEXT CYCLE... STOOOOOPPPPINGGGGGGGGGGG"
//         //   );
//         //   successCount = successCount + 1;
//         //   // console.clear(); // Clears the console
//         //   // startProcess(); // Continue the process if running
//         // } else {
//         //   failedCount = failedCount + 1;
//         //   // console.clear(); // Clears the console
//         //   startProcess(); // Retry if failed
//         // }
//       }
//     } catch (error) {
//       console.error("ERROR OCCURED, RETRYING...", error);
//       failedCount = failedCount + 1;
//       // console.clear(); // Clears the console
//       await sleep(120000); // Wait for 2 minutes
//       startProcess(); // Handle errors and retry
//     }
//   }
//   startProcess();
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get("q");
//     console.log(`qqq`, query);
//     // return;
//     const data = await Upload2(query);

//     return Response.json({ running: data });
//   } catch (error) {
//     console.log(error);
//     return Response.json(error);
//   }
// }

// @ts-nocheck

export const revalidate = 0;

import { subSections } from "@/libs/Section";
import axios from "axios";
import slugify from "slugify";
import { CONVERT } from "../humanizee/Convert";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import puppeteer from "puppeteer";
import UPLOAD from "../upload2/Upload";

const prisma = new PrismaClient().$extends(withAccelerate());

let timestorun = 1;
let successCount = 0;
let failedCount = 0;

const REGEX = /\["(\bhttps?:\/\/[^"]+)",(\d+),(\d+)\],null/g;

// Sleep helper
function sleep(ms) {
  console.log(`⏳ Waiting ${ms / 1000 / 60} min before next request...`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Converts unicode escapes to normal strings
const unicodeToString = (content) =>
  content.replace(/\\u[\dA-F]{4}/gi, (match) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
  );

// Scrape image URLs from Google Images
async function fetchImageUrls(searchTerm) {
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
async function image(query) {
  try {
    const results = await fetchImageUrls(query);
    const url = results.find((item) => {
      const isHttps = item.url.startsWith("https:");
      const isNotFromBlockedSource =
        !/(Shutterstock|Instagram|Facebook|Stockcake|TikTok|GettyImages|AdobeStock|iStock|Alamy|123RF|EnvatoElements|Depositphotos|Dreamstime|Pond5|CanvaPro)/i.test(
          item.url
        );
      const hasImageExtension = /\.(jpe?g|png|gif|webp|bmp)$/i.test(item.url);
      return isHttps && isNotFromBlockedSource && hasImageExtension;
    });
    return url;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// ------------------- MAIN PROCESS -------------------

async function Upload2(randomKeyword) {
  async function startProcess() {
    try {
      const blogs = await UPLOAD({ query: randomKeyword });
      const covertedBlog = JSON.parse(blogs);

      // Validation
      if (
        covertedBlog.pageTitle.includes("[") ||
        covertedBlog.pageTitle.includes("]") ||
        covertedBlog.pageTitle.includes("Image Query")
      )
        throw new Error("Invalid title");

      covertedBlog.recipeDescription.detailedDescription.forEach((item) => {
        if (
          item.description.includes("[") ||
          item.description.includes("]") ||
          item.description.includes("Image Query")
        )
          throw new Error("Invalid description");
      });

      // Main image
      if (!covertedBlog.imageQuery || covertedBlog.imageQuery === "null") {
        console.log("❌ Missing image query — retrying in 2 min...");
        await sleep(30000);
        return await startProcess();
      }

      let mainImg = await image(covertedBlog.imageQuery);
      if (!mainImg?.url) {
        console.log("❌ No valid image found for:", covertedBlog.imageQuery);
        console.warn("⚠️ Main image failed — retrying with 'food' suffix...");
        mainImg = await image(`${covertedBlog.imageQuery} food`);

        if (!mainImg?.url) {
          console.warn(
            "⚠️ Main image failed again — retrying with 'recipe dish' suffix..."
          );
          mainImg = await image(`${covertedBlog.imageQuery} recipe dish`);
          if (!mainImg?.url) throw new Error("Main image fetch failed");
        }
      }
      // Step images
      const results = await Promise.all(
        covertedBlog.recipeDescription.detailedDescription.map(async (item) => {
          if (!item.imageQuery || item.imageQuery === "null") {
            return {
              description: item.description,
              url: "null",
              alt: "null",
            };
          }
          let stepImg = await image(item.imageQuery);
          if (!stepImg?.url) {
            console.log("❌ No step image found for:", item.imageQuery);
            console.warn("⚠️ Retrying with 'recipe step' suffix...");
            stepImg = await image(`${item.imageQuery} recipe step`);

            if (!stepImg?.url) {
              console.warn(
                "⚠️ Step image failed again — retrying with 'food cooking step' suffix..."
              );
              stepImg = await image(`${item.imageQuery} food cooking step`);
              if (!stepImg?.url) throw new Error("Step image fetch failed");
            }
          }
          return {
            description: item.description,
            url: stepImg?.url || "null",
            alt: item.imageQuery,
          };
        })
      );

      // Upload to DB
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
      // return { success: true, data: reqres };

      console.log(`title`, slugify(covertedBlog.pageTitle));
      const newBlog = await prisma.foodBlogs.create({ data: reqres });
      await prisma.$disconnect();

      // ✅ Construct the response object
      const domain = process.env.NEXT_PUBLIC_BASE_API_URL; // change this to your domain
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
        date: new Date(Date.now() - 60 * 60 * 1000), // 1 hour before now
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
        randomKeyword: randomKeyword,
      };

      console.log("✅ UPLOAD SUCCESSFUL:", newBlog.title);
      failedCount = 0;
      return responseObject;

      successCount++;
      if (successCount < timestorun) {
        await sleep(120000);
        return await startProcess();
      } else {
        console.log("🎉 All uploads completed successfully!");
        return "Success";
      }
    } catch (error) {
      console.error("⚠️ Error occurred, retrying...", error);
      failedCount++;
      console.log("failed count", failedCount);
      if (failedCount == 2) {
        await sleep(2147483);
        // return null;
      } else {
        await sleep(30000);
        return await startProcess();
      }
    }
  }

  // ✅ Important: return the awaited promise chain
  const result = await startProcess();
  return result; // ensures the response propagates up
}

// ------------------- API Route -------------------

export async function GET() {
  try {
    // const { searchParams } = new URL(req.url);
    // const query = searchParams.get("q");
    // console.log(`📦 Received query:`, query);
    // Parse the JSON array from env
    // const keywords = JSON.parse(process.env.NEXT_PUBLIC_KEYWORDS || "[]");
    const envVar = process.env.NEXT_PUBLIC_KEYWORDS || "[]";
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

    return Response.json(data);
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return Response.json({ error: error.message || "Something went wrong" });
  }
}

function DeSlugify(slug: string) {
  if (!slug) return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
