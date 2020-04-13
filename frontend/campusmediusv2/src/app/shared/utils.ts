export function getIdFromResourceUrl(url: string) {
    const parts = new URL(url).pathname.split('/');
    return parts.pop() || parts.pop();  // handle potential trailing slash
}
