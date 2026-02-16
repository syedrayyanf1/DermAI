import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="text-6xl">🔬</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            DermaTrack AI
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          AI-powered acne progression tracking. Upload daily photos, log your
          routine, and watch your skin improve with data-driven insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-semibold rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
          {[
            { icon: "📸", title: "Daily Capture", desc: "Standardized photo tracking" },
            { icon: "🤖", title: "AI Analysis", desc: "Gemini Vision powered insights" },
            { icon: "📊", title: "Trend Dashboard", desc: "Charts, averages, correlations" },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
