/* eslint-disable import/no-named-default */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { decode } from 'jsonwebtoken';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import Box from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { print } from 'graphql';
import { UploadResume, BuildResumePackage } from './Profile.gql';

function ResumeButton({ profile, token, ...rest }) {
  const uploadRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();

  return (
    <>
      <input
        ref={uploadRef}
        type="file"
        onChange={async (e) => {
          if (e.target.files.length === 0) return;
          setIsLoading(true);
          try {
            await apiFetch(
              print(UploadResume),
              { resume: e.target.files[0], username: profile.username },
              { 'X-Advisors-Authorization': `Bearer ${token}` },
            );
            success('Resume uploaded.');
          } catch (ex) {
            error(ex.toString());
          }
          setIsLoading(false);
        }}
        style={{ display: 'none' }}
      />
      <Button
        isLoading={isLoading}
        onClick={() => {
          uploadRef.current.click();
        }}
        {...rest}
      >
        Upload Resume
      </Button>
    </>
  );
}

export default function ProfileResumeBox({ profile, token, edit, colorScheme, ...rest }) {
  const { typ } = decode(token);
  if (!profile?.username || (!profile.urlResume && !edit && typ !== 'a')) return <></>;

  return (
    <Box mb={8} {...rest}>
      <Heading as="h3" fontSize="2xl" mb={4}>Resume</Heading>
      {profile.urlResume && (
        <>
          <Button
            as="a"
            colorScheme={colorScheme}
            href={profile.urlResume}
            target="_blank"
            mb={2}
          >
            Download Resume
          </Button>
          <br />
        </>
      )}
      {profile.urlResume && typ === 'a' && (
        <>
          <Button
            colorScheme={colorScheme}
            mb={2}
            onClick={async () => {
              const resp = await apiFetch(
                print(BuildResumePackage),
                { username: profile.username },
                { 'X-Advisors-Authorization': `Bearer ${token}` },
              );
              window.open(resp?.advisors?.buildResumePackage);
            }}
          >
            Build Resume Package
          </Button>
          <br />
        </>
      )}
      <ResumeButton
        colorScheme={colorScheme}
        profile={profile}
        token={token}
      />
    </Box>
  );
}
