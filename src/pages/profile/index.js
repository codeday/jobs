import { getSession } from 'next-auth/client';

export default function ProfileIndex() {
  return null;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    redirect: {
      permanent: false,
      destination: `/profile/${session.user.name}`,
    },
  };
}
