"use server";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";
import { NextRequest } from "next/server";

export async function CONVERT(content: string) {
  try {
    // const { content } = await req.json();

    if (!content) {
      return new Response(JSON.stringify({ error: "Content is required" }), {
        status: 400,
      });
    }

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--disable-gpu", "--window-size=1920,1080"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    await page.goto("https://www.undetectableai.pro", {
      waitUntil: "networkidle2",
    }); // Replace with the target URL

    await page.setViewport({ width: 1080, height: 1024 });

    // Fill in the textarea (input)
    await page.waitForSelector(".Home_editor__textarea__W6jTe"); // Wait up to 120 seconds

    // await page.type(".Home_editor__textarea__W6jTe", content); // Correct selector for input
    const inputSelector = ".Home_editor__textarea__W6jTe";
    await page.evaluate(
      (selector, value) => {
        const input: any = document.querySelector(selector);
        if (input) {
          input.value = value; // Set the value directly
          input.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event
        }
      },
      inputSelector,
      content
    );

    // Click the submit button
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // await setTimeout(5000);
    await setTimeout(2000);

    await page.waitForSelector(".Home_editor__button__iu08P"); // Wait up to 120 seconds

    // await page.$eval(".Home_editor__button__iu08P", (elem) => elem.click());

    // await page.click(".Home_editor__button__iu08P");

    // await page.$eval(".Home_editor__button__iu08P", (element) => {
    //   (element as HTMLElement).click(); // Cast element to HTMLElement before clicking
    // });

    // await page.evaluate(() => {
    //   const button = document.querySelector(".Home_editor__button__iu08P"); // Replace '#humanise-button' with your button selector
    //   button.scrollIntoView(); // Scrolls the button into view
    // });

    // const element = await page.$(".Home_editor__button__iu08P");

    // if (element) {
    //   // Get the bounding box of the element
    //   const box = await element.boundingBox();

    //   if (box) {
    //     // Calculate the center of the element
    //     const x = box.x + box.width / 2;
    //     const y = box.y + box.height / 2;

    //     // Move the mouse to the center of the button
    //     await page.mouse.move(x, y);

    //     // Simulate mouse down (click start)
    //     await page.mouse.down();

    //     // Optional: add a delay to simulate a click hold (in milliseconds)
    //     await setTimeout(100);

    //     // Simulate mouse up (click end)
    //     await page.mouse.up();
    //   } else {
    //     console.log("Bounding box not found for the element.");
    //   }
    // } else {
    //   console.log("Element not found.");
    // }

    // await page.focus(".Home_editor__button__iu08P");
    // await setTimeout(5000);

    await page.$eval(".Home_editor__button__iu08P", (element) =>
      (element as HTMLElement).click()
    );
    await setTimeout(1000);

    await page.$eval(".Home_editor__button__iu08P", (element) =>
      (element as HTMLElement).click()
    );

    // await page.evaluate(() => {
    //   document.querySelector(".Home_editor__button__iu08P").click(); // Trigger click via JavaScript
    // });
    // await page.evaluate(() => {
    //   document.querySelector(".Home_editor__button__iu08P").click(); // Trigger click via JavaScript
    // });

    // await page.screenshot({ path: "screenshot1.png" });
    // console.log(`Done Screenshot`);

    // const element = await page.$(".Home_editor__button__iu08P");

    // if (element) {
    //   // Get the bounding box of the element
    //   const box = await element.boundingBox();

    //   if (box) {
    //     // Calculate the center of the element
    //     const x = box.x + box.width / 2;
    //     const y = box.y + box.height / 2;

    //     // Move the mouse to the center of the button
    //     await page.mouse.move(x, y);

    //     // Simulate mouse down (click start)
    //     await page.mouse.down();

    //     // Optional: add a delay to simulate a click hold (in milliseconds)
    //     await setTimeout(100);

    //     // Simulate mouse up (click end)
    //     await page.mouse.up();
    //   } else {
    //     console.log("Bounding box not found for the element.");
    //   }
    // } else {
    //   console.log("Element not found.");
    // }

    // Wait for 30 seconds to get the full page content for debugging
    // await setTimeout(30000);

    // await page.screenshot({ path: "screenshot2.png" });
    // console.log(`Done Screenshot`);

    // Get the entire page's HTML content for debugging
    // const pageContent = await page.content();
    // console.log("Page content after 30 seconds:", pageContent);

    // Wait for the output textarea to appear
    const outputSelector =
      ".Home_editor__textarea__W6jTe.Home_editor__result__GpHzx";
    console.log(`Waiting for output textarea with selector: ${outputSelector}`);

    // Using waitForSelector to wait for the textarea to appear, with increased timeout
    await page.waitForSelector(outputSelector, { timeout: 30000 }); // Wait up to 120 seconds

    // Get the humanized content from the textarea
    const humanizedContent = await page.$eval(
      outputSelector,
      (el) => (el as HTMLTextAreaElement).value // Cast to HTMLTextAreaElement
    );

    await browser.close();

    return humanizedContent;
  } catch (error) {
    console.error("Scraping failed: ", error);
    return null;
  }
}
