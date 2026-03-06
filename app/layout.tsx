import { Poppins } from "next/font/google";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ width: '100%', minHeight: '100%' }}>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preload" href="/assets/background-splash.svg" as="image" />
            </head>
            <body style={{ width: '100%', minHeight: '100%' }}>
                <LenisScroll />
                {children}
            </body>
        </html>
    );
}