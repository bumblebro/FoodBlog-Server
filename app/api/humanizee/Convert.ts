// @ts-nocheck

"use server";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";
import userAgent from "user-agents";

export async function CONVERT(content: string) {
  // const { content } = await req.json();

  if (!content) {
    return new Response(JSON.stringify({ error: "Content is required" }), {
      status: 400,
    });
  }

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

  // const browserWSEndpoint = await browser.wsEndpoint();
  try {
    const page = await browser.newPage();
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    // );
    await page.setUserAgent(userAgent.random().toString());

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

    await page.$eval(".Home_editor__button__iu08P", (element) =>
      (element as HTMLElement).click()
    );
    await setTimeout(1000);

    await page.$eval(".Home_editor__button__iu08P", (element) =>
      (element as HTMLElement).click()
    );

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
    console.log("Page close startttt");

    const pages = await browser.pages();
    await Promise.all(pages.map((p: any) => p.close())); // Close all pages
    console.log("all pages closed");
    await browser.close();

    return humanizedContent;
  } catch (error) {
    console.error("Scraping failed: ", error);
    return null;
  }
}
