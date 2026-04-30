import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { AthleteBoathouseShellScreen } from '@/src/screens/athlete/AthleteBoathouseShellScreen';

export default function AthleteBoathouseRoute() {
  return (
    <ProtectedRouteBoundary area="athlete">
      <AthleteBoathouseShellScreen />
    </ProtectedRouteBoundary>
  );
}
