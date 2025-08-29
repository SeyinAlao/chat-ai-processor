
export function toast({ title, description, variant = 'default' }) {
  const background = variant === 'destructive' ? '#ffe5e5' : '#e5ffe5';
  const color = variant === 'destructive' ? '#d8000c' : '#005500';

  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.padding = '12px 16px';
  toast.style.backgroundColor = background;
  toast.style.color = color;
  toast.style.border = `1px solid ${color}`;
  toast.style.borderRadius = '8px';
  toast.style.zIndex = 9999;
  toast.style.fontFamily = 'sans-serif';
  toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
  toast.style.maxWidth = '300px';
  toast.innerHTML = `
    <strong style="display:block; margin-bottom: 4px;">${title}</strong>
    <span>${description}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
