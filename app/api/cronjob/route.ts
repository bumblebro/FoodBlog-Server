// @ts-nocheck

// "use server";
export const revalidate = 0;

import { subSections } from "@/libs/Section";
import axios from "axios";
import slugify from "slugify";
import UPLOAD from "../upload/Upload";
import { CONVERT } from "../humanizee/Convert";
///////////////// DB Upload

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

///////////////// DB Upload

let timestorun = 1;

///////////////// Google Imageee

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

const REGEX = /\["(\bhttps?:\/\/[^"]+)",(\d+),(\d+)\],null/g;

/**
 * Converts unicode escape sequences to string
 * @param {string} content
 * @returns {string}
 */
const unicodeToString = (content: any) =>
  content.replace(/\\u[\dA-F]{4}/gi, (match: any) =>
    String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
  );

/**
 * Fetches image URLs from Google Image Search
 * @param {String} searchTerm Search term to search
 * @returns {Promise<[{url: string, height: number, width: number}]>}
 */
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

    // Set the user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    // Navigate to Google Image Search
    const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
      searchTerm +
        " " +
        "Unspash" +
        " " +
        "Freepik" +
        " " +
        "Pixabay" +
        " " +
        "Pexels"
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

    return results;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw new Error("Error fetching image URLs");
  } finally {
    const pages = await browser.pages();
    await Promise.all(pages.map((p: any) => p.close())); // Close all pages
    console.log("all pages closed");
    await browser.close();
    const childProcess = browser.process();
    if (childProcess) {
      childProcess.kill(9);
    }
  }
}

async function image(query: string) {
  // const body = await req.json();

  try {
    const results = await fetchImageUrls(query);
    // console.log(`res`, results);
    // console.log(results.slice(0, 10));

    // const url = results.find((item) => item.url.startsWith("https:"));
    // let url = results.find(
    //   (item) =>
    //     item.url.startsWith("https:") && !item.url.includes("shutterstock")
    // );
    let url = results.find(
      (item) =>
        item.url.startsWith("https:") &&
        !/(shutterstock|instagram|facebook)/i.test(item.url)
    );

    // if (url && url.url.includes("shutterstock")) {
    //   throw new Error("Shutterstock images are not allowed.");
    // }
    console.log(`url`, url);
    return url;
  } catch (e) {
    console.error(e);
    return e;
  }
}

///////////////// Google Imageee

// const searchImages = async (query: string) => {
//   const response = await axios.post("/api/scrape", {
//     query,
//   });
//   return response.data.results.url;
// };

async function getRandomPath(subSections: any) {
  const firstLevel = Object.keys(subSections);
  const randomFirstLevel =
    firstLevel[Math.floor(Math.random() * firstLevel.length)];
  const secondLevel = Object.keys(subSections[randomFirstLevel]);
  const randomSecondLevel =
    secondLevel[Math.floor(Math.random() * secondLevel.length)];
  const thirdLevel = subSections[randomFirstLevel][randomSecondLevel];
  const randomThirdLevel =
    thirdLevel[Math.floor(Math.random() * thirdLevel.length)];
  return [randomFirstLevel, randomSecondLevel, randomThirdLevel];
}

