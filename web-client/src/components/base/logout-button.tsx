import { LogOut } from 'lucide-react';

import { Button } from '@/components/base/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/base/tooltip';
import { useLogout } from '@/hooks/useLogout';
import { cn } from '@/lib/utils';

export function LogoutButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { logout } = useLogout();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="logout-button"
          variant="ghost"
          size="icon"
          className={cn('cursor-pointer p-2 w-fit', className)}
          onClick={(event) => {
            onClick?.(event);
            logout();
          }}
          {...props}
        >
          <LogOut size={50} />
          <span className="sr-only">Logout</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" className="w-fit">
        Logout
      </TooltipContent>
    </Tooltip>
  );
}
