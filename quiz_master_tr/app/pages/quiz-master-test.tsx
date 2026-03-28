import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./quiz-master-test.web').default,
  default: require('./quiz-master-test.native').default,
});

export default Screen;
