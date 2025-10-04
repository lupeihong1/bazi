export default {
  common: {
    submit: 'Start Reading',
    hint: 'Know your destiny, starting from understanding yourself',
    required: 'Required',
    optional: 'Optional'
  },
  form: {
    birthDate: {
      label: 'Date of Birth',
      placeholder: 'Select birth date'
    },
    birthPlace: {
      label: 'Place of Birth',
      traditional: 'Traditional',
      international: 'International',
      country: 'Select Country',
      city: 'Select or enter custom city',
      addCity: 'Add City',
      coordinates: 'Coordinates'
    },
    birthTime: {
      label: 'Birth Hour',
      placeholder: 'Select hour (optional)',
      hint: 'Birth hour is optional. If uncertain, leave blank. Providing it improves accuracy. Default is noon if not provided.',
      zi: 'Zi Hour (23:00-1:00)',
      chou: 'Chou Hour (1:00-3:00)',
      yin: 'Yin Hour (3:00-5:00)',
      mao: 'Mao Hour (5:00-7:00)',
      chen: 'Chen Hour (7:00-9:00)',
      si: 'Si Hour (9:00-11:00)',
      wu: 'Wu Hour (11:00-13:00)',
      wei: 'Wei Hour (13:00-15:00)',
      shen: 'Shen Hour (15:00-17:00)',
      you: 'You Hour (17:00-19:00)',
      xu: 'Xu Hour (19:00-21:00)',
      hai: 'Hai Hour (21:00-23:00)'
    },
    gender: {
      label: 'Gender',
      male: 'Male',
      female: 'Female',
      unknown: 'Prefer not to say'
    }
  },
  dialog: {
    addCity: {
      title: 'Add Custom City',
      cityName: 'City Name',
      cityPlaceholder: 'Enter city name (e.g., Beijing, New York, Tokyo)',
      search: 'Search',
      searching: 'Searching...',
      searchButton: 'Search coordinates with Leaflet',
      searchResults: 'Search results (click to select):',
      selectedCoords: 'Selected Coordinates',
      latitude: 'Latitude',
      longitude: 'Longitude',
      error: 'Error',
      cancel: 'Cancel',
      confirm: 'Confirm'
    }
  },
  result: {
    title: 'Your Destiny Reading: {key} · {name}',
    calculationTime: 'Reading Time: {time}',
    bazi: 'BaZi: {bazi}',
    solarTime: 'True Solar Time: {time}',
    sections: {
      bazi: {
        title: 'BaZi Information'
      },
      personality: {
        icon: '🌟',
        title: 'Personal Traits'
      },
      character: {
        title: 'Character Traits'
      },
      relationship: {
        icon: '👥',
        title: 'Connections & Companions',
        friendSuggestion: 'Friendship',
        coupleSuggestion: 'Love & Compatibility'
      },
      luck: {
        icon: '📊',
        title: 'Wealth, Health & Heart'
      },
      favorableElements: {
        title: 'Your Favorable Elements'
      },
      celebrities: {
        title: 'Celebrities with Your Energy',
        international: 'International',
        domestic: 'Domestic'
      },
      luckSuggestion: {
        icon: '✨',
        title: 'Auspicious Guidance',
        color: 'Auspicious Colors',
        location: 'Auspicious Directions',
        tips: 'Auspicious Rituals'
      }
    }
  },
  messages: {
    selectBirthDate: 'Please select birth date',
    selectCountryCity: 'Please select country and city',
    noCoordinates: 'Unable to get coordinates for the selected city. Please check or add a custom city',
    enterCityName: 'Please enter city name',
    noCityFound: 'No city found. Please check the spelling',
    cityNotFound: 'No city found',
    searchSuccess: 'Found {count} results. Please select the correct city',
    searchFailed: 'Search failed. Please check network connection or try again later',
    coordsSelected: 'Coordinates selected',
    selectValidCoords: 'Please search and select valid coordinates first',
    selectCountryFirst: 'Please select country first',
    cityAddSuccess: 'Custom city added successfully',
    cityAddFailed: 'Failed to add custom city. It may already exist',
    cannotGetCoords: 'Cannot get coordinates for {city}',
    coordsGetFailed: 'Failed to get city coordinates. Please check network connection',
    solarTimeFailed: 'Solar time calculation failed, using backup method'
  }
};

