// import { useEffect, useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { IconSymbol } from '@/components/ui/IconSymbol';

// const FAVORITES_KEY = 'weather_favorites';

// export default function FavoritesScreen() {
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const router = useRouter();

//   const goToCityWeather = (city: string) => {
//     router.push({
//       pathname: '/(tabs)',
//       params: { city },
//     });
//   };

//   const loadFavorites = async () => {
//     const data = await AsyncStorage.getItem(FAVORITES_KEY);
//     if (data) setFavorites(JSON.parse(data));
//   };

//   const deleteFavorite = async (cityToDelete: string) => {
//     const updated = favorites.filter(city => city !== cityToDelete);
//     setFavorites(updated);
//     await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
//   };

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   return (
//     <View className="flex-1 bg-white dark:bg-black px-4 pt-20">
//       <Text className="text-2xl font-bold text-blue-500 mb-4">⭐ Favorites</Text>

//       <FlatList
//         data={favorites}
//         keyExtractor={(item) => item}
//         renderItem={({ item: city }) => (
//           <View className="bg-yellow-200 rounded-lg p-4 mb-3 flex-row justify-between items-center">
//             <TouchableOpacity onPress={() => goToCityWeather(city)}>
//               <Text className="text-lg text-black">{city}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => deleteFavorite(city)}>
//               <IconSymbol name="trash" color="red" size={20} />
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </View>
//   );
// }













// favourites.tsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

const FAVORITES_KEY = 'weather_favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const router = useRouter();

  const goToCityWeather = (city: string) => {
    router.push({
      pathname: '/(tabs)',
      params: { city },
    });
  };

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) setFavorites(JSON.parse(data));
  };

  const deleteFavorite = async (cityToDelete: string) => {
    const updated = favorites.filter(city => city !== cityToDelete);
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  useFocusEffect(() => {
    loadFavorites();
  });

  return (
    <View className="flex-1 bg-white dark:bg-black px-4 pt-20">
      <Text className="text-2xl font-bold text-blue-500 mb-4">⭐ Favorites</Text>

      {favorites.length === 0 ? (
        <Text className="text-lg text-gray-500 text-center mt-10">No favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={({ item: city }) => (
            <View className="bg-yellow-200 rounded-lg p-4 mb-3 flex-row justify-between items-center">
              <TouchableOpacity onPress={() => goToCityWeather(city)}>
                <Text className="text-lg text-black">{city}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteFavorite(city)}>
                <IconSymbol name="trash" color="red" size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
