import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
  Modal,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, gradients } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375; // iPhone SE and smaller
const isMediumScreen = width >= 375 && width < 428; // iPhone 6/7/8/X/XR/11/12/13
const isLargeScreen = width >= 428; // iPhone 6+/X Max and larger

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'list'
  const [activeCardId, setActiveCardId] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Mock data for barbers
  const mockBarbers = [
    {
      id: 1,
      name: 'Mehmet Berber Salonu',
      rating: 4.8,
      image: null,
      isPopular: true,
      distance: '0.5 km',
      distanceValue: 0.5,
      price: 50,
      priceRange: 'low',
    },
    {
      id: 2,
      name: 'Modern Kuaför',
      rating: 4.5,
      image: null,
      isPopular: false,
      distance: '1.2 km',
      distanceValue: 1.2,
      price: 75,
      priceRange: 'medium',
    },
    {
      id: 3,
      name: 'Elit Berber',
      rating: 4.9,
      image: null,
      isPopular: true,
      distance: '0.8 km',
      distanceValue: 0.8,
      price: 120,
      priceRange: 'high',
    },
    {
      id: 4,
      name: 'Klasik Kuaför',
      rating: 4.3,
      image: null,
      isPopular: false,
      distance: '2.1 km',
      distanceValue: 2.1,
      price: 45,
      priceRange: 'low',
    },
    {
      id: 5,
      name: 'Saç Tasarım Merkezi',
      rating: 4.7,
      image: null,
      isPopular: true,
      distance: '1.5 km',
      distanceValue: 1.5,
      price: 90,
      priceRange: 'medium',
    },
    {
      id: 6,
      name: 'Gentleman Berber',
      rating: 4.6,
      image: null,
      isPopular: false,
      distance: '2.3 km',
      distanceValue: 2.3,
      price: 150,
      priceRange: 'high',
    },
    {
      id: 7,
      name: 'Royal Kuaför',
      rating: 4.4,
      image: null,
      isPopular: true,
      distance: '1.8 km',
      distanceValue: 1.8,
      price: 80,
      priceRange: 'medium',
    },
    {
      id: 8,
      name: 'Trend Berber',
      rating: 4.2,
      image: null,
      isPopular: false,
      distance: '3.1 km',
      distanceValue: 3.1,
      price: 40,
      priceRange: 'low',
    },
    {
      id: 9,
      name: 'Lüks Saç Salonu',
      rating: 4.9,
      image: null,
      isPopular: true,
      distance: '0.9 km',
      distanceValue: 0.9,
      price: 200,
      priceRange: 'high',
    },
    {
      id: 10,
      name: 'Şehir Berberi',
      rating: 4.1,
      image: null,
      isPopular: false,
      distance: '2.7 km',
      distanceValue: 2.7,
      price: 60,
      priceRange: 'medium',
    },
  ];

  // Filter functions
  const applyFilters = () => {
    let filtered = mockBarbers;

    // Distance filter
    if (selectedDistance !== 'all') {
      const maxDistance = parseFloat(selectedDistance);
      filtered = filtered.filter(barber => barber.distanceValue <= maxDistance);
    }

    // Price filter
    if (selectedPrice !== 'all') {
      filtered = filtered.filter(barber => barber.priceRange === selectedPrice);
    }

    // Search filter
    if (searchText && searchText.trim().length > 0) {
      const query = searchText.trim().toLowerCase();
      filtered = filtered.filter(barber => barber.name.toLowerCase().includes(query));
    }

    setFilteredBarbers(filtered);
  };

  const resetFilters = () => {
    setSelectedDistance('all');
    setSelectedPrice('all');
    setFilteredBarbers(mockBarbers);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedDistance, selectedPrice, searchText]);

  useEffect(() => {
    setFilteredBarbers(mockBarbers);
  }, []);

  const handleCardPress = (barberId) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Navigate to barber detail screen (will be implemented later)
    console.log('Barber selected:', barberId);
  };

  const toggleFavorite = (barberId) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(barberId)) {
        next.delete(barberId);
      } else {
        next.add(barberId);
      }
      return next;
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      applyFilters();
      setRefreshing(false);
    }, 800);
  };

  const handleBookPress = (barberId) => {
    const barber = mockBarbers.find(b => b.id === barberId);
    navigation.navigate('Booking', { barber });
  };

  const handleDetailsPress = (barberId) => {
    console.log('Detay:', barberId);
  };

  const renderBarberCard = ({ item, index }) => {
    const isList = layoutMode === 'list';
    return (
      <View style={[styles.barberCard]}>
        <TouchableOpacity
          onPress={() => handleCardPress(item.id)}
          activeOpacity={0.9}
          style={[styles.cardTouchable]}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, puan ${item.rating}, ${item.distance}`}
          onPressIn={() => layoutMode === 'grid' && setActiveCardId(item.id)}
          onPressOut={() => layoutMode === 'grid' && setActiveCardId(null)}
          onMouseEnter={() => layoutMode === 'grid' && setActiveCardId(item.id)}
          onMouseLeave={() => layoutMode === 'grid' && setActiveCardId(null)}
        >
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popüler</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite(item.id)}
            accessibilityRole="button"
            accessibilityLabel={favoriteIds.has(item.id) ? 'Favorilerden kaldır' : 'Favorilere ekle'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={favoriteIds.has(item.id) ? 'heart' : 'heart-outline'}
              size={20}
              color={favoriteIds.has(item.id) ? colors.accent : colors.textSecondary}
            />
          </TouchableOpacity>

          {item.image ? (
            <Image source={{ uri: item.image }} style={[styles.barberImage, isList && styles.barberImageListLarge]} />
          ) : (
            <View style={[styles.barberImage, styles.placeholderImage, isList && styles.barberImageListLarge]}>
              <Ionicons name="person" size={40} color={colors.textPlaceholder} />
            </View>
          )}
          
          {/* Grid overlay actions (hover/press reveal) */}
          {layoutMode === 'grid' && activeCardId === item.id && (
            <View style={styles.cardOverlay} pointerEvents="box-none">
              <View style={styles.overlayActions}>
                <TouchableOpacity
                  onPress={() => handleBookPress(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Randevu al"
                  activeOpacity={0.9}
                  style={[styles.overlayButtonFlex, styles.overlayButtonSpacingBottom]}
                >
                  <LinearGradient
                    colors={[colors.secondary, colors.accent]}
                    style={styles.overlayButtonPrimary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="calendar" size={16} color={colors.white} />
                    <Text style={styles.overlayButtonPrimaryText}>Randevu Al</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDetailsPress(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Detay"
                  activeOpacity={0.9}
                  style={[styles.overlayButtonOutline, styles.overlayButtonFlex]}
                >
                  <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
                  <Text style={styles.overlayButtonOutlineText}>Detay</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={[styles.cardContent, isList && styles.cardContentList]}>
            <Text style={styles.barberName} numberOfLines={1}>
              {item.name}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.accent} />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.distanceText}>• {item.distance}</Text>
            </View>

            {isList && (
              <View style={styles.bookButtonsRow}>
                <TouchableOpacity
                  style={[styles.bookButton, styles.bookButtonFlex]}
                  onPress={() => handleBookPress(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Randevu al"
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={[colors.secondary, colors.accent]}
                    style={styles.bookButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="calendar" size={16} color={colors.white} />
                    <Text style={styles.bookButtonText}>Randevu Al</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bookButton, styles.bookButtonOutline, styles.bookButtonFlex]}
                  onPress={() => handleDetailsPress(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Detay"
                  activeOpacity={0.85}
                >
                  <View style={styles.bookButtonOutlineInner}>
                    <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
                    <Text style={styles.bookButtonOutlineText}>Detay</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.backgroundLight, colors.white]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentInsetAdjustmentBehavior="automatic"
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          bounces={true}
          alwaysBounceVertical={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Kuaförüm Online</Text>
            <Text style={styles.headerSubtitle}>Size en yakın berberleri keşfedin</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={[
              styles.searchInputContainer,
              isSearchFocused && styles.searchInputFocused
            ]}>
              <Ionicons 
                name="search" 
                size={20} 
                color={colors.textPlaceholder} 
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Berber Ara"
                placeholderTextColor={colors.textPlaceholder}
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                returnKeyType="search"
                accessibilityLabel="Berber ara"
              />
              {Boolean(searchText) && (
                <TouchableOpacity
                  onPress={() => setSearchText('')}
                  style={styles.clearButton}
                  accessibilityRole="button"
                  accessibilityLabel="Aramayı temizle"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textPlaceholder} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="location" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Bana En Yakın Berberler</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.secondary, colors.accent]}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="heart" size={20} color={colors.white} />
                <Text style={styles.actionButtonText}>Favorilerim</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Filter Section */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              activeOpacity={0.8}
              style={styles.filterHeader}
              accessibilityRole="button"
              accessibilityLabel="Filtreleri aç veya kapat"
            >
              <Text style={styles.filterTitle}>Filtreler</Text>
              <Ionicons 
                name={showFilters ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
            
            {showFilters && (
              <View style={styles.filterContent}>
                {/* Distance Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Uzaklık</Text>
                  <View style={styles.filterButtons}>
                    {['all', '1', '2', '3'].map((distance) => (
                      <TouchableOpacity
                        key={distance}
                        style={[
                          styles.filterButton,
                          selectedDistance === distance && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedDistance(distance)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          selectedDistance === distance && styles.filterButtonTextActive
                        ]}>
                          {distance === 'all' ? 'Tümü' : `${distance} km`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Price Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Fiyat Aralığı</Text>
                  <View style={styles.filterButtons}>
                    {[
                      { key: 'all', label: 'Tümü' },
                      { key: 'low', label: 'Ekonomik (₺30-60)' },
                      { key: 'medium', label: 'Orta (₺60-100)' },
                      { key: 'high', label: 'Premium (₺100+)' }
                    ].map((price) => (
                      <TouchableOpacity
                        key={price.key}
                        style={[
                          styles.filterButton,
                          selectedPrice === price.key && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedPrice(price.key)}
                      >
                        <Text style={[
                          styles.filterButtonText,
                          selectedPrice === price.key && styles.filterButtonTextActive
                        ]}>
                          {price.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Layout Filter */}
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Listeleme Şekli</Text>
                  <View style={styles.filterButtons}>                    
                    <TouchableOpacity
                      style={[styles.filterButton, layoutMode === 'grid' && styles.filterButtonActive]}
                      onPress={() => setLayoutMode('grid')}
                      accessibilityRole="button"
                      accessibilityLabel="İki sütun görünüm"
                    >
                      <Text style={[styles.filterButtonText, layoutMode === 'grid' && styles.filterButtonTextActive]}>İki Sütun</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.filterButton, layoutMode === 'list' && styles.filterButtonActive]}
                      onPress={() => setLayoutMode('list')}
                      accessibilityRole="button"
                      accessibilityLabel="Tek sütun yatay kart görünüm"
                    >
                      <Text style={[styles.filterButtonText, layoutMode === 'list' && styles.filterButtonTextActive]}>Tek Sütun</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Reset Button */}
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                  <Text style={styles.resetButtonText}>Filtreleri Temizle</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Barbers List */}
          <View style={styles.barbersSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Popüler Berberler</Text>
              <Text style={styles.resultsCount}>{filteredBarbers.length} sonuç</Text>
            </View>
            
            {filteredBarbers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={36} color={colors.textPlaceholder} />
                <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
                <Text style={styles.emptySubtitle}>Filtreleri değiştirin veya aramayı temizleyin.</Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetFilters} accessibilityRole="button">
                  <Ionicons name="refresh" size={16} color={colors.primary} />
                  <Text style={styles.resetButtonText}>Filtreleri Temizle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.barbersGrid, layoutMode === 'list' && styles.barbersListContainer]}>
                {filteredBarbers.map((item, index) => {
                  return (
                    <View
                      key={item.id.toString()}
                      style={layoutMode === 'grid' ? styles.barberCardWrapper : styles.barberCardWrapperList}
                    >
                      {renderBarberCard({ item, index })}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    paddingTop: isSmallScreen ? spacing.md : spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: isSmallScreen ? 14 : 16,
  },
  searchContainer: {
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 0.5,
    borderColor: 'transparent',
    ...shadows.small,
  },
  searchInputFocused: {
    borderColor: colors.lightGray,
    ...shadows.medium,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  clearButton: {
    marginLeft: spacing.xs,
  },
  actionButtonsContainer: {
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallScreen ? spacing.sm : spacing.md,
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    borderRadius: 25,
    ...shadows.medium,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.sm,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 14 : 16,
  },
  barbersSection: {
    paddingHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: 200,
  },
  barbersListContainer: {
    flexDirection: 'column',
  },
  barberCardWrapper: {
    width: isSmallScreen ? '100%' : '48%',
    marginBottom: spacing.md,
  },
  barberCardWrapperList: {
    width: '100%',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  resultsCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  barberCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.medium,
  },
  barberCardList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTouchable: {
    flex: 1,
  },
  cardTouchableList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: isSmallScreen ? spacing.xs : spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    zIndex: 1,
  },
  favButton: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.xs,
    zIndex: 1,
    ...shadows.small,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayActions: {
    width: '85%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  overlayButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 22,
    ...shadows.medium,
  },
  overlayButtonPrimaryText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  overlayButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  overlayButtonFlex: {
    flex: 1,
  },
  overlayButtonSpacingBottom: {
    marginBottom: spacing.md,
  },
  overlayButtonOutlineText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  popularText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: isSmallScreen ? 8 : 10,
  },
  barberImage: {
    width: '100%',
    height: isSmallScreen ? 100 : 120,
    backgroundColor: colors.lightGray,
  },
  barberImageListLarge: {
    height: isSmallScreen ? 160 : 200,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  cardContent: {
    padding: isSmallScreen ? spacing.sm : spacing.md,
  },
  cardContentList: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bookButton: {
    marginTop: spacing.md,
  },
  bookButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  bookButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    ...shadows.small,
  },
  bookButtonText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  bookButtonOutline: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  bookButtonOutlineInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: spacing.md,
  },
  bookButtonFlex: {
    flex: 1,
  },
  bookButtonOutlineText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  barberName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontSize: isSmallScreen ? 14 : 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  distanceText: {
    ...typography.caption,
    color: colors.textPlaceholder,
    marginLeft: spacing.xs,
  },
  // Filter Styles
  filterSection: {
    paddingHorizontal: isSmallScreen ? spacing.sm : spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.white,
    marginHorizontal: isSmallScreen ? spacing.md : spacing.lg,
    borderRadius: 16,
    ...shadows.small,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  filterTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  filterToggle: {
    padding: spacing.xs,
  },
  filterContent: {
    paddingBottom: spacing.md,
  },
  filterGroup: {
    marginBottom: spacing.lg,
  },
  filterLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: isSmallScreen ? spacing.sm : spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minWidth: isSmallScreen ? (width - spacing.md * 4 - spacing.sm) / 2 : 'auto',
    marginBottom: isSmallScreen ? spacing.xs : 0,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: isSmallScreen ? 12 : 14,
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm,
  },
  resetButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    ...shadows.small,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },


});

export default HomeScreen;