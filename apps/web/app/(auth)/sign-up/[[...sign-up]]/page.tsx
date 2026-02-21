import { ClientClerkSignUp } from '@/components/auth/ClientClerkSignUp';

const signUpAppearance = {
  elements: {
    rootBox: 'w-full max-w-sm',
    card: 'bg-white shadow-none border border-[#E8DDD0] rounded-2xl',
    headerTitle: 'text-[#6B5344] font-serif',
    headerSubtitle: 'text-[#8C7B6B]',
    formButtonPrimary:
      'bg-[#8B9F82] hover:bg-[#7A8E71] text-white shadow-none',
    formFieldInput:
      'border-[#D4C5B2] bg-[#FAF7F2] text-[#6B5344] focus:border-[#8B9F82] focus:ring-[#8B9F82]',
    footerActionLink: 'text-[#8B9F82] hover:text-[#7A8E71]',
    socialButtonsBlockButton:
      'border-[#D4C5B2] text-[#6B5344] hover:bg-[#FAF7F2]',
    dividerLine: 'bg-[#E8DDD0]',
    dividerText: 'text-[#8C7B6B]',
  },
};

export default function SignUpPage(): JSX.Element {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 flex flex-col items-center gap-3">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="drop-shadow-sm"
        >
          <path
            d="M12 3C8 3 5.5 6.5 5.5 11c0 4 2.5 7.5 6.5 10 4-2.5 6.5-6 6.5-10 0-4.5-2.5-8-6.5-8z"
            fill="#8B9F82"
          />
          <path
            d="M12 7v10"
            stroke="#F5F0E8"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M9.5 10c1.5 1 3.5 1 5 0"
            stroke="#F5F0E8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-2xl tracking-wide text-[#6B5344]">
          VETEA
        </span>
        <p className="text-sm text-[#8C7B6B]">Create your account</p>
      </div>

      <ClientClerkSignUp appearance={signUpAppearance} />
    </div>
  );
}
