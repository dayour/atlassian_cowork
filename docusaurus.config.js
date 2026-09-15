const config = {
  title: 'Atlassian Rovo MCP for Cowork',
  tagline: 'A reproducible investigation of DCR authentication in Microsoft 365 Copilot Cowork',
  url: 'https://dayour.github.io',
  baseUrl: '/atlassian_cowork/',
  organizationName: 'dayour',
  projectName: 'atlassian_cowork',
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: { onBrokenMarkdownLinks: 'warn' }
  },
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/dayour/atlassian_cowork/edit/main/'
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ],
  themeConfig: {
    colorMode: { defaultMode: 'light', respectPrefersColorScheme: true },
    mermaid: {
      theme: { light: 'base', dark: 'base' },
      options: {
        themeVariables: {
          fontFamily: 'Calibri, Trebuchet MS, sans-serif',
          primaryColor: '#e0fbfc',
          primaryTextColor: '#0d1b2a',
          primaryBorderColor: '#0077b6',
          lineColor: '#0077b6',
          secondaryColor: '#f0e6ff',
          tertiaryColor: '#f8fffe',
          clusterBkg: '#f0e6ff',
          clusterBorder: '#7b2ff7',
          actorBkg: '#e0fbfc',
          actorBorder: '#0077b6',
          actorTextColor: '#0d1b2a',
          signalColor: '#415a77',
          signalTextColor: '#0d1b2a',
          noteBkgColor: '#f0e6ff',
          noteTextColor: '#0d1b2a'
        }
      }
    },
    navbar: {
      title: 'Atlassian Cowork',
      items: [
        { to: '/', label: 'Investigation', position: 'left' },
        { to: '/reproduction/overview', label: 'Reproduce', position: 'left' },
        { to: '/reference/plugin-package', label: 'Reference', position: 'left' },
        { href: 'https://github.com/dayour/atlassian_cowork', label: 'GitHub', position: 'right' }
      ]
    },
    footer: {
      style: 'dark',
      copyright: 'Independent interoperability reproduction. Microsoft, Atlassian, Jira, and Rovo are trademarks of their respective owners.'
    }
  }
};

module.exports = config;