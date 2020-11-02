import React from 'react';
import { print } from 'graphql';
import { getSession, signIn } from 'next-auth/client'
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import ContentfulRichText from '../../components/ContentfulRichText';
import Page from '../../components/Page';
import Sidebar from '../../components/Sidebar';
import { JobPostingQuery } from './posting.gql';

export default function Home({ query, id }) {
  if (!query) {
    signIn('auth0');
    return null;
  }
  const { hiringPost } = query.cms;

	return (
		<Page slug={`/posting/${id}`} title={`${hiringPost.title} ~ ${hiringPost.company.name}`}>
      <Content mt={-8}>
        <Grid templateColumns={{base: '1fr', md: '1fr 3fr'}} gap={8}>
          <Sidebar />

          <Box>
            <Box as="a" href={hiringPost.company.url} target="_blank" rel="noopener" d="block" fontSize="5xl">
              <Image src={hiringPost.company.logo.url} height="1em" alt={hiringPost.company.name} />
            </Box>
            <Heading as="h2" fontSize="3xl">
              {hiringPost.title} ({hiringPost.paid ? 'Paid' : 'Unpaid'} {hiringPost.type})
            </Heading>
            {hiringPost.regions?.items?.length > 0 && (
              <Text fontSize="xl" color="current.textLight" bold>
                {hiringPost.regions.items.map((r) => r.name).join(', ')}
              </Text>
            )}

            <ContentfulRichText json={hiringPost.description.json} />

            <Button as="a" href={hiringPost.url} target="_blank" rel="noopener" variantColor="teal">More Info</Button>
          </Box>
        </Grid>
      </Content>
		</Page>
	)
}

export async function getServerSideProps({ params: { id }, ...context}) {
  const session = await getSession(context);
  if (!session) return {props: {}};

  return {
    props: {
      query: await apiFetch(print(JobPostingQuery), { id }),
      id,
    },
  };
}
