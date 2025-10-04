
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About PulseCheck",
    description: "Learn about how PulseCheck ensures anonymous and fair polling.",
};

export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto bg-brand-gray-900 rounded-lg p-6 md:p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-white">About PulseCheck</h1>
            <div className="prose prose-invert prose-p:text-brand-gray-300 prose-headings:text-white prose-a:text-blue-400 max-w-none">
                <p>
                    PulseCheck is a simple, powerful tool for gauging public opinion. We believe in the principle of "one human, one vote." To achieve this in a privacy-preserving way, we use World ID.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-3">How It Works</h2>
                <p>
                    Each day, a new poll is released. Any human verified with World ID can cast a single vote. As soon as you vote, you see the live, aggregate results. Your individual vote is never revealed.
                </p>
                
                <h2 className="text-2xl font-semibold mt-6 mb-3">Privacy and Security</h2>
                <p>
                    Your privacy is paramount. Here's what we do—and more importantly, what we don't do—to protect it:
                </p>
                <ul>
                    <li>
                        <strong>We use World ID's Incognito Actions:</strong> When you vote, World App generates a zero-knowledge proof. This proof confirms you are a unique human without revealing your identity (your World ID, wallet address, etc.).
                    </li>
                    <li>
                        <strong>We only store the `nullifier_hash`:</strong> The only piece of information we receive from the proof is a `nullifier_hash`. This is a unique, anonymous identifier for you for this specific poll. It allows us to prevent duplicate votes in the same poll without knowing who you are. A different `nullifier_hash` is used for each poll, so your votes cannot be linked across different polls.
                    </li>
                    <li>
                        <strong>We never store PII:</strong> We never have access to, nor do we store, any personally identifiable information. No names, no emails, no wallet addresses.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-3">The Goal</h2>
                <p>
                    Our goal is to create a reliable, bot-resistant platform for understanding collective sentiment on a variety of topics. By ensuring every vote comes from a real, unique person, we can provide more accurate and meaningful insights.
                </p>
            </div>
        </div>
    );
}
