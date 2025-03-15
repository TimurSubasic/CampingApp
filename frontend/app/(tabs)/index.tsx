import React, { useLayoutEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, Platform, StatusBar, ImageBackground } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import {useHeaderHeight} from '@react-navigation/elements'
import RecommendButtons from '@/components/rbuttons'
import Places from '@/components/places'
import places from '@/data/places.json'

export default function Page() {
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          <TouchableOpacity onPress={() => {}}>
          <Ionicons name="menu-outline" size={30} color="white" style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => {}}>
        
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Select places from 'All' for 'Hidden Gems'
  const hiddenGems = places.slice(0, 1); 

  // Filter places based on category selection
  const filteredPlaces =
    selectedCategory === 'all'
      ? places
      : selectedCategory === 'hidden_gems'
      ? hiddenGems
      : [];

  return (
    <View style={[styles.container]}>
      {/* Background image for the top section */}
      <ImageBackground
        source={require('@/assets/images/camper.jpeg')} 
        style={[styles.backgroundImage, { paddingTop: headerHeight }]} 
      >
        <View style={styles.headerContainer}>
        </View>
      </ImageBackground>

      <View style={styles.contentContainer}>
        <RecommendButtons onCategorySelect={setSelectedCategory} />
        <Places places={filteredPlaces} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 40 : 20, 
  },
  menuIcon: {
    padding: 10,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    marginTop: -30,
  },
});
