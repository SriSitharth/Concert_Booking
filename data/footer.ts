import { IFooter } from "@/types";

export const footerData: IFooter[] = [
    {
        title: "Event",
        links: [
            { name: "Home", href: "#" },
            { name: "About", href: "#features" },
            { name: "Seat", href: "#seat" },
            { name: "Pricing", href: "#pricing" },
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
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Refunds & Cancellations", href: "/refunds" },
        ]
    }
];