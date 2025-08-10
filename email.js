<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
<script>
  (function(){
    emailjs.init("YOUR_PUBLIC_KEY");
  })();

  function sendEmail(storyTitle, contributorName) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
      title: storyTitle,
      name: contributorName,
      admin_email: "admin_email@gmail.com"
    }).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
      },
      (err) => {
        console.error("FAILED...", err);
      }
    );
  }

  // Call on form submit
  sendEmail("Ancient Temple", "Nivetha");
</script>
