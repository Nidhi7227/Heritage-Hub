function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'ta',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  }

  // Load Google Translate script asynchronously
  var gtScript = document.createElement('script');
  gtScript.type = 'text/javascript';
  gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(gtScript);

  const toggleBtn = document.getElementById('lang-toggle');
  let isTamil = false;

  toggleBtn.addEventListener('click', () => {
    // Use cookie to set language and reload
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