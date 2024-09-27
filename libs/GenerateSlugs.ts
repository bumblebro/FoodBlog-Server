import { subSections } from "./Section";

export default async function GenerateSlugs(
  section: any,
  currentSlug: string[] = [],
  result: object[] = []
) {
  for (const key in section) {
    const newSlug = [...currentSlug, key.toLowerCase()];
    result.push({ slug: newSlug });

    if (typeof section[key] === "object" && !Array.isArray(section[key])) {
      GenerateSlugs(section[key], newSlug, result);
    } else if (Array.isArray(section[key])) {
      section[key].forEach((item) => {
        result.push({ slug: [...newSlug, item.toLowerCase()] });
      });
    }
  }
  return result;
}
