// Load Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'ta',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false
  }, 'google_translate_element');
}

var gtScript = document.createElement('script');
gtScript.type = 'text/javascript';
gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(gtScript);

// Toggle button
const toggleBtn = document.getElementById('lang-toggle');
if (toggleBtn) {
  let isTamil = document.cookie.includes("googtrans=/en/ta");
  toggleBtn.textContent = isTamil ? 'English' : 'தமிழ்';

  toggleBtn.addEventListener('click', () => {
    if (!isTamil) {
      document.cookie = "googtrans=/en/ta;path=/;domain=" + location.hostname;
      toggleBtn.textContent = 'English';
      isTamil = true;
    } else {
      document.cookie = "googtrans=/en/en;path=/;domain=" + location.hostname;
      toggleBtn.textContent = 'தமிழ்';
      isTamil = false;
    }
    location.reload();
  });
}
