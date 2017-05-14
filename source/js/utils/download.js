export default function (url) {
  const link = document.createElement('a');

  document.body.appendChild(link);
  link.href = url;

  link.click();

  link.remove();
}