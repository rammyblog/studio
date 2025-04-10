'use client';

import { cn } from '@/lib/utils';
import { Activity, BarChart2, Music, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: <Music className="h-5 w-5" />,
  },
  {
    name: 'Analysis',
    href: '/analysis',
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    name: 'Performance',
    href: '/performance',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    name: 'Comparison',
    href: '/compare',
    icon: <Users className="h-5 w-5" />,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">
                Music Analytics
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
