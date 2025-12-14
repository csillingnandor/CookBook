(() => {
  // src/sw.ts
  self.addEventListener("push", (event) => {
    const pushEvent = event;
    const data = pushEvent.data ? pushEvent.data.json() : {};
    const title = data.title ?? "Receptk\xF6nyv";
    const options = {
      body: data.body ?? "\xDAj \xE9rtes\xEDt\xE9s",
      icon: "/icons/icon-192.png",
      // ha van
      data: { url: data.url ?? "/" }
    };
    pushEvent.waitUntil(self.registration.showNotification(title, options));
  });
  self.addEventListener("notificationclick", (event) => {
    const notifEvent = event;
    notifEvent.notification.close();
    const url = notifEvent.notification.data?.url ?? "/";
    notifEvent.waitUntil(
      (async () => {
        const allClients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        });
        for (const client of allClients) {
          if ("focus" in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })()
    );
  });
})();
