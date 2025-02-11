"use server";

import { subSections } from "@/libs/Section";
import axios from "axios";
import slugify from "slugify";
import UPLOAD from "../upload/Upload";
import { CONVERT } from "../humanizee/Convert";

async function Upload2() {
  let isRunning = false;
  let successCount = 0;
  let failedCount = 0;
  let consoleData = [];

  if (successCount == 10) {
    // refreshPage();
    return;
  }

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

  const searchImages = async (query: string) => {
    const response = await axios.post("/api/scrape", {
      query,
    });
    return response.data.results.url;
  };

  async function startProcess() {
    console.log(`SUCCESS COUNT`, successCount);
    console.log(`FAILED COUNT`, failedCount);
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
      let link;
      if (
        covertedBlog.imageQuery == null ||
        covertedBlog.imageQuery == "null"
      ) {
        console.log("Failed to have imagequery for main");
        throw new Error("Failed to have imagequery for main");
      } else {
        link = await searchImages(covertedBlog.imageQuery);
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
            let link;
            if (item.imageQuery == null || item.imageQuery == "null") {
              link = "null";
            } else {
              link = await searchImages(item.imageQuery);
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

            const response = await runUntilResponse(item.description);

            return {
              // title: item.title,
              description: response,
              // description: item.description,
              url: link,
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
        ((path[0],
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
        covertedBlog.recipeDescription.shortDescription),
        covertedBlog.faq,
        covertedBlog.equipments)
      ) {
        const res = await axios.post("/api/dbupload", {
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
        });
        if (res.status) {
          console.log(
            "UPLOAD SUCCESSFULL",
            res.data,
            "STARTING NEXT CYCLE... STOOOOOPPPPINGGGGGGGGGGG"
          );
          successCount = successCount + 1;
          // console.clear(); // Clears the console
          // startProcess(); // Continue the process if running
        } else {
          failedCount = failedCount + 1;
          // console.clear(); // Clears the console
          startProcess(); // Retry if failed
        }
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

export async function GET() {
  try {
    await Upload2();

    return Response.json({ running: "run" });
  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}
