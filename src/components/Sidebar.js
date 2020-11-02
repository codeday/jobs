import React from 'react';
import Box from '@codeday/topo/Atom/Box';
import Divider from '@codeday/topo/Atom/Divider';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item as Li } from '@codeday/topo/Atom/List';

export default function Sidebar(props) {
  return (
    <Box {...props}>
      {/* General information */}
      <Box
        bg="blue.50"
        borderColor="blue.200"
        borderWidth={1}
        rounded="sm"
        p={4}
        color="blue.900"
        mb={8}
      >
        <Heading as="h2" fontSize="xl" mb={2}>These companies hire CodeDay alums!</Heading>
        <Text>You can click the names of community members to request that they refer you internally.</Text>
        <Text textDecoration="underline" bold>
          * Sorry, but unless explicitly specified, opportunities are not open to high school students. *
        </Text>

        <Divider mb={8} mt={8} />

        <Heading as="h2" fontSize="xl" mb={2}>Resources for Your Job Search</Heading>
        <List styleType="disc" stylePos="outside" pl={2} spacing={2}>
          <Li>
            <Link
              href="https://uploads.codeday.org/d/6/d6azyhkd7wmz8ynr5don3kkjn79pnviqntnn4z69cqgduw4z7piem6o5dk5vbpt4zp.pdf"
              target="_blank"
              rel="noopener"
            >
              Cracking the Coding Interview (PDF)
            </Link>
          </Li>
          <Li>
            <Link
              href="https://www.youtube.com/watch?v=nOykBHnRmu0"
              target="_blank"
              rel="noopener"
            >
              College New Grad Hiring Demystified - Tips From a Recruiter (Video)
            </Link>
          </Li>
          <Li>
            <Link
              href="https://www.youtube.com/watch?v=oyZBps9R590"
              target="_blank"
              rel="noopener"
            >
              College New Grad Hiring Demystified - Q&A (Video)
            </Link>
          </Li>
        </List>
      </Box>
    </Box>
  );
}
