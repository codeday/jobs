import React from 'react';
import Text from '@codeday/topo/Atom/Text';
import InfoBox from './InfoBox';

export default function ResumeReviewGuide() {
  return (
    <InfoBox heading="Instructions">
      <Text>Click anywhere on the resume to add an annotation.</Text>
      <Text>Please focus on content and <em>NOT formatting</em> (unless the formatting is particularly bad).</Text>
      <Text>You will receive an intro email to the student, in case they have any follow-up questions.</Text>
    </InfoBox>
  );
}
