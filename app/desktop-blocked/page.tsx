export default function DesktopBlockedPage() {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-8">
      <div className="card p-10 text-center space-y-4 max-w-xs">
        <p className="text-4xl">📱</p>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-primary tracking-tight">Mobile only</h1>
          <p className="text-secondary text-sm leading-relaxed">
            WorkoutBud is built for mobile. Open this URL on your phone to get started.
          </p>
        </div>
      </div>
    </main>
  );
}
