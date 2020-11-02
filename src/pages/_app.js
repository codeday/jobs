import Theme from '@codeday/topo/Theme';
import { Provider } from 'next-auth/client'

export default ({ Component, pageProps }) => (
  <Theme  brandColor="red">
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  </Theme>
);
