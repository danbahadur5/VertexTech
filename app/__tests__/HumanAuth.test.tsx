import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupPage from '../pages/SignupPage';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';

// Mocking the dependencies to isolate the component logic.
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
vi.mock('../lib/auth-context', () => ({
  useAuth: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SignupPage - Human Perspective Tests', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      register: mockRegister,
      signInWithGoogle: vi.fn(),
      signInWithGithub: vi.fn(),
    });
  });

  it('shows encouraging feedback for password strength', async () => {
    render(<SignupPage />);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    
    // Weak password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    expect(screen.getByText(/Needs work/i)).toBeDefined();
    
    // Stronger password
    fireEvent.change(passwordInput, { target: { value: 'Stronger123!' } });
    expect(screen.getByText(/Vault-Grade/i)).toBeDefined();
  });

  it('prevents submission with mismatched passwords and shows a human-centric error', async () => {
    render(<SignupPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm');
    const submitButton = screen.getByRole('button', { name: /Start Building Free/i });

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Different123!' } });
    
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("Typo?"));
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('suggests making the password stronger if it is too weak', async () => {
    render(<SignupPage />);
    
    const passwordInput = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm');
    const submitButton = screen.getByRole('button', { name: /Start Building Free/i });

    // This password only meets 1 criteria (length >= 8)
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmInput, { target: { value: 'password' } });
    
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining("for your safety"));
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
