import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./ales-taktikler.web').default,
  default: require('./ales-taktikler.native').default,
});

export default Screen;
