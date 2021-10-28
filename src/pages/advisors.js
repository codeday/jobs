import { print } from 'graphql';
import { getSession, signIn } from 'next-auth/client';
import React, { useState, useReducer, useRef } from 'react';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Page from '../components/Page';
import Button from '@codeday/topo/Atom/Button';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { useToasts, apiFetch } from '@codeday/topo/utils';
import { validate as validateEmail } from 'email-validator';
import { getAdvisorToken } from '../util/advisorToken';
import { GetMyPendingRequests, CreateRequest } from './advisors.gql';

export default function ({ hasSession, advisorToken, pendingRequests: pendingRequestsInit }) {
  const [givenName, setGivenName] = useState();
  const [familyName, setFamilyName] = useState();
  const [email, setEmail] = useState();
  const uploadRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();

  const [pendingRequests, addPendingRequest] = useReducer(
    (prev, type ) => ({ ...prev, [type]: (prev[type] || 0) + 1 }),
    pendingRequestsInit
  );

  const makeUploadFn = (type, resume) => async () => {
    setIsLoading(true);
    console.log({ givenName, familyName, email, type, resume });
    try {
      const resp = await apiFetch(
        print(CreateRequest),
        { givenName, familyName, email, type, resume },
        { 'X-Advisors-Authorization': `Bearer ${advisorToken}` }
      );
      addPendingRequest(type);
      success('Request sent.');
    } catch (ex) {
      error(ex.toString());
    }
    setIsLoading(false);
  }

  if (!hasSession) {
    return (
      <Content p={8} textAlign="center">
        <Text>This portal is only for students who are actively job-hunting.</Text>
        <Text>You need to be logged into a CodeDay account with specific permission to access this tool.</Text>
        <Button onClick={() => signIn('auth0')} variantColor="red">Log Into CodeDay Account</Button>
      </Content>
    )
  }


  if (!advisorToken) return (
		<Page slug="/advisors" title="Advisors">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl">You don't have access to career advisors!</Heading>
        <Text>Advisors are limited to students we know are actively looking for internships or jobs.</Text>
        <Text>
          Some CodeDay programs automatically provide access, but otherwise you can request access by asking a
          member of staff in the CodeDay Discord.
        </Text>
      </Content>
		</Page>
  );

  return (
    <Page slug="/advisors" title="Advisors">
      <input
        ref={uploadRef}
        type="file"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            makeUploadFn('RESUME', e.target.files[0])();
          }
        }}
        style={{ display: 'none' }}
      />
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl">Need help with resumes or interviews?</Heading>
        <Text>You can request resume feedback and/or practice interviews from our panel of professionals.</Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} mb={4}>
          <Input onChange={(e) => setGivenName(e.target.value)} placeholder="First (Given) Name" />
          <Input onChange={(e) => setFamilyName(e.target.value)} placeholder="Last (Family) Name" />
        </Grid>
        <Box mb={4}>
          <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </Box>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} textAlign="center">
          <Box>
            <Button
              variantColor="blue"
              size="lg"
              disabled={!(givenName && familyName && validateEmail(email)) || isLoading || pendingRequests.RESUME}
              isLoading={isLoading}
              onClick={() => {
                uploadRef.current.click();
              }}
            >
              {pendingRequests.RESUME ? 'Resume Request Pending' : 'Request Resume Feedback'}
            </Button>
          </Box>
          <Box>
            <Button
              variantColor="purple"
              size="lg"
              disabled={!(givenName && familyName && validateEmail(email)) || isLoading || pendingRequests.INTERVIEW}
              isLoading={isLoading}
              onClick={makeUploadFn('INTERVIEW')}
            >
              {pendingRequests.INTERVIEW ? 'Interview Request Pending' : 'Request Practice Interview'}
            </Button>
          </Box>
        </Grid>
      </Content>
    </Page>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const advisorToken = await getAdvisorToken(session, true);
  if (!advisorToken) return { props: { hasSession: false } };

  const pendingRequestsResp = await apiFetch(
    print(GetMyPendingRequests),
    {},
    { 'X-Advisors-Authorization': `Bearer ${advisorToken}` },
  );

  const pendingRequests = pendingRequestsResp?.advisors?.pendingRequests
    .reduce((accum, { requestType, pendingRequests }) => ({ [requestType]: pendingRequests, ...accum }), {});

  return {
    props: {
      advisorToken,
      pendingRequests,
      hasSession: true,
    },
  };
}
