// Set the current page and emails per page
let currentPage = 1;
let emailsPerPage = 10;
let totalEmails = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Use navbar or sidebar links to load mailboxes
  document.querySelector('#inbox-link').addEventListener('click', () => {
    load_mailbox('inbox');
  });
  document.querySelector('#sent-link').addEventListener('click', () => {
    load_mailbox('sent');
  });
  document.querySelector('#archive-link').addEventListener('click', () => {
    load_mailbox('archive');
  });
  document.querySelector('#compose-button').addEventListener('click', compose_email);

  // Compose form submit event
  document.querySelector('#compose-form').addEventListener('submit', () => {
    send_mail();
    localStorage.setItem('sent', 'true')
  });

  // By default, load the inbox
  if (localStorage.getItem('sent') === 'true') {
    load_mailbox('sent');
    localStorage.setItem('sent', 'false');
  } else {
    load_mailbox('inbox');
  }

  // Event listener for right arrow button
  document.querySelector('#right-arrow').addEventListener('click', () => {
    if ((currentPage * emailsPerPage) < totalEmails) {
      currentPage++;
      if (localStorage.getItem('sent') === 'true') {
        load_mailbox('sent');
      } else {
        load_mailbox('inbox');
      }
    }
  });

  // Event listener for left arrow button
  document.querySelector('#left-arrow').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      if (localStorage.getItem('sent') === 'true') {
        load_mailbox('sent');
      } else {
        load_mailbox('inbox');
      }
    }
  });
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

  if (mailbox === 'sent') {
    localStorage.setItem('sent', 'true');
  } else {
    localStorage.setItem('sent', 'false');
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Calculate offset to fetch emails based on current page
  const offset = (currentPage - 1) * emailsPerPage;

  // Fetch emails for the current page
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    totalEmails = emails.length; // Update total number of emails
    
    // Update display text
    const nowShowingDiv = document.querySelector('#now-showing');
    const firstEmailIndex = offset + 1;
    const lastEmailIndex = Math.min(offset + emailsPerPage, totalEmails);
    nowShowingDiv.innerHTML = `${firstEmailIndex}-${lastEmailIndex} of ${totalEmails}`;

    let emailsToDisplay = emails.slice(offset, offset + emailsPerPage);

    // Loop through the emails
    emailsToDisplay.forEach(email => {
      // Create a div for the email
      const recipients = email.recipients.join(', ')
      const recipients_concat = recipients.length > 25 ? recipients.substring(0, 25) + '...' : recipients;
      const sender = email.sender;
      const sender_concat = sender.length > 25 ? sender.substring(0, 25) + '...' : sender;
      const subject = `${email.subject ? email.subject : '(no subject)'} -&nbsp;`;
      const concat_body = email.body.length > 40 ? email.body.substring(0, 40) + '...' : email.body;

      const email_div = document.createElement('div');
      const senderRecipientDiv = document.createElement('div');
      const subjectDiv = document.createElement('div');
      subjectDiv.classList.add('subject-div');

      const subjectSpan = document.createElement('div');
      subjectSpan.innerHTML = subject;
      const bodySpan = document.createElement('span');
      bodySpan.innerHTML = concat_body;
      bodySpan.classList.add('concat-body');
      const timestampDiv = document.createElement('div');
      
      email_div.className = 'email';


      if (email.read) {
        email_div.style.backgroundColor = '#efefef';
        email_div.style.fontWeight = 'normal';
      } else {
        email_div.style.backgroundColor = 'white';
        email_div.style.fontWeight = 'bold';
      }


      subjectDiv.appendChild(subjectSpan);
      subjectDiv.appendChild(bodySpan);

      const formatDate = new Date(email.timestamp);
      timestampDiv.innerHTML = `${formatDate.toDateString().substring(4, 10)}`;
      timestampDiv.classList.add('timestamp');

      if (mailbox === "sent") {
        senderRecipientDiv.innerHTML = `To: ${recipients_concat}`;
      } else {
        senderRecipientDiv.innerHTML = `${sender_concat}`;
      } 

      senderRecipientDiv.style.width = '30%';
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.float = 'left';
      checkbox.style.width = '14px';
      checkbox.style.height = '14px';
      checkbox.style.marginRight = '10px';
      checkbox.style.position = 'relative';

      const rightSideDiv = document.createElement('div');
      rightSideDiv.classList.add('right-side-div');
      rightSideDiv.appendChild(subjectDiv);
      rightSideDiv.appendChild(timestampDiv);

      email_div.appendChild(checkbox);
      email_div.appendChild(senderRecipientDiv);
      email_div.appendChild(rightSideDiv);


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

      // If the email is a reply, keep the subject the same
      if (email.subject.slice(0, 3) === 'Re:') {
        document.querySelector('#compose-subject').value = email.subject;
      } else {
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
      }
      document.querySelector('#compose-recipients').value = email.sender;
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


