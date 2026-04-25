import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotFoundPage from '../not-found';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock useAuth context
vi.mock('../lib/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    resolvedTheme: 'light',
  }),
}));

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock PublicHeader to avoid parsing issues with its .js extension in tests
vi.mock('../components/layout/PublicHeader', () => ({
  PublicHeader: () => <header data-testid="public-header">Header</header>,
}));

describe('NotFoundPage', () => {
  it('renders the 404 error message', () => {
    render(<NotFoundPage />);
    expect(screen.getAllByText(/404 ERROR/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Oops! Page/i)).toBeDefined();
    expect(screen.getByText(/Vanished/i)).toBeDefined();
  });

  it('contains a link to the home page', () => {
    render(<NotFoundPage />);
    const homeLinks = screen.getAllByRole('link', { name: /Back to Home/i });
    expect(homeLinks[0].getAttribute('href')).toBe('/');
  });

  it('contains a link to the services page', () => {
    render(<NotFoundPage />);
    const servicesLinks = screen.getAllByRole('link', { name: /Our Services/i });
    expect(servicesLinks[0].getAttribute('href')).toBe('/services');
  });

  it('contains branded elements', () => {
    render(<NotFoundPage />);
    expect(screen.getAllByText(/Vertex Technology/i).length).toBeGreaterThan(0);
  });
});
