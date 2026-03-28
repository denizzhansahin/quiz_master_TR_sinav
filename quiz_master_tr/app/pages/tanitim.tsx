import { Platform } from 'react-native';

const Tanitim = Platform.select({
  web: require('./tanitim.web').default,
  default: require('./tanitim.native').default,
});

export default Tanitim;
