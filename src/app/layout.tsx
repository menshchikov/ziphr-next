import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from "@/app/utils/providers/reactQueryProvider";
import {Menu} from "@/components/Menu";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ReactQueryProvider>
            <div className="flex flex-col sm:flex-row">
                {/*{children}*/}
                <div id='navbar' className={'w-full shrink-0 sm:w-[200px] p-1 bg-gray-100'}>
                    <Menu></Menu>
                </div>
                <div className={'max-sm:w-full flex-grow'}>
                    {children}
                </div>
            </div>
        </ReactQueryProvider>
        </body>
        </html>
    );

    // return (
    //     <div className="flex flex-col sm:flex-row">
    //       <div id='navbar' className={'w-full shrink-0 sm:w-[200px] p-1 bg-gray-100'}>
    //         <Menu></Menu>
    //       </div>
    //       <div className={'max-sm:w-full flex-grow'}>
    //         {/*<Outlet></Outlet>*/}
    //         {children}
    //       </div>
    //     </div>
    // );
}
