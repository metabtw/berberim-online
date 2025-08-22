Proje: KolayRandevu - Teknik ve Ürün Yol Haritası
Durum: Başlangıç Fazı
Versiyon: 0.0.1 (Planlama)
Son Güncelleme: 22 Ağustos 2025

1. Proje Vizyonu ve Kapsamı
Problem: Geleneksel berber ve kuaför salonları, randevu yönetimini hala büyük ölçüde telefon ve ajanda gibi verimsiz yöntemlerle sürdürmektedir. Bu durum, hem işletme sahibi için randevu çakışmaları, zaman kaybı ve müşteri takibinde zorluklar yaratmakta, hem de modern müşteri için anlık müsaitlik durumunu görememe, telefonla ulaşamama ve plansızlık gibi sorunlara yol açmaktadır.

Çözüm (KolayRandevu): KolayRandevu, bu iki dünyayı bir araya getiren modern bir köprüdür. Müşterilerin, mobil uygulama üzerinden çevrelerindeki berber ve kuaförleri kolayca keşfetmelerini, hizmetleri, fiyatları ve yorumları inceleyerek saniyeler içinde randevu almalarını sağlar. İşletme sahipleri için ise, teknolojiyle arası iyi olmayan bir ustanın bile rahatlıkla kullanabileceği, son derece basit bir yönetim paneli sunarak dijitalleşmenin karmaşıklığını ortadan kaldırır.

Hedef Kitle:

Şehire yeni gelen üniversite öğrencileri,Zamanı değerli, planlı olmayı seven, hizmet almadan önce araştırma yapmayı ve dijital kolaylıkları kullanmayı tercih eden 20-45 yaş arası bireyler.

İşletmeler: Müşteri portföyünü genişletmek, randevu trafiğini düzene sokmak ve modern dünyaya adapte olmak isteyen ancak karmaşık sistemlerden çekinen küçük ve orta ölçekli berber, kuaför ve güzellik salonları.

2. Teknik Altyapı ve Mimari
Proje, birbirleriyle API üzerinden konuşan iki ana bileşenden oluşacak ve tek bir GitHub reposunda (monorepo) yönetilecektir.

Mobil Uygulama (Frontend): React Native (Expo) ile cross-platform (iOS & Android) geliştirilecektir.

API (Backend): C# / ASP.NET Core Web API kullanılarak sağlam ve ölçeklenebilir bir altyapı oluşturulacaktır.

Veritabanı: İlişkisel veri bütünlüğü için PostgreSQL veya SQL Server tercih edilecektir.

Authentication: Güvenlik için endüstri standardı olan JWT (JSON Web Tokens) kullanılacaktır.

3. Geliştirme Durumu
3.1. Tamamlananlar (Yapılanlar)
[✔] Proje Planlaması: MVP (Minimum Uygulanabilir Ürün) kapsamı ve temel özellikleri belirlendi.

[✔] Teknik Dökümantasyon: Bu döküman oluşturularak projenin yol haritası ve teknik gereksinimleri yazılı hale getirildi.

[✔] Teknoloji Yığını Seçimi: Frontend, backend ve veritabanı teknolojileri üzerinde anlaşma sağlandı.

[✔] GitHub Repository Kurulumu:

kolayrandevu adında özel (private) bir repository oluşturuldu.

Frontend ve backend geliştiricileri "collaborator" olarak eklendi.

main branch için Pull Request koruma kuralları aktif edildi.

[✔] Monorepo Yapısının Oluşturulması: Ana dizin yapısı (/mobile, /backend, /docs, /.github) oluşturuldu.

3.2. Yapılacaklar (Yol Haritası)
Bu bölüm, projenin hayata geçirilmesi için gereken tüm adımları fazlara ayrılmış şekilde detaylandırmaktadır.

FAZ 1: MVP (Minimum Uygulanabilir Ürün) - Temel İşlevsellik
Bu fazın amacı, uygulamanın çekirdek fonksiyonlarını hayata geçirerek kullanıcıların temel randevu akışını tamamlamasını sağlamaktır.

Kullanıcı Yönetimi (Authentication):

[ ] Backend: User modeli ve veritabanı tablosunun oluşturulması.

[ ] Backend: E-posta/şifre ile kullanıcı kaydı (/auth/register) ve doğrulaması.

[ ] Backend: Güvenli kullanıcı girişi (/auth/login) ve JWT (accessToken, refreshToken) üretimi.

[ ] Frontend: Kayıt Ol (Register) ve Giriş Yap (Login) ekranlarının tasarlanması ve geliştirilmesi.

[ ] Frontend: Alınan JWT token'ının güvenli bir şekilde cihazda saklanması (SecureStore).

[ ] Frontend: Yetkilendirme gerektiren API isteklerine Authorization header'ının otomatik eklenmesi.

[ ] Backend: Barber ve Service modellerinin ve tablolarının oluşturulması.

