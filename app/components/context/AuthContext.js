'use client';

import httpRequest from '@/lib/axiosInstance';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: null,
  logout: () => {},
});

export function AuthProvider({ children }) {
  const router = useRouter()
  const pathName = usePathname()
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(!loading && pathName !== '/' && !user) router.push('/')
  }, [pathName, user, router, loading])

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching user:', err);
        setUser(null);
        setLoading(false)
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    httpRequest.post('/logout')
    .then((res)=>{
      if(res.data.success) router.push("/")
    })

    setUser(null);
    window.location.href = '/';
  };

  if(!user && pathName !== '/') return <></>

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
