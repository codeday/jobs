/* eslint-disable import/no-named-default */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/prop-types */
import React, { useState, useReducer, useRef } from 'react';
import { decode } from 'jsonwebtoken';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import { default as Select } from '@codeday/topo/Atom/Input/Select';
import { print } from 'graphql';
import { EditProfile, UploadResume, BuildResumePackage } from './Profile.gql';
import { filterObject } from '../util/filterObject';
import Recommendation from './Recommendation';
import ProfileResumeBox from './ProfileResumeBox';

export default function Profile({ profile: originalProfile, token, ...rest }) {
  const [profile, setProfile] = useState(originalProfile);
  const [editProfile, setEditProfile] = useReducer(
    (prev, [key, value]) => ({ ...prev, [key]: value }),
    originalProfile,
  );

  const { typ, username } = decode(token);
  const isEditor = typ === 'a' || username === profile.username;

  const recommendationBoxes = profile?.recommendations?.map((r) => (
    <Recommendation
      recommendation={r}
      profileUsername={profile.username}
      token={token}
      mb={4}
    />
  ));

  if (!isEditor) {
    if (!profile) return <Box {...rest}>Not found.</Box>;
    return (
      <Box {...rest}>
        <Heading as="h2">{profile.givenName} {profile.familyName}</Heading>
        {profile.recommendations?.length > 0 && (
          <>
            <Heading as="h3" fontSize="2xl" mb={4}>Recommendations</Heading>
            {recommendationBoxes}
          </>
        )}
      </Box>
    );
  }

  return (
    <Box {...rest}>
      <ProfileResumeBox edit={isEditor} token={token} profile={profile} />
      {(profile.recommendations?.length > 0 || typ === 'a') && (
        <>
          <Heading as="h3" fontSize="2xl" mb={4}>Recommendations</Heading>
          {recommendationBoxes}
          {typ === 'a' && (
            <Recommendation profileUsername={profile.username} token={token} />
          )}
        </>
      )}
    </Box>
  );
}
