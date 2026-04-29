import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { AthleteSubmissionShellScreen } from '@/src/screens/athlete/AthleteSubmissionShellScreen';

export default function AthleteSubmissionRoute() {
  return (
    <ProtectedRouteBoundary area="athlete" previewModeEnabled={true}>
      <AthleteSubmissionShellScreen />
    </ProtectedRouteBoundary>
  );
}
