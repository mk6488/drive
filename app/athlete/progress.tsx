import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { AthleteProgressShellScreen } from '@/src/screens/athlete/AthleteProgressShellScreen';

export default function AthleteProgressRoute() {
  return (
    <ProtectedRouteBoundary area="athlete">
      <AthleteProgressShellScreen />
    </ProtectedRouteBoundary>
  );
}
