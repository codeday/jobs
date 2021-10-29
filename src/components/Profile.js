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
import { default as Checkbox } from '@codeday/topo/Atom/Input/Checkbox';
import { print } from 'graphql';
import { validate as validateEmail } from 'email-validator';
import { EditProfile, CreateProfile } from './Profile.gql';
import { filterObject } from '../util/filterObject';
import Recommendation from './Recommendation';
import ProfileResumeBox from './ProfileResumeBox';
import MonthYearPicker from './MonthYearPicker';

export default function Profile({ profile: originalProfile, token, ...rest }) {
  const { success, error } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(originalProfile);
  const [editProfile, setEditProfile] = useReducer(
    (prev, obj) => ({ ...prev, ...obj }),
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

  const isValid = editProfile
    && editProfile.givenName && editProfile.familyName
    && editProfile.email && validateEmail(editProfile.email)
    && (!editProfile.urlGithub || editProfile.urlGithub.includes('://'))
    && (!editProfile.urlLinkedIn || editProfile.urlLinkedIn.includes('://'))
    && (!editProfile.urlWebsite || editProfile.urlWebsite.includes('://'));

  return (
    <Box {...rest}>
      <Heading as="h2" mb={8}>
        {profile?.email ? 'Edit' : 'Create'} Profile
        {editProfile.givenName && ` for ${editProfile.givenName}`}
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8}>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4} textAlign="center">Contact Info</Heading>
          <Box mb={2}>
            <Text mb={0} bold>Name</Text>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={2}>
              <Input
                placeholder="First (Given) Name"
                defaultValue={profile.givenName}
                onChange={(e) => setEditProfile({ givenName: e.target.value })}
              />
              <Input
                placeholder="Last (Family) Name"
                defaultValue={profile.familyName}
                onChange={(e) => setEditProfile({ familyName: e.target.value })}
              />
            </Grid>
          </Box>

          <Box mb={2}>
            <Text mb={0} bold>Email</Text>
            <Input
              placeholder="me@gmail.com"
              defaultValue={profile.email}
              onChange={(e) => setEditProfile({ email: e.target.value })}
            />
          </Box>

          <Box mb={2}>
            <Text mb={0} bold>Github (full URL)</Text>
            <Input
              placeholder="https://github.com/codeday"
              defaultValue={profile.urlGithub}
              onChange={(e) => setEditProfile({ urlGithub: e.target.value })}
            />
          </Box>

          <Box mb={2}>
            <Text mb={0} bold>LinkedIn (full URL)</Text>
            <Input
              placeholder="https://linkedin.com/in/codeday"
              defaultValue={profile.urlLinkedIn}
              onChange={(e) => setEditProfile({ urlLinkedIn: e.target.value })}
            />
          </Box>

          <Box mb={2}>
            <Text mb={0} bold>Personal Site (full URL)</Text>
            <Input
              placeholder="https://www.example.com/"
              defaultValue={profile.urlWebsite}
              onChange={(e) => setEditProfile({ urlWebsite: e.target.value })}
            />
          </Box>

          <Heading as="h3" fontSize="2xl" mt={12} mb={4} textAlign="center">Academic Milestones</Heading>
          <Box mb={2}>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
              <Box>
                <Text mb={0} bold>High School Graduation</Text>
                <MonthYearPicker
                  defaultValue={profile?.gradHighSchoolAt}
                  onChange={(e) => setEditProfile({ gradHighSchoolAt: e })}
                />
              </Box>
              <Box>
                <Text mb={0} bold>College (Undergrad) Graduation</Text>
                <MonthYearPicker
                  defaultValue={profile?.gradUniversityAt}
                  onChange={(e) => setEditProfile({ gradUniversityAt: e })}
                />
              </Box>
            </Grid>
          </Box>

          <Heading as="h3" fontSize="2xl" mt={12} mb={4} textAlign="center">Job Search</Heading>
          <Box mb={2}>
            <Box mb={4}>
              <Text mb={0} bold>Searching now?</Text>
              <Checkbox
                defaultIsChecked={editProfile?.searchOpen}
                onChange={(e) => setEditProfile({ searchOpen: e.target.checked })}
              >
                I'm open to work, please share my resume.
              </Checkbox>
            </Box>
            {editProfile?.searchOpen && (
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
                <Box>
                  <Text mb={0} bold>Will you consider internships?</Text>
                  <Checkbox
                    defaultIsChecked={editProfile?.searchInternships}
                    onChange={(e) => setEditProfile({ searchInternships: e.target.checked })}
                  >
                    I'm currently open to internships.
                  </Checkbox>
                </Box>
                <Box>
                  <Text mb={0} bold>When will you consider full-time jobs?</Text>
                  <MonthYearPicker
                    defaultValue={profile?.searchFullTimeAt}
                    onChange={(e) => setEditProfile({ searchFullTimeAt: e })}
                  />
                </Box>
              </Grid>
            )}
          </Box>

          <Box textAlign="center" mt={8}>
            <Button
              size="lg"
              colorScheme="green"
              disabled={!isValid}
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const res = await apiFetch(
                    print(profile?.email ? EditProfile : CreateProfile),
                    {
                      username: profile.username,
                      data: {
                        ...filterObject(editProfile, ['username', 'id', 'urlResume', 'recommendations']),
                        ...(editProfile?.searchOpen ? {} : {
                          searchInternships: false,
                          searchFullTimeAt: null,
                        }),
                      }
                    },
                    { 'X-Advisors-Authorization': `Bearer ${token}` },
                  );
                  success(profile?.email ? 'Updated!' : 'Created!');
                  setProfile(res.advisors.editProfile);
                } catch (ex) {
                  error(ex.toString());
                }
                setIsLoading(false);
              }}
            >
              {profile?.email ? 'Save' : 'Create'}
            </Button>
          </Box>
        </Box>
        <Box>
          <ProfileResumeBox
            colorScheme="gray"
            edit={isEditor}
            token={token}
            profile={profile}
            borderColor="gray.600"
            borderWidth={1}
            p={4}
            textAlign="center"
          />
        </Box>
      </Grid>

      {(profile.recommendations?.length > 0 || typ === 'a') && (
        <>
          <Heading as="h3" fontSize="2xl" mt={8} mb={4}>Recommendations</Heading>
          {recommendationBoxes}
          {typ === 'a' && (
            <Recommendation profileUsername={profile.username} token={token} />
          )}
        </>
      )}
    </Box>
  );
}
