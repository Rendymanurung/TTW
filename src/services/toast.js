/* Toast Notification Event Helper */

export function showToast(message) {
  window.dispatchEvent(new CustomEvent('ttw-toast', { detail: message }));
}
