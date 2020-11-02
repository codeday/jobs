import { sign } from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function makeJwt() {
  return sign({ scopes: 'read:users' }, serverRuntimeConfig.gqlSecret, { expiresIn: '5m' });
}
