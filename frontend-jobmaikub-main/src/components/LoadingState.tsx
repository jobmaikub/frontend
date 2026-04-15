const LoadingState = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
    <div className="flex gap-2">
      <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
      <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
      <div className="h-3 w-3 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
    </div>
    <p className="text-muted-foreground text-sm">Loading...</p>
  </div>
);

export default LoadingState;
