"use client";

import { useState, useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { buatDeskripsiAI } from "@/app/admin/actions";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, action }) {
  const [state, formAction, isPending] = useActionState(
    action || (async () => null),
    null
  );

  const [nama, setNama] = useState(produk.nama || "");
  const [kategori, setKategori] = useState(produk.kategori || "");
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi || "");
  const [loadingAI, setLoadingAI] = useState(false);
  const [pesanAI, setPesanAI] = useState(null);

  const handleBuatDeskripsiAI = async () => {
    if (!nama.trim()) {
      setPesanAI({
        tipe: "error",
        teks: "Harap isi nama produk terlebih dahulu sebelum membuat deskripsi AI.",
      });
      return;
    }

    setLoadingAI(true);
    setPesanAI(null);

    try {
      const res = await buatDeskripsiAI(nama, kategori);
      if (res?.error) {
        setPesanAI({ tipe: "error", teks: res.error });
      } else if (res?.deskripsi) {
        setDeskripsi(res.deskripsi);
        setPesanAI({
          tipe: "sukses",
          teks: "Deskripsi berhasil dibuat dengan AI!",
        });
      }
    } catch (err) {
      setPesanAI({
        tipe: "error",
        teks: err?.message || "Terjadi kesalahan saat memanggil AI.",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {state?.error && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {state.error}
        </div>
      )}
      {produk.id ? <input type="hidden" name="id" defaultValue={produk.id} /> : null}
      <Input
        label="Nama produk"
        name="nama"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        required
      />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input
        label="Kategori"
        name="kategori"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <Input
        label="Link foto"
        name="foto_url"
        placeholder="https://... atau /produk/nama-file.svg"
        defaultValue={produk.foto_url}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="input-deskripsi" className="text-sm font-semibold text-teks">
            Deskripsi
          </label>
          <button
            type="button"
            onClick={handleBuatDeskripsiAI}
            disabled={loadingAI}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-utama transition-colors hover:bg-permukaan hover:text-utama-gelap disabled:opacity-50"
          >
            {loadingAI ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                <span>Sedang membuat deskripsi...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Buat deskripsi dengan AI</span>
              </>
            )}
          </button>
        </div>
        {pesanAI && (
          <p
            className={`text-xs font-medium ${
              pesanAI.tipe === "error" ? "text-bahaya" : "text-utama"
            }`}
          >
            {pesanAI.teks}
          </p>
        )}
        <textarea
          id="input-deskripsi"
          name="deskripsi"
          rows={4}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tulis deskripsi atau klik 'Buat deskripsi dengan AI' di atas..."
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </div>

      <div className="flex gap-3">
        <Tombol type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}


