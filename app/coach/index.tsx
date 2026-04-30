import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { CoachHomePlaceholderScreen } from '@/src/screens/coach/CoachHomePlaceholderScreen';

export default function CoachIndex() {
  return (
    <ProtectedRouteBoundary area="coach">
      <CoachHomePlaceholderScreen />
    </ProtectedRouteBoundary>
  );
}
