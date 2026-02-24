'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { updateUserPreferences } from '@/app/actions/user';

const SUGAR_OPTIONS = ['0%', '25%', '50%', '75%', '100%'];
const ICE_OPTIONS = ['No Ice', 'Less Ice', 'Normal Ice', 'Extra Ice'];

type OptionButtonProps = {
  label: string;
  isSelected: boolean;
  onClick: () => void;
};

function OptionButton({ label, isSelected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer hover:opacity-90 ${
        isSelected ? 'bg-[#8B9F82] text-white' : 'bg-[#F5F0E8] text-[#8C7B6B] hover:bg-[#E8DDD0]'
      }`}
    >
      {label}
    </button>
  );
}

interface PreferencesSegmentProps {
  initialSugarLevel: string;
  initialIceLevel: string;
}

export function PreferencesSegment({
  initialSugarLevel,
  initialIceLevel,
}: PreferencesSegmentProps) {
  const router = useRouter();
  const [sugarLevel, setSugarLevel] = useState(
    SUGAR_OPTIONS.includes(initialSugarLevel) ? initialSugarLevel : '50%',
  );
  const [iceLevel, setIceLevel] = useState(
    ICE_OPTIONS.includes(initialIceLevel) ? initialIceLevel : 'Normal Ice',
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSugarChange = async (level: string) => {
    setSugarLevel(level);
    setErrorMessage(null);
    const result = await updateUserPreferences(level, iceLevel);
    if (!result.success) setErrorMessage(result.message);
    else router.refresh();
  };

  const handleIceChange = async (level: string) => {
    setIceLevel(level);
    setErrorMessage(null);
    const result = await updateUserPreferences(sugarLevel, level);
    if (!result.success) setErrorMessage(result.message);
    else router.refresh();
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B5A898]">
        Preferences
      </h2>
      {errorMessage && (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B5344]">Default sugar level</p>
              <p className="text-xs text-[#B5A898]">Applied to new orders</p>
            </div>
            <div className="flex gap-1">
              {SUGAR_OPTIONS.map((level) => (
                <OptionButton
                  key={level}
                  label={level}
                  isSelected={sugarLevel === level}
                  onClick={() => handleSugarChange(level)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-5 border-t border-[#E8DDD0]" />

        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#6B5344]">Default ice level</p>
              <p className="text-xs text-[#B5A898]">Applied to new orders</p>
            </div>
            <div className="flex gap-1">
              {ICE_OPTIONS.map((level) => (
                <OptionButton
                  key={level}
                  label={level}
                  isSelected={iceLevel === level}
                  onClick={() => handleIceChange(level)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
