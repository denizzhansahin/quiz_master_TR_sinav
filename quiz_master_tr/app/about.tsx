

import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./about.web').default,
  default: require('./about.native').default, 
});

export default Screen;
