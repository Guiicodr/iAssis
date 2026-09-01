export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/5 blur-3xl animate-blob-1" />
      <div className="absolute top-1/3 -right-32 size-80 rounded-full bg-amber-300/10 blur-3xl animate-blob-2" />
      <div className="absolute bottom-10 left-1/3 size-56 rounded-full bg-primary/5 blur-3xl animate-blob-3" />
    </div>
  );
}