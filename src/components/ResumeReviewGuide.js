import React from 'react';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import InfoBox from './InfoBox';
import Box from '@codeday/topo/Atom/Box';

export default function ResumeReviewGuide() {
  return (
    <Box bgColor="blue.50" color="blue.800" p={4}>
      <Heading as="h3" fontSize="lg" mb={2}>Important</Heading>
      <Text mb={2}>Students need the most help in choosing what experience to include, how to talk about that experience, etc.</Text>
      <Text mb={0}>Please do <em>NOT</em> focus on grammar or formatting (unless it's particularly bad).</Text>
    </Box>
  );
}
