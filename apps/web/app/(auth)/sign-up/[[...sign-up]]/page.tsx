import { SignUp } from '@clerk/nextjs';

export default function SignUpPage(): JSX.Element {
  return (
    <section className="flex justify-center py-6">
      <SignUp />
    </section>
  );
}
