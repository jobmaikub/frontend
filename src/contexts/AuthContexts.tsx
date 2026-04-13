// AuthContexts.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '../supabase';
import { fetchActiveBanByUser } from '@/lib/users.api';

type AuthContextType = {
  user: any;
  profile: any;
  loading: boolean;
  signOut: () => Promise<void>;
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

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      // ✅ LOGIN SUCCESS HERE
      setUser(session?.user ?? null);
      setLoading(false);

      // ⬇️ profile โหลดทีหลัง ไม่ block login
      if (session?.user) {
        loadProfile(session.user.id, session.user.email);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setUser(session?.user ?? null);

        if (session?.user) {
          loadProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string, email?: string) => {
    try {
      const activeBan = await fetchActiveBanByUser(userId);
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
        console.log('✅ Profile loaded:', data);
        setProfile(data);
      } else {
        // profile ไม่เจอ → สร้างใหม่ (กันกรณี reset password)
        console.log('📝 Creating new profile for user:', userId);
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email,
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Failed to create profile:', insertError);
          // ยังคง set profile ด้วย default role === null
          setProfile({ id: userId, email, role: null });
        } else if (newProfile) {
          console.log('✅ New profile created:', newProfile);
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
      // Fallback: ตั้ง profile ด้วย default role === null เพื่อให้ admin สามารถเข้าได้
      setProfile({ id: userId, email, role: null });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
