import { firestoreSeedData } from './firestoreSeedData';
import { createFirestoreSeedPlan, getFirestoreSeedPlanSummary, validateFirestoreSeedPlan } from './firestoreSeedPlan';

function formatList(values: readonly string[]): string {
  return values.length === 0 ? 'none' : values.join(', ');
}

function printDryRunReport() {
  const plan = createFirestoreSeedPlan(firestoreSeedData);
  const validation = validateFirestoreSeedPlan(plan);
  const summary = getFirestoreSeedPlanSummary(plan);

  console.log('DRIVE Firestore seed dry run');
  console.log('============================');
  console.log(`Validation status: ${validation.status}`);
  console.log(`Planned document count: ${summary.totalOperations}`);
  console.log(`Planned document types: ${formatList(summary.documentTypes)}`);
  console.log('');
  console.log('Planned document paths:');
  plan.operations.forEach((operation) => {
    console.log(`- ${operation.path}`);
    console.log(`  Document type: ${operation.documentType}`);
    console.log(`  Operation type: ${operation.operationType}`);
    console.log(`  Document id: ${operation.documentId}`);
    operation.safetyNotes.forEach((note) => {
      console.log(`  Safety note: ${note}`);
    });
  });
  console.log('');
  console.log('Validation messages:');
  console.log(`Errors: ${formatList(validation.errors)}`);
  validation.warnings.forEach((warning) => {
    console.log(`- ${warning}`);
  });
  console.log('');
  console.log('Safety result: no Firestore writes were performed.');
  console.log('Safety result: no Firestore reads were performed.');
  console.log('Safety result: no Firebase Admin write happened.');
  console.log('Safety result: Firebase Admin was not initialised.');
  console.log('Safety result: apply:seed exists as a separate guarded workflow and was not run.');
  console.log('Safety result: no real junior data is included.');
  console.log('Safety result: no real club private data is included.');
  console.log('Safety result: submitted seed submissions omit review fields until coach review exists.');
  console.log('Safety result: repository provider mode was not changed.');
}

function main() {
  try {
    printDryRunReport();
  } catch (error) {
    console.error('Unable to run Firestore seed dry run.');
    console.error(error instanceof Error ? error.message : String(error));
    console.error('Safety result: no Firestore writes were performed.');
    console.error('Safety result: no Firestore reads were performed.');
    console.error('Safety result: Firebase Admin was not initialised.');
    process.exitCode = 1;
  }
}

main();
