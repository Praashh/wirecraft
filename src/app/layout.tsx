import "~/app/globals.css";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
});


import { type Metadata } from "next";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./providers";

const SITE_URL = process.env.NEXTAUTH_URL!;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wirecraft | The open hardware workbench for Arduino, ESP32 & Pico",
    template: "%s | Wirecraft",
  },
  description:
    "Describe the gadget you want to build and get firmware, a wiring diagram, a parts list and step-by-step assembly instructions — in minutes.",
  keywords: [
    "Arduino",
    "ESP32",
    "Raspberry Pi Pico",
    "hardware",
    "wiring diagram",
    "firmware generator",
    "open source",
    "IoT",
    "electronics",
    "PlatformIO",
    "breadboard",
    "maker",
  ],
  authors: [{ name: "Wirecraft" }],
  creator: "Wirecraft",
  publisher: "Wirecraft",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Wirecraft",
    title: "Wirecraft | The open hardware workbench for Arduino, ESP32 & Pico",
    description:
      "Describe a gadget and get firmware, wiring, a parts list and assembly steps — in minutes. Open-source, self-hostable, no cloud required.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Wirecraft — The open hardware workbench for Arduino, ESP32 & Pico",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wirecraft | The open hardware workbench for Arduino, ESP32 & Pico",
    description:
      "Describe a gadget and get firmware, wiring, a parts list and assembly steps — in minutes.",
    images: ["/og.png"],
    creator: "@wirecraft",
  },
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
  ],
  other: {
    "theme-color": "#17191E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