[ ] Backend: Berberleri listelemek için temel bir endpoint (GET /barbers). (MVP'de şehir bazlı filtreleme yeterli).

[ ] Backend: Tek bir berberin tüm detaylarını (adres, çalışma saatleri, hizmetler, fiyatlar) getiren endpoint (GET /barbers/{id}).

[ ] Frontend: Ana sayfada berberlerin bir liste halinde gösterilmesi.

[ ] Frontend: Tıklanan bir berber için tüm detaylarının gösterildiği "Berber Detay" ekranının geliştirilmesi.

Randevu Yönetimi:

[ ] Backend: Appointment modeli ve tablosunun oluşturulması.

[ ] Backend: Yeni bir randevu oluşturmak için endpoint (POST /appointments). Bu endpoint, seçilen saatin uygunluğunu kontrol etmelidir.

[ ] Backend: Bir kullanıcının kendi randevularını listelemesi için endpoint (GET /appointments/me).

[ ] Frontend: Berber detay sayfasından randevu alma akışının başlatılması.

[ ] Frontend: Kullanıcının tarih ve uygun bir saat seçebileceği arayüzün geliştirilmesi.

[ ] Frontend: Randevu özetini gösteren ve son onayı alan bir "Onay" ekranı.

Kullanıcı Profili:

[ ] Backend: Kullanıcının kendi profil bilgilerini getiren (GET /users/me) ve güncelleyen (PUT /users/me) endpoint'ler.

[ ] Frontend: Kullanıcının temel bilgilerini (ad, e-posta, telefon) görebileceği bir "Profilim" ekranı.

[ ] Frontend: "Geçmiş Randevularım" sekmesi altında, GET /appointments/me endpoint'inden gelen verilerin listelenmesi.

FAZ 2: Gelişmiş Özellikler ve Kullanıcı Deneyimi
Bu faz, MVP üzerine inşa edilerek uygulamayı daha kullanışlı, etkileşimli ve rekabetçi hale getirmeyi amaçlar.

[ ] Gelişmiş Arama ve Filtreleme:

Ana sayfaya güçlü bir arama çubuğu eklenmesi (berber adı, semt ile arama).

Filtreleme seçenekleri: Puana göre sıralama, anlık olarak müsait olanları gösterme, belirli bir hizmeti sunanları filtreleme.

[ ] Harita Entegrasyonu:

Berberlerin liste görünümüne ek olarak harita üzerinde de gösterilmesi.

Kullanıcının mevcut konumuna en yakın berberleri gösterme.

[ ] Puanlama ve Yorum Sistemi:

Kullanıcıların tamamlanmış randevular sonrası hizmet aldıkları berbere 1-5 arası puan verebilmesi ve yorum yazabilmesi.

Berber detay sayfasında diğer kullanıcıların yorumlarının gösterilmesi.

[ ] Anlık Bildirimler (Push Notifications):

Randevu oluşturulduğunda anlık onay bildirimi.

Randevudan 1 saat veya 24 saat önce otomatik hatırlatma bildirimi.

(İleri seviye) İşletmenin randevuyu iptal etmesi durumunda bilgilendirme.

[ ] Favori Berberler:

Kullanıcıların beğendikleri berberleri favorilerine ekleyebilmesi.

Profil sayfasında favori berberlere hızlı erişim için bir sekme.

FAZ 3: Platform Büyümesi ve İşletme Araçları
Bu faz, uygulamanın bir ekosisteme dönüşmesi, gelir modeli oluşturması ve işletmelere daha fazla değer sunması üzerine odaklanır.

[ ] Online Ödeme Entegrasyonu:

Kullanıcıların randevu alırken kredi kartı ile kapora veya hizmet bedelinin tamamını ödeyebilmesi (Iyzico, Stripe entegrasyonu).

[ ] Personel Seçimi:

Randevu alırken işletmedeki belirli bir personeli (Ali Usta, Veli Kalfa vb.) seçme imkanı.

[ ] İşletme Yönetim Paneli (Admin Panel):

İşletmelerin kendi profilini, hizmetlerini, fiyatlarını ve çalışma saatlerini güncelleyebileceği basit bir web paneli.

Randevuları takvim üzerinde görüntüleme, manuel randevu ekleme ve belirli saatleri bloke etme (öğle arası vb.).

[ ] Abonelik ve "Öne Çıkarma" Modeli:

İşletmeler için aylık/yıllık abonelik paketleri.

Ek ücret karşılığında arama sonuçlarında veya ana sayfada "öne çıkanlar" bölümünde yer alma imkanı.

[ ] Hediye Kartları ve Sadakat Programları:

Kullanıcıların belirli bir berber için hediye kartı satın alabilmesi.

"5 tıraşa 1'i bedava" gibi sadakat programlarının sisteme entegre edilmesi.

[ ] İşletmeler için Analiz ve Raporlama:

İşletme panelinde aylık ciro, en çok tercih edilen hizmetler, yeni/eski müşteri oranı gibi basit raporların sunulması.