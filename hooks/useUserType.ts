import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function useUserType() {
  const [userType, setUserType] = useState<'fan' | 'sponsor' | 'talent' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function getUserType() {
      if (session?.user) {
        const response = await fetch('/api/profile');
        const user = await response.json();
        setUserType(user?.account_type || null);
      }
      setIsLoading(false);
    }

    getUserType();
  }, [session]);

  return { userType, isLoading };
}