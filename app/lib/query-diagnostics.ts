import { randomUUID } from 'node:crypto';

type QueryLabel =
  | 'revenue'
  | 'latest-invoices'
  | 'card-invoice-count'
  | 'card-customer-count'
  | 'card-invoice-status'
  | 'invoice-table'
  | 'invoice-page-count'
  | 'invoice-by-id'
  | 'customers'
  | 'customer-table'
  | 'login-user'
  | 'invoice-create'
  | 'invoice-update'
  | 'invoice-delete';

// Temporary diagnostics: pass fixed labels only, never SQL or query parameters.
export function createQueryDiagnostics(module: 'data' | 'auth' | 'actions') {
  const moduleInstanceId = randomUUID();
  let sequence = 0;

  return async function traceQuery<T>(
    queryLabel: QueryLabel,
    execute: () => PromiseLike<T>,
  ): Promise<T> {
    const queryId = ++sequence;
    const started = performance.now();

    function log(event: 'start' | 'success' | 'error', errorCode?: string) {
      console.log(JSON.stringify({
        diagnostic: 'db-query',
        module,
        moduleInstanceId,
        queryId,
        queryLabel,
        event,
        elapsedMs: Math.round(performance.now() - started),
        ...(errorCode ? { errorCode } : {}),
      }));
    }

    log('start');
    try {
      const result = await execute();
      log('success');
      return result;
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error
        ? error.code
        : undefined;
      const errorCode = typeof code === 'string' && /^[A-Z0-9_]{1,64}$/.test(code)
        ? code
        : 'UNKNOWN';
      log('error', errorCode);
      throw error;
    }
  };
}
