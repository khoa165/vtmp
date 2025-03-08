module.exports = [
  {
    name: 'Blog Post',
    templatePath: 'cookiecutter/templates/BLOG_TEMPLATE.md',
    outputPath: 'web-client/src/blogs/content/vtmp-2025/',
    fields: [
      {
        templateVariable: 'BLOG_TITLE',
        question: "What is the blog post's name?",
      },
      {
        templateVariable: 'YYYY_MM_DD',
        question: "What is the blog post's date in YYYY-MM-DD format?",
      },
    ],
  },
];
