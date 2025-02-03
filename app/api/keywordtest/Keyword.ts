"use server";

import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";
import { NextRequest } from "next/server";

export async function KEYWORDTEST(query: string) {
  // open a new browser
  const browser = await puppeteer.launch({
    headless: false,
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

  // create a new page
  const page = await browser.newPage();

  // navigate to google
  await page.goto("https://www.google.com");

  // type slowly and parse the keyword
  await page.type("*[name='q']", query, { delay: 500 });

  // go to ul class listbox
  await page.waitForSelector("ul[role='listbox']");

  // extracting keywords from ul li span
  const search = await page.evaluate(() => {
    // count over the li's starting with 0
    let listBox = document.body.querySelectorAll(
      "ul[role='listbox'] li .wM6W7d"
    );
    // loop over each li store the results as x
    let item = Object.values(listBox).map((x: any) => {
      return x.querySelector("span").innerText;
    });
    return item;
  });

  // logging results
  console.log(search);
  return search;

  await browser.close();
}
