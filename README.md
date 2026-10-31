# Миний портал — Сургалтын DEMO PWA

**Энэ бол албан ёсны e-Mongolia апп, төрийн цахим үйлчилгээ, иргэний үнэмлэх биш.** Хичээлийн зориулалтаар бүтээсэн харилцан үйлдэлтэй PWA загвар. Картууд дээр үргэлж `DEMO / NOT VALID ID` гэсэн тэмдэг байна.

## Ажиллах боломжууд

- iPhone-д таарсан профайл, баримтын carousel, дэлгэц дүүргэсэн sheet popup
- Картын нүүр/ар тал солих, оюутны карт, таван табтай үндсэн цэс
- Нэр, овог, имэйл, төрсөн огноо, хүйс, дугаар, хаяг, картын гарчиг, сургууль, өнгө гэх мэт мэдээлэл засах
- iPhone Photos-оос зураг сонгож зураг оруулах
- Browser LocalStorage-д автоматаар хадгалах (зөвхөн Save дарахад)
- JSON экспорт/импорт, анхны төлөвт сэргээх
- Сургалтын түүх болон санал бичих жишээ
- Service Worker offline cache, manifest, app icons

## Шууд турших

Компьютер дээр: `python3 -m http.server 8000` гэж энэ хавтсанд ажиллуулаад `http://localhost:8000` нээнэ. Эсвэл `index.html`-ийг компьютер дээр нээж харах боломжтой (гэхдээ file:// үед PWA/offline ажиллахгүй).

## iPhone Home Screen-д суулгах

1. Энэ хавтсыг HTTPS-д байршуулна. Хялбар арга: https://app.netlify.com/drop дээр **бүх файлыг агуулсан хавтас** эсвэл ZIP-ээ upload хийнэ. Үүссэн `https://....netlify.app` URL-г авна. Хүсвэл GitHub Pages ашиглаж болно.
2. iPhone-д Safari-гаар уг HTTPS URL-г нээнэ.
3. Safari-ийн **Share** → **Add to Home Screen**.
4. **Open as Web App** идэвхжүүлээд **Add**.
5. Home Screen дээрх `Миний демо` icon-оор нээнэ.
6. Баруун дээд **харандаа** icon эсвэл `Профайл → Мэдээлэл засах` хэсгээс талбаруудаа өөрчлөөд **Өөрчлөлтийг хадгалах** дарна.

> Мэдээлэл зөвхөн тухайн browser/web app-ийн локал storage дээр байдаг. Өөр төхөөрөмжид шилжүүлэхдээ `Тохиргоо → JSON экспорт/импорт` ашигла. iOS storage-г устгавал мэдээлэл алдагдана. Бодит хувийн мэдээлэл/бүртгэлийн дугаар upload хийхгүй байхыг зөвлөж байна.

## Төслийн бүтэц

- `index.html` — үндсэн HTML + iOS PWA meta
- `styles.css` — бүх responsive CSS
- `app.js` — UI болон өгөгдөлтэй ажиллах логик
- `manifest.webmanifest` — Home Screen аппын мэдээлэл
- `sw.js` — оффлайн хадгалалтын Service Worker
- `icons/` — аппын icon

## Багшид тайлбарлах түлхүүр ойлголтууд

- HTML, CSS, Vanilla JavaScript
- PWA, Web App Manifest, Service Worker
- Event delegation, template rendering
- FormData, file input, Canvas image resizing
- LocalStorage + JSON import/export
- Responsive design, CSS env(safe-area-inset-*)

## Нэмэлт анхааруулга

Энэ загвар бодит хэрэглэгчийн үнэмлэхийн баталгаажуулалт, QR эсвэл улсын тэмдэг бүхий үнэмлэхийг дууриан гаргахгүй. Тэмдэглэгээг арилгаж албан баримт мэт ашиглах зориулалтгүй.
