"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

const varianPerKategori = {
  Minuman: ["Original", "Dingin", "Hangat"],
  Camilan: ["Original", "Pedas", "Manis Gurih"],
  Bumbu: ["Pedas Sedang", "Ekstra Pedas"],
  "Kue kering": ["Toples 250 g", "Toples 500 g"],
  Kain: ["Ukuran 2 m", "Ukuran 2.5 m"],
  Kerajinan: ["Standar", "Ukuran Besar"],
  Perhiasan: ["Standar", "Gift Box"],
  "Bahan kue": ["Kemasan Reguler", "Kemasan Hemat"],
};

export default function TombolWhatsApp({ produk }) {
  const opsiVarian = varianPerKategori[produk?.kategori] || ["Standar", "Spesial"];
  const [varian, setVarian] = useState(opsiVarian[0]);
  const [jumlah, setJumlah] = useState(1);

  const nomor = (toko.nomorWhatsApp || "").replace(/\D/g, "");
  const totalHarga = (produk?.harga || 0) * jumlah;
  const teksVarian = varian ? ` (Varian: ${varian})` : "";
  const pesan = `Halo, saya ingin memesan ${produk?.nama}${teksVarian} sebanyak ${jumlah} pcs seharga ${formatRupiah(totalHarga)}.`;
  const urlWhatsApp = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Pilihan Varian */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-teks">Pilih varian:</label>
        <div className="flex flex-wrap gap-2">
          {opsiVarian.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setVarian(opt)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                varian === opt
                  ? "bg-utama text-white shadow-xs"
                  : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Pilihan Jumlah */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-teks">Jumlah:</label>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={jumlah <= 1}
              aria-label="Kurangi jumlah"
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks hover:bg-permukaan active:bg-garis disabled:opacity-40"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={jumlah}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setJumlah(isNaN(val) || val < 1 ? 1 : val);
              }}
              className="w-14 text-center text-base font-semibold text-teks focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              aria-label="Tambah jumlah"
              className="flex h-10 w-10 items-center justify-center text-lg font-bold text-teks hover:bg-permukaan active:bg-garis"
            >
              +
            </button>
          </div>
          {jumlah > 1 && (
            <p className="text-sm text-teks-lembut">
              Total: <span className="font-bold text-teks">{formatRupiah(totalHarga)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tombol Pesan WhatsApp */}
      <div>
        <a
          href={urlWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white transition-colors hover:bg-utama-gelap sm:w-auto"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}


