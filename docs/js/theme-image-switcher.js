function updateThemePictures() {
  const darkModeLabel = document.querySelector('label[title="Dark mode"]');
  const isDark = !darkModeLabel.hidden;

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
}

document.addEventListener("DOMContentLoaded", () => {
  updateThemePictures();
  const darkModeLabel = document.querySelector('label[title="Dark mode"]');

  const observer = new MutationObserver(() => {
    setTimeout(updateThemePictures, 50);
  });

  observer.observe(darkModeLabel, {
    attributes: true,
    attributeFilter: ['hidden']
  });
});
