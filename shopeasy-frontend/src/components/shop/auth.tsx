import { Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ShoppingBag, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { request, normalizeUser } from '@/lib/shop/api';
import { useSession } from './session';

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'admin' }) {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useSession();
  const register = mode === 'register';
  const admin = mode === 'admin';
  return <div className="auth-page"><div className="auth-panel"><span className="auth-mark">{admin ? <ShieldCheck /> : <ShoppingBag />}</span><h1>{registered ? 'Account created' : register ? 'Create your account' : admin ? 'Admin Login' : 'Welcome back'}</h1><p>{registered ? 'You can now sign in with your email and password.' : register ? 'Your next favorite is waiting for you.' : admin ? 'Sign in to manage your store.' : 'Sign in to your ShopEase account.'}</p>{registered ? <Button asChild className="w-full" size="lg"><Link to="/login.html">Continue to Login <ArrowRight /></Link></Button> : <form onSubmit={async e => {
    e.preventDefault(); setPending(true); setError('');
    const form = new FormData(e.currentTarget);
    const email = String(form.get('email')); const password = String(form.get('password'));
    try {
      const result = await request<{ user?: unknown; message?: string }>(register ? '/api/register' : admin ? '/api/admin/login' : '/api/login', register ? { name: String(form.get('name')), email, password } : { email, password });
      if (register && !result.user) { setRegistered(true); return; }
      const user = normalizeUser(result.user, admin ? 'admin' : 'customer');
      setUser(user);
      await navigate({ to: user.role === 'admin' ? '/admin' : '/', replace: true });
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); }
    finally { setPending(false); }
  }}>
    {register && <label className="field">Full name<input name="name" autoComplete="name" required /></label>}
    <label className="field">Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
    <label className="field">Password<div className="password-field"><input name="password" type={show ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} required /><Button type="button" variant="ghost" size="icon" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</Button></div></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? <Loader2 className="animate-spin" /> : null}{pending ? 'Please wait…' : register ? 'Create Account' : 'Login'}{!pending && <ArrowRight />}</Button>
  </form>}
    {!registered && <div className="auth-bottom">{register ? <>Already have an account? <Link to="/login.html">Login</Link></> : admin ? <Link to="/login.html">Customer login <ArrowRight size={14} /></Link> : <>New to ShopEase? <Link to="/register.html">Create an account</Link></>}</div>}
    <Link className="back-to-shop" to="/">Back to shop</Link>
  </div></div>;
}
