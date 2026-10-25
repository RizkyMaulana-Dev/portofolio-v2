export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the selection-based fallback.
  }

  const previouslyFocused =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    try {
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      return document.execCommand('copy');
    } finally {
      textarea.remove();
      previouslyFocused?.focus();
    }
  } catch {
    return false;
  }
}
