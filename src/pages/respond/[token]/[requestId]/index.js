import { print } from 'graphql';
import React, { useState, useReducer, useRef } from 'react';
import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import { useToasts, apiFetch } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { GetRequest, RespondRequest } from './index.gql';
import ResumeReview from '../../../../components/ResumeReview';
import ResumeReviewGuide from '../../../../components/ResumeReviewGuide';

const QUESTIONS = {
  RESUME: [
    'Any general feedback about this resume which you\'d like to share?',
    'In the next 3 months, what could this student focus on to best strengthen their resume? (i.e. particular projects, classes, etc)',
  ],
  INTERVIEW: [
    'Overall, what was your assessment of the practice interview?',
    'What subjects should the student focus on to best improve their chances of being hired?',
  ],
};

export default function ({ token, request, requestId, response: serverResponse, responseFile: serverResponseFile }) {
  const [isSubmitted, setSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [response, updateResponse] = useReducer((_prev, [key, value]) => ({ ..._prev, [key]: value }), {});
  const { success, error } = useToasts();
  const [annotatedFile, setAnnotatedFile] = useState();
  const valid = Object.values(response).filter(Boolean).length >= QUESTIONS[request.type].length;
  const title = `${request.type[0]}${request.type.slice(1).toLowerCase()} feedback for ${request.givenName} ${request.familyName}`;

  if (request.type === 'RESUME' && !request.resumeUrl) {
    return (
      <Page>
        <Content>Error occurred: resume request had no resume. Please contact volunteer@codeday.org for help.</Content>
      </Page>
    );
  }

  if (serverResponse || serverResponseFile || isSubmitted) {
    return (
      <Page>
        <Content textAlign="center" mt={-8}>
          We have shared your feedback/advice with {request.givenName} {request.familyName}. Thank you for your time!
        </Content>
      </Page>
    );
  }
  return (
    <Page title={title}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" mb={8}>{title}</Heading>
      </Content>
      {request.resumeUrl && (
        <>
          <Content><ResumeReviewGuide /></Content>
          <Content maxW="container.xl">
            <ResumeReview pdf={request.resumeUrl} annotatedFile={annotatedFile} setAnnotatedFile={setAnnotatedFile} />
          </Content>
        </>
      )}
      <Content>
        {QUESTIONS[request.type].map((q) => (
          <>
            <Heading as="h4" fontSize="md">{q}</Heading>
            <Textarea mb={4} onChange={(e) => updateResponse([q, e.target.value])} />
          </>
        ))}
        <Box textAlign="center">
          <Button
            isLoading={isLoading}
            isDisabled={!valid}
            colorScheme="green"
            size="lg"
            onClick={async () => {
              setLoading(true);
              try {
                await apiFetch(
                  print(RespondRequest),
                  { request: requestId, response, file: new File([Buffer.from(annotatedFile)], 'feedback.pdf')},
                  { 'X-Advisors-Authorization': `Bearer ${token}` },
                );
                success('Feedback submitted.');
                setSubmitted(true);
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >
            {!valid ? 'Fill all fields to submit' : 'Submit'}
          </Button>
        </Box>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token, requestId } }) {
  const { request, response, responseFile } = (await apiFetch(
    print(GetRequest),
    { request: requestId },
    { 'X-Advisors-Authorization': `Bearer ${token}` },
  )).advisors.getRequestAssignment;

  return {
    props: {
      token,
      request,
      requestId,
      response: response || null,
      responseFile: responseFile || null,
    },
  };
}
