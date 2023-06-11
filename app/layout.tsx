/* eslint-disable @next/next/no-page-custom-font */
import "./styles/globals.scss";
import "./styles/markdown.scss";
import "./styles/highlight.scss";
import { getBuildConfig } from "./config/build";

const buildConfig = getBuildConfig();

export const metadata = {
  title: "AI.chat - 国内直接使用的Gpt",
  description:
    "国内能轻松使用的chatgpt网站，官方接口，可联系上下文像真人一样沟通交流，可作为你工作上的私人助理，生活上的私人管家。",
  appleWebApp: {
    title: "AI.chat - 国内直接使用的Gpt",
    statusBarStyle: "default",
  },
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta
          name="theme-color"
          content="#151515"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="version" content={buildConfig.commitId} />
        <link rel="manifest" href="/site.webmanifest"></link>
        {/* <link rel="preconnect" href="https://fonts.proxy.ustclug.org"></link> */}
        {/* <link
          href="https://fonts.proxy.ustclug.org/css2?family=Noto+Sans+SC:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        ></link> */}
        <script src="/serviceWorkerRegister.js" defer></script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-11170461037"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-11170461037');
              `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
