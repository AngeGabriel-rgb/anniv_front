import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Variante visuelle du champ
   * @default 'default'
   */
  variant?: 'default' | 'ghost' | 'search';
  /**
   * Affiche une icône de chargement
   * @default false
   */
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', isLoading = false, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            variant === 'search' && 'pl-10',
            isLoading && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {variant === 'search' && (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };