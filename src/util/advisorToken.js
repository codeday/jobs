import { print } from 'graphql';
import { getSession } from 'next-auth/client';
import { apiFetch } from '@codeday/topo/utils';
import { sign } from 'jsonwebtoken';
import getConfig from 'next/config';
import { GetAdvisorTokenAccountInfo } from './advisorToken.gql';

const { serverRuntimeConfig } = getConfig();

export async function getAdvisorToken(session) {
  if (!session) return null;

  const token = sign({ scopes: 'read:users' }, serverRuntimeConfig.gqlSecret, { expiresIn: '5m' });
  const { account } = await apiFetch(
    print(GetAdvisorTokenAccountInfo),
    { username: session.user.name },
    { Authorization: `Bearer ${token}`},
  );

  const roleIds = (account?.getUser?.roles || []).map((r) => r.id);

  if (!roleIds.includes(serverRuntimeConfig.advisorsAccessRole)) return null;

  return sign(
    { typ: 'req', username: session.user.name },
    serverRuntimeConfig.advisorsSecret,
    { audience: serverRuntimeConfig.advisorsAudience, expiresIn: '1w' },
  );
}
