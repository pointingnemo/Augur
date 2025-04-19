

// import { useEffect, useState } from 'react';
// import * as Location from 'expo-location';
// import {
//   ActivityIndicator,
//   Image,
//   ScrollView as RNScrollView,
//   Text as RNText,
//   View as RNView,
//   FlatList,
//   Alert,
//   TextInput as RNTextInput,
//   TouchableOpacity,
// } from 'react-native';
// import { cssInterop } from 'nativewind';
// import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useLocalSearchParams } from 'expo-router';

// const View = cssInterop(RNView, { className: 'style' });
// const Text = cssInterop(RNText, { className: 'style' });
// const ScrollView = cssInterop(RNScrollView, { className: 'style' });

// const API_KEY = '9164cb7acc144b4fab825251251804';

// interface WeatherData {
//   location: {
//     name: string;
//     country: string;
//     localtime: string;
//     tz_id: string;
//   };
//   current: {
//     temp_c: number;
//     condition: { text: string; icon: string };
//     feelslike_c: number;
//     humidity: number;
//     wind_kph: number;
//   };
//   forecast: {
//     forecastday: {
//       date: string;
//       day: {
//         maxtemp_c: number;
//         mintemp_c: number;
//         condition: { text: string; icon: string };
//       };
//       hour: {
//         time: string;
//         temp_c: number;
//         condition: { icon: string };
//       }[];
//     }[];
//   };
// }

// interface fav{
//   name:string
// }
// const getGradient = (condition: string): string[] => {
//   if (condition.includes('Sunny')) return ['#facc15', '#f97316'];
//   if (condition.includes('Rain')) return ['#60a5fa', '#3b82f6'];
//   if (condition.includes('Cloud')) return ['#a5b4fc', '#6366f1'];
//   if (condition.includes('Snow')) return ['#bae6fd', '#7dd3fc'];
//   return ['#d4d4d8', '#a1a1aa']; // default gray
// };

// const FAVORITES_KEY = 'weather_favorites';

// export default function WeatherScreen() {
//   const params=useLocalSearchParams();
//   const passedCity = typeof params.city === 'string' ? params.city : null;

//   const [weather, setWeather] = useState<WeatherData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [city, setCity] = useState('');
//   const [useCurrentLocation, setUseCurrentLocation] = useState(true);
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [favorites, setFavorites] = useState<string[]>([]);

//   const saveToFavorites = async (city: string) => {
//     try {
//       let existing = await AsyncStorage.getItem(FAVORITES_KEY);
//       let favs = existing ? JSON.parse(existing) : [];

//       if (!favs.includes(city)) {
//         favs.push(city);
//         await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
//         setFavorites(favs);
//       }
//     } catch (err) {
//       console.log('Favorites error:', err);
//     }
//   };

//   const loadFavorites = async () => {
//     const data = await AsyncStorage.getItem(FAVORITES_KEY);
//     if (data) setFavorites(JSON.parse(data));
//   };

//   const fetchWeather = async (query: string) => {
//     setLoading(true);
//     try {
//       if (useCurrentLocation) {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Permission Denied', 'Location permission is required.');
//           return;
//         }
//         const loc = await Location.getCurrentPositionAsync({});
//         query = `${loc.coords.latitude},${loc.coords.longitude}`;
//       } else {
//         if (!city.trim()) {
//           Alert.alert('Error', 'Please enter a city name.');
//           setLoading(false);
//           return;
//         }
//         query = city.trim();
//       }

//       const res = await fetch(
//         `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3`
//       );
//       const data = await res.json();
//       setWeather(data);
//     } catch (err) {
//       console.error('Fetch error:', err);
//       Alert.alert('Error fetching weather data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//       const initialize = async () => {
//         loadFavorites();

//         if (passedCity) {
//           setUseCurrentLocation(false);
//           setCity(passedCity);
//           await fetchWeather(passedCity);
//         } else if (useCurrentLocation) {
//           const { status } = await Location.requestForegroundPermissionsAsync();
//           if (status !== 'granted') {
//             Alert.alert('Permission Denied', 'Location permission is required.');
//             return;
//           }

