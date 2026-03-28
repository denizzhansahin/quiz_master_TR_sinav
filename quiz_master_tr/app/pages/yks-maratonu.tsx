import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./yks-maratonu.web').default,
  default: require('./yks-maratonu.native').default,
});

export default Screen;
