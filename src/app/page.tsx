import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  return redirect('/landing');
  // const { userId } = await auth();
  // if (!userId) {
  //   return redirect('/landing');
  // } else {
  //   redirect('/dashboard/overview');
  // }
}
