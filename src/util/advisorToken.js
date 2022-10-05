import { print } from 'graphql';
import { getSession } from 'next-auth/client';
import { apiFetch } from '@codeday/topo/utils';
import { sign } from 'jsonwebtoken';
import getConfig from 'next/config';
import { GetAdvisorTokenAccountInfo } from './advisorToken.gql';

const { serverRuntimeConfig } = getConfig();

function getType(roleIds) {
  if (roleIds.includes(serverRuntimeConfig.recAdminRole)) return 'a';
  if (roleIds.includes(serverRuntimeConfig.recWriterRole)) return 'rec';
  if (roleIds.includes(serverRuntimeConfig.advisorsAccessRole)) return 'req';
  return 'com';
}

export async function getAdvisorToken(session, onlyAdvisors) {
  if (!session) return null;

  const token = sign({ scopes: 'read:users' }, serverRuntimeConfig.gqlSecret, { expiresIn: '5m' });
  const { account } = await apiFetch(
    print(GetAdvisorTokenAccountInfo),
    { username: session.user.name },
    { Authorization: `Bearer ${token}`},
  );

  const roleIds = (account?.getUser?.roles || []).map((r) => r.id);
  const typ = getType(roleIds);
  if (typ === 'com' && onlyAdvisors) return null;

  return sign(
    { typ, username: session.user.name },
    serverRuntimeConfig.advisorsSecret,
    { audience: serverRuntimeConfig.advisorsAudience, expiresIn: '1w' },
  );
}
