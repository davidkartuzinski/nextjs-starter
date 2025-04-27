import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItems } from '@/app/site-config';

export default function MainNav() {
  const pathname = usePathname();

  return (
    <nav
      className='flex items-center space-x-6 text-base
 font-medium'
    >
      {NavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === item.href
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
