import {
  SchemaType,
  GoogleGenerativeAI,
  ResponseSchema,
} from "@google/generative-ai";

export default async function HUMANIZE(text: string) {
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

  try {
    // const body = await req.json();
    console.log("Start");
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts

    // For Example:
    // Initial text:  ## The Best Pasta For a Family Dinner (That Everyone Will Love!) You know that feeling, right? The one where you're staring into the abyss of your fridge, wondering what to make for dinner. It's a common dilemma, but one that can be especially tricky when you're trying to feed a family. You want something that's easy to make, delicious to eat, and that everyone will actually enjoy. Don't worry, my fellow food-loving friends, I've got you covered! For me, pasta is always a go-to for a weeknight meal. It's versatile, budget-friendly, and there's just something comforting about a big pot of steaming noodles. Plus, you can easily customize it to suit everyone's tastebuds. But with so many options, it can be hard to know which pasta to choose. I've tried (and devoured) tons of different types of pasta over the years, and I've learned a few things along the way. To help you choose the perfect pasta for your next family dinner, I'm sharing some of my favorites. Let's dive in!

    // converted to : ##The Best Pasta for Family Dinner That Everyone Loves! You know that feeling, right? Like you're staring into the abyss of your fridge-like, what am I going to make for dinner? It's a common dilemma, yet one that can be most trickily pulled off when you're trying to feed a family. You want something that's easy to make, delicious to eat, and that everyone will actually enjoy. No problem, foodie friends! For me, pasta is always a go-to when it comes to a weeknight meal. It's versatile, affordable, and there's just something so satisfying about a big pot of steaming noodles. Plus, it's super easy to make for a crowd, since everyone has different tastes. But with so many options, it's hard to know which pasta to choose. I have tried-and consumed-torrents of different kinds of pasta over the years, and along the way, I learned a thing or two. Some of my top favorites that should make it easy for you to choose the right pasta for your next family dinner are the following: Let's dive in!
    const prompt = `
    Try to sound like a human writer, writing for a blog, writing in the first person giving advice. Try to sound unique and write in an unpredictable fashion that doesn't sound like GPT3. Based on the above, convert : ${text}`;
    //       const prompt = `
    //  Hey ChatGPT, regarding generating writing content, two factors are crucial to be in the highest degree, "perplexity" and "burstiness." Perplexity measures the complexity of the text. Separately, burstiness compares the variations of sentences. Humans tend to write with greater burstiness, for example, with some longer or more complex sentences alongside shorter ones. Al sentences tend to be more uniform. Therefore, generated text content must have the highest degree of perplexity and the highest degree of burstiness. The other two factors are that writing should be maximum contextually relevant and maximum coherent. Based on the above, convert this: ${text}`;

    const schema: ResponseSchema = {
      description: "Converted text",
      type: SchemaType.STRING,
    };

    const model3 = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const result = await model3.generateContent(prompt);
    const response1 = await result.response;
    // console.log(response);
    const data1 = response1.text();
    return data1;
  } catch (error) {
    return error;
  }
}
