function DeSlugify(text: string): string {
  return text.replace(/-/g, " ");
}

export default DeSlugify;
