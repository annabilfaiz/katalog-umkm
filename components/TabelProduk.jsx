"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const [loadingId, setLoadingId] = useState(null);
  const [pesanError, setPesanError] = useState(null);

  const handleHapus = async (produk) => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${produk.nama}"?`
    );
    if (!konfirmasi) {
      return;
    }

    setLoadingId(produk.id);
    setPesanError(null);

    try {
      const res = await hapusProduk(produk.id);
      if (res?.error) {
        setPesanError(res.error);
        alert(res.error);
      }
    } catch (err) {
      const pesan = err?.message || "Gagal menghapus produk. Terjadi kesalahan pada server.";
      setPesanError(pesan);
      alert(pesan);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {pesanError && (
        <div className="rounded-lg border border-garis bg-permukaan p-3 text-sm font-medium text-bahaya">
          {pesanError}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Harga</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada produk.
                </td>
              </tr>
            ) : (
              daftarProduk.map((produk) => (
                <tr key={produk.id} className="border-t border-garis">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={produk.foto_url}
                        alt=""
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <span className="font-semibold">{produk.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
                  <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      <Tombol
                        type="button"
                        varian="bahaya"
                        disabled={loadingId === produk.id}
                        onClick={() => handleHapus(produk)}
                      >
                        {loadingId === produk.id ? "Menghapus..." : "Hapus"}
                      </Tombol>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

