document.getElementById("quote-form").addEventListener("submit", function(e) {
    e.preventDefault(); // prevent default form submission

    const form = e.target;
    const data = new FormData(form);

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSeJBZnrScqSgq5QNZRAu3MogyH_r6q3DKFKDpS34I1Ju0qDEw/formResponse", {
      method: "POST",
      mode: "no-cors", // important for Google Forms
      body: data
    }).then(() => {
      alert("Application submitted successfully!");
      form.reset(); // clear form
    }).catch(() => {
      alert("There was an error submitting the form.");
    });
  });