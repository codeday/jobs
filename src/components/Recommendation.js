/* eslint-disable import/no-named-default */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/prop-types */
import React, { useState, useReducer } from 'react';
import { DateTime } from 'luxon';
import { decode } from 'jsonwebtoken';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import { default as Select } from '@codeday/topo/Atom/Input/Select';
import { print } from 'graphql';
import { EditRecommendation, CreateRecommendation } from './Recommendation.gql';
import { filterObject } from '../util/filterObject';

const REC_RATINGS = {
  INTERN_BELOW: 'Below intern-level',
  INTERN_MEETS: 'Intern-level',
  INTERN_EXCEEDS: 'Above intern-level',
  NEW_GRAD: 'New-grad hire level',
  NEW_GRAD_EXCEEDS: 'Exceeds new-grad hire level',
};

function ShadowBox({ children, ...rest }) {
  return <Box p={4} borderWidth={1} shadow="md" rounded="sm" {...rest}>{children}</Box>;
}

function RecRatingDropdown({ defaultValue, onChange, ...rest }) {
  return (
    <Select defaultValue={defaultValue} onChange={onChange} {...rest}>
      <option></option>
      {Object.keys(REC_RATINGS).map((value) => <option key={value} value={value}>{REC_RATINGS[value]}</option>)}
    </Select>
  );
}

export default function Recommendation({
  recommendation: originalRecommendation,
  profileUsername,
  token,
  ...rest
}) {
  const { error, success } = useToasts();
  const [authorUsername, setAuthorUsername] = useState();
  const [recommendation, setRecommendation] = useState(originalRecommendation);
  const [editRecommendation, setEditRecommendation] = useReducer(
    (prev, [field, value]) => ({ ...prev, [field]: value }),
    originalRecommendation,
  );
  const [isLoading, setIsLoading] = useState(false);

  const { typ, username } = decode(token);
  const isEditor = typ === 'a'
    || (typ === 'rec' && !recommendation.id)
    || (typ === 'rec' && recommendation.username && username === recommendation.username);

  const editRecommendationValid = editRecommendation
    && editRecommendation.givenName && editRecommendation.familyName
    && editRecommendation.title && editRecommendation.employer
    && editRecommendation.skillEngineering
    && editRecommendation.skillTechnical
    && editRecommendation.skillInterpersonal;

  // Non-editor view
  if (!isEditor) {
    if (!recommendation) return <Box {...rest}>Not found.</Box>
    const updated = DateTime.fromISO(recommendation.updatedAt);
    return (
      <ShadowBox {...rest}>
        <Heading as="h4" fontSize="lg" fontWeight="bold" mb={2}>
          {updated.toLocaleString({ month: 'short', year: 'numeric' })}{' / '}
          {recommendation.givenName} {recommendation.familyName}{', '}
          {recommendation.title} @ {recommendation.employer}
        </Heading>
        {recommendation.recommendation && <Text>{recommendation.recommendation}</Text>}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={2}>
          <Box>
            <Text as="span" bold>Self-Directed: </Text>
            {REC_RATINGS[recommendation.skillEngineering] || 'N/A'}
          </Box>
          <Box>
            <Text as="span" bold>Technical: </Text>
            {REC_RATINGS[recommendation.skillTechnical] || 'N/A'}
          </Box>
          <Box>
            <Text as="span" bold>Interpersonal: </Text>
            {REC_RATINGS[recommendation.skillInterpersonal] || 'N/A'}
          </Box>
        </Grid>
      </ShadowBox>
    );
  }

  // Editor view
  return (
    <ShadowBox {...rest}>
      {typ === 'a' && !recommendation?.id && (
        <Box mb={2}>
          <Text bold mb={0}>Author Username</Text>
          <Input
            w="100%"
            onChange={(e) => setAuthorUsername(e.target.value)}
          />
        </Box>
      )}
      <Box mb={2}>
        <Text bold mb={0}>Name</Text>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={2}>
          <Input
            w="100%"
            defaultValue={recommendation?.givenName}
            onChange={(e) => setEditRecommendation(['givenName', e.target.value])}
            placeholder="First (Given) Name"
          />
          <Input
            w="100%"
            defaultValue={recommendation?.familyName}
            onChange={(e) => setEditRecommendation(['familyName', e.target.value])}
            placeholder="Last (Family) Name"
          />
        </Grid>
      </Box>

      <Box mb={2}>
        <Text bold mb={0}>Job</Text>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={2}>
          <Input
            w="100%"
            defaultValue={recommendation?.title}
            onChange={(e) => setEditRecommendation(['title', e.target.value])}
            placeholder="Title"
          />
          <Input
            w="100%"
            defaultValue={recommendation?.employer}
            onChange={(e) => setEditRecommendation(['employer', e.target.value])}
            placeholder="Employer"
          />
        </Grid>
      </Box>

      <Box mb={2}>
        <Text bold mb={0}>Relation: (i.e. "Supervised at CodeDay Labs")</Text>
        <Input
          w="100%"
          defaultValue={recommendation?.relation}
          onChange={(e) => setEditRecommendation(['relation', e.target.value])}
          placeholder="Relation"
        />
      </Box>

      <Box mb={2}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={2}>
          <Box>
            <Text bold mb={0}>Self-Directed:</Text>
            <RecRatingDropdown
              w="100%"
              defaultValue={recommendation?.skillEngineering}
              onChange={(e) => setEditRecommendation(['skillEngineering', e.target.value])}
            />
          </Box>
          <Box>
            <Text bold mb={0}>Technical:</Text>
            <RecRatingDropdown
              w="100%"
              defaultValue={recommendation?.skillTechnical}
              onChange={(e) => setEditRecommendation(['skillTechnical', e.target.value])}
            />
          </Box>
          <Box>
            <Text bold mb={0}>Interpersonal:</Text>
            <RecRatingDropdown
              w="100%"
              defaultValue={recommendation?.skillInterpersonal}
              onChange={(e) => setEditRecommendation(['skillInterpersonal', e.target.value])}
            />
          </Box>
        </Grid>
      </Box>

      <Box>
        <Text bold mb={0}>Written Recommendation:</Text>
        <Textarea
          w="100%"
          defaultValue={recommendation?.recommendation}
          onChange={(e) => setEditRecommendation(['recommendation', e.target.value])}
        />
      </Box>

      <Button
        variantColor="green"
        isLoading={isLoading}
        disabled={!editRecommendationValid}
        onClick={async () => {
          setIsLoading(true);
          try {
            const res = await apiFetch(
              print(recommendation?.id ? EditRecommendation : CreateRecommendation),
              {
                id: recommendation?.id,
                username: profileUsername,
                authorUsername: authorUsername ? authorUsername : undefined,
                data: filterObject(editRecommendation, ['id', 'username']),
              },
              { 'X-Advisors-Authorization': `Bearer ${token}` },
            );
            success(recommendation?.id ? 'Updated!' : 'Created!');
            setRecommendation(res.advisors.newRecommendation);
          } catch (ex) {
            error(ex.toString());
          }
          setIsLoading(false);
        }}
      >
        Save
      </Button>
    </ShadowBox>
  );
}
