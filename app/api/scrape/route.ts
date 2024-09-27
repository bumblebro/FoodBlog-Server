import { NextRequest } from "next/server";
// import gis from "g-i-s";
import gis from "async-g-i-s";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // try {
  //   const results = await new Promise((resolve, reject) => {
  //     gis("cat", (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(results);
  //       }
  //     });
  //   });
  //   console.log(results);
  //   return Response.json({ result: results[1] });
  // } catch (e) {
  //   console.log(e);
  //   return Response.json({ e });
  // }

  try {
    const results = await gis(body.query, {
      query: { safe: "on" },
    });
    console.log(results.slice(0, 10));

    const url = results.find((item) => item.url.startsWith("https:"));

    return Response.json({ results: url });
  } catch (e) {
    console.error(e);
    return Response.json({ e });
  }
}
