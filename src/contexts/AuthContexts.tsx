// AuthContexts.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { fetchActiveBanByUser } from '@/lib/users.api';

const DAY_MS = 24 * 60 * 60 * 1000;

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey?: string | null) => {
  if (!dateKey) return null;
  const [y, m, d] = String(dateKey).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const getDayDiff = (fromDate: Date, toDate: Date) => {
  const startFrom = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const startTo = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  return Math.floor((startTo.getTime() - startFrom.getTime()) / DAY_MS);
};

type AuthContextType = {
  user: any;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const forceRedirectToLoginForBan = async (reason?: string, until?: string | null) => {
    const params = new URLSearchParams({
      banned: '1',
      reason: reason || 'Your account has been suspended by admin',
      until: until || '',
    });

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.href = `/login?${params.toString()}`;
  };

  const syncLoginStreak = async (rawProfile: any, userId: string, email?: string) => {
    const now = new Date();
    const todayKey = toLocalDateKey(now);
    const currentStreak = Number(rawProfile?.current_streak ?? 0) || 0;
    const lastStreakDate = rawProfile?.last_streak_date ?? null;
    const lastDate = parseDateKey(lastStreakDate);

    let nextStreak = currentStreak;

    if (!lastDate) {
      nextStreak = 1;
    } else {
      const diffDays = getDayDiff(lastDate, now);

      if (diffDays === 0) {
        nextStreak = currentStreak;
      } else if (diffDays === 1) {
        nextStreak = currentStreak + 1;
      } else {
        nextStreak = 1;
      }
    }

    const shouldUpdate =
      lastStreakDate !== todayKey || Number(rawProfile?.current_streak ?? 0) !== nextStreak;

    if (!shouldUpdate) {
      return {
        ...rawProfile,
        current_streak: nextStreak,
        last_streak_date: todayKey,
      };
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        current_streak: nextStreak,
        last_streak_date: todayKey,
      })
      .eq('id', userId)
      .select('*')
      .single();

    if (updateError) {
      console.error('❌ Failed to sync login streak:', updateError);
      return {
        ...rawProfile,
        current_streak: nextStreak,
        last_streak_date: todayKey,
      };
    }

    return updatedProfile ?? {
      ...rawProfile,
      email: rawProfile?.email ?? email,
      current_streak: nextStreak,
      last_streak_date: todayKey,
    };
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Use a timeout to ensure state is stable or just call directly if not already loading
        loadProfile(currentUser.id, currentUser.email);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        const newUser = session?.user ?? null;
        
        // Only trigger profile load if the user actually changed or explicitly signed in
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && !user)) {
          setUser(newUser);
          if (newUser) loadProfile(newUser.id, newUser.email);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else {
          // For other events like TOKEN_REFRESHED, just update the user object if it exists
          if (newUser) setUser(newUser);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string, email?: string) => {
    // Prevent redundant loads if already loading or loaded for this user
    if (profile?.id === userId) return;

    try {
      let activeBan: Awaited<ReturnType<typeof fetchActiveBanByUser>> = null;
      try {
        activeBan = await fetchActiveBanByUser(userId);
      } catch (banCheckError) {
        console.warn('⚠️ Ban check failed, continue with profile load:', banCheckError);
      }

      if (activeBan) {
        await forceRedirectToLoginForBan(
          activeBan.reason || 'Your account has been suspended by admin',
          activeBan.unban_date || ''
        );
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        const profileWithStreak = await syncLoginStreak(data, userId, email);
        console.log('✅ Profile loaded:', profileWithStreak);
        setProfile(profileWithStreak);
      } else {
        console.log('📝 Creating new profile for user:', userId);
        const todayKey = toLocalDateKey(new Date());
        
        // Get full name from user metadata if available
        const { data: sessionData } = await supabase.auth.getSession();
        const fullName = sessionData.session?.user?.user_metadata?.full_name || '';

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email,
            full_name: fullName,
            current_streak: 1,
            last_streak_date: todayKey,
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
          setProfile({
            id: userId,
            email,
            role: null,
            current_streak: 1,
            last_streak_date: todayKey,
          });
        } else if (newProfile) {
          console.log('✅ New profile created:', newProfile);
          
          // Trigger welcome email via backend for first-time login (Manual or OAuth)
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          fetch(`${API_URL}/otp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type: 'welcome' }),
          }).catch(err => console.error('Error sending welcome email:', err));

          setProfile(newProfile);
        }
      }
    } catch (err) {
      const errMsg = String((err as any)?.message || '').toLowerCase();
      if (errMsg.includes('banned') || errMsg.includes('suspend')) {
        await forceRedirectToLoginForBan('Your account has been suspended by admin');
        return;
      }

      console.error('🚨 Profile load error:', err);
      setProfile({ id: userId, email, role: null });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
