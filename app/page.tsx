import Link from "next/link";

function page() {
  return (
    <div className="flex justify-center gap-4 mt-48 text-2xl">
      <Link href={"/upload"}>Upload</Link>
      <Link href={"/upload2"}>Upload2</Link>
      <Link href={"/upload3"}>Upload3</Link>
      <Link href={"/test"}>Test</Link>
      <Link href={"/imagetest"}>imagetest</Link>
    </div>
  );
}

export default page;
