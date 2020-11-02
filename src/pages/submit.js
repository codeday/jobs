import React from 'react';
import { getSession, signIn } from 'next-auth/client'
import Content from '@codeday/topo/Molecule/Content';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Page from '../components/Page';

export default function Submit({ username }) {
  if (!username) {
    signIn('auth0');
    return null;
  }

	return (
		<Page slug="/submit" title="Submit New">
      <Content mt={-8}>
        <CognitoForm formId="78" prefill={{ Username: username }} />
      </Content>
		</Page>
	)
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return {props: {}};
  return {
    props: {
      username: session.user.name,
    },
  };
}
