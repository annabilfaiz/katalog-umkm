import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function buatUrlKatalog({ kategori, q }) {
  const sp = new URLSearchParams();
  if (kategori) sp.set("kategori", kategori);
  if (q) sp.set("q", q);
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export default async function HalamanKatalog({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const kataKunci = (resolvedSearchParams.q || resolvedSearchParams.cari || "").trim();
  const kategoriParam = (resolvedSearchParams.kategori || "").trim();
  const kategoriAktif =
    kategoriParam && kategoriParam.toLowerCase() !== "semua"
      ? kategoriParam
      : "";

  let daftarProduk = null;
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createServerClient();

    let query = supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (kategoriAktif) {
      query = query.ilike("kategori", kategoriAktif);
    }

    if (kataKunci) {
      query = query.ilike("nama", `%${kataKunci}%`);
    }

    const [{ data: produkData, error: produkError }, { data: kategoriData }] =
      await Promise.all([
        query,
        supabase.from("produk").select("kategori"),
      ]);

    if (produkError) {
      pesanError = produkError.message || "Gagal mengambil data dari database.";
    } else {
      daftarProduk = produkData;
    }

    if (kategoriData) {
      const setKategori = new Set();
      kategoriData.forEach((item) => {
        if (item.kategori && item.kategori.trim()) {
          setKategori.add(item.kategori.trim());
        }
      });
      daftarKategori = Array.from(setKategori).sort((a, b) =>
        a.localeCompare(b, "id")
      );
    }
  } catch (err) {
    pesanError = err.message || "Terjadi kesalahan saat menghubungkan ke database.";
  }

  const adaFilter = Boolean(kataKunci || kategoriAktif);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="judul-produk" className="text-xl font-bold">
            Produk kami
          </h2>
          <form method="GET" action="/" className="flex w-full max-w-md items-center gap-2">
            <input
              type="search"
              name="q"
              defaultValue={kataKunci}
              placeholder="Cari nama produk..."
              className="w-full rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            {kategoriAktif ? (
              <input type="hidden" name="kategori" value={kategoriAktif} />
            ) : null}
            <Tombol type="submit" className="shrink-0 px-3.5 py-2 text-xs sm:text-sm">
              Cari
            </Tombol>
            {adaFilter && (
              <Tombol href="/" varian="garis" className="shrink-0 px-3.5 py-2 text-xs sm:text-sm">
                Reset
              </Tombol>
            )}
          </form>
        </div>

        {/* Filter Kategori */}
        {daftarKategori.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buatUrlKatalog({ kategori: "", q: kataKunci })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                !kategoriAktif
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
              }`}
            >
              Semua
            </Link>
            {daftarKategori.map((kat) => (
              <Link
                key={kat}
                href={buatUrlKatalog({ kategori: kat, q: kataKunci })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  kategoriAktif.toLowerCase() === kat.toLowerCase()
                    ? "bg-utama text-white"
                    : "border border-garis bg-latar text-teks hover:border-utama hover:text-utama"
                }`}
              >
                {kat}
              </Link>
            ))}
          </div>
        )}

        {adaFilter && daftarProduk && (
          <p className="text-xs text-teks-lembut">
            Menampilkan {daftarProduk.length} produk
            {kataKunci ? ` untuk pencarian "${kataKunci}"` : ""}
            {kategoriAktif ? ` dalam kategori "${kategoriAktif}"` : ""}
          </p>
        )}

        {pesanError ? (
          <div className="rounded-xl border border-garis bg-permukaan p-6 text-center">
            <p className="font-semibold text-bahaya">Gagal memuat produk</p>
            <p className="mt-1 text-sm text-teks-lembut">{pesanError}</p>
          </div>
        ) : !daftarProduk || daftarProduk.length === 0 ? (
          adaFilter ? (
            <div className="rounded-xl border border-garis bg-permukaan p-8 text-center">
              <p className="text-base font-semibold text-teks">Tidak ada produk yang sesuai</p>
              <p className="mt-1 text-sm text-teks-lembut">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
              <div className="mt-4">
                <Tombol href="/" varian="garis">
                  Lihat semua produk
                </Tombol>
              </div>
            </div>
          ) : (
            <p className="py-12 text-center text-teks-lembut">Belum ada produk</p>
          )
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}


