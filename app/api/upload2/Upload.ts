import { SchemaType, GoogleGenerativeAI } from "@google/generative-ai";

// Define the sleep function
function sleep(ms: any) {
  console.log(`Waiting for 2 min until next request, Please hold on baby`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function UPLOAD({ query }: { query: string }) {
  // const apiKeys = [
  //   // "AIzaSyAmFmuQLHs_sHv-JmxGuh1lGoFsbPSLUec",
  //   // "AIzaSyAGZSdvW7-jNdSuYOWDuy-75-DNDjwyn1Q",
  //   // "AIzaSyAzL87x9mCyZahihEtNAM-nCbbV1p2jWo8",
  //   "AIzaSyDUYOOcFPT_Rng-V3sbma24sclKMmZok54",
  // ];

  // const apiKeys = ["AIzaSyAplveCGzwidcNP5pNzoSBuwiLoattwFck"];

  //const apiKeys = ["AIzaSyAplveCGzwidcNP5pNzoSBuwiLoattwFck"];

  const apiKeys = process.env.NEXT_PUBLIC_GEMINIAI_API_URL?.split("|") || [];

  if (!Array.isArray(apiKeys) || apiKeys.length === 0) {
    throw new Error("NEXT_PUBLIC_KEYWORDS is empty or invalid");
  }

  // Pick a random keyword
  const randomApi = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  console.log(`📦 Selected random Api:`, randomApi);

  // const apiKeys = [
  //   process.env.NEXT_PUBLIC_GEMINIAI_API_URL,
  //   process.env.NEXT_PUBLIC_GEMINIAI_API_URL1,
  // ];

  // const randomIndex = Math.floor(Math.random() * apiKeys.length);

  // const selectedApiKey = apiKeys[randomIndex];
  // console.log(`API Used`, randomIndex, selectedApiKey);

  const genAI = new GoogleGenerativeAI(randomApi || "");

  // const apiKeys = process.env.NEXT_PUBLIC_GEMINIAI_API_URL;

  //  console.log(`API Used`, apiKeys);

  // const genAI = new GoogleGenerativeAI(apiKeys || "");

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  console.log(formattedDate); // Output̀: "September 19, 2024"
  console.log("keyord from Upload", query);

  try {
    // const body = await req.json();
    console.log("Start");
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-2.0-flash",
    //   generationConfig: {
    //     responseMimeType: "application/json",
    //   },
    // });

    // Generate 100 possible,recipe,  unique, non-repetitive, and captivating click-bait recipe titles for a Food and Drink niche blog under the sub-subsection "${subSubSection}", which falls under the subsection "${subSection}" and section "${section}" updated as of ${formattedDate}.
    //     const promptForTitle = `
    // Generate 100 unique, captivating, and non-repetitive click-bait titles for a blog under the sub-subsection ${subSubSection}. This sub-subsection belongs to the subsection ${subSection} and the section ${section}. Ensure the titles are updated and relevant as of ${formattedDate}.

    // Each title should follow one of these blog formats:
    //    - How-To/Tutorial Blogs (e.g., "How to Make the Perfect Homemade Pizza")

    // The titles must be:
    // - Avoid complex words by using simple vocabulary like ‘find out’ instead of ‘ascertain’ or ‘use’ over ‘utilize’.
    // - Make it less generic by adding a personal touch using opinions, real-life examples, etc. For instance, “One of my friends told me about their fun hiking experience in the mountains.”
    //     - Add emotional cues, words, and phrases. For example, “I know how difficult it can be to lose a loved one.”
    // - Creative, captivating, and designed to make the reader want to click.
    // - Reflective of the specific blog format chosen.
    // - Clearly associated with the following topic hierarchy:
    //   - Section: ${section}
    //   - Subsection: ${subSection}
    //   - Sub-subsection: ${subSubSection}

    // Ensure that the titles:
    // - Avoid word "ultimate".
    // - Avoid any placeholders like "the product name" or "insert here," using meaningful and specific words related to the context of the sub-subsection.
    // - Vary across different blog formats.
    // - Are meaningful and relevant to the topic, avoiding repetition or generic placeholders.
    // - Include a mix of popular and engaging title strategies (e.g., numbers, questions, controversial opinions, etc.).

    // The response should be structured as a JSON array of strings with the following schema:

    // {
    //   "type": "array",
    //   "items": { "type": "string", "nullable": false }
    // }
    // `;

    //     const promptForTitle = `
    // Generate 100 unique, captivating, and non-repetitive click-bait recipe name for blog under the sub-subsection ${subSubSection}. This sub-subsection belongs to the subsection ${subSection} and the section ${section}. Ensure the recipes are updated and relevant as of ${formattedDate}.

    // The recipes must be:
    // - Creative and designed to make the reader want to click and try the recipe.
    // - Clearly associated with the following topic hierarchy:
    //   - Section: ${section}
    //   - Subsection: ${subSection}
    //   - Sub-subsection: ${subSubSection}

    // Ensure that the titles:
    // - Are meaningful and relevant to the recipe, avoiding repetition or generic phrases.

    // `;

    // const promptForTitle = `
    // Generate 100 unique, captivating, and non-repetitive recipe names for a blog under the sub-subsection "${subSubSection}". This sub-subsection belongs to the subsection "${subSection}" and the section "${section}". Ensure the recipes are latest.

    // The recipe names must be:
    // - Clearly associated with the following topic hierarchy:
    //   - Section: ${section}
    //   - Subsection: ${subSection}
    //   - Sub-subsection: ${subSubSection}

    // Provide only the recipe names, one per line, without any numbers, bullet points, or additional text. Do not include any explanations, sentences, or notes. Only the recipe names.
    // `;

    // const schema1 = {
    //   type: SchemaType.ARRAY,
    //   description: "Array of Reciepes",
    //   items: {
    //     type: SchemaType.STRING,
    //   },
    //   nullable: false,
    // };

    // const model3 = genAI.getGenerativeModel({
    //   model: "gemini-2.0-flash",
    //   generationConfig: {
    //     responseMimeType: "application/json",
    //     responseSchema: schema1,
    //   },
    // });

    // const res = await model3.generateContent(promptForTitle);
    // const response = await res.response;
    // const data = response.text();
    // const titlelist = JSON.parse(data);

    // // console.log(`Title list`, titlelist);

    // const title = await titlelist[
    //   Math.floor(Math.random() * titlelist.length) // Corrected
    // ];

    // console.log(`title picked :`, title);

    // // if (title.toLowerCase().includes("updated")) {
    // //   throw new Error("Title cannot contain the word 'updated'.");
    // // }

    // if (typeof title === "string" && title.toLowerCase().includes("updated")) {
    //   throw new Error("Title cannot contain the word 'updated'.");
    // }

    // await sleep(120000); // Wait for 2 minutes

    const prompt = `Write a well-researched, engaging, and structured recipe blog post that contains a description, ingredients, directions to cook, and a conclusion, around 1500 to 2500 words, for the Food and Drink niche. The content should avoid repetitive phrasing, formulaic structures, and predictable sentence patterns, which are often detectable by AI content tools. Instead, rewrite these unnatural elements by varying sentence structures and word choices in a way that mimics human writing styles. Ensure the text has a natural flow and maintains reader engagement throughout, just like human writers who enhance clarity and readability through diverse language use.

Make sure the content replicates the engaging and natural qualities of human-authored text, ensuring it is indistinguishable from human writing. The final output should be precise, pass AI detection tools, and be enhanced for readability, flow, and engagement.

The algorithms you use should account for language nuances—syntax, semantics, and context—making intelligent edits that humanize the AI-generated text without changing its original intent or meaning. Ensure the output improves SEO performance and provides a positive reader experience, while also remaining completely undetectable by AI content detection algorithms
Given the recipe title "${query}", generate slightly rephrased alternate title that keep the same meaning, tone, and main keywords, sound natural, catchy, and SEO-friendly, stay between 5–9 words.The blog should be written in a clear, informative, conversational, personal tone and style of storytelling. Ensure the content is:

- Strictly one recipe.
- Avoid the word "ultimate".
- Avoid complex words by using simple vocabulary like ‘find out’ instead of ‘ascertain’ or ‘use’ over ‘utilize’.
- Make it less generic by adding a personal touch using opinions, real-life examples, etc. For instance, “One of my friends told me about their fun hiking experience in the mountains.”
- Add emotional cues, words, and phrases. For example, “I know how difficult it can be to lose a loved one.”
- Try to include deliberate errors in the text like typos, grammar mistakes, and incomplete sentences from time to time.
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
   - The main title of the blog post".

3. **Image Query:**
   - Generate a query for the main image that aligns with the blog content.

4. **equipments:**
   - Include an array of equipment names (as strings) required for the recipe.

5. **faq:**
   - Include an array of 4 to 6 frequently asked questions (FAQ) about the recipe. Each FAQ item should include:
     - **Question:** A clear question that a reader might ask.
     - **Answer:** A concise and helpful answer to the question.

6. **Recipe Description:**
   - Include the following fields:
     - **Short Description:** A concise keyword rich summary of the recipe (1-2 sentences).
     - **Detailed Description:** A detailed blog content of the recipe and image queries, broken into an array of 2-3 strings (each string representing a paragraph or chunk of content).

7. **Instructions:**  
   - ** Provide **extremely detailed, step-by-step instructions** Each step should be **actionable, clear, and granular**, ensuring that even a beginner can follow along without confusion. Include tips, visual cues (e.g., "the dough should look smooth and elastic"), and troubleshooting advice where applicable.

8. **Recipe Details:**
   - Include the following fields:
     - **Preparation Time:** Time required for preparation in seconds.
     - **Cook Time:** Time required for cooking in seconds.
     - **Total Time:** Total time required in seconds.
     - **Yield:** Yield of the recipe (e.g., "4").
     - **Ingredients:** List of ingredients with quantities for different serving sizes (1X, 2X, 3X, 4X).
     - **Notes:** Additional tips or notes for the recipe.
     - **Nutrition:** Nutritional information per serving.

9. **SEO Information:**
   - Include meta description, Open Graph title and description, primary keywords, and secondary keywords.
   - Primary Keywords: One primary keyword for SEO to rank top in Google search, analyze it properly.
   - Secondary Keywords: Three secondary keywords for SEO to rank top in Google search, analyze it properly.

Make sure the content is thoroughly researched and provides value to readers. Avoid filler content or placeholders, and focus on delivering substantial, fact-based information. Always use specific and relevant names, brands, or details related to the title provided.

### Example Output:

{
  "author": "Jane Smith",
  "quote": "Cooking isn't just about the ingredients—it’s about creating something that nourishes both body and soul.",
  "pageTitle": "How to Create the Perfect Homemade Pizza",
  "imageQuery": "person making homemade pizza",
  "equipments": ["Mixing Bowl", "Whisk", "Rolling Pin", "Baking Sheet"],
  "faq": [
    {
      "question": "Can I use almond flour instead of all-purpose flour?",
      "answer": "Yes, you can substitute almond flour, but the texture may be slightly different. You may need to adjust the liquid ingredients to get the right consistency."
    },
    {
      "question": "How long does it take to cook this dish?",
      "answer": "It takes approximately 30 minutes to prepare and cook this dish, but times may vary depending on your stove and ingredients."
    },
    {
      "question": "Can I make this recipe vegan?",
      "answer": "Yes! You can replace dairy ingredients with plant-based alternatives like almond milk or coconut cream and use flaxseed meal as an egg substitute."
    },
    {
      "question": "How should I store leftovers?",
      "answer": "Store leftovers in an airtight container in the refrigerator for up to 3 days. Reheat in a microwave or on the stovetop before serving."
    },
    {
      "question": "Can I freeze this dish?",
      "answer": "Yes, you can freeze it for up to 2 months. Make sure to let it cool completely before transferring it to a freezer-safe container."
    }
  ],
  "recipeDescription": {
    "shortDescription": "There’s something magical about making pizza from scratch. The smell of fresh dough rising, the sound of sizzling toppings, and the joy of pulling a golden, cheesy masterpiece out of the oven—it’s an experience that brings people together.",
    "detailedDescription": [
     {
      imageQuery: "Close-up shot of a bowl of chickpea curry with rice",
      description:
         "Whether you're cooking for a family dinner or hosting a pizza night with friends, this recipe will guide you step-by-step to create the perfect homemade pizza. The process begins with preparing the dough, which is surprisingly simple and requires just a few basic ingredients.",
    },
    {
      imageQuery: "A person serving a bowl of chickpea curry",
      description:
        "Once the dough is ready, the fun part begins—adding your favorite toppings! From classic margherita to adventurous combinations like BBQ chicken or pesto and goat cheese, the possibilities are endless. The key is to balance flavors and textures to create a pizza that’s uniquely yours."
    }
    ]
  },
  "instructions": [
        "Preheat the oven: Start by preheating your oven to 350°F (175°C). This ensures the oven is at the right temperature when you’re ready to bake.",
        "Prepare your workspace: Clear a clean, flat surface for kneading the dough. Lightly dust it with flour to prevent sticking.",
        "Mix the dry ingredients: In a large mixing bowl, combine 1 cup of flour with 1/2 cup of sugar. Use a whisk or fork to ensure the ingredients are evenly distributed.",
        "Add wet ingredients: Create a well in the center of the dry ingredients. Slowly pour in 1/4 cup of warm water and 1 tablespoon of olive oil. Use a wooden spoon or your hands to mix until a dough begins to form.",
        "Knead the dough: Transfer the dough to your floured surface. Knead it for about 5-7 minutes, or until it becomes smooth and elastic. If the dough feels too sticky, add a little more flour, one tablespoon at a time.",
        "Let the dough rest: Shape the dough into a ball and place it back in the mixing bowl. Cover the bowl with a clean kitchen towel or plastic wrap. Let it rest for 10 minutes to allow the gluten to relax.",
        "Roll out the dough: After resting, use a rolling pin to roll the dough into a circle or rectangle, depending on your preference. Aim for a thickness of about 1/4 inch.",
        "Prepare the baking sheet: Lightly grease a baking sheet or pizza pan with olive oil or cooking spray. Transfer the rolled-out dough onto the sheet.",
        "Add toppings: Spread a thin layer of tomato sauce over the dough, leaving a small border around the edges. Sprinkle shredded mozzarella cheese evenly over the sauce. Add your favorite toppings, such as pepperoni, mushrooms, or bell peppers.",
        "Bake the pizza: Place the pizza in the preheated oven. Bake for 20 minutes, or until the crust is golden brown and the cheese is bubbly and slightly browned.",
        "Cool and serve: Remove the pizza from the oven and let it cool for 2-3 minutes. Use a pizza cutter or sharp knife to slice it into pieces. Serve warm and enjoy!"
      ],
  "recipeDetails": {
    "1X": {
      "preparationTime": "450",
      "cookTime": "1800",
      "totalTime": "2700",
      "yield": "4",
      "ingredients": [
        {
          "name": "Flour",
          "quantity": "1 cup"
        },
        {
          "name": "Sugar",
          "quantity": "1/2 cup"
        }
      ],
      "notes": [
        "You can add vanilla extract for extra flavor."
      ],
      "nutrition": {
        "calories": "200 kcal",
        "fat": "5 g",
        "carbohydrates": "35 g",
        "protein": "3 g"
      }
    },
    "2X": {
      "preparationTime": "1200",
      "cookTime": "2100",
      "totalTime": "3300",
      "yield": "8",
      "ingredients": [
        {
          "name": "Flour",
          "quantity": "2 cups"
        },
        {
          "name": "Sugar",
          "quantity": "1 cup"
        }
      ],
      "notes": [
        "You can add vanilla extract for extra flavor."
      ],
      "nutrition": {
        "calories": "400 kcal",
        "fat": "10 g",
        "carbohydrates": "70 g",
        "protein": "6 g"
      }
    }
  },
  "seo": {
    "metaDescription": "Learn how to make a delicious homemade pizza from scratch with this easy-to-follow recipe.",
    "ogTitle": "How to Create the Perfect Homemade Pizza",
    "ogDescription": "Follow this step-by-step guide to make a perfect pizza at home, from kneading the dough to adding your favorite toppings.",
    "primaryKeywords": [
      "easy pizza"
    ],
    "secondaryKeywords": [
      "pizza from scratch", "making pizza", "best homemade pizza"
  }
}`;
    const schema = {
      description:
        "Schema for a food blog website with SEO, author information, and recipe details",
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
        equipments: {
          type: SchemaType.ARRAY,
          description: "Array of equipment names required for the recipe",
          items: {
            type: SchemaType.STRING,
          },
          nullable: false,
        },
        faq: {
          type: SchemaType.ARRAY,
          description:
            "Array of frequently asked questions about the recipe about 4-6",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              question: {
                type: SchemaType.STRING,
                description: "The FAQ question",
                nullable: false,
              },
              answer: {
                type: SchemaType.STRING,
                description: "The answer to the FAQ question",
                nullable: false,
              },
            },
            required: ["question", "answer"],
          },
          nullable: false,
        },
        recipeDescription: {
          type: SchemaType.OBJECT,
          description:
            "Description of the recipe, including a short summary and detailed blog content",
          properties: {
            shortDescription: {
              type: SchemaType.STRING,
              description: "Short keyword rich summary of the recipe",
              nullable: false,
            },
            detailedDescription: {
              type: SchemaType.ARRAY,
              description:
                "Detailed blog content of the recipe, stored in chunks with corresponding image queries",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  description: {
                    type: SchemaType.STRING,
                    description: "A chunk of the detailed blog content",
                    nullable: false,
                  },
                  imageQuery: {
                    type: SchemaType.STRING,
                    description:
                      "Query for the image corresponding to this chunk",
                    nullable: false,
                  },
                },
                required: ["description", "imageQuery"],
              },
              nullable: false,
            },
          },
          required: ["shortDescription", "detailedDescription"],
          nullable: false,
        },
        instructions: {
          type: SchemaType.ARRAY,
          description: "Step-by-step instructions for the recipe",
          items: {
            type: SchemaType.STRING,
          },
          nullable: false,
        },
        recipeDetails: {
          type: SchemaType.OBJECT,
          description: "Recipe details for different serving sizes",
          properties: {
            "1X": {
              type: SchemaType.OBJECT,
              description: "Recipe details for 1X serving size",
              properties: {
                preparationTime: {
                  type: SchemaType.STRING,
                  description: "Time required for preparation in seconds",
                  nullable: false,
                },
                cookTime: {
                  type: SchemaType.STRING,
                  description: "Time required for cooking in seconds",
                  nullable: false,
                },
                totalTime: {
                  type: SchemaType.STRING,
                  description: "Total time required in seconds",
                  nullable: false,
                },
                yield: {
                  type: SchemaType.STRING,
                  description: "Yield of the recipe (e.g., '4')",
                  nullable: false,
                },
                ingredients: {
                  type: SchemaType.ARRAY,
                  description: "List of ingredients for 1X serving size",
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: {
                        type: SchemaType.STRING,
                        description: "Name of the ingredient",
                        nullable: false,
                      },
                      quantity: {
                        type: SchemaType.STRING,
                        description: "Quantity of the ingredient",
                        nullable: false,
                      },
                    },
                    required: ["name", "quantity"],
                  },
                  nullable: false,
                },
                notes: {
                  type: SchemaType.ARRAY,
                  description: "Additional notes or tips for 1X serving size",
                  items: {
                    type: SchemaType.STRING,
                  },
                  nullable: true,
                },
                nutrition: {
                  type: SchemaType.OBJECT,
                  description: "Nutritional information for 1X serving size",
                  properties: {
                    calories: {
                      type: SchemaType.STRING,
                      description: "Total energy per serving",
                      nullable: false,
                    },
                    carbohydrates: {
                      type: SchemaType.STRING,
                      description: "Total carbs per serving",
                      nullable: false,
                    },
                    protein: {
                      type: SchemaType.STRING,
                      description: "Total protein per serving",
                      nullable: false,
                    },
                    fat: {
                      type: SchemaType.STRING,
                      description: "Total fat per serving",
                      nullable: false,
                    },
                    calcium: {
                      type: SchemaType.STRING,
                      description: "Total calcium per serving",
                      nullable: false,
                    },
                    fiber: {
                      type: SchemaType.STRING,
                      description: "Total fiber per serving",
                      nullable: false,
                    },
                  },
                  required: [
                    "calories",
                    "carbohydrates",
                    "protein",
                    "fat",
                    "calcium",
                    "fiber",
                  ],
                  nullable: false,
                },
              },
              required: [
                "preparationTime",
                "cookTime",
                "totalTime",
                "yield",
                "ingredients",
                "nutrition",
                "notes",
              ],
            },
            "2X": {
              type: SchemaType.OBJECT,
              description: "Recipe details for 2X serving size",
              properties: {
                preparationTime: {
                  type: SchemaType.STRING,
                  description: "Time required for preparation in seconds",
                  nullable: false,
                },
                cookTime: {
                  type: SchemaType.STRING,
                  description: "Time required for cooking in seconds",
                  nullable: false,
                },
                totalTime: {
                  type: SchemaType.STRING,
                  description: "Total time required in seconds",
                  nullable: false,
                },
                yield: {
                  type: SchemaType.STRING,
                  description: "Yield of the recipe (e.g., '8')",
                  nullable: false,
                },
                ingredients: {
                  type: SchemaType.ARRAY,
                  description: "List of ingredients for 2X serving size",
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: {
                        type: SchemaType.STRING,
                        description: "Name of the ingredient",
                        nullable: false,
                      },
                      quantity: {
                        type: SchemaType.STRING,
                        description: "Quantity of the ingredient",
                        nullable: false,
                      },
                    },
                    required: ["name", "quantity"],
                  },
                  nullable: false,
                },
                notes: {
                  type: SchemaType.ARRAY,
                  description: "Additional notes or tips for 2X serving size",
                  items: {
                    type: SchemaType.STRING,
                  },
                  nullable: true,
                },
                nutrition: {
                  type: SchemaType.OBJECT,
                  description: "Nutritional information for 2X serving size",
                  properties: {
                    calories: {
                      type: SchemaType.STRING,
                      description: "Total energy per serving",
                      nullable: false,
                    },
                    carbohydrates: {
                      type: SchemaType.STRING,
                      description: "Total carbs per serving",
                      nullable: false,
                    },
                    protein: {
                      type: SchemaType.STRING,
                      description: "Total protein per serving",
                      nullable: false,
                    },
                    fat: {
                      type: SchemaType.STRING,
                      description: "Total fat per serving",
                      nullable: false,
                    },
                    calcium: {
                      type: SchemaType.STRING,
                      description: "Total calcium per serving",
                      nullable: false,
                    },
                    fiber: {
                      type: SchemaType.STRING,
                      description: "Total fiber per serving",
                      nullable: false,
                    },
                  },
                  required: [
                    "calories",
                    "carbohydrates",
                    "protein",
                    "fat",
                    "calcium",
                    "fiber",
                  ],
                  nullable: false,
                },
              },
              required: [
                "preparationTime",
                "cookTime",
                "totalTime",
                "yield",
                "ingredients",
                "nutrition",
                "notes",
              ],
            },
            "3X": {
              type: SchemaType.OBJECT,
              description: "Recipe details for 3X serving size",
              properties: {
                preparationTime: {
                  type: SchemaType.STRING,
                  description: "Time required for preparation in seconds",
                  nullable: false,
                },
                cookTime: {
                  type: SchemaType.STRING,
                  description: "Time required for cooking in seconds",
                  nullable: false,
                },
                totalTime: {
                  type: SchemaType.STRING,
                  description: "Total time required in seconds",
                  nullable: false,
                },
                yield: {
                  type: SchemaType.STRING,
                  description: "Yield of the recipe (e.g., '12')",
                  nullable: false,
                },
                ingredients: {
                  type: SchemaType.ARRAY,
                  description: "List of ingredients for 3X serving size",
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: {
                        type: SchemaType.STRING,
                        description: "Name of the ingredient",
                        nullable: false,
                      },
                      quantity: {
                        type: SchemaType.STRING,
                        description: "Quantity of the ingredient",
                        nullable: false,
                      },
                    },
                    required: ["name", "quantity"],
                  },
                  nullable: false,
                },
                notes: {
                  type: SchemaType.ARRAY,
                  description: "Additional notes or tips for 3X serving size",
                  items: {
                    type: SchemaType.STRING,
                  },
                  nullable: true,
                },
                nutrition: {
                  type: SchemaType.OBJECT,
                  description: "Nutritional information for 3X serving size",
                  properties: {
                    calories: {
                      type: SchemaType.STRING,
                      description: "Total energy per serving",
                      nullable: false,
                    },
                    carbohydrates: {
                      type: SchemaType.STRING,
                      description: "Total carbs per serving",
                      nullable: false,
                    },
                    protein: {
                      type: SchemaType.STRING,
                      description: "Total protein per serving",
                      nullable: false,
                    },
                    fat: {
                      type: SchemaType.STRING,
                      description: "Total fat per serving",
                      nullable: false,
                    },
                    calcium: {
                      type: SchemaType.STRING,
                      description: "Total calcium per serving",
                      nullable: false,
                    },
                    fiber: {
                      type: SchemaType.STRING,
                      description: "Total fiber per serving",
                      nullable: false,
                    },
                  },
                  required: [
                    "calories",
                    "carbohydrates",
                    "protein",
                    "fat",
                    "calcium",
                    "fiber",
                  ],
                  nullable: false,
                },
              },
              required: [
                "preparationTime",
                "cookTime",
                "totalTime",
                "yield",
                "ingredients",
                "nutrition",
                "notes",
              ],
            },
            "4X": {
              type: SchemaType.OBJECT,
              description: "Recipe details for 4X serving size",
              properties: {
                preparationTime: {
                  type: SchemaType.STRING,
                  description: "Time required for preparation in seconds",
                  nullable: false,
                },
                cookTime: {
                  type: SchemaType.STRING,
                  description: "Time required for cooking in seconds",
                  nullable: false,
                },
                totalTime: {
                  type: SchemaType.STRING,
                  description: "Total time required in seconds",
                  nullable: false,
                },
                yield: {
                  type: SchemaType.STRING,
                  description: "Yield of the recipe (e.g., '16')",
                  nullable: false,
                },
                ingredients: {
                  type: SchemaType.ARRAY,
                  description: "List of ingredients for 4X serving size",
                  items: {
                    type: SchemaType.OBJECT,
                    properties: {
                      name: {
                        type: SchemaType.STRING,
                        description: "Name of the ingredient",
                        nullable: false,
                      },
                      quantity: {
                        type: SchemaType.STRING,
                        description: "Quantity of the ingredient",
                        nullable: false,
                      },
                    },
                    required: ["name", "quantity"],
                  },
                  nullable: false,
                },
                notes: {
                  type: SchemaType.ARRAY,
                  description: "Additional notes or tips for 4X serving size",
                  items: {
                    type: SchemaType.STRING,
                  },
                  nullable: true,
                },
                nutrition: {
                  type: SchemaType.OBJECT,
                  description: "Nutritional information for 4X serving size",
                  properties: {
                    calories: {
                      type: SchemaType.STRING,
                      description: "Total energy per serving",
                      nullable: false,
                    },
                    carbohydrates: {
                      type: SchemaType.STRING,
                      description: "Total carbs per serving",
                      nullable: false,
                    },
                    protein: {
                      type: SchemaType.STRING,
                      description: "Total protein per serving",
                      nullable: false,
                    },
                    fat: {
                      type: SchemaType.STRING,
                      description: "Total fat per serving",
                      nullable: false,
                    },
                    calcium: {
                      type: SchemaType.STRING,
                      description: "Total calcium per serving",
                      nullable: false,
                    },
                    fiber: {
                      type: SchemaType.STRING,
                      description: "Total fiber per serving",
                      nullable: false,
                    },
                  },
                  required: [
                    "calories",
                    "carbohydrates",
                    "protein",
                    "fat",
                    "calcium",
                    "fiber",
                  ],
                  nullable: false,
                },
              },
              required: [
                "preparationTime",
                "cookTime",
                "totalTime",
                "yield",
                "ingredients",
                "nutrition",
                "notes",
              ],
            },
          },
          required: ["1X", "2X", "3X", "4X"],
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
      },
      required: [
        "author",
        "quote",
        "pageTitle",
        "imageQuery",
        "recipeDescription",
        "instructions",
        "recipeDetails",
        "seo",
        "equipments",
        "faq",
      ],
    };

    const model2 = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
    // console.log(title, section, subSection, subSubSection);
    return data1;
  } catch (error) {
    console.log(`error message`, error);
    return error;
  }
}
