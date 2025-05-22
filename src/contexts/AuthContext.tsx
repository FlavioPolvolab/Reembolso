import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    try {
      // Wait a moment to ensure the trigger has time to create the user profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil do usuário:", error);

        // Tenta criar o perfil do usuário se não existir
        if (error.code === "PGRST116") {
          // Código para "não encontrado"
          const userData = await supabase.auth.getUser();
          if (userData.data?.user) {
            const { error: insertError } = await supabase.from("users").insert([
              {
                id: userId,
                name:
                  userData.data.user.user_metadata?.name ||
                  userData.data.user.email,
                email: userData.data.user.email,
                role: "user",
              },
            ]);

            if (!insertError) {
              // Tenta buscar o perfil novamente
              const { data: newData } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

              if (newData) {
                setProfile(newData);
                setIsAdmin(newData?.role === "admin");
                setIsLoading(false);
                return;
              }
            }
          }
        }

        setProfile(null);
        setIsAdmin(false);
      } else {
        console.log("Perfil de usuário carregado:", data);
        setProfile(data);
        setIsAdmin(data?.role === "admin");
      }
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { data: null, error };
      }

      // Verificar se o perfil do usuário foi criado pelo trigger
      if (data?.user) {
        // Esperar um momento para o trigger executar
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verificar se o perfil foi criado
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        // Se não encontrou o perfil, criar manualmente
        if (profileError) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: data.user.id,
              name,
              email,
              role: "user",
            },
          ]);

          if (insertError) {
            console.error(
              "Erro ao criar perfil de usuário manualmente:",
              insertError,
            );
          }
        }
      }

      return { data, error: null };
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
