# Glypfig

[![NPM](https://img.shields.io/npm/v/glypfig/latest?style=flat-square&logo=npm)](https://www.npmjs.com/package/glypfig)
[![Patreon](https://img.shields.io/badge/Patreon-donate-blue?style=flat-square&logo=patreon)](https://www.patreon.com/Glypfig)
[![Apache 2.0 license](https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)
![E2E tests and deploy](https://github.com/laitine/glypfig/actions/workflows/deploy-storybook.yml/badge.svg)

The icon library workflow for Figma.

![Glypfig icon library creator](https://raw.githubusercontent.com/laitine/glypfig/main/header.png)

Picks up your existing icons from Figma and outputs them ready for production. Currently supported export formats include JPG, PDF, PNG, SVG, CSS and React (with typescript support). Can also optimize image assets and builds UI components according to your custom template.

[Find an example Storybook with all formats here](https://laitine.github.io/glypfig/)🚀

## Prerequisites

* [NodeJS](https://nodejs.org/) installed
* [Figma](https://www.figma.com/) project with a page that has a frame or similar container with icon components
* Figma API key – Generate new personal access token at Settings -> Account -> Personal access tokens
* File key – Your file's (with the icon components) key identifier e.g. figma.com/file/{figma-file-key}/Glypfig
* Node ID – Your frame's [URL decoded](https://www.urldecoder.io/) node ID e.g. figma.com/...?node-id=0%3A1 -> URL decoded to 0:1

### Figma notes

To exclude a component to be exported from the frame prefix it's name with a dot e.g. ".Title". Frames and groups along with their child nodes can also be excluded in the same way.

For best results always have your icon component's main layer in Figma boxed with equal width and height e.g. 24x24px.

### Development notes

It is suggested to run a linter on build components such as [Prettier](https://prettier.io/), [Stylelint](https://stylelint.io/) and code analyser such as [ESLint](https://eslint.org/).

## Get started

1. Install Glypfig from [NPM](https://www.npmjs.com/package/glypfig) with `npm` or `yarn`.

    ```shell
    npm install --save-dev glypfig
    ```

    ```shell
    yarn add --dev glypfig
    ```

2. Run with your preferred configuration. See all the possible options below.

    ```shell
    npx glypfig --apikey <figma-api-key> --filekey <figma-file-key> --nodeid <icon-frame-node-id>
    ```

### Configuration

| Parameter         |  Flag          | Value   | Default                   | Options                                                      |
| ----------------- | -------------- | ------- | ------------------------- | ------------------------------------------------------------ |
| Figma API Key     | apikey, a      | string  | None                      | Figma: Settings/Account/Personal access tokens               |
| File key          | filekey, k     | string  | None                      | e.g. figma.com/file/{figma-file-key}/Glypfig                 |
| Node ID           | nodeid, n      | string  | None                      | figma.com/...?node-id=0%3A1 URL param value decoded to 0:1   |
| Output format     | format, f      | string  | png,svg,react             | jpg, png, svg, pdf, css and react                            |
| Output path       | output, o      | string  | icon-library              | e.g. ./the-path/to/your-icons                                |
| Silent logging    | silent, s      | boolean | false                     | true or false                                                |
| Optimize files    | optimize, p    | boolean | false                     | true or false                                                |
| Template formats  | template, t    | string  | jsx                       | jsx and tsx                                                  |
| CSS template path | csspath, c     | string  | ./templates/css.eta       | e.g. ./the-path/to/your-template-css.eta                     |
| JS template path  | jspath, j      | string  | ./templates/react-jsx.eta | e.g. ./the-path/to/your-template-tsx.eta                     |
| CSS prefix        | cssprefix, r   | string  | icon-                     | e.g. 'glypfig-'                                              |
| JS prefix         | jsprefix, e    | string  | Icon                      | e.g. 'Glypfig'                                               |
| License file      | license, l     | string  | ./templates/LICENSE.txt   | Pass '' for default or e.g. ./the-path/to/your-license-file  |
| JPG image scale   | jpgscale, b    | string  | None                      | Scale of exported image 0.01 - 4                             |
| PNG image scale   | pngscale, d    | string  | None                      | Scale of exported image 0.01 - 4                             |
| Properties filter | filter, i      | string  | None                      | Filter components by properties e.g. 'Size=XS, Color=Blue'   |
| Property naming   | propnames, m   | boolean | None                      | Figma component properties in name e.g. icon-size-large.svg  |
| Help              | help, h        | boolean | None                      | Show help                                                    |

## More

[Support](https://www.patreon.com/Glypfig) this project

[Eta templating engine](https://eta.js.org/)

## Thanks

[Helsinki Design System](https://github.com/City-of-Helsinki/helsinki-design-system)
