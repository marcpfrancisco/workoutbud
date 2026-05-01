export default function DesktopBlockedPage() {
  return (
    <main className="min-h-screen bg-obsidian flex items-center justify-center p-8">
      <div className="holo-border glow-purple rounded-holo p-10 text-center space-y-4 max-w-xs">
        <div className="text-5xl">📱</div>
        <h1 className="text-2xl font-bold text-hyper-purple tracking-tight">
          Mobile Only
        </h1>
        <p className="text-ghost-white/50 text-sm leading-relaxed">
          WorkoutBud is engineered for mobile. Scan this URL on your phone to
          begin.
        </p>
      </div>
    </main>
  );
}
