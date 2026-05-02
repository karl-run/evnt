const STATEMENTS = {
  ev: 'ev. er forkortelse for "eventuelt"',
  evt: 'evt. er forkortelse for "etter vår tidsregning"',
  evnt: 'evnt. er ikke en forkortelse',
  eventuelt: 'eventuelt er fint å skrive :)',
} as const

const LINKS = [
  {
    subdomain: 'ev',
    href: 'https://ev.karl.run',
    symbol: '✓',
    toneClass: 'green',
    label: 'ev. - eventuelt',
  },
  {
    subdomain: 'evt',
    href: 'https://evt.karl.run',
    symbol: '✗',
    toneClass: 'red',
    label: 'evt. - etter vår tidsregning',
  },
  {
    subdomain: 'evnt',
    href: 'https://evnt.karl.run',
    symbol: '✗',
    toneClass: 'red',
    label: 'evnt. - ???',
  },
  {
    subdomain: 'eventuelt',
    href: 'https://eventuelt.karl.run',
    symbol: '✓',
    toneClass: 'green',
    label: 'eventuelt - ev. bare skriv hele ordet :)',
  },
] as const

type Subdomain = keyof typeof STATEMENTS

export default {
  fetch(request: Request): Response {
    const url = new URL(request.url)

    if (url.pathname !== '/') {
      return new Response('Not found', { status: 404 })
    }

    const subdomain = getSubdomain(url.hostname)

    return new Response(renderPage(subdomain), {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
      },
    })
  },
}

function getSubdomain(hostname: string): Subdomain {
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return 'evt'
  }

  const [label = ''] = hostname.split('.')

  switch (label) {
    case 'ev':
    case 'evt':
    case 'evnt':
    case 'eventuelt':
      return label
    default:
      return 'evnt'
  }
}

function renderPage(subdomain: Subdomain): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <title>${STATEMENTS[subdomain]}</title>
    <meta charset="utf-8" />
    <meta name="description" content="eventuelt, kort fortalt" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <style>
      html {
        box-sizing: border-box;
        font-size: 16px;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      ol,
      ul {
        margin: 0;
        padding: 0;
        font-weight: normal;
      }

      ol,
      ul {
        list-style: none;
      }

      img {
        max-width: 100%;
        height: auto;
      }

      html {
        font-family: sans-serif;
        background-color: black;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        height: 100svh;
      }

      body {
        max-width: 600px;
        margin: 0 auto;
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 4px;
      }

      a {
        color: unset;
        display: block;
        text-decoration: none;
        margin-bottom: 2px;
      }

      a:last-of-type {
        margin-top: 8px;
      }

      .green {
        color: green;
      }

      .red {
        color: red;
      }

      .active {
        font-weight: bold;
        font-size: 1.2rem;
      }
    </style>
  </head>
  <body>
    <h1>eventuelt, kort fortalt:</h1>
    ${LINKS.map((link) => renderLink(link, subdomain)).join('')}
  </body>
</html>`
}

function renderLink(link: (typeof LINKS)[number], activeSubdomain: Subdomain): string {
  const activeClass = link.subdomain === activeSubdomain ? 'active' : ''

  return `<a href="${link.href}" class="${activeClass}">
      <span class="${link.toneClass}">${link.symbol}</span> ${link.label}
    </a>`
}
