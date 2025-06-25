function updateTheme() {
  const darkModeLabel = document.querySelector('label[title="Dark mode"]');
  const isDark = !darkModeLabel.hidden;

  // change images
  document.querySelectorAll('picture.theme-picture').forEach(picture => {
    const darkImg = picture.querySelector('img[data-theme="dark"]');
    const lightImg = picture.querySelector('img[data-theme="light"]');

    if (isDark){
      darkImg.style.display = '';
      lightImg.style.display = 'none';
    }
    if (!isDark) {
      darkImg.style.display = 'none';
      lightImg.style.display = '';
    }
  });

  // change table colors
  document.querySelectorAll('table').forEach(table => {

    if (isDark){
      table.classList.add('table-dark');
    }
    if (!isDark) {
      table.classList.remove('table-dark');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateTheme();
  const darkModeLabel = document.querySelector('label[title="Dark mode"]');

  const observer = new MutationObserver(() => {
    setTimeout(updateTheme, 50);
  });

  observer.observe(darkModeLabel, {
    attributes: true,
    attributeFilter: ['hidden']
  });
});
