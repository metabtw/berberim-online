# Berberim Online - Mobile App

Bu proje React Native + Expo + TypeScript kullanılarak geliştirilmiş bir berber randevu uygulamasıdır.

## 🚀 Özellikler

- **Tema Desteği**: Light/Dark mode geçişi
- **Kullanıcı Kimlik Doğrulama**: Login/Register ekranları
- **Randevu Arama**: Konum, tarih ve saat seçimi
- **Berber Listesi**: 2 sütunlu grid görünüm
- **Filtreleme**: Müsaitlik, popülerlik ve mesafe bazlı
- **Takvim**: Bottom sheet ile tarih seçimi
- **Bekleme Listesi**: Dolu randevular için bildirim sistemi
- **Animasyonlar**: Smooth UI geçişleri

## 🛠 Teknolojiler

- **React Native** + **Expo** + **TypeScript**
- **Navigation**: @react-navigation/native
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animations**: react-native-reanimated
- **Forms**: react-hook-form + zod validation
- **Bottom Sheet**: @gorhom/bottom-sheet
- **Date Handling**: dayjs
- **State Management**: React Context
- **Storage**: AsyncStorage

## 📱 Ekranlar

### Auth Ekranları
- **LoginScreen**: Email/password ile giriş
- **RegisterScreen**: Kullanıcı kaydı

### Ana Ekranlar
- **SearchScreen**: Randevu arama (Obilet tarzı)
- **BarberListScreen**: Berber listesi ve filtreleme

### Componentler
- **BarberCard**: Berber kartı (aspect ratio 0.95, minHeight 220)
- **SearchBar**: Arama çubuğu
- **Chip**: Seçim chipleri
- **RatingStars**: Yıldız rating gösterimi
- **SkeletonCard**: Loading durumu
- **EmptyState**: Boş durum gösterimi

## 🎨 Tema Renkleri

### Light Theme
- Primary: #2F4553
- Secondary: #C49A6C
- Accent: #4AA3A2
- Background: #F5F7F9
- Card: #FFFFFF
- Text: #1E232B
- Muted: #6B7280
- Border: #E5E7EB

### Dark Theme
- Primary: #5DADE2
- Secondary: #B88A57
- Accent: #6CCFCB
- Background: #121417
- Card: #1B1F24
- Text: #E6EAF0
- Muted: #9AA3AF
- Border: #2A2F36

## 📦 Kurulum

1. **Dependencies yükleyin:**
```bash
npm install
```

2. **Expo CLI kurulumu (global):**
```bash
npm install -g @expo/cli
```

3. **Uygulamayı başlatın:**
```bash
npx expo start
```

4. **Platform seçimi:**
   - `i` - iOS simulator
   - `a` - Android emulator
   - `w` - Web browser
   - QR kod ile fiziksel cihaz

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── components/          # Yeniden kullanılabilir componentler
│   ├── BarberCard.tsx
│   ├── SearchBar.tsx
│   ├── Chip.tsx
│   ├── RatingStars.tsx
│   ├── SkeletonCard.tsx
│   └── EmptyState.tsx
├── screens/             # Ekran componentleri
│   ├── Auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── SearchScreen.tsx
│   └── BarberListScreen.tsx
├── services/            # API ve veri servisleri
│   ├── mock.ts         # Mock veri servisi
│   └── availability.ts # Müsaitlik hesaplamaları
├── theme/              # Tema yönetimi
│   ├── colors.ts       # Renk tanımları
│   └── ThemeContext.tsx # Tema context
└── types/              # TypeScript tip tanımları
    └── index.ts
```

### Mock Veri

Uygulama tamamen mock veri ile çalışır:
- 20 berber verisi
- Müsaitlik durumları
- Randevu slotları
- Kullanıcı kimlik doğrulama

### Önemli Özellikler

1. **Two-Column FlatList Fix**: 
   - `numColumns={2}`
   - `columnWrapperStyle` ile gap
   - Sabit `aspectRatio` ve `minHeight`

2. **Bottom Sheet Calendar**:
   - `@gorhom/bottom-sheet` kullanımı
   - Aylık takvim görünümü
   - Tarih seçimi ve state güncelleme

3. **Availability System**:
   - Berber durumları: available, full, closed
   - Sıralama: available → full → closed
   - Grayscale efekt dolu kartlar için

4. **Waitlist Notification**:
   - Dolu kartlarda "Bildirim Al" butonu
   - Local state yönetimi
   - Toast bildirimleri

5. **Theme Toggle**:
   - Header'da light/dark switch
   - AsyncStorage ile kalıcılık
   - Tüm componentlerde theme token kullanımı

## 🎯 Kabul Kriterleri

✅ `npx expo start` çalışıyor
✅ Login/Register animasyonlu ve validasyonlu
✅ Search ekranı: konum, tarih, saat seçimi
✅ Bottom-sheet takvim çalışıyor
✅ BarberList: 2 sütun, kartlar doğru boyutlarda
✅ Theme toggle sorunsuz çalışıyor
✅ TypeScript, component tabanlı mimari
✅ Tüm veri mock servislerden geliyor

## 🐛 Bilinen Sorunlar

- Gerçek API entegrasyonu yok (mock veri kullanılıyor)
- Push notification sistemi yok
- Offline destek yok

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.