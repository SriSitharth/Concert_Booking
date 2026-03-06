import { IPricing } from "@/types";

export const pricingData: IPricing[] = [
    {
        name: "General",
        price: 999,
        period: "ticket",
        features: [
            "General admission entry",
            "Standing area access",
            "Food court access",
            "Concert merchandise discount",
            "Digital concert program"
        ],
        mostPopular: false
    },
    {
        name: "VIP",
        price: 2999,
        period: "ticket",
        features: [
            "Premium seating",
            "Exclusive VIP lounge access",
            "Complimentary refreshments",
            "Meet & greet opportunity",
            "Signed merchandise",
            "Priority parking",
            "Photo with artists"
        ],
        mostPopular: true
    },
    {
        name: "Platinum",
        price: 4999,
        period: "ticket",
        features: [
            "Front row seating",
            "Backstage tour",
            "Private dining experience",
            "Exclusive after-party access",
            "Limited edition collectibles"
        ],
        mostPopular: false
    }
];