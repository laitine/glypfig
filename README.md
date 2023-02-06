# Glypfig

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/Glypfig)

The icon library workflow for Figma.

![Glypfig icon library creator](header.png)

Gets your existing icons from Figma and outputs them ready for production. Currently supported export formats include JPG, PNG, SVG, PDF or React. Can also optimize image assets and build UI components according to template.

## Prerequisites

* [NodeJS](https://nodejs.org/) installed
* [Figma](https://www.figma.com/) project with a page that has a frame with icon components
* Figma API key – Generate new personal access token at Settings -> Account -> Personal access tokens
* File key – Your file with the icon components e.g. figma.com/file/<figma-file-key>/Glypfig
* Node ID – Your frame's URL encoded node ID e.g. figma.com/...?node-id=0%3A1 (URL decoded to 0:1)

### Figma notes

To exclude a component from the frame to be exported prefix it's name with a dot e.g. ".Title".

For best results always have your icon component's main layer in Figma boxed with equal width and height e.g. 24x24px.

## Get started

1. Install Glypfig from (NPM)[].

    ```shell
    npm install glypfig
    ```

    ```shell
    yarn add glypfig
    ```

2. Run with your preferred configuration.

    ```shell
    glypfig --apikey <figma-api-key> --filekey <figma-file-key> --nodeid <figma-layer-including-icons>
    ```

### configuration

| Parameter        |  Flag       | Value   | Default                   | Options                                           |
| ---------------- | ----------- | ------- | ----------------------------------------------------------------------------- |
| Figma API Key    | apikey, a   | string  | None                      | Figma: Settings/Account/Personal access tokens    |
| File key         | filekey, k  | string  | None                      | figma.com/file/<figma-file-key>/Glypfig           |
| Node ID          | nodeid, n   | string  | None                      | figma.com/...?node-id=0%3A1 URL decoded to 0:1    |
| Output format    | format, f   | string  | png,svg,react             | jpg, png, svg, pdf and react                      |
| Output path      | output, o   | string  | icon-library              | e.g. ./the-path/to/your-icons                     |
| Silent logging   | silent, s   | boolean | false                     | true or false                                     |
| Optimize files   | optimize, p | boolean | false                     | true or false                                     |
| Template format  | template, t | string  | jsx                       | jsx or tsx                                        |
| Template path    | path, h     | string  | ./templates/react-jsx.eta | e.g. ./the-path/to/your-template-tsx.eta          |

## More

[Support](https://www.patreon.com/Glypfig) this project
