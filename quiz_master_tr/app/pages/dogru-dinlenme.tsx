import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./dogru-dinlenme.web').default,
  default: require('./dogru-dinlenme.native').default,
});

export default Screen;
