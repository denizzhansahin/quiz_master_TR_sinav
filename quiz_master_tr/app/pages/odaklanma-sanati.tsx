import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./odaklanma-sanati.web').default,
  default: require('./odaklanma-sanati.native').default,
});

export default Screen;
