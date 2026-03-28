import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./sinav-kaygisi.web').default,
  default: require('./sinav-kaygisi.native').default,
});

export default Screen;
