/**
 * 基于Leaflet的地理位置服务
 * 支持国家和城市选择，通过 Nominatim API 获取经纬度坐标
 */

import L from 'leaflet';

// 支持的国家和常见城市名称列表（不包含经纬度，所有坐标通过 API 获取）
const worldCityNames = {
  'China': [
    'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Chongqing', 'Tianjin', 
    'Xi\'an', 'Suzhou', 'Wuhan', 'Nanjing', 'Qingdao', 'Dalian', 'Ningbo', 'Xiamen'
  ],
  'United States': [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'
  ],
  'Japan': [
    'Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 
    'Fukuoka', 'Kobe', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai'
  ],
  'South Korea': [
    'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju',
    'Ulsan', 'Suwon', 'Changwon', 'Goyang'
  ],
  'United Kingdom': [
    'London', 'Birmingham', 'Liverpool', 'Manchester', 'Leeds', 
    'Glasgow', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'
  ],
  'France': [
    'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 
    'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'
  ],
  'Germany': [
    'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 
    'Dusseldorf', 'Dortmund', 'Essen', 'Leipzig'
  ],
  'Australia': [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 
    'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Logan City'
  ],
  'Canada': [
    'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 
    'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'
  ],
  'Italy': [
    'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 
    'Bologna', 'Florence', 'Bari', 'Catania'
  ],
  'Spain': [
    'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 
    'Malaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'
  ],
  'Russia': [
    'Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 
    'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Samara', 'Omsk', 'Rostov-on-Don'
  ],
  'Brazil': [
    'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
    'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'
  ],
  'India': [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
    'Pune', 'Ahmedabad', 'Surat', 'Jaipur'
  ],
  'Mexico': [
    'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana',
    'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí'
  ],
  'Netherlands': [
    'Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven',
    'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'
  ],
  'Belgium': [
    'Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège',
    'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'
  ],
  'Switzerland': [
    'Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne',
    'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano', 'Biel'
  ],
  'Austria': [
    'Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck',
    'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'
  ],
  'Sweden': [
    'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås',
    'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'
  ],
  'Norway': [
    'Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Drammen',
    'Fredrikstad', 'Kristiansand', 'Sandnes', 'Tromsø', 'Sarpsborg'
  ],
  'Denmark': [
    'Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg',
    'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'
  ],
  'Finland': [
    'Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu',
    'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori'
  ],
  'Poland': [
    'Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań',
    'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'
  ],
  'Czech Republic': [
    'Prague', 'Brno', 'Ostrava', 'Plzen', 'Liberec',
    'Olomouc', 'Budweis', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice'
  ],
  'Hungary': [
    'Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs',
    'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'
  ],
  'Thailand': [
    'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Nakhon Ratchasima',
    'Hat Yai', 'Udon Thani', 'Surat Thani', 'Khon Kaen', 'Nakhon Si Thammarat'
  ],
  'Singapore': [
    'Singapore'
  ],
  'Malaysia': [
    'Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya',
    'Klang', 'Johor Bahru', 'Subang Jaya', 'Kuching', 'Kota Kinabalu'
  ],
  'Indonesia': [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'
  ],
  'Philippines': [
    'Manila', 'Quezon City', 'Caloocan', 'Davao', 'Cebu City',
    'Zamboanga', 'Antipolo', 'Pasig', 'Taguig', 'Valenzuela'
  ],
  'Vietnam': [
    'Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho',
    'Bien Hoa', 'Hue', 'Nha Trang', 'Buon Ma Thuot', 'Nam Dinh'
  ],
  'New Zealand': [
    'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga',
    'Napier-Hastings', 'Dunedin', 'Palmerston North', 'Nelson', 'Rotorua'
  ]
};

/**
 * 用户自定义城市存储
 */
let customCities = JSON.parse(localStorage.getItem('leaflet_custom_cities') || '[]');

/**
 * 坐标缓存，避免重复请求相同城市的坐标
 */
const coordinatesCache = new Map();

/**
 * 获取所有支持的国家列表
 * @returns {Array} 国家名称数组
 */
export function getCountries() {
  return Object.keys(worldCityNames);
}

/**
 * 获取指定国家的城市名称列表
 * @param {string} country - 国家名称
 * @returns {Array} 城市名称列表
 */
export function getCitiesByCountry(country) {
  const cities = worldCityNames[country] || [];
  // 合并用户自定义的该国家城市
  const customCountryCities = customCities
    .filter(city => city.country === country)
    .map(city => city.name);
  return [...cities, ...customCountryCities];
}

/**
 * 通过 Nominatim API 获取城市坐标
 * @param {string} cityName - 城市名称
 * @param {string} country - 国家名称（可选，用于提高搜索精度）
 * @returns {Promise<Object|null>} 包含 lat, lng 的坐标对象，如果未找到返回 null
 */
