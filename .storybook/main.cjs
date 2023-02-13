module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    {
      "name": "@storybook/addon-docs",
      "options": {
        "transcludeMarkdown": true
      },
    },
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-css-modules",
    "@a110/storybook-expand-all",
  ],
  "staticDirs": ['../static'],
  "framework": "@storybook/react",
}
