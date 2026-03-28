import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./kpss-denge.web').default,
  default: require('./kpss-denge.native').default,
});

export default Screen;
