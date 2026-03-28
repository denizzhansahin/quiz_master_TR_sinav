import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./sinav-kazandiran-ikili.web').default,
  default: require('./sinav-kazandiran-ikili.native').default,
});

export default Screen;
