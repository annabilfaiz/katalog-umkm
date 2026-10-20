"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk memproses login admin.
 */
export async function masukAdmin(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);
  const email = data?.get?.("email");
  const password = data?.get?.("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email atau password salah. Silakan periksa kembali."
          : error.message || "Gagal masuk. Silakan periksa email dan password.",
    };
  }

  redirect("/admin");
}

/**
 * Server Action untuk mengakhiri sesi login admin.
 */
export async function keluarAdmin() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Server Action untuk mengganti password admin yang sedang login.
 */
export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);
  const passwordBaru = data?.get?.("password_baru");
  const konfirmasiPassword = data?.get?.("konfirmasi_password");

  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Semua kolom password wajib diisi." };
  }

  if (String(passwordBaru).length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum masuk. Silakan login kembali." };
  }

  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: error.message || "Gagal mengubah password. Silakan coba lagi." };
  }

  return { success: "Password berhasil diganti." };
}

