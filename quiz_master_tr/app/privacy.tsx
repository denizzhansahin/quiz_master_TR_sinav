

import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./privacy.web').default,
  default: require('./privacy.native').default, 
});

export default Screen;


