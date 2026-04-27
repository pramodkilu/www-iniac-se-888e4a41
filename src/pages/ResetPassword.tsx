import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Bot } from 'lucide-react';
import { z } from 'zod';

const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Case 1: Newer Supabase sends ?code=... (PKCE) — exchange it for a session
      const code = searchParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('exchangeCodeForSession error:', error);
          if (mounted) setErrorMsg('Reset link is invalid or has expired. Please request a new one.');
          return;
        }
        if (mounted) setSessionReady(true);
        return;
      }

      // Case 2: Hash-based recovery token (#access_token=...&type=recovery)
      const hash = window.location.hash;
      if (hash.includes('type=recovery') || hash.includes('access_token')) {
        // Supabase client auto-parses the hash and creates a session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          setSessionReady(true);
          return;
        }
      }

      // Case 3: Already have a session (e.g. came back to page)
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        setSessionReady(true);
      } else if (mounted) {
        setErrorMsg('No active reset session. Please use the link from your email.');
      }
    };

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true);
        setErrorMsg(null);
      }
    });

    init();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated! You can now sign in.');
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <header className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/auth')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Bot className="w-10 h-10 text-cyan-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                INIAC
              </span>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-white text-center">Set a new password</CardTitle>
                <CardDescription className="text-gray-300 text-center">
                  {errorMsg
                    ? errorMsg
                    : sessionReady
                      ? 'Enter your new password below'
                      : 'Validating your reset link...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-gray-200">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    disabled={!sessionReady}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-200">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    disabled={!sessionReady}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={isSubmitting || !sessionReady}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
                {errorMsg && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                    onClick={() => navigate('/auth')}
                  >
                    Request a new reset link
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
