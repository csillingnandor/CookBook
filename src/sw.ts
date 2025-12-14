/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

export {};



self.addEventListener("push", (event) => {
  const pushEvent = event as PushEvent;

  const data = pushEvent.data ? (pushEvent.data.json() as any) : {};
  const title = data.title ?? "Receptkönyv";

  const options: NotificationOptions = {
    body: data.body ?? "Új értesítés",
    icon: "/icons/icon-192.png", // ha van
    data: { url: data.url ?? "/" },
  };

  pushEvent.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  const notifEvent = event as NotificationEvent;
  notifEvent.notification.close();

  const url = (notifEvent.notification.data as any)?.url ?? "/";

  notifEvent.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of allClients) {
        // WindowClient esetén van focus()
        if ("focus" in client) {
          return (client as WindowClient).focus();
        }
      }

      return self.clients.openWindow(url);
    })()
  );
});

