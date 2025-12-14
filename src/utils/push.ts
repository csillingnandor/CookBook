function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function isPushEnabled(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  return !!sub;
}

export async function togglePush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    alert("Service Worker nem támogatott");
    return false;
  }

  // iOS/Safari esetekben is előfordulhat, hogy nincs Push API
  if (!("PushManager" in window)) {
    alert("A böngésző nem támogatja a Push API-t.");
    return false;
  }

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();

  if (existing) {
    const ok = await existing.unsubscribe();
    if (!ok) {
      alert("Nem sikerült kikapcsolni az értesítéseket.");
      return true; 
    }


    return false; 
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string;
  if (!vapidPublicKey) {
    alert("Hiányzik: VITE_VAPID_PUBLIC_KEY");
    return false;
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  return true; 
}

export async function notifyRecipeAdded(recipeTitle: string) {
  if (!("serviceWorker" in navigator)) return;

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();

  if (!sub) return;

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  await fetch("/api/push/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Receptkönyv",
      body: `Új recept hozzáadva: ${recipeTitle} ✅`,
      url: "/",
    }),
  });
}

