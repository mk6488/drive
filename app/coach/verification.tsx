import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { CoachVerificationQueueShellScreen } from '@/src/screens/coach/CoachVerificationQueueShellScreen';

export default function CoachVerificationQueueRoute() {
  return (
    <ProtectedRouteBoundary area="coach" previewModeEnabled={true}>
      <CoachVerificationQueueShellScreen />
    </ProtectedRouteBoundary>
  );
}
