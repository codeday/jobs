import { DefaultSeo } from 'next-seo';
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Header, { SiteLogo, Menu } from '@codeday/topo/Organism/Header';
import Footer from '@codeday/topo/Organism/Footer';
import { CodeDay } from '@codeday/topo/Atom/Logo';

const DOMAIN = 'https://jobs.codeday.org';

export default ({ children, title, darkHeader, slug }) => (
  <>
    <DefaultSeo
      title={title ? `${title} ~ CodeDay Jobs` : 'CodeDay Jobs'}
      description="Companies that hire CodeDay alums!"
      canonical={`${DOMAIN}${slug}`}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        site_name: 'jobs',
        url: `${DOMAIN}${slug}`,
      }}
      twitter={{
        handle: '@codeday',
        site: '@codeday',
        cardType: 'summary_large_image',
      }}
    />
    <Box position="relative">
      <Header darkBackground={darkHeader} gradAmount={darkHeader && 'lg'} underscore position="relative" zIndex={1000}>
        <SiteLogo>
            <a href="https://www.codeday.org/">
              <CodeDay withText />
            </a>
            <a href="/">
              <Text
                as="span"
                d="inline"
                letterSpacing="-2px"
                fontFamily="heading"
                position="relative"
                top={1}
                ml={1}
                textDecoration="underline"
                bold
              >
                Jobs
              </Text>
            </a>
        </SiteLogo>
        <Menu>
          <Button as="a" href="/submit">Add Company / Referral</Button>
        </Menu>
      </Header>
      {children}
      <Footer />
    </Box>
  </>
);
