import React from 'react';
import { print } from 'graphql';
import { getSession, signIn } from 'next-auth/client';
import { apiFetch } from '@codeday/topo/utils';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Page from '../../../components/Page';
import Profile from '../../../components/Profile';
import { getAdvisorToken } from '../../../util/advisorToken';
import { GetProfile } from './index.gql';

export default function ProfilePage({ token, profile, hasSession }) {
  if (!hasSession) {
    return (
      <Content p={8} textAlign="center">
        <Text>This portal is only for the CodeDay community.</Text>
        <Text>You will need to log into or create a CodeDay account to access this site.</Text>
        <Button onClick={() => signIn('auth0')} variantColor="red">Log Into CodeDay Account</Button>
      </Content>
    );
  }

  return (
    <Page title="Profile">
      <Content>
        <Profile profile={profile} token={token} />
      </Content>
    </Page>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const token = await getAdvisorToken(session, false);
  if (!token) return { props: { hasSession: false } };

  try {
    const profile = await apiFetch(
      print(GetProfile),
      { username: context.params.username },
      { 'X-Advisors-Authorization': `Bearer ${token}` },
    );

    return {
      props: {
        token,
        profile: profile.advisors.profile,
        hasSession: true,
      },
    };
  } catch (ex) {
    return {
      props: {
        token,
        profile: { username: context.params.username },
        hasSession: true,
      },
    };
  }
}