async function Upload2() {
  let successCount = 0;
  let failedCount = 0;

  if (successCount == 10) {
    // refreshPage();
    return;
  }
  async function startProcess() {
    try {
      // Getting random section
      const path = await getRandomPath(subSections);

      const blogs: any = await UPLOAD({
        section: path[0],
        subSection: path[1],
        subSubSection: path[2],
      });

      // const data = await blogs.data;
      const covertedBlog = await JSON.parse(blogs);
      if (
        covertedBlog.pageTitle.includes("[") ||
        covertedBlog.pageTitle.includes("]") ||
        covertedBlog.pageTitle.includes("Image Query")
      ) {
        throw new Error(
          'String contains forbidden characters "[" or "]" or "Image Query". in the Title'
        );
      }

      covertedBlog.recipeDescription.detailedDescription.map((item: any) => {
        if (
          item.description.includes("[") ||
          item.description.includes("]") ||
          item.description.includes("Image Query")
        ) {
          throw new Error(
            'String contains forbidden characters  "[" or "]" or "Image Query". in the description'
          );
        }
      });

      if (
        covertedBlog.imageQuery == null ||
        covertedBlog.imageQuery == "null"
      ) {
        startProcess();
        return;
      }
      let link: string;
      if (
        covertedBlog.imageQuery == null ||
        covertedBlog.imageQuery == "null"
      ) {
        console.log("Failed to have imagequery for main");
        throw new Error("Failed to have imagequery for main");
      } else {
        let linkgot: any = await image(covertedBlog.imageQuery);
        console.log(`linkgot`, linkgot);
        link = linkgot.url;
      }

      // let primaryKeywords = await KEYWORD(covertedBlog.seo.primaryKeywords[0]);
      // let secondaryKeywords = await KEYWORD(
      //   covertedBlog.seo.secondaryKeywords[0]
      // );
      // console.log(primaryKeywords);
      // console.log(secondaryKeywords);
      // let newseo = { ...covertedBlog.seo, primaryKeywords, secondaryKeywords };
      console.log(`oldseo`, covertedBlog.seo);

      // console.log(`newseo`, newseo);
      console.log(covertedBlog);
      const results = await Promise.all(
        covertedBlog.recipeDescription.detailedDescription?.map(
          async (item: {
            imageQuery: string;
            // title: string;
            description: string;
          }) => {
            let link: any;
            if (item.imageQuery == null || item.imageQuery == "null") {
              link = "null";
            } else {
              console.log(`Imageee q`, item.imageQuery);
              link = await image(item.imageQuery);
            }

            // Function to retry humanizing content
            async function runUntilResponse(item: string) {
              let response = null;
              let count = 0;
              while (response === null) {
                if (count >= 4) {
                  throw new Error("Maximum limit reached for humanizing...");
                }
                response = await CONVERT(item); // Retry until success or max attempts
                if (response === null) {
                  count++;
                  console.log("Response is null, retrying...");
                  // await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay
                }
              }
              console.log("Got a non-null response:", response);
              return response;
            }

            // const response = await runUntilResponse(item.description);

            return {
              // title: item.title,
              // description: response,
              description: item.description,
              url: link.url,
              alt: item.imageQuery,
            };
          }
        )
      );

      // results.map((item: any) => {
      //   if (
      //     item.description.includes("[") ||
      //     item.description.includes("]") ||
      //     item.description.includes("}") ||
      //     item.description.includes("{") ||
      //     item.description.includes("Image Query")
      //   ) {
      //     throw new Error(
      //       'String contains forbidden characters "[" or "]" or "Image Query". in the description'
      //     );
      //   }
      // });

      console.log(`UPLOADDDDD STARTTTTTTTTT`);
      if (
        (path[0],
        covertedBlog.pageTitle,
        covertedBlog.imageQuery,
        link,
        path[1],
        path[2],
        results,
        covertedBlog.author,
        covertedBlog.quote,
        covertedBlog.seo,
        covertedBlog.recipeDetails,
        covertedBlog.instructions,
        covertedBlog.recipeDescription.shortDescription,
        covertedBlog.faq,
        covertedBlog.equipments)
      ) {
        console.log(`UPLOADDDDD INSIDEEE`);

        try {
          let reqres = {
            section: path[0],
            title: slugify(covertedBlog.pageTitle),
            imagealt: covertedBlog.imageQuery,
            imageurl: link,
            subsection: path[1],
            subsubsection: path[2],
            content: results,
            instructions: covertedBlog.instructions,
            recipedetails: covertedBlog.recipeDetails,
            recipedescription: covertedBlog.recipeDescription.shortDescription,
            author: covertedBlog.author,
            quote: covertedBlog.quote,
            seo: covertedBlog.seo,
            faq: covertedBlog.faq,
            equipments: covertedBlog.equipments,
            slug: `${path[0]}/${path[1]}/${path[2]}/${slugify(
              covertedBlog.pageTitle
            )}`,
          };

          // const body = await req.json();
          // console.log(body);
          const newBlog = await prisma.foodBlogs.create({
            data: reqres,
          });
          console.log("UPLOAD SUCCESSFULL", newBlog);
          successCount = successCount + 1;
          if (successCount < timestorun) {
            console.log(`SUCCESS COUNT`, successCount);
            console.log(`FAILED COUNT`, failedCount);
            startProcess();
          } else {
            console.log(`SUCCESS COUNT`, successCount);
            console.log(`FAILED COUNT`, failedCount);
            console.log("STOOOOOPPPPINGGGGGGGGGGG");
          }
        } catch (error) {
          console.log(`errorrrrrr`, error);
          failedCount = failedCount + 1;
          // console.clear(); // Clears the console
          startProcess(); // Retry if failed
        }

        // const res = await axios.post("/api/dbupload", {
        //   section: path[0],
        //   title: slugify(covertedBlog.pageTitle),
        //   imagealt: covertedBlog.imageQuery,
        //   imageurl: link,
        //   subsection: path[1],
        //   subsubsection: path[2],
        //   content: results,
        //   instructions: covertedBlog.instructions,
        //   recipedetails: covertedBlog.recipeDetails,
        //   recipedescription: covertedBlog.recipeDescription.shortDescription,
        //   author: covertedBlog.author,
        //   quote: covertedBlog.quote,
        //   seo: covertedBlog.seo,
        //   faq: covertedBlog.faq,
        //   equipments: covertedBlog.equipments,
        //   slug: `${path[0]}/${path[1]}/${path[2]}/${slugify(
        //     covertedBlog.pageTitle
        //   )}`,
        // });
        // if (res.status) {
        //   console.log(
        //     "UPLOAD SUCCESSFULL",
        //     res.data,
        //     "STARTING NEXT CYCLE... STOOOOOPPPPINGGGGGGGGGGG"
        //   );
        //   successCount = successCount + 1;
        //   // console.clear(); // Clears the console
        //   // startProcess(); // Continue the process if running
        // } else {
        //   failedCount = failedCount + 1;
        //   // console.clear(); // Clears the console
        //   startProcess(); // Retry if failed
        // }
      }
    } catch (error) {
      console.error("ERROR OCCURED, RETRYING...", error);
      failedCount = failedCount + 1;
      // console.clear(); // Clears the console
      startProcess(); // Handle errors and retry
    }
  }
  startProcess();
}

export async function GET(req: Request) {
  try {
    await Upload2();

    return Response.json({ running: "run" });
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}
