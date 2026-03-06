import { IFooter } from "@/types";

export const footerData: IFooter[] = [
    {
        title: "Event",
        links: [
            { name: "Home", href: "#" },
            { name: "About", href: "#features" },
            { name: "Tickets", href: "#pricing" },
            { name: "Contact", href: "#contact" },
        ]
    },
    {
        title: "Info",
        links: [
            { name: "Artists", href: "#artists" },
            { name: "Venue", href: "#venue" },
            { name: "Schedule", href: "#schedule" },
            { name: "FAQ", href: "#faq" },
            { name: "Pay", href: "#pay" },
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy", href: "#privacy" },
            { name: "Terms", href: "#terms" },
        ]
    }
];