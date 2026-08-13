import React from 'react';
import { navigate } from './next-navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  key?: React.Key;
}

export default function Link({ href, replace, children, onClick, className, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    // Allow standard click behaviors (cmd/ctrl click for new tab, right click, etc.)
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(href, replace);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
