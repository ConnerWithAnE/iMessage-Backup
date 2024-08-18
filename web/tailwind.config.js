/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                logoPurple: "#8C6FF0",
                appleChatBubble: "#3B82F6",
                androidChatBubble: "#22C55E",
                recieveChatBubble: "#E5E7EB",
            },
        },
    },
    plugins: [],
};
