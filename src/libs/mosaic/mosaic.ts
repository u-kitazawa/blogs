export const getMosaicSnippets = (posts: any[], totalCount: number = 20) => {
  const allSnippets: string[] = [];
  const chunkSize = 500;

  const specials = ["BLOG", "ABOUT"];

  while (allSnippets.length < totalCount) {
    for (const post of posts) {
      if (allSnippets.length >= totalCount) break;

      const body =
        post.body
          ?.replace(/<[^>]*>/g, "")
          .replace(/[|:>=`~*_^\[()\]#-]/g, " ") || "";

      if (body.length >= chunkSize) {
        const start = Math.floor(Math.random() * (body.length - chunkSize));
        allSnippets.push(body.substring(start, start + chunkSize));
      }
    }

    if (posts.length === 0) break;
  }

  if (allSnippets.length >= 2) {
    const pos1 = Math.floor(Math.random() * (allSnippets.length - 1));
    const pos2 = Math.floor(Math.random() * (allSnippets.length - 1));

    allSnippets[pos1] = specials[0];
    allSnippets[pos2] = specials[1];
  }

  return allSnippets;
};
