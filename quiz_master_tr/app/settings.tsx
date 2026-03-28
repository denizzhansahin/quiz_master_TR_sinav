
import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./settings.web').default,
  default: require('./settings.native').default, 
});

export default Screen;

