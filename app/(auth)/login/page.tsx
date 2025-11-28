'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMagicLink = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/projects`
          : 'https://render-vault.vercel.app/projects';

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      setStatus('sent');
      setMessage('Check your email for a magic link to continue.');
    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const disabled = !email || status === 'loading' || status === 'sent';

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text-ink">Login</h1>
        <p className="text-sm text-text-subtle">
          Enter your email to receive a magic link. You’ll be redirected back to your projects.
        </p>
      </div>

      <div className="w-full space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleMagicLink} disabled={disabled} className="w-full">
          {status === 'loading' ? 'Sending...' : 'Send magic link'}
        </Button>
        {message && (
          <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-text-subtle'}`}>{message}</p>
        )}
      </div>

      <p className="text-xs text-text-subtle">
        By continuing you agree to receive a one-time login link. No passwords required.
      </p>
    </div>
  );
}
