// fallback olarak native'i kullanıyoruz
//export { default } from './contact.native';

import { Platform } from 'react-native';

const Screen = Platform.select({
  web: require('./contact.web').default,
  default: require('./contact.native').default, 
});

export default Screen;
