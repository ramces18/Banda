
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image 
        src="https://media.discordapp.net/attachments/1405546288912662600/1411914672919019622/imagen_2025-08-31_171722723-Photoroom.png?ex=68b66382&is=68b51202&hm=c8c165ff34ffdf8f36d83096e9b8e2d7e8bf9c683e896ca79018b13aa191c805&=&format=webp&quality=lossless"
        alt="Logo IDI"
        width={40}
        height={40}
        className="h-10 w-auto"
      />
      <span className="text-xl font-semibold text-foreground whitespace-nowrap">La Banda del IDI</span>
    </div>
  );
}
