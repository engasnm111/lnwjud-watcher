export function shouldRegisterServiceWorker(protocol: string, isNativePlatform: boolean): boolean {
  return !isNativePlatform && (protocol === 'https:' || protocol === 'http:');
}

export async function removeNativeServiceWorkers(serviceWorker: ServiceWorkerContainer | undefined): Promise<boolean> {
  if (!serviceWorker) return false;
  const wasControlled = serviceWorker.controller !== null;
  const registrations = await serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  return wasControlled;
}
