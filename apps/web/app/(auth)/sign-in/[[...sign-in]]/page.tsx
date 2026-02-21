import { SignIn } from '@clerk/nextjs';

export default function SignInPage(): JSX.Element {
  return (
    <section className="flex justify-center py-6">
      <SignIn />
    </section>
  );
}
