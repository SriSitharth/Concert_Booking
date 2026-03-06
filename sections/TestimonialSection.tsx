'use client'
import SectionTitle from "@/components/SectionTitle";
import { motion } from "motion/react";

export default function TestimonialSection() {
    return (
        <div id="pay" className="px-4 md:px-16 lg:px-24 xl:px-32 w-full overflow-hidden">
            <SectionTitle text1="Pay" text2="Quick Payment" text3="Scan the QR code below to make a quick and secure payment for your concert tickets." />

            <motion.div 
                className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="aspect-square relative bg-white p-4 rounded-xl">
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://payments.cashfree.com/forms/tvkcup" 
                        alt="Payment QR Code" 
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="text-center mt-6">
                    <p className="text-slate-800 font-semibold text-lg">Scan to Pay</p>
                    <p className="text-slate-500 text-sm mt-2">Scan with your phone camera to open payment</p>
                </div>
            </motion.div>

            <motion.div 
                className="max-w-2xl mx-auto mt-8 text-center"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <p className="text-slate-400 text-sm">
                    After payment, please send your payment screenshot and ticket details to our WhatsApp or email for confirmation.
                </p>
            </motion.div>
        </div>
    );
}