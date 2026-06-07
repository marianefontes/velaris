export function ChatLoadingState() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-bounce"
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
    </div>
  );
}

