"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

/**
 * Server Action untuk menambah produk baru ke database.
 */
export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : (prevState instanceof FormData ? prevState : null);

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum masuk. Aksi ditolak." };
  }

  const nama = data?.get?.("nama")?.toString().trim();
  const hargaRaw = data?.get?.("harga")?.toString().trim();
  const kategori = data?.get?.("kategori")?.toString().trim() || null;
  const foto_url = data?.get?.("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get?.("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: error.message || "Gagal menyimpan produk ke database." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

/**
 * Server Action untuk mengubah produk di database.
 */
export async function ubahProduk(idOrPrevState, prevStateOrFormData, maybeFormData) {
  let id;
  let data;

  if (typeof idOrPrevState === "string" || typeof idOrPrevState === "number") {
    id = idOrPrevState;
    data = maybeFormData instanceof FormData ? maybeFormData : (prevStateOrFormData instanceof FormData ? prevStateOrFormData : null);
  } else {
    data = prevStateOrFormData instanceof FormData ? prevStateOrFormData : (idOrPrevState instanceof FormData ? idOrPrevState : null);
    id = data?.get?.("id");
  }

  if (!id) {
    return { error: "ID produk tidak valid atau tidak ditemukan." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum masuk. Aksi ditolak." };
  }

  const nama = data?.get?.("nama")?.toString().trim();
  const hargaRaw = data?.get?.("harga")?.toString().trim();
  const kategori = data?.get?.("kategori")?.toString().trim() || null;
  const foto_url = data?.get?.("foto_url")?.toString().trim() || null;
  const deskripsi = data?.get?.("deskripsi")?.toString().trim() || null;

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = parseInt(hargaRaw, 10);
  if (isNaN(harga) || harga < 0) {
    return { error: "Harga harus berupa angka dan tidak boleh negatif." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal mengubah data produk di database." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

/**
 * Server Action untuk menghapus produk dari database.
 */
export async function hapusProduk(idOrFormData) {
  let id;
  if (idOrFormData instanceof FormData) {
    id = idOrFormData.get("id");
  } else if (typeof idOrFormData === "object" && idOrFormData?.get) {
    id = idOrFormData.get("id");
  } else {
    id = idOrFormData;
  }

  if (!id) {
    return { error: "ID produk tidak valid atau tidak ditemukan." };
  }

  const supabase = await createSessionClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau Anda belum masuk. Aksi ditolak." };
  }

  const { error } = await supabase
    .from("produk")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message || "Gagal menghapus produk dari database." };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  return { success: true };
}



