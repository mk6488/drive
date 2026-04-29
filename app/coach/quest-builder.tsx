import { ProtectedRouteBoundary } from '@/src/components/auth/ProtectedRouteBoundary';
import { CoachQuestBuilderShellScreen } from '@/src/screens/coach/CoachQuestBuilderShellScreen';

export default function CoachQuestBuilderRoute() {
  return (
    <ProtectedRouteBoundary area="coach" previewModeEnabled={true}>
      <CoachQuestBuilderShellScreen />
    </ProtectedRouteBoundary>
  );
}
