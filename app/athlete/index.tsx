import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { AthleteTodaysQuestScreen } from '@/src/screens/athlete/AthleteTodaysQuestScreen';

export default function AthleteIndex() {
  return (
    <ProtectedRouteBoundary area="athlete">
      <AthleteTodaysQuestScreen />
    </ProtectedRouteBoundary>
  );
}
