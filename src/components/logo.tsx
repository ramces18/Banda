
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPA903u2MwhTN5_t-OW-OUw6luHECTXeFjFw&s"
        alt="Logo IDI"
        width={40}
        height={40}
        className="h-10 w-auto"
      />
      <span className="text-xl font-semibold text-foreground whitespace-nowrap">La Banda del IDI</span>
    </div>
  );
}
