export function formHandler(formId = 'quoteForm', statusId = 'formStatus') {
    const form = document.getElementById(formId);
    const formStatus = document.getElementById(statusId);
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        
        // Replace this URL with your actual Google Form URL
        // You need to get this from your Google Form
        const googleFormURL = 'https://docs.google.com/forms/d/e/1FAIpQLSflV5HUAzz0b15FFZqPSUy2JJtq8AVD-IOQ0cA7wWv2r-Iegw/formResponse';
        
        // Get form data
        const formData = new FormData(form);
        
        // Create URL search params object for form submission
        const urlParams = new URLSearchParams();
        
        // Map your form fields to Google Form entry IDs
        // You'll need to replace these with your actual Google Form entry IDs
        const fieldMappings = {
            'name': 'entry.247360845',     // Replace with your actual entry ID
            'email': 'entry.2045398862',    // Replace with your actual entry ID
            'phone': 'entry.111510226',    // Replace with your actual entry ID
            'service': 'entry.1652547650',  // Replace with your actual entry ID
            'details': 'entry.1477358480'   // Replace with your actual entry ID
        };
        
        // Add form data to URL params with correct entry IDs
        for (const [name, value] of formData.entries()) {
            if (fieldMappings[name]) {
                urlParams.append(fieldMappings[name], value);
            }
        }
        
        try {
            // Create a temporary iframe for form submission
            // This is a workaround since direct AJAX to Google Forms can cause CORS issues
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Submit the form through the iframe
            iframe.setAttribute('src', `${googleFormURL}?${urlParams.toString()}`);
            
            // Show success message after a brief delay
            setTimeout(() => {
                // Clear the form
                form.reset();
                
                // Show success message
                formStatus.textContent = 'Your quote request has been submitted successfully!';
                formStatus.className = 'alert alert-success mt-3';
                formStatus.style.display = 'block';
                
                // Remove iframe after submission
                document.body.removeChild(iframe);
                
                // Hide the success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1000);
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            formStatus.textContent = 'There was an error submitting your request. Please try again.';
            formStatus.className = 'alert alert-danger mt-3';
            formStatus.style.display = 'block';
        }
    }
    
}