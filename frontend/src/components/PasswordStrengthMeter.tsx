import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

interface PasswordStrengthMeterProps {
  password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 33, label: 'Poor', color: 'bg-destructive' };
  if (score <= 3) return { score: 66, label: 'Good', color: 'bg-amber-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <Progress
        value={strength.score}
        className="h-1.5 bg-muted"
        indicatorClassName={strength.color}
      />
      <p className={`text-xs font-medium ${
        strength.label === 'Poor' ? 'text-destructive' :
        strength.label === 'Good' ? 'text-amber-500' : 'text-emerald-500'
      }`}>
        Password strength: {strength.label}
      </p>
    </div>
  );
}
