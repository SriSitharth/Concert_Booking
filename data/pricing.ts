import { IPricing } from "@/types";

export const pricingData: IPricing[] = [
    {
        name: "General",
        price: 600,
        period: "ticket",
        features: [
            "General admission entry",
            "Seating access",
            "Food court access",
            "Digital concert program"
        ],
        mostPopular: false,
        color: "white"
    },
    {
        name: "Premium",
        price: 1100,
        period: "ticket",
        features: [
            "Premium seating",
            "Priority entry",
            "Food court access",
            "Vicky performance access",
            "Digital concert program"
        ],
        mostPopular: false,
        color: "navi-blue"
    },
    {
        name: "VIP",
        price: 2000,
        period: "ticket",
        features: [
            "Front row seating",
            "Exclusive VIP lounge access",
            "Food court access",
            "Meet & greet opportunity",
            "Priority parking",
            "Close look with artists"
        ],
        mostPopular: true,
        color: "dark-pink"
    }
];