import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async (userId: string) => {
    try {
      const [roleRes, profileRes] = await Promise.all([
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('status, suspension_reason, suspended_until')
          .eq('id', userId)
          .maybeSingle(),
      ]);

      setIsAdmin(!!roleRes.data);
      const profile = profileRes.data;
      if (profile && (profile.status === 'suspended' || profile.status === 'banned')) {
        // Automatically reinstate if a timed ban has expired
        if (profile.suspended_until && new Date(profile.suspended_until) <= new Date()) {
          await supabase
            .from('profiles')
            .update({ status: 'active', suspension_reason: null, suspended_until: null })
            .eq('id', userId);
          setIsSuspended(false);
          setSuspensionReason(null);
        } else {
          setIsSuspended(true);
          const expiryNote = profile.suspended_until
            ? ` (Ban active until ${new Date(profile.suspended_until).toLocaleString()})`
            : ' (Permanent Ban)';
          setSuspensionReason((profile.suspension_reason || 'Platform policy violation') + expiryNote);
        }
      } else {
        setIsSuspended(false);
        setSuspensionReason(null);
      }
    } catch (error) {
      console.error('Error checking user status:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);

          // Clear hash fragment after successful OAuth login
          if (event === 'SIGNED_IN' && window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          setIsAdmin(false);
          setIsSuspended(false);
          setSuspensionReason(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message);
      }
      throw error;
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      toast.error('This email is already registered. Please sign in instead.');
      return;
    }

    // Show email verification message
    toast.success('Verification email sent! Please check your inbox to confirm your email address.', {
      duration: 6000,
    });
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(error.message);
      }
      throw error;
    }

    toast.success('Welcome back to SwadBook!');
    navigate('/');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success('Signed out successfully');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isSuspended, suspensionReason, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
