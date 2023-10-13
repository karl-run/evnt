import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const subDomain = getSubdomain(req.headers.host ?? "");

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  return res.send(html`
    <!doctype html>
    <html lang="en">
      <head>
        <title>${getStatement(subDomain)}</title>
        <meta charset="utf-8" />
        <meta name="description" content="eventuelt, kort fortalt" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="https://karl.run/favicon.ico" />
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

          .bold {
            font-weight: bold;
            font-size: 1.2rem;
          }
        </style>
      </head>
      <body>
        <h1>eventuelt, kort fortalt:</h1>
        <a
          href="https://ev.karl.run"
          class="${subDomain === "ev" ? "bold" : ""}"
        >
          <span class="green">✓</span> ev. - eventuelt
        </a>
        <a
          href="https://evt.karl.run"
          class="${subDomain === "evt" ? "bold" : ""}"
        >
          <span class="red">✗</span> evt. - etter vår tidsregning
        </a>
        <a
          href="https://evnt.karl.run"
          class="${subDomain === "evnt" ? "bold" : ""}"
        >
          <span class="red">✗</span> evnt. - ???
        </a>
        <a
          href="https://eventuelt.karl.run"
          class="${subDomain === "eventuelt" ? "bold" : ""}"
        >
          <span class="green">✓</span> eventuelt - ev. bare skriv hele ordet :)
        </a>
      </body>
    </html>
  `);
}

function getStatement(type: ReturnType<typeof getSubdomain>): string {
  switch (type) {
    case "ev":
      return 'ev. er forkortelse for "eventuelt"';
    case "evt":
      return 'evt. er forkortelse for "etter vår tidsregning"';
    case "evnt":
      return "evnt. er ikke en forkortelse";
    case "eventuelt":
      return "eventuelt er fint å skrive :)";
  }
}

function getSubdomain(host: string): "ev" | "evt" | "evnt" | "eventuelt" {
  if (!host || host.includes("localhost")) return "evt";
  else if (host.includes("ev.")) return "ev";
  else if (host.includes("evt.")) return "evt";
  else if (host.includes("evnt.")) return "evnt";
  else if (host.includes("eventuelt.")) return "eventuelt";
  else return "evnt";
}

function html(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
