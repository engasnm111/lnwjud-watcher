export function shouldRegisterServiceWorker(protocol: string): boolean {
  return protocol !== 'file:';
}
