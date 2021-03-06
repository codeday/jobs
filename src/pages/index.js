import React from 'react';
import { print } from 'graphql';
import { getSession, signIn, useSession } from 'next-auth/client'
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Page from '../components/Page';
import Sidebar from '../components/Sidebar';
import HiringCompany from '../components/HiringCompany';
import { makeJwt } from '../util/auth';
import { IndexQuery } from './index.gql';

export default function Home({ query }) {
  const [ session, loading ] = useSession();

  if (session && !query && typeof window !== 'undefined') {
    window.location.reload();
  }

  if (!query) {
    return (
      <Content p={8} textAlign="center">
        <Text>This portal is only for the CodeDay community.</Text>
        <Text>You will need to log into or create a CodeDay account to access this site.</Text>
        <Button onClick={() => signIn('auth0')} variantColor="red">Log Into CodeDay Account</Button>
      </Content>
    )
  }
  const { hiringCompanies } = query.cms;

	return (
		<Page slug="/">
      <Content mt={-8}>
        <Grid templateColumns={{base: '1fr', md: '1fr 3fr'}} gap={8}>
          <Sidebar />
          <Box>
            {
              hiringCompanies
                ?.items
                ?.sort((a, b) => {
                  if (a.featured && !b.featured) return -1;
                  if (b.featured && !a.featured) return 1;
                  return (b.linkedFrom?.hiringPosts?.items?.length || 0) - (a.linkedFrom?.hiringPosts?.items?.length || 0);
                })
                .map((c) => <HiringCompany company={c} />)
              }
          </Box>
        </Grid>
      </Content>
		</Page>
	)
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return {props: {}};

  const token = makeJwt();
  return {
    props: {
      query: await apiFetch(print(IndexQuery), {}, { Authorization: `Bearer ${token}`}),
    },
  };
}
