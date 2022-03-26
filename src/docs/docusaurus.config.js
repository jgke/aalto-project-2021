// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
/* eslint-disable @typescript-eslint/no-var-requires*/
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'My Site',
    tagline: 'Dinosaurs are cool',
    url: 'https://your-docusaurus-test-site.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'facebook', // Usually your GitHub org/user name.
    projectName: 'docusaurus', // Usually your repo name.

    presets: [
        [
            "docusaurus-preset-openapi",
            /** @type {import('docusaurus-preset-openapi').Options} */
            ({
                api: {
                    path: "./openapi.json",
                    routeBasePath: "petstore",
                },
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    editUrl:
                        "https://github.com/cloud-annotations/docusaurus-openapi/edit/main/demo/",
                },
                blog: false,
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
                proxy: {
                    "/proxy": {
                        target: "http://localhost:8091",
                        pathRewrite: { "^/proxy": "" },
                    },
                },
            }),
        ],
    ],

    plugins: [
        [
            'docusaurus-plugin-openapi',
            {
                id: 'cos',
                path: './openapi.json',
            }
        ]
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Info',
                logo: {
                    alt: 'My Site Logo',
                    src: 'img/logo.svg',
                },
                items: [
                    {
                        to: '/help',
                        label: 'Help',
                        position: 'left'
                    },
                    {
                        to: '/api',
                        label: 'Api Documentation',
                        position: 'left'
                    },
                    {
                        to: '/internal',
                        label: 'Internal Documentation',
                        position: 'left'
                    }
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Useful links',
                        items: [
                            {
                                label: 'The app',
                                href: 'https://aalto-project.herokuapp.com/',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Bytecraft. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
