import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./yol-haritasi.web').default,
  default: require('./yol-haritasi.native').default,
});

export default Screen;
