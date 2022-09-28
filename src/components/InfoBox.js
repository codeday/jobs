import React from 'react';
import Box, { Flex } from '@codeday/topo/Atom/Box';

export default function InfoBox({
  children, heading, headingSize, buttons, nested, colorScheme: _colorScheme, ...props
}) {
  const colorScheme = _colorScheme ?? 'gray'
  return (
    <Box
      d="block"
      borderWidth={3}
      rounded={nested ? 1 : 3}
      borderColor={nested ? `${colorScheme}.100` : `${colorScheme}.200`}
      m={nested ? 0 : 1}
      {...props}
    >
      {heading && (
        <Flex
          backgroundColor={nested ? `${colorScheme}.100` : `${colorScheme}.200`}
          fontSize={headingSize}
          justifyContent="space-between"
          fontWeight="bold"
          p={2}
        >
          <Box>{heading}</Box>
          <Box>{buttons}</Box>
        </Flex>
      )}
      <Box
        mt={1}
        rounded={5}
        p={1}
      >
        {children}
      </Box>
    </Box>
  );
}
