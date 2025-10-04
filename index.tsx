import React from 'react';
import { createRoot } from 'react-dom/client';

const Instructions = () => {
    return (
        <div className="min-h-screen bg-[#0e0e11] text-[#ececf0] flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-[#1c1c24] rounded-xl shadow-2xl p-8 text-center border border-[#3a3a4a]">
                <h1 className="text-4xl font-bold text-blue-400 mb-4 tracking-tight">PulseCheck Project</h1>
                <p className="text-lg text-gray-300 mb-6">
                    This is a full-stack Next.js 14 application. The preview you are seeing cannot run a Next.js project, which requires a dedicated server.
                </p>
                <div className="text-left bg-[#0e0e11] p-6 rounded-lg border border-[#3a3a4a]">
                    <h2 className="text-2xl font-semibold mb-3 text-white">How to Run This Project Correctly</h2>
                    <p className="text-gray-400 mb-4">
                        To experience the live polling app, please run it in a proper Node.js environment or deploy it to a hosting provider. The complete instructions are in the <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm font-mono">README.md</code> file.
                    </p>
                    <ol className="list-decimal list-inside space-y-3 text-gray-300">
                        <li>
                            <strong>Setup:</strong> Clone the project, install dependencies (<code className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm font-mono">pnpm install</code>), and configure your <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm font-mono">.env.local</code> file with your Worldcoin and Supabase keys.
                        </li>
                        <li>
                            <strong>Run Locally:</strong> Start the development server with <code className="bg-gray-700 text-gray-200 px-2 py-1 rounded-md text-sm font-mono">pnpm dev</code> and visit <a href="http://localhost:3000" className="text-blue-400 hover:underline">http://localhost:3000</a>.
                        </li>
                        <li>
                            <strong>Deploy:</strong> Push the code to GitHub and deploy it on a platform like Vercel for a live version.
                        </li>
                    </ol>
                </div>
                <p className="mt-8 text-sm text-gray-500">
                    All the necessary Next.js code has been generated and is ready to go. This message is a helper to get you started in the right environment.
                </p>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<Instructions />);
} else {
    console.error('Fatal Error: The #root element was not found in the DOM.');
}
