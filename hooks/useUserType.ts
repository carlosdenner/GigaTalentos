import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useUserType() {
  const [userType, setUserType] = useState<'fan' | 'sponsor' | 'talent' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserType() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: user } = await supabase
          .from('users')
          .select('account_type')
          .eq('id', session.user.id)
          .single();
        
        setUserType(user?.account_type || null);
      }
      setIsLoading(false);
    }

    getUserType();
  }, []);

  return { userType, isLoading };
}