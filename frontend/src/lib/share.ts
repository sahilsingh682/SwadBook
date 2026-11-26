import { toast } from 'sonner';

export function shareToWhatsApp(title: string, url: string = window.location.href) {
  const text = `Check out this Zaika recipe: ${title}\n${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

export function shareToTwitter(title: string, url: string = window.location.href) {
  const text = `Check out this Zaika recipe: ${title}`;
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank',
    'noopener,noreferrer'
  );
}

export async function copyToClipboard(text: string = window.location.href) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
      return true;
    }
  } catch {
    // Fall through to legacy textarea fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    if (ok) {
      toast.success('Link copied to clipboard!');
      return true;
    }
  } catch {
    // ignore
  }

  toast.error('Failed to copy link');
  return false;
}
