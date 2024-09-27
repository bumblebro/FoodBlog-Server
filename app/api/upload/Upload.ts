import { SchemaType, GoogleGenerativeAI } from "@google/generative-ai";

export default async function UPLOAD({
  section,
  subSection,
  subSubSection,
}: {
  section: string;
  subSection: string;
  subSubSection: string;
}) {
  const apiKeys = [
    "AIzaSyCXDKoQVeO41DjXic40S9ONZwF8oiMFTww",
    "AIzaSyA2bW3jhFQMlSRZvRyXZCTLbYczeoJruzc",
    "AIzaSyBwzqeVWzLPb-TjfbaqV5UIEBbN-xuF7Lg",
  ];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * apiKeys.length);

  // Select the random API key
  const selectedApiKey = apiKeys[randomIndex];
  console.log(`API Used`, randomIndex, selectedApiKey);

  const genAI = new GoogleGenerativeAI(selectedApiKey);

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  console.log(formattedDate); // Output: "September 19, 2024"

  try {
    // const body = await req.json();
    console.log("Start");
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    //     const promptForTitle = `
    // Generate 100 possible, unique, non-repetitive, and captivating click-bait titles for a blog under the sub-subsection "${subSubSection}", which falls under the subsection "${subSection}" and section "${section}".

    // Each title should follow one of these blog formats:
    //   - Listicles (e.g., "10 Best... ")
    //   - Review Blogs (e.g., "In-Depth Review of...")
    //   - Comparison Blogs (e.g., "Product A vs. Product B: Which Is Better?")
    //   - How-To/Tutorial Blogs (e.g., "How to...")
    //   - Roundup Blogs (e.g., "Top 5...")
    //   - Buying Guides (e.g., "Ultimate Buying Guide for...")
    //   - Opinion Blogs (e.g., "Why I Think...")

    // The titles must be:
    // - Creative, captivating, and designed to make the reader want to click.
    // - Reflective of the specific blog format chosen.
    // - Clearly associated with the following topic hierarchy:
    //   - Section: ${section}
    //   - Subsection: ${subSection}
    //   - Sub-subsection: ${subSubSection}

    // Ensure that the titles:
    // - Vary across different blog formats.
    // - Are meaningful and relevant to the topic, avoiding repetition or placeholder titles.
    // - Include a mix of popular and engaging title strategies (e.g., numbers, questions, controversial opinions, etc.).

    // The response should be structured as a JSON array of objects with the following schema:

    // {
    //   "type": "array",
    //   "items": {
    //     "type": "object",
    //     "properties": {
    //       "title": { "type": "string", "nullable": false }
    //     },
    //     "required": ["title"]
    //   }
    // }
    // `;

    const promptForTitle = `
Generate 100 possible, unique, non-repetitive, and captivating click-bait titles for a blog under the sub-subsection "${subSubSection}", which falls under the subsection "${subSection}" and section "${section}" updated as of ${formattedDate}.

Each title should follow one of these blog formats:
  - Listicles (e.g., "10 Best... ")
  - Review Blogs (e.g., "In-Depth Review of...")
  - Comparison Blogs (e.g., "Product A vs. Product B: Which Is Better?")
  - How-To/Tutorial Blogs (e.g., "How to...")
  - Roundup Blogs (e.g., "Top 5...")
  - Buying Guides (e.g., "Ultimate Buying Guide for...")
  - Opinion Blogs (e.g., "Why I Think...")

The titles must be:
- Creative, captivating, and designed to make the reader want to click.
- Reflective of the specific blog format chosen.
- Clearly associated with the following topic hierarchy: 
  - Section: ${section}
  - Subsection: ${subSection}
  - Sub-subsection: ${subSubSection}

Ensure that the titles:
- Avoid any placeholders like "the product name" or "insert here," using meaningful and specific words related to the context of the sub-subsection.
- Vary across different blog formats.
- Are meaningful and relevant to the topic, avoiding repetition or generic placeholders.
- Include a mix of popular and engaging title strategies (e.g., numbers, questions, controversial opinions, etc.).

The response should be structured as a JSON array of objects with the following schema:

{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "title": { "type": "string", "nullable": false }
    },
    "required": ["title"]
  }
}
`;

    const res = await model.generateContent(promptForTitle);
    const response = await res.response;
    const data = response.text();
    const titlelist = JSON.parse(data);
    // console.log(`Title list`, titlelist);
    const title = await titlelist[Math.floor(Math.random() * 100) + 1].title;

    // const prompt = `
    //     Generate a well-researched, engaging, and structured blog post (around 1300 words) with the title "${title}". The blog should be written in a clear, informative, conversational, personal tone and style of storytelling. Ensure the content is:

    //     - Begin the blog with a relatable, personal anecdote or story that ties into the topic.
    //     - Maintain a conversational flow, making the reader feel as if they're being spoken to directly.
    //     - Use humor, informal language, and personal insights where appropriate.
    //     - Encourage reflection by posing questions to the reader and addressing them directly (e.g., "What does this mean for you?").
    //     - Balance the casual tone with useful, actionable advice.
    //     - Human Written
    //     - 100% Unique
    //     - SEO Optimized
    //     - Relevant to the title
    //     - Avoid filler phrases that may suggest AI-generated content, like "Remember," "Let’s face it," or "Embrace.
    //     - Avoid filler content or placeholders

    //     The structure of the blog should follow this format:

    //     1. **Author and Quote:**
    //        - Generate a random author's name.
    //        - Include a relevant quote from the author that reflects the theme of the blog and sets the tone.

    //     2. **Page Title:**
    //        - The main title of the blog post.

    //     3. **Image Query:**
    //        - Generate a query for the main image that aligns with the blog content.

    //     4. **Blog Content:**
    //        - For each section, generate an object with the following fields:
    //          - **Description:** This field should provide detailed content about the section or set to null if no image is required. Use Markdown language for formatting, including headers (e.g., ##), bullet points, and bold text where appropriate.
    //          - **Query:** This field should contain an image query related to the section content, or set to null if no image is required.

    //     5. **SEO Information:**
    //        - Include meta description, Open Graph title and description, primary keywords, and secondary keywords (optional).

    //     Make sure the content is thoroughly researched and provides value to readers. Avoid filler content or placeholders, and focus on delivering substantial, fact-based information.

    //     ### Example Output:

    //     {
    //       "author": "Jane Smith",
    //       "quote": "Mastering your finances isn't just about numbers—it's about creating a life that truly reflects your values.",
    //       "pageTitle": "How to Take Control of Your Finances and Build a Life You Love",
    //       "imageQuery": "person managing finances at home",
    //       "seo": {
    //         "metaDescription": "Discover how to manage your finances wisely and build a life that aligns with your values and goals.",
    //         "ogTitle": "How to Take Control of Your Finances and Build a Life You Love",
    //         "ogDescription": "Learn the key steps to take control of your finances and start building a life that reflects your personal goals and values.",
    //         "primaryKeywords": ["personal finance", "money management", "budgeting tips"],
    //         "secondaryKeywords": ["financial freedom", "value-based spending", "savings goals"]
    //       },
    //       "content": [
    //         {
    //           "description": "Growing up, my family didn’t take expensive vacations. In fact, I remember the times we squeezed into a tiny, two-bed motel room—four of us, in a space made for two. My parents were always looking for ways to stretch a dollar. Back then, I thought this was just how things were, but now, looking back, I realize it was my first lesson in personal finance. Managing money isn't just about earning more, it’s about getting the most value out of what you have.",
    //           "query": "family road trip in a small car"
    //         },
    //         {
    //           "description": "## Why Budgeting is the First Step\n\nYears later, when I started managing my own money, that lesson stuck with me. The first real step to financial freedom is learning how to budget. Just like my parents, who carefully planned every dollar, I realized that a budget doesn’t limit you—it actually gives you freedom. When you know where your money is going, you’re in control. You can start making decisions that support the life you want to live.",
    //           "query": "person creating a budget at a kitchen table"
    //         },
    //         {
    //           "description": "## The Power of Value-Based Spending\n\nNot long ago, I took a trip to Italy with a few friends. We didn’t hold back on experiences—fine dining, boat rides, and exploring beautiful towns. But here’s the thing: we planned for it. I cut back on things that didn’t matter to me, like fancy gadgets and expensive clothes, so I could spend more on what did—travel, memories, and experiences. This is what I call value-based spending, and it’s key to building your rich life.",
    //           "query": "person enjoying a luxurious vacation"
    //         },
    //         {
    //           "description": "## Savings: Your Secret Weapon\n\nI’ll admit, saving didn’t always come naturally to me. I used to think it was about depriving myself of the things I enjoyed. But then I learned how powerful savings can be. It’s not about what you can’t spend—it’s about what you’re saving for. Whether it's an emergency fund, a new home, or a dream vacation, every dollar saved gets you closer to the things that matter most.",
    //           "query": "person putting money in a savings jar"
    //         },
    //         {
    //           "description": "## Investing in Your Future\n\nOnce you’ve mastered saving, the next step is investing. When I got my first paycheck, I spent most of it right away. But now, I see investing as planting seeds for the future. The earlier you start, the more time your money has to grow. Whether it's stocks, real estate, or retirement funds, investing is about building a future that gives you the freedom to live on your terms.",
    //           "query": "person investing in the stock market"
    //         },
    //         {
    //           "description": "## Design Your Financial Plan\n\nNow, here’s where it all comes together. Just like my parents did with our vacations, you can design a financial plan that reflects your values. It’s not about making more money—it's about making your money work for you. Maybe you want to travel, spend more time with family, or simply enjoy peace of mind knowing you have financial security. Whatever it is, start designing your plan today and take control of your financial future.",
    //           "query": "person planning finances on a notebook"
    //         },
    //         {
    //           "description": "## Conclusion: Your Rich Life Awaits\n\nLiving a rich life isn’t about having the most money—it’s about living in alignment with what matters most to you. Whether it’s budgeting, saving, or investing, the key is to start taking small steps today. Just like those family road trips taught me the value of money, you can start applying these lessons to create a life filled with the things that bring you joy. Your rich life is waiting—start building it today.",
    //           "query": "person living a happy, fulfilled life"
    //         }
    //       ]
    //     }
    //   `;

    const prompt = `
    Generate a well-researched, engaging, and structured blog post around 1500 to 2500 words with the title "${title}" updated as of ${formattedDate}. The blog should be written in a clear, informative, conversational, personal tone and style of storytelling. Ensure the content is:
    
    - Begin the blog with a relatable, personal anecdote or story that ties into the topic.
    - Maintain a conversational flow, making the reader feel as if they're being spoken to directly.
    - Use humor, informal language, and personal insights where appropriate.
    - Encourage reflection by posing questions to the reader and addressing them directly (e.g., "What does this mean for you?").
    - Balance the casual tone with useful, actionable advice.
    - Human Written
    - 100% Unique
    - SEO Optimized
    - Relevant to the title and specific context (do not use placeholders like '[Desktop Name]' or generic references)
    - Avoid filler content or placeholders
    
    The structure of the blog should follow this format:
    
    1. **Author and Quote:**
       - Generate a random author's name.
       - Include a relevant quote from the author that reflects the theme of the blog and sets the tone.
    
    2. **Page Title:**
       - The main title of the blog post.
    
    3. **Image Query:**
       - Generate a query for the main image that aligns with the blog content.
    
    4. **Blog Content:**
       - For each section, generate an object with the following fields:
         - **Query:** This field should contain an image query related to the section content, or set to null if no image is required.
         - **Description:** This field should provide detailed content about the section. Use Markdown language for formatting, including headers (e.g., ##), bullet points, and **bold text** where appropriate. Do not use any placeholders or vague product names.
    
    5. **SEO Information:**
       - Include meta description, Open Graph title and description, primary keywords, and secondary keywords.
       - Primary Keywords: Focus on high search volume and medium-to-high competition.
       - Secondary Keywords: Focus on moderate search volume and competition, with a related but distinct focus.
    
    Make sure the content is thoroughly researched and provides value to readers. Avoid filler content or placeholders, and focus on delivering substantial, fact-based information. Always use specific and relevant names, brands, or details related to the title provided.
    
   ### Example Output:

        {
          "author": "Jane Smith",
          "quote": "Mastering your finances isn't just about numbers—it's about creating a life that truly reflects your values.",
          "pageTitle": "How to Take Control of Your Finances and Build a Life You Love",
          "imageQuery": "person managing finances at home",
          "seo": {
            "metaDescription": "Discover how to manage your finances wisely and build a life that aligns with your values and goals.",
            "ogTitle": "How to Take Control of Your Finances and Build a Life You Love",
            "ogDescription": "Learn the key steps to take control of your finances and start building a life that reflects your personal goals and values.",
            "primaryKeywords": ["personal finance", "money management", "budgeting tips"],
            "secondaryKeywords": ["financial freedom", "value-based spending", "savings goals"]
          },
          "content": [
            {
              "query": "family road trip in a small car",
              "description": "Growing up, my family didn’t take expensive vacations. In fact, I remember the times we squeezed into a tiny, two-bed motel room—four of us, in a space made for two. My parents were always looking for ways to stretch a dollar. Back then, I thought this was just how things were, but now, looking back, I realize it was my first lesson in personal finance. Managing money isn't just about earning more, it’s about getting the most value out of what you have."
            },
            {
            "query": "person creating a budget at a kitchen table",
              "description": "## Why Budgeting is the First Step\n\nYears later, when I started managing my own money, that lesson stuck with me. The first real step to financial freedom is learning how to budget. Just like my parents, who carefully planned every dollar, I realized that a budget doesn’t limit you—it actually gives you freedom. When you know where your money is going, you’re in control. You can start making decisions that support the life you want to live."
            },
            {
              "query": "person enjoying a luxurious vacation",
              "description": "## The Power of Value-Based Spending\n\nNot long ago, I took a trip to Italy with a few friends. We didn’t hold back on experiences—fine dining, boat rides, and exploring beautiful towns. But here’s the thing: we planned for it. I cut back on things that didn’t matter to me, like fancy gadgets and expensive clothes, so I could spend more on what did—travel, memories, and experiences. This is what I call value-based spending, and it’s key to building your rich life."
            },
            {
              "query": "person putting money in a savings jar",
              "description": "## Savings: Your Secret Weapon\n\nI’ll admit, saving didn’t always come naturally to me. I used to think it was about depriving myself of the things I enjoyed. But then I learned how powerful savings can be. It’s not about what you can’t spend—it’s about what you’re saving for. Whether it's an emergency fund, a new home, or a dream vacation, every dollar saved gets you closer to the things that matter most."
            },
            {
              "query": "person investing in the stock market",
              "description": "## Investing in Your Future\n\nOnce you’ve mastered saving, the next step is investing. When I got my first paycheck, I spent most of it right away. But now, I see investing as planting seeds for the future. The earlier you start, the more time your money has to grow. Whether it's stocks, real estate, or retirement funds, investing is about building a future that gives you the freedom to live on your terms."
            },
            {
              "query": "person planning finances on a notebook",
              "description": "## Design Your Financial Plan\n\nNow, here’s where it all comes together. Just like my parents did with our vacations, you can design a financial plan that reflects your values. It’s not about making more money—it's about making your money work for you. Maybe you want to travel, spend more time with family, or simply enjoy peace of mind knowing you have financial security. Whatever it is, start designing your plan today and take control of your financial future."
            },
            {
              "query": "person living a happy, fulfilled life",
              "description": "## Conclusion: Your Rich Life Awaits\n\nLiving a rich life isn’t about having the most money—it’s about living in alignment with what matters most to you. Whether it’s budgeting, saving, or investing, the key is to start taking small steps today. Just like those family road trips taught me the value of money, you can start applying these lessons to create a life filled with the things that bring you joy. Your rich life is waiting—start building it today."
            }
          ]
        }
  `;

    const schema = {
      description: "Schema for content with SEO and author information",
      type: SchemaType.OBJECT,
      properties: {
        author: {
          type: SchemaType.STRING,
          description: "Name of the author",
          nullable: false,
        },
        quote: {
          type: SchemaType.STRING,
          description: "Quote provided by the author",
          nullable: false,
        },
        pageTitle: {
          type: SchemaType.STRING,
          description: "Title of the page",
          nullable: false,
        },
        imageQuery: {
          type: SchemaType.STRING,
          description: "Query for the image",
          nullable: false,
        },
        seo: {
          type: SchemaType.OBJECT,
          description: "SEO related information",
          properties: {
            metaDescription: {
              type: SchemaType.STRING,
              description: "Meta description for SEO",
              nullable: false,
            },
            ogTitle: {
              type: SchemaType.STRING,
              description: "Open Graph title for social media",
              nullable: false,
            },
            ogDescription: {
              type: SchemaType.STRING,
              description: "Open Graph description for social media",
              nullable: false,
            },
            primaryKeywords: {
              type: SchemaType.ARRAY,
              description: "Primary keywords for SEO",
              items: {
                type: SchemaType.STRING,
              },
              nullable: false,
            },
            secondaryKeywords: {
              type: SchemaType.ARRAY,
              description: "Secondary keywords for SEO",
              items: {
                type: SchemaType.STRING,
              },
              nullable: false,
            },
          },
          required: [
            "metaDescription",
            "primaryKeywords",
            "secondaryKeywords",
            "ogTitle",
            "ogDescription",
          ],
        },
        content: {
          type: SchemaType.ARRAY,
          description: "Array of content objects",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              query: {
                type: SchemaType.STRING,
                description: "Query related to the content",
                nullable: true,
              },
              description: {
                type: SchemaType.STRING,
                description: "Description of the content into markdown format",
                nullable: true,
              },
            },
            required: ["description"],
          },
        },
      },
      required: [
        "author",
        "quote",
        "pageTitle",
        "imageQuery",
        "seo",
        "content",
      ],
    };

    const model2 = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model2.generateContent(prompt);
    const response1 = await result.response;
    // console.log(response);
    const data1 = response1.text();
    console.log(data1);
    console.log(title, section, subSection, subSubSection);
    return data1;
  } catch (error) {
    return error;
  }
}
