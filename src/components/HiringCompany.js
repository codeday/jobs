import React from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import ContentfulRichText from './ContentfulRichText';
import List, { Item as Li } from '@codeday/topo/Atom/List';

export default function ({ company, ...props }) {
  const featureColor = company.featured ? "yellow.50" : "gray.100";
  const featureColorDark = company.featured ? "yellow.800" : "gray.900";

  return (
    <Box mb={2} borderWidth={1} rounded="sm" {...props}>
      <Box bg={featureColor} p={2} pl={4} pr={4} fontSize="2xl">
        <Image src={company.logo.url} alt="" height="2.5em" d="inline-block" mr={4} />
        <Heading
          as="h2"
          fontSize="1em"
          d="inline-block"
          position="relative"
          color={featureColorDark}
          top={1}
        >
          {company.name}
        </Heading>
        {company.relatedSponsor?.name && (
          <Box d="inline-block" color={featureColorDark} fontSize="sm" ml={2}>
            (CodeDay Sponsor)
          </Box>
        )}
      </Box>
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} p={4}>
        <Box>
          <Box mb={4}>
            <Link href={company.url} target="_blank" rel="noopener" mb={4}>{company.url}</Link>
          </Box>
          <ContentfulRichText json={company.description.json} />
        </Box>
        <Box>
            {company.linkedFrom?.hiringPosts?.items?.length > 0 && (
              <Box mb={8}>
                <Heading as="h4" fontSize="lg" mb={2}>Job Postings</Heading>
                <List styleType="disc" stylePos="outside" pl={2} spacing={2}>
                  {company.linkedFrom.hiringPosts.items.map((post) => (
                    <Li>
                      <Link href={`/post/${post.sys.id}`} fontWeight="bold" color="blue.700">
                        {post.title}
                      </Link>{' '}
                      ({post.paid ? 'Paid' : 'Unpaid'} {post.type})
                    </Li>
                  ))}
                </List>
              </Box>
            )}
            {company.alumniReferralAccounts?.length > 0 && (
              <Box>
                <Heading as="h4" fontSize="lg" mb={2}>Request an Intro</Heading>
                <List styleType="disc" stylePos="outside" pl={2} spacing={2}>
                  {company.alumniReferralAccounts.map((a) => (
                    <Li>
                      <Link
                        color="blue.700"
                        href={`mailto:${a.email}?subject=${company.name} (from CodeDay alum)`}
                      >{a.name}</Link>
                    </Li>
                  ))}
                </List>
              </Box>
            )}
        </Box>
      </Grid>
    </Box>
  );
}