export async function getCityCoordinates(cityName, country = '') {
  const cacheKey = `${country}-${cityName}`;
  
  // 检查缓存
  if (coordinatesCache.has(cacheKey)) {
    return coordinatesCache.get(cacheKey);
  }
  
  // 先检查用户自定义城市
  const customCity = customCities.find(city => 
    city.name === cityName && city.country === country
  );
  if (customCity) {
    const coordinates = { lat: customCity.lat, lng: customCity.lng };
    coordinatesCache.set(cacheKey, coordinates);
    return coordinates;
  }
  
  try {
    // 构建搜索查询
    let searchQuery = cityName;
    if (country) {
      searchQuery = `${cityName}, ${country}`;
    }
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Nominatim API request failed');
    }
    
    const results = await response.json();
    
    if (results.length === 0) {
      console.warn(`No coordinates found for city: ${searchQuery}`);
      coordinatesCache.set(cacheKey, null);
      return null;
    }
    
    const coordinates = {
      lat: parseFloat(results[0].lat),
      lng: parseFloat(results[0].lon)
    };
    
    // 缓存结果
    coordinatesCache.set(cacheKey, coordinates);
    console.log(`Coordinates found for ${searchQuery}:`, coordinates);
    
    return coordinates;
  } catch (error) {
    console.error(`Error fetching coordinates for ${searchQuery}:`, error);
    coordinatesCache.set(cacheKey, null);
    return null;
  }
}

/**
 * 添加用户自定义城市
 * @param {string} cityName - 城市名称
 * @param {string} country - 国家名称
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {boolean} 是否添加成功
 */
export function addCustomCity(cityName, country, lat, lng) {
  try {
    // 验证输入
    if (!cityName || !country || typeof lat !== 'number' || typeof lng !== 'number') {
      console.error('Invalid input for custom city');
      return false;
    }

    // 检查是否已存在
    const exists = customCities.some(city => 
      city.name === cityName && city.country === country
    );
    
    if (exists) {
      console.warn('City already exists in custom cities');
      return false;
    }

    // 添加新城市
    const newCity = {
      name: cityName,
      country,
      lat,
      lng,
      custom: true
    };

    customCities.push(newCity);
    localStorage.setItem('leaflet_custom_cities', JSON.stringify(customCities));
    
    console.log(`Successfully added custom city: ${cityName}, ${country}`);
    return true;
  } catch (error) {
    console.error('Error adding custom city:', error);
    return false;
  }
}

/**
 * 获取所有用户自定义城市
 * @returns {Array} 自定义城市列表
 */
export function getCustomCities() {
  return [...customCities];
}

/**
 * 删除用户自定义城市
 * @param {string} cityName - 城市名称
 * @param {string} country - 国家名称
 * @returns {boolean} 是否删除成功
 */
export function removeCustomCity(cityName, country) {
  try {
    const index = customCities.findIndex(city => 
      city.name === cityName && city.country === country
    );
    
    if (index === -1) {
      console.warn('Custom city not found');
      return false;
    }

    customCities.splice(index, 1);
    localStorage.setItem('leaflet_custom_cities', JSON.stringify(customCities));
    
    console.log(`Successfully removed custom city: ${cityName}, ${country}`);
    return true;
  } catch (error) {
    console.error('Error removing custom city:', error);
    return false;
  }
}

/**
 * 使用 Leaflet Geocoding API 搜索城市（Nominatim）
 * @param {string} query - 搜索查询
 * @returns {Promise<Array>} 搜索结果数组
 */
export async function searchCityWithLeaflet(query) {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding API request failed');
    }

    const results = await response.json();
    
    return results.map(result => ({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      country: result.address?.country || 'Unknown',
      state: result.address?.state || '',
      city: result.address?.city || result.address?.town || result.address?.village || ''
    }));
  } catch (error) {
    console.error('Error searching city with Leaflet:', error);
    return [];
  }
}

/**
 * 验证坐标是否有效
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {boolean} 坐标是否有效
 */
export function isValidCoordinates(lat, lng) {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  );
}

/**
 * 获取格式化的位置信息用于选择器
 * @returns {Array} 格式化的位置数据
 */
export function getFormattedLocationData() {
  const countries = getCountries();
  
  return countries.map(country => ({
    value: country,
    label: country,
    children: getCitiesByCountry(country).map(cityName => {
      // 检查是否为自定义城市
      const isCustom = customCities.some(city => 
        city.name === cityName && city.country === country
      );
      
      return {
        value: cityName,
        label: cityName,
        custom: isCustom
      };
    })
  }));
}

/**
 * 导出默认的地理位置数据，用于与现有系统集成
 */
export const leafletLocationData = getFormattedLocationData();
