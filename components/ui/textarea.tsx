import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Taille minimale en lignes
   * @default 3
   */
  minRows?: number;
  /**
   * Taille maximale en lignes
   * @default 10
   */
  maxRows?: number;
  /**
   * Afficher un compteur de caractères
   * @default false
   */
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    minRows = 3, 
    maxRows = 10, 
    showCharCount = false,
    maxLength,
    value,
    ...props 
  }, ref) => {
    return (
      <div className="grid gap-1">
        <textarea
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y',
            className
          )}
          style={{
            minHeight: `${minRows * 1.5}rem`,
            maxHeight: `${maxRows * 1.5}rem`,
          }}
          rows={minRows}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCharCount && maxLength && (
          <div className="text-xs text-muted-foreground text-right">
            {String(value).length}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };