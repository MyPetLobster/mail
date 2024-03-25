document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', () => {
    send_mail();
    localStorage.setItem('sent', 'true')
  });

  if (localStorage.getItem('sent') === 'true') {
    load_mailbox('sent');
    localStorage.setItem('sent', 'false');
  } else {
    load_mailbox('inbox');
  }
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_mail() {

  // Get the values of the email form
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send the email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);
  });

  // Load the sent mailbox
  load_mailbox('sent');
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get the emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);
    // Loop through the emails
    emails.forEach(email => {
      // Create a div for the email
      const recipients = email.recipients.join(', ')
      const recipients_concat = recipients.length > 25 ? recipients.substring(0, 25) + '...' : recipients;
      const subject = email.subject ? email.subject : '(no subject)';
      const email_div = document.createElement('div');

      email_div.className = 'email';

      if (email.read) {
        email_div.style.backgroundColor = 'lightgray';
      } else {
        email_div.style.backgroundColor = 'white';
      }

      // Set innerHTML format depending on the mailbox
      if (mailbox === "sent") {
        email_div.innerHTML = `<b>To: ${recipients_concat}</b> - ${subject} - ${email.timestamp}`;
      } else {
        email_div.innerHTML = `<b>From: ${email.sender}</b> - ${subject} - ${email.timestamp}`;
      } 
        
      email_div.addEventListener('click', () => {
        load_email(email.id);
      });

      // Append the email to the emails-view
      document.querySelector('#emails-view').appendChild(email_div);
    });
  });

}


function load_email(email_id) {
  // Show the email-view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Clear the email-view
  document.querySelector('#email-view').innerHTML = '';

  // Get the email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);

    // Create a div for the email
    const email_div = document.createElement('div');
    email_div.innerHTML = `<b>From:</b> ${email.sender}<br><b>To:</b> ${email.recipients}<br><b>Subject:</b> ${email.subject}<br><b>Timestamp:</b> ${email.timestamp}<br><br>${email.body}`;

    // Append the email to the email-view
    document.querySelector('#email-view').appendChild(email_div);

    // Create a button to reply
    const reply_button = document.createElement('button');
    reply_button.innerHTML = 'Reply';
    reply_button.addEventListener('click', () => {
      compose_email();
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
    });

    // Append the button to the email-view
    document.querySelector('#email-view').appendChild(reply_button);

    // Create a button to archive
    const archive_button = document.createElement('button');
    if (email.archived) {
      archive_button.innerHTML = 'Unarchive';
    } else { 
      archive_button.innerHTML = 'Archive';
    }

    archive_button.addEventListener('click', () => {
      archived = !email.archived;
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          archived: archived
        })
      });
      // wait until db is updated then refresh inbox
      setTimeout(() => load_mailbox('inbox'), 100);
    });

    // Append the button to the email-view
    document.querySelector('#email-view').appendChild(archive_button);

    // Mark the email as read
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    });
  });
}


