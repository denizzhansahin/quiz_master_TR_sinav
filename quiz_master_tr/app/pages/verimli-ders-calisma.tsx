import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./verimli-ders-calisma.web').default,
  default: require('./verimli-ders-calisma.native').default,
});

export default Screen;
