import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

type MainNavProps = {
  className?: string;
};

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/partner-groups', label: 'Partner Groups' },
  { to: '/partners', label: 'Partners' },
  { to: '/users', label: 'Users' },
];

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'text-sm font-medium transition-colors hover:text-primary',
          isActive ? 'text-primary' : 'text-muted-foreground',
          'block px-2 py-1.5 hover:bg-accent rounded-md'
        )
      }
    >
      {label}
    </NavLink>
  );
}

export function MainNav({ className }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn('hidden md:flex items-center space-x-4 lg:space-x-6', className)}>
        {navItems.map((item) => (
          <NavItem key={item.to} to={item.to} label={item.label} />
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <div className="px-7 py-8 space-y-6">
              <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.to} onClick={() => setIsOpen(false)}>
                    <NavItem to={item.to} label={item.label} />
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
