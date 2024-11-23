import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, trailingIcon, ...props }, ref) => {
    return (
      <div className={cn('input-wrapper', className)}>
        {icon && <span className='mr-2 text-muted-foreground'>{icon}</span>}
        <input
          type={type}
          className='flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none'
          ref={ref}
          {...props}
        />
        {trailingIcon && (
          <span className='ml-2 text-muted-foreground'>{trailingIcon}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