//           const loc = await Location.getCurrentPositionAsync({});
//           const query = `${loc.coords.latitude},${loc.coords.longitude}`;
//           fetchWeather(query);
//         }
//       };

//       initialize();
//     }, [passedCity]);


//   if (loading || !weather) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text className="text-lg mt-4">Loading...</Text>
//       </View>
//     );
//   }

//   const bgColors = getGradient(weather.current.condition.text);
//   const todayHours = weather.forecast.forecastday[0].hour.slice(0, 24);

//   return (
//     <LinearGradient colors={bgColors} className="flex-1 px-4 pt-20">
//       <View className="flex-row items-center mb-4 space-x-2">
//         <View className="flex-1 bg-white/20 rounded-xl px-3 py-2">
//           <RNTextInput
//             placeholder="Enter city"
//             placeholderTextColor="#ffffff"
//             value={city}
//             onChangeText={async (text) => {
//               setCity(text);
//               if (text.length < 2) {
//                 setSuggestions([]);
//                 return;
//               }

//               try {
//                 const res = await fetch(
//                   `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${text}`
//                 );
//                 const data = await res.json();
//                 setSuggestions(data);
//               } catch (err) {
//                 console.error('Autocomplete fetch error:', err);
//               }
//             }}
//             className="text-white"
//           />
//         </View>

//         <TouchableOpacity
//           onPress={() => {
//             if (!city.trim()) {
//               Alert.alert('Please enter a city');
//               return;
//             }
//             setUseCurrentLocation(false);
//             fetchWeather(city.trim());
//           }}
//           className="bg-blue-500 px-4 ml-4 py-2 rounded-xl"
//         >
//           <Text className="text-white font-semibold">Search</Text>
//         </TouchableOpacity>
//       </View>

