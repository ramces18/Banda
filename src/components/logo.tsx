import { Music } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <Music className="h-8 w-8" />
      <span className="text-2xl font-bold text-foreground">La Banda del IDI</span>
    </div>
  );
}
