import React from "react";
import LinkNext from "next/link";
import { useRouter, usePathname, useParams as useNextParams } from "next/navigation";

type LinkProps = {
  to: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  replace?: boolean;
  prefetch?: boolean;
};

export function Link({ to, children, className, onClick, replace, prefetch }: LinkProps) {
  return (
    <LinkNext href={to} className={className} onClick={onClick} replace={replace} prefetch={prefetch}>
      {children}
    </LinkNext>
  );
}

export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

export function useParams<T extends Record<string, string>>() {
  return useNextParams() as unknown as T;
}