//       {suggestions.length > 0 && (
//         <FlatList
//           data={suggestions}
//           keyExtractor={(item, index) => item.id?.toString() || index.toString()}
//           style={{ maxHeight: 240 }}
//           className="bg-white/20 rounded-xl mb-4 min-h-20"
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => {
//                 setCity(item.name);
//                 setSuggestions([]);
//                 setUseCurrentLocation(false);
//                 fetchWeather(item.name);
//               }}
//               className="px-5 py-4 border-b border-white/10"
//             >
//               <Text className="text-white text-base">
//                 {item.name}, {item.region}, {item.country}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />
//       )}

//       <TouchableOpacity
//         onPress={() => {
//           setCity('');
//           setUseCurrentLocation(true);
//         }}
//         className="mb-4 self-center bg-green-500 px-4 py-1 rounded-full"
//       >
//         <Text className="text-white">Use Current Location</Text>
//       </TouchableOpacity>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View className="items-center mb-6">
//           <Text className="text-3xl font-semibold text-white">{weather.location.name}</Text>
//           <Text className="text-md text-white/80">{weather.location.country}</Text>
//           <Image source={{ uri: `https:${weather.current.condition.icon}` }} className="w-24 h-24 my-4" />
//           <Text className="text-5xl font-bold text-white">{weather.current.temp_c}°C</Text>
//           <Text className="text-lg text-white/90 mt-1">{weather.current.condition.text}</Text>
//         </View>

//         <TouchableOpacity
//           onPress={() => {
//             if (weather?.location?.name) {
//               saveToFavorites(weather.location.name);
//             }
//           }}
//           className="bg-yellow-300 px-4 py-2 rounded-full self-center my-3"
//         >
//           <Text className="text-black font-semibold">Add to Favorites</Text>
//         </TouchableOpacity>

//         <Text className="text-xl font-bold text-white mb-2">Next 24 Hours</Text>
//         <FlatList
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           data={todayHours}
//           keyExtractor={(item) => item.time}
//           renderItem={({ item }) => (
//             <View className="bg-white/20 p-3 m-1 rounded-lg items-center w-24">
//               <Text className="text-white text-xs">{item.time.split(' ')[1]}</Text>
//               <Image source={{ uri: `https:${item.condition.icon}` }} className="w-10 h-10 my-1" />
//               <Text className="text-white font-semibold">{item.temp_c}°C</Text>
//             </View>
//           )}
//         />

//         <Text className="text-xl font-bold text-white mt-8 mb-2">3-Day Forecast</Text>
//         {weather.forecast.forecastday.map((day) => (
//           <View
//             key={day.date}
//             className="bg-white/20 rounded-xl p-4 mb-3 flex-row justify-between items-center"
//           >
//             <View>
//               <Text className="text-white font-semibold">{day.date}</Text>
//               <Text className="text-white/80 text-sm">{day.day.condition.text}</Text>
//             </View>
//             <Image source={{ uri: `https:${day.day.condition.icon}` }} className="w-12 h-12" />
//             <View className="items-end">
//               <Text className="text-white font-semibold">↑ {day.day.maxtemp_c}°C</Text>
//               <Text className="text-white/70">↓ {day.day.mintemp_c}°C</Text>
//             </View>
//           </View>
//         ))}

//         <View className="mt-6 mb-10 items-center">
//           <Text className="text-white text-sm">🕒 {weather.location.localtime}</Text>
//           <Text className="text-white/60 text-xs">{weather.location.tz_id}</Text>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }








































// index.tsx
import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import {
  ActivityIndicator,
  Image,
  ScrollView as RNScrollView,
  Text as RNText,
  View as RNView,
  FlatList,
  Alert,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import debounce from 'lodash.debounce';

const View = cssInterop(RNView, { className: 'style' });
const Text = cssInterop(RNText, { className: 'style' });
const ScrollView = cssInterop(RNScrollView, { className: 'style' });

const API_KEY = '9164cb7acc144b4fab825251251804';
const FAVORITES_KEY = 'weather_favorites';

interface WeatherData {
  location: { name: string; country: string; localtime: string; tz_id: string };
  current: { temp_c: number; condition: { text: string; icon: string }; feelslike_c: number; humidity: number; wind_kph: number };
  forecast: {
    forecastday: {
      date: string;
      day: { maxtemp_c: number; mintemp_c: number; condition: { text: string; icon: string } };
      hour: { time: string; temp_c: number; condition: { icon: string } }[];
    }[];
  };
}

const getGradient = (condition: string): string[] => {
  if (condition.includes('Sunny')) return ['#facc15', '#f97316'];
  if (condition.includes('Rain')) return ['#60a5fa', '#3b82f6'];
  if (condition.includes('Cloud')) return ['#a5b4fc', '#6366f1'];
  if (condition.includes('Snow')) return ['#bae6fd', '#7dd3fc'];
  return ['#d4d4d8', '#a1a1aa'];
};

export default function WeatherScreen() {
  const params = useLocalSearchParams();
  const passedCity = typeof params.city === 'string' ? params.city : null;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const saveToFavorites = async (city: string) => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      const favs = data ? JSON.parse(data) : [];
      if (!favs.includes(city)) {
        const updated = [...favs, city];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        setFavorites(updated);
      }
    } catch (err) {
      console.log('Favorites error:', err);
    }
  };

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) setFavorites(JSON.parse(data));
  };

  const fetchWeather = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=3`);
      const data = await res.json();
      if (data.error) {
        Alert.alert('Error', data.error.message || 'Failed to fetch weather.');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to fetch weather.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const query = `${loc.coords.latitude},${loc.coords.longitude}`;
      fetchWeather(query);
    } catch (err) {
      Alert.alert('Error', 'Failed to get location.');
    }
  };

  const debouncedAutocomplete = useCallback(
    debounce(async (text: string) => {
      if (text.length < 2) return setSuggestions([]);
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${text}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Autocomplete fetch error:', err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    loadFavorites();
    if (passedCity) {
      setUseCurrentLocation(false);
      setCity(passedCity);
      fetchWeather(passedCity);
    } else {
      fetchLocationWeather();
    }
  }, [passedCity]);

  if (loading || !weather) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg mt-4">Loading...</Text>
      </View>
    );
  }

  const bgColors = getGradient(weather.current.condition.text);
  const todayHours = weather.forecast.forecastday[0].hour.slice(0, 24);

  return (
    <LinearGradient colors={bgColors} className="flex-1 px-4 pt-20">
      <View className="flex-row items-center mb-4 space-x-2">
        <View className="flex-1 bg-white/20 rounded-xl px-3 py-2">
          <RNTextInput
            placeholder="Enter city"
            placeholderTextColor="#ffffff"
            value={city}
            onChangeText={(text) => {
              setCity(text);
              debouncedAutocomplete(text);
            }}
            className="text-white"
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (!city.trim()) {
              Alert.alert('Please enter a city');
              return;
            }
            setUseCurrentLocation(false);
            fetchWeather(city.trim());
          }}
          className="bg-blue-500 px-4 ml-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          style={{ maxHeight: 240 }}
          className="bg-white/20 rounded-xl mb-4 min-h-20"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setCity(item.name);
                setSuggestions([]);
                setUseCurrentLocation(false);
                fetchWeather(item.name);
              }}
              className="px-5 py-4 border-b border-white/10"
            >
              <Text className="text-white text-base">
                {item.name}, {item.region}, {item.country}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          setCity('');
          setUseCurrentLocation(true);
          fetchLocationWeather();
        }}
        className="mb-4 self-center bg-green-500 px-4 py-1 rounded-full"
      >
        <Text className="text-white">Use Current Location</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6">
          <Text className="text-3xl font-semibold text-white">{weather.location.name}</Text>
          <Text className="text-md text-white/80">{weather.location.country}</Text>
          <Image source={{ uri: `https:${weather.current.condition.icon}` }} className="w-24 h-24 my-4" />
          <Text className="text-5xl font-bold text-white">{weather.current.temp_c}°C</Text>
          <Text className="text-lg text-white/90 mt-1">{weather.current.condition.text}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (weather?.location?.name) saveToFavorites(weather.location.name);
          }}
          className="bg-yellow-300 px-4 py-2 rounded-full self-center my-3"
        >
          <Text className="text-black font-semibold">Add to Favorites</Text>
        </TouchableOpacity>

        <Text className="text-xl font-bold text-white mb-2">Next 24 Hours</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={todayHours}
          keyExtractor={(item) => item.time}
          renderItem={({ item }) => (
            <View className="bg-white/20 p-3 m-1 rounded-lg items-center w-24">
              <Text className="text-white text-xs">{item.time.split(' ')[1]}</Text>
              <Image source={{ uri: `https:${item.condition.icon}` }} className="w-10 h-10 my-1" />
              <Text className="text-white font-semibold">{item.temp_c}°C</Text>
            </View>
          )}
        />

        <Text className="text-xl font-bold text-white mt-8 mb-2">3-Day Forecast</Text>
        {weather.forecast.forecastday.map((day) => (
          <View key={day.date} className="bg-white/20 rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-white font-semibold">{day.date}</Text>
              <Text className="text-white/80 text-sm">{day.day.condition.text}</Text>
            </View>
            <Image source={{ uri: `https:${day.day.condition.icon}` }} className="w-12 h-12" />
            <View className="items-end">
              <Text className="text-white font-semibold">↑ {day.day.maxtemp_c}°C</Text>
              <Text className="text-white/70">↓ {day.day.mintemp_c}°C</Text>
            </View>
          </View>
        ))}

        <View className="mt-6 mb-10 items-center">
          <Text className="text-white text-sm">🕒 {weather.location.localtime}</Text>
          <Text className="text-white/60 text-xs">{weather.location.tz_id}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
