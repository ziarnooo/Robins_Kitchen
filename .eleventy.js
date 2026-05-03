module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addWatchTarget("images");

  // Date display filters
  eleventyConfig.addFilter("dateDay", (d) =>
    new Date(d).getUTCDate().toString().padStart(2, "0")
  );
  eleventyConfig.addFilter("dateMonth", (d) =>
    new Date(d).toLocaleString("en-US", { month: "short", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("dateFull", (d) =>
    new Date(d).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  );

  // Collection filters
  eleventyConfig.addFilter("futureOnly", (arr) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return arr.filter(item => new Date(item.data.date) >= now);
  });
  eleventyConfig.addFilter("byDateAsc", (arr) =>
    [...arr].sort((a, b) => new Date(a.data.date) - new Date(b.data.date))
  );
  eleventyConfig.addFilter("byDateDesc", (arr) =>
    [...arr].sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  );
  eleventyConfig.addFilter("publishedOnly", (arr) =>
    arr.filter(item => item.data.published === true)
  );
  eleventyConfig.addFilter("inCatalog", (arr) =>
    arr.filter(item => item.data.active !== false && item.data.show_in_catalog !== false)
  );
  eleventyConfig.addFilter("byNumberAsc", (arr) =>
    [...arr].sort((a, b) => (a.data.number || 99) - (b.data.number || 99))
  );
  // Limit array to first N items (Nunjucks slice() works differently — use this instead)
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Put notes with featured:true first, rest in original order
  eleventyConfig.addFilter("featuredFirst", (arr) => {
    const featured = arr.filter(item => item.data.featured);
    const rest = arr.filter(item => !item.data.featured);
    return [...featured, ...rest];
  });

  // Collections
  eleventyConfig.addCollection("classes", api =>
    api.getFilteredByGlob("content/classes/*.md")
  );
  eleventyConfig.addCollection("upcoming", api =>
    api.getFilteredByGlob("content/upcoming/*.md")
  );
  eleventyConfig.addCollection("notes", api =>
    api.getFilteredByGlob("content/notes/*.md")
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk"
  };
};
