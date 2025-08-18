export function createPersistPlugin({ storage, path = '' } = {}) {
  const safeStorage =
    storage ??
    (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
      ? window.localStorage
      : null)

  return ({ store }) => {
    if (!safeStorage) return

    const key = `${path}${store.$id}`

    try {
      const raw = safeStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw)
        store.$patch(parsed)
      }
    } catch (_e) {
      // ignore corrupted storage
    }

    store.$subscribe(
      (_mutation, state) => {
        try {
          safeStorage.setItem(key, JSON.stringify(state))
        } catch (_e) {
          // ignore quota/serialize errors
        }
      },
      { detached: true }
    )
  }
}
