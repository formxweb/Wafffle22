# Waffle Mina — "Kare kare"

Waffle Mina için statik, framework'süz marka sitesi. Sunucuda derleme gerekmez; klasör olduğu gibi yayınlanır.

## Fikir

Türkçede **kare** hem "kare" hem "çerçeve/fotoğraf karesi" demek. Waffle da karelerden oluşur. Site bunun üzerine kurulu:

| Sistem | Ne yapar | Nerede |
|---|---|---|
| **Izgara (cep)** | Logodaki 3×3 waffle ve dükkândaki duvar resminden türeyen düz grafik waffle. Kareler yapıdır. | Giriş, içindekiler, footer, 404, ölçü sistemi |
| **Sekiz çikolata** | Menüdeki 8 çikolata, sitenin tek vurgu renkleri. Daireler sostur. Her tarif kendi sos kodunu taşır. | Sos rafı (filtre), tarif listesi, detay |
| **Sos çizgisi** | Waffle'ların üstüne dökülen zigzag; tarifin kendi sos renklerinde çizilir. | Bölüm geçişleri, filtre, detay |
| **Çıtır / yumuşak** | Markanın kendi cümlesi tipografiye dönüşür: Archivo Expanded Black = dışı çıtır, Bodoni Moda Italic = içi yumuşak, IBM Plex Mono = adisyon (saat, adres, içerik). | Her yerde |

## İçerik kaynağı

Uydurma bilgi yok. Tüm içerik şu kaynaklardan:

- **Ürünler ve içerikler:** resmi QR menü — <https://wafflemina.adisyonqr.com/>
- **Şubeler, telefonlar, saatler, metinler:** mevcut site (wafflemina.com)
- **Instagram:** `@waffle_mina` (QR menüdeki bağlantı; eski sitedeki `waffle.mina` bağlantısı yanlıştı)

**Fiyatlar bilinçli olarak sitede yok.** Şubeye göre değişebiliyorlar ve QR menüde güncel tutuluyorlar; site her yerde QR menüye yönlendirir.

**Görseller:** Markanın kendi fotoğrafları kare kırpıldı. QR menüdeki kahve ve dondurma fotoğrafları ile eski sitedeki iki kahve fotoğrafında Gemini (yapay zekâ) filigranı var. Magnolya fotoğrafları da üretilmiş görünüyor. Bunlar kullanılmadı: magnolya, fotoğraf yerine etkileşimli bir "kavanoz" ile anlatılıyor.

## Yapı

```
index.html              tek sayfa
404.html                "Bu kare boş."
assets/css/site.css     tüm stiller (tokenlar dosyanın başında)
assets/js/data.js       menü verisi: TEK KAYNAK
assets/js/site.js       etkileşimler (ES module, bağımlılık yok)
assets/fonts/           self-host, Türkçe karakterlere göre alt kümelenmiş woff2 (toplam ~120 KB)
assets/img/             kare WebP görseller (+ -480, -240 boyutları)
tools/build.mjs         data.js → index.html (tarif satırları, sos rafı, JSON-LD, magnolya listesi)
```

## Menü güncelleme

1. `assets/js/data.js` dosyasını düzenle (ad, içerik, sos, görsel).
2. `npm run render` komutunu çalıştır (`node tools/build.mjs`) ve değişen `index.html` dosyasını commit'le. Statik HTML (SEO / JS kapalı) ve etkileşim katmanı aynı veriden üretilir.
3. Yeni görsel ekleniyorsa kare kırp ve `name.webp`, `name-240.webp` (gerekirse `name-480.webp`) olarak `assets/img/` içine koy, `IMG` tablosuna ekle.

Yerel önizleme: `npm run serve` → <http://localhost:8080>

## Yayın (Vercel)

Derleme adımı yok: `index.html` repoda hazır halde durur, Vercel kök klasörü olduğu gibi yayınlar (`vercel.json` → `outputDirectory: "."`). Bu yüzden `package.json` içinde bilinçli olarak `build` adında bir script yok; olursa Vercel onu çalıştırıp çıktıyı `public` klasöründe arar ve dağıtım başarısız olur.

## Kalite kontrol (yapılanlar)

- Chromium'da 375, 390, 834, 1024, 1280, 1440 ve 1920 genişlikte test edildi: konsol hatası ve yatay taşma yok.
- axe-core (WCAG 2.1 AA + best practice): 0 ihlal. html-validate: 0 hata.
- Klavye: atlama bağlantısı, odak halkaları, diyalog odak yönetimi, ok tuşlarıyla tarifler arası geçiş, Esc.
- `prefers-reduced-motion` desteklenir. JavaScript kapalıyken bütün içerik okunur durumda kalır.
- Mobilde tarif detayı alttan açılan bir sayfa olarak gelir; telefonun geri tuşu kapatır. `#tarif/<id>` paylaşılabilir bağlantıdır.

## Açık konular

- **Fotoğraf:** Kaynak fotoğraflar 400–960 px ve bir kısmı yoğun işlenmiş. Kaliteyi en çok artıracak tek adım, aynı ışıkta ve kare kadrajla çekilmiş gerçek bir ürün çekimi olur. Görsel adları değişmeden dosyalar değiştirilebilir.
- **Alan adı:** canonical, OG ve sitemap `https://wafflemina.com/` varsayıyor. Yayın HTTPS değilse güncellenmeli.
- **İngilizce:** Eski sitede TR/EN vardı; bu sürüm yalnızca Türkçe.
- Çalışma saatleri tüm şubeler için "her gün 14:00–00:00" olarak alındı. Sitedeki canlı "Açık / Kapalı" göstergesi bu saatlere ve İstanbul saatine göre hesaplanır.
