import { supabase } from "@/lib/supabase";

/**
 * Promove um usuário para o papel de administrador
 * @param email O email do usuário a ser promovido
 * @returns Promise com status de sucesso e mensagem
 */
export const promoteToAdmin = async (email: string) => {
  try {
    // Primeiro, verificar se o usuário existe
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (userError) {
      return {
        success: false,
        message: `Usuário com email ${email} não encontrado`,
      };
    }

    if (userData.role === "admin") {
      return {
        success: false,
        message: `Usuário ${email} já é um administrador`,
      };
    }

    // Atualizar o papel do usuário para admin
    const { error: updateError } = await supabase
      .from("users")
      .update({ role: "admin" })
      .eq("id", userData.id);

    if (updateError) throw updateError;

    return {
      success: true,
      message: `Usuário ${email} promovido a administrador com sucesso`,
    };
  } catch (error: any) {
    console.error("Erro ao promover usuário para administrador:", error);
    return {
      success: false,
      message: error.message || "Falha ao promover usuário para administrador",
    };
  }
};

/**
 * Verifica se o usuário atual é um administrador
 * @returns Promise com booleano indicando se o usuário é administrador
 */
export const checkAdminStatus = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !data) return false;

    return data.role === "admin";
  } catch (error) {
    console.error("Erro ao verificar status de administrador:", error);
    return false;
  }
};
