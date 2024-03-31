// Set global variable values for email pagination and icon listeners
let currentPage = 1;
let emailsPerPage = 25;
let totalEmails = 0;
let listenersLoaded = false;
let soloTrashListener = false;
const usersWithPics = [
  "CoryJSuzuki", 
  "Nick", 
  "BlockbusterVideo", 
  "yardsaleco", 
  "tom_riddle26",
  "BonsaiWorld",
  "AuntLindaKnits",
  "Big_D_Vader",
  "norman_bates",
  "A_Chigurh",
  "AuntSpiker",
  "AuntSponge01",
  "TheTigerKing",
  "JJProperties",
  "DWyle445",
  "BenThePerson"
]

document.addEventListener('DOMContentLoaded', function() {
  
  // Switch to mailbox arrow event listeners
  switchToMailboxArrows();

  // Use navbar or sidebar links to load mailboxes
  document.querySelector('#inbox-link').addEventListener('click', () => {
    localStorage.setItem('sent', 'false');
    localStorage.setItem('archive', 'false');
    switchToMailboxArrows();
    resetSelectAll();
    showAllIcons();
    load_mailbox('inbox');
  });

  document.querySelector('#sent-link').addEventListener('click', () => {
    switchToMailboxArrows();
    resetSelectAll();
    showTrashOnly();
    load_mailbox('sent');
  });

  document.querySelector('#archive-link').addEventListener('click', () => {
    switchToMailboxArrows();
    resetSelectAll();
    showAllIcons();
    load_mailbox('archive');
    localStorage.setItem('archive', 'true');
  });

  document.querySelectorAll('.logout-link').forEach(link => {
    link.addEventListener('click', () => {
      localStorage.setItem('sent', 'false'),
      localStorage.setItem('archive', 'false')
    });
  });
  
  // Display compose new message form when compose button is clicked
  document.querySelector('#compose-button').addEventListener('mouseup', () => {
    if (!listenersLoaded) {
      minimizeCompose();
      expandCompose();
      closeCompose();
    }
    listenersLoaded = true;
    compose_email();
  });

  // Compose form submit event
  document.querySelector('#compose-form').addEventListener('submit', () => {
    send_mail();
    localStorage.setItem('sent', 'true')
  });

  // Load or refresh selected mailbox. Default to inbox
  if (localStorage.getItem('sent') === 'true') {
    load_mailbox('sent');
    localStorage.setItem('sent', 'false');
  } else if (localStorage.getItem('archive') === 'true') {
    load_mailbox('archive')
    localStorage.setItem('archive', 'false')
  } else {
    load_mailbox('inbox');
  }

  // Select All, checkboxes, and batch processing
  // Icon event listeners
  const archiveIcon = document.querySelector('#archive-icon');
  const closedEnvelopeIcon = document.querySelector('#closed-envelope-icon');
  const openEnvelopeIcon = document.querySelector('#open-envelope-icon');
  const trashIcon = document.querySelector('.trash-icons');

  archiveIcon.onclick = () => {
    const emailCheckboxes = document.querySelectorAll('.email-checkbox');
    let selectedEmails = [];
    selectedEmails = Array.from(emailCheckboxes).filter(checkbox => checkbox.checked);

    selectedEmails.forEach(checkbox => {
        const emailID = checkbox.nextSibling.value;
        
        fetch(`/emails/${emailID}`)
        .then(response => response.json())
        .then(email => {
            fetch(`/emails/${emailID}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: !email.archived
                })
            });
        }); 
    });

    setTimeout(() => {
      load_mailbox('inbox');
    }, 250);
  };

  closedEnvelopeIcon.onclick = () => {
    const emailCheckboxes = document.querySelectorAll('.email-checkbox');
    let selectedEmails = [];
    selectedEmails = Array.from(emailCheckboxes).filter(checkbox => checkbox.checked);
    selectedEmails.forEach(checkbox => {
        const emailID = checkbox.nextSibling.value;
        fetch(`/emails/${emailID}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
        });
    });
    
    document.querySelector('#select-all-checkbox').checked = false;
    document.querySelector('#select-all-text').classList.remove('hidden');
    document.querySelector('#all-icons-div').classList.add('hidden');


    setTimeout(() => {
        if (localStorage.getItem('sent') === 'true') {
            load_mailbox('sent');
        } else if (localStorage.getItem('archive') === 'true') {
            load_mailbox('archive');
        } else {
            load_mailbox('inbox');
        }
    }, 250);
  };

  openEnvelopeIcon.onclick = () => {
    const emailCheckboxes = document.querySelectorAll('.email-checkbox');
    let selectedEmails = [];
    selectedEmails = Array.from(emailCheckboxes).filter(checkbox => checkbox.checked);
    selectedEmails.forEach(checkbox => {
        const emailID = checkbox.nextSibling.value;
        fetch(`/emails/${emailID}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: false
            })
        });
    });
    
    document.querySelector('#select-all-checkbox').checked = false;
    document.querySelector('#all-icons-div').classList.add('hidden');
    document.querySelector('#select-all-text').classList.remove('hidden');

    setTimeout(() => {
        if (localStorage.getItem('sent') === 'true') {
            load_mailbox('sent');
        } else if (localStorage.getItem('archive') === 'true') {
            load_mailbox('archive');
        } else {
            load_mailbox('inbox');
        }
    }, 250);
  }

  trashIcon.addEventListener('mouseup', () => {
    const emailCheckboxes = document.querySelectorAll('.email-checkbox');
    let selectedEmails = [];
    selectedEmails = Array.from(emailCheckboxes).filter(checkbox => checkbox.checked);
    if (selectedEmails.length === 1) {
      alert("Email moved to trash (metaphorically)");
    } else {
      alert(`${selectedEmails.length} emails moved to trash (metaphorically)`);
    }

    document.querySelector('#select-all-checkbox').checked = false;
    document.querySelector('#all-icons-div').classList.add('hidden');
    document.querySelector('#select-all-text').classList.remove('hidden');

    setTimeout(() => {
        if (localStorage.getItem('sent') === 'true') {
            load_mailbox('sent');
        } else if (localStorage.getItem('archive') === 'true') {
            load_mailbox('archive');
        } else {
            load_mailbox('inbox');
        }
    }, 250);
  });


  // Search bar style event listeners
  const search = document.querySelector('#search');
  const searchBar = document.querySelector('.search-bar');

  search.addEventListener('click', () => {
      searchBar.style.backgroundColor = 'white';
      search.style.backgroundColor = 'white';
  });

  // Reset style if user clicks elsewhere on the page
  document.addEventListener('click', (e) => {
      if (e.target !== search) {
          searchBar.style.backgroundColor = '#d5d5d5';
          search.style.backgroundColor = '#d5d5d5';
      }
  });

  // Search bar "enter" key event listener
  document.querySelector('#search').addEventListener('keyup', (key) => {
    if (key.keyCode === 13) {
      alert('Search not yet implemented');
      document.querySelector('#search').value = '';
    }
  });
  
  // Hamburger menu event listener
  const hamburger = document.querySelector('#hamburger');
  const navTextSpans = document.querySelectorAll('.nav-text');

  // Collapse all nav text, only display icons. Main container expands left, 48px margin removed
  hamburger.addEventListener('click', () => {
      navTextSpans.forEach(span => {
          span.classList.toggle('display-none');
      });
      const gmailLogo = document.querySelector('#gmail-logo');
      gmailLogo.classList.toggle('display-none');

      const composeButton = document.querySelector('#compose-button');
      composeButton.classList.toggle('shrink-button');

      const navbar = document.querySelector('#base-nav-div');
      navbar.classList.toggle('shrink-navbar');
      const bottomNavbar = document.querySelector('#bottom-navbar');
      bottomNavbar.classList.toggle('shrink-navbar');
      const navUl = document.querySelector('#navbar-nav');
      navUl.classList.toggle('shrink-navbar');

      document.querySelector('.main-container').classList.toggle('margin-left-48');
  });

  // Select all checkbox event listener
  const selectAllCheckbox = document.querySelector('#select-all-checkbox');
  const allIconsDiv = document.querySelector('#all-icons-div');
  const selectAllText = document.querySelector('#select-all-text');

  selectAllCheckbox.onclick = () => {
      const allCheckboxes = document.querySelectorAll('.email-checkbox');
      if (selectAllCheckbox.checked) {
          allIconsDiv.classList.remove('hidden');
          allIconsDiv.classList.remove('negative-zidx');
          selectAllText.classList.add('hidden');
          allCheckboxes.forEach(checkbox => checkbox.checked = true);
      } else {
          allIconsDiv.classList.add('hidden');
          allIconsDiv.classList.add('negative-zidx');
          selectAllText.classList.remove('hidden');
          allCheckboxes.forEach(checkbox => checkbox.checked = false);
      }
  };

  // Trash icon event listeners, animate Oscar the Grouch
  const trashDiv = document.querySelector('.trash-icons');
  const trashOne = document.querySelector('#trash-icon-01');
  const trashTwo = document.querySelector('#trash-icon-02');
  const trashThree = document.querySelector('#trash-icon-03');

  trashDiv.addEventListener('mouseover', () => {
      trashOne.classList.add('full-hidden');
      trashTwo.classList.remove('full-hidden');
  })
  trashDiv.addEventListener('mouseout', () => {
      trashTwo.classList.add('full-hidden');
      trashOne.classList.remove('full-hidden');
  })
  trashDiv.addEventListener('mousedown', () => {
      trashTwo.style.display = 'none';
      trashThree.classList.remove('full-hidden');
  })
  trashDiv.addEventListener('mouseup', () => {
      trashThree.classList.add('full-hidden');
      trashTwo.style.display = 'inherit';
  })

  // Profile pic dropdown event listeners
  const navProfilePic = document.querySelector('#nav-profile-pic');
  const dropDownMenu = document.querySelector('#dropdown-menu');
  navProfilePic.addEventListener('click', () => {
    dropDownMenu.classList.toggle('display-none');
  });
  document.querySelector('.dropdown-x').addEventListener('click', () => {
    dropDownMenu.classList.add('display-none');
  });

});


// VIEWS and ACTIONS
function compose_email() {
  const composeForm = document.querySelector('#compose-form');
  if (composeForm.style.display === 'none') {
    composeForm.style.display = 'flex';
  }

  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-floating-div').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').innerHTML = '';
}

function send_mail() {
  // Get the values of the email form
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').innerHTML;

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
    localStorage.setItem('archive', 'false')
  } else if (mailbox === 'archive') {
    localStorage.setItem('archive', 'true');
    localStorage.setItem('sent', 'false');
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#all-icons-div').classList.remove('display-none');
  document.querySelector('#select-all-checkbox').classList.remove('display-none');
  document.querySelector('#select-all-text').classList.remove('display-none');
  document.querySelector('#solo-trash-div').classList.add('display-none');

  // Handle separate trash icons for sent mailbox and solo email views.
  if (soloTrashListener === false) {
    document.querySelector('#solo-trash-div').addEventListener('mouseover', () => {
      document.querySelector('#trash-solo-icon-01').classList.add('full-hidden');
      document.querySelector('#trash-solo-icon-02').classList.remove('full-hidden');
    });
    document.querySelector('#solo-trash-div').addEventListener('mouseout', () => {
      document.querySelector('#trash-solo-icon-01').classList.remove('full-hidden');
      document.querySelector('#trash-solo-icon-02').classList.add('full-hidden');
    });
    document.querySelector('#solo-trash-div').addEventListener('mousedown', () => {
      document.querySelector('#trash-solo-icon-02').classList.add('display-none');
      document.querySelector('#trash-solo-icon-03').classList.remove('full-hidden');
    });
    document.querySelector('#solo-trash-div').addEventListener('mouseup', () => {
      alert('Email moved to trash (metaphorically)');
      document.querySelector('#trash-solo-icon-02').classList.remove('display-none');
      document.querySelector('#trash-solo-icon-03').classList.add('full-hidden');
    });
    soloTrashListener = true;
  } 

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h4>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h4>`;

  // Calculate offset to fetch emails based on current page and emailsPerPage value
  const offset = (currentPage - 1) * emailsPerPage;

  // Fetch emails for the current page
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    totalEmails = emails.length; // Update total number of emails
    
    if (totalEmails === 0) {
      document.querySelector('.select-all-div').classList.add('hidden-flat');
    } else {
      document.querySelector('.select-all-div').classList.remove('hidden-flat');
    }

    // Update display text
    const nowShowingDiv = document.querySelector('#now-showing');
    const firstEmailIndex = offset + 1;
    const lastEmailIndex = Math.min(offset + emailsPerPage, totalEmails);
    if (totalEmails === 0) {
      nowShowingDiv.innerHTML = `0-0 of 0`;
    } else {
      nowShowingDiv.innerHTML = `${firstEmailIndex}-${lastEmailIndex} of ${totalEmails}`;
    }

    let emailsToDisplay = emails.slice(offset, offset + emailsPerPage);

    const listOfAllEmails = []
    emails.forEach(email => {
      listOfAllEmails.push(email.id);
    });

    // Loop through the emails
    emailsToDisplay.forEach(email => {

      // Create a div for the email
      const subjectLength = email.subject ? email.subject.length : 0;
      const charactersToDisplay = 86 - subjectLength;

      const recipients = email.recipients.join(', ')
      const recipients_concat = recipients.length > 25 ? recipients.substring(0, 25) + '...' : recipients;
      const sender = email.sender;
      const sender_concat = sender.length > 25 ? sender.substring(0, 25) + '...' : sender;
      const subject = `${email.subject ? email.subject : '(no subject)'} -&nbsp;`;
      const bodyText = email.body;
      const cleanBody = bodyText.replace(/<[^>]*>?/gm, ' ');
      const concat_body = cleanBody.length > charactersToDisplay ? cleanBody.substring(0, charactersToDisplay) + '...' : cleanBody;
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
      checkbox.style.zIndex = '1000';
      checkbox.classList.add('email-checkbox');
      checkbox.addEventListener('click', showHideIcons);

      const rightSideDiv = document.createElement('div');
      rightSideDiv.classList.add('right-side-div');
      rightSideDiv.appendChild(subjectDiv);
      rightSideDiv.appendChild(timestampDiv);

      const hiddenEmailId = document.createElement('input');
      hiddenEmailId.type = 'hidden';
      hiddenEmailId.value = email.id;
      hiddenEmailId.classList.add('email-id');

      const hiddenListOfAllEmails = document.createElement('input');
      hiddenListOfAllEmails.type = 'hidden';
      hiddenListOfAllEmails.value = listOfAllEmails;
      hiddenListOfAllEmails.classList.add('list-of-all-emails');


      email_div.appendChild(checkbox);
      email_div.appendChild(hiddenEmailId);
      email_div.appendChild(senderRecipientDiv);
      email_div.appendChild(rightSideDiv);

      // Add click event listener ignoring checkbox
      email_div.addEventListener('click', (event) => {
        if (event.target.type !== 'checkbox') {
          load_email(email.id, listOfAllEmails);
        }
      });

      // Append the email to the emails-view
      document.querySelector('#emails-view').appendChild(email_div);
    });
  });
}

function load_email(email_id, listOfAllEmails) {

  // Remove listeners for mailbox arrow functions
  document.querySelector('#right-arrow').removeAttribute('onclick');
  document.querySelector('#left-arrow').removeAttribute('onclick');
  
  // Hide the icon array and select all checkbox
  document.querySelector('#all-icons-div').classList.add('display-none');
  document.querySelector('#select-all-checkbox').classList.add('display-none');
  document.querySelector('#select-all-text').classList.add('display-none');
  document.querySelector('#solo-trash-div').classList.remove('display-none');

  // Clear the email-view
  document.querySelector('#email-view').innerHTML = '';

  // Show the email-view and hide other views
  const nowShowingDiv = document.querySelector('#now-showing');
  const totalEmails = listOfAllEmails.length;
  const currentEmailIndex = listOfAllEmails.indexOf(email_id) + 1;
  nowShowingDiv.innerHTML = `${currentEmailIndex} of ${totalEmails}`;

  const leftArrow = document.querySelector('#left-arrow');
  const rightArrow = document.querySelector('#right-arrow');

  if (currentEmailIndex === 1) {
    leftArrow.style.display = 'none';
  } else {
    leftArrow.style.display = 'block';
  }

  if (currentEmailIndex === totalEmails) {
    rightArrow.style.display = 'none';
  } else {
    rightArrow.style.display = 'block';
  }

  leftArrow.onclick = () => {
    if (currentEmailIndex > 1) {
      load_email(listOfAllEmails[currentEmailIndex - 2], listOfAllEmails);
    }
  }
  rightArrow.onclick = () => {
    if (currentEmailIndex < totalEmails) {
      load_email(listOfAllEmails[currentEmailIndex], listOfAllEmails);
    }
  };

  // Show the email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Get the email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
    const body = makeEmailBodyLinksClickable(email.body);
    // Create a div for the email
    const emailDiv = document.createElement('div');

    // Check if the sender has a profile picture, if not set to default
    senderUsername = email.sender.split('@')[0];
    if (usersWithPics.includes(senderUsername)) {
      senderUsername = senderUsername.toLowerCase();
    } else {
      senderUsername = 'default';
    }
  
    emailDiv.innerHTML = `
      <div class="email-content-div">
        <div class="content-header">
          <div id="profile-picture-email" class="profile-pic-container">
            <img class="profile-picture" src="../../static/mail/images/${senderUsername}.jpg">
          </div>
          <div class="content-subject">${email.subject}</div>
        </div>
        <div class="content-content">
          <div class="content-sender">From: ${email.sender}</div>
          <div class="recipients-timestamp">
            <div class="content-recipients">To: ${email.recipients.join(', ')}</div>
            <div class="timestamp-icons-div">
              <div class="content-timestamp">${email.timestamp}</div>
            </div>
          </div>
          <div class="content-body">${body}</div>
        </div>
      </div>
    `;

    // Append the email to the email-view
    document.querySelector('#email-view').appendChild(emailDiv);

    // Create a button to reply
    const replyButton = document.createElement('button');
    replyButton.classList.add('email-reply-button');
    replyButton.innerHTML = `
        <svg id="reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19">
          <path id="reply-icon-path" fill="rgb(84,84,84)" data-name="reply-24px" d="M15,5H3.4L6.7,1.7A.967.967,0,0,0,6.7.3.967.967,0,0,0,5.3.3l-5,5a.967.967,0,0,0,0,1.4l5,5a.967.967,0,0,0,1.4,0,.967.967,0,0,0,0-1.4L3.4,7H15a6.957,6.957,0,0,1,7,7v4a1,1,0,0,0,2,0V14A8.963,8.963,0,0,0,15,5Z"/>
        </svg>
        Reply `;
    replyButton.addEventListener('click', () => {
      if (!listenersLoaded) {
        minimizeCompose();
        expandCompose();
        closeCompose();
      }
      listenersLoaded = true;
      compose_email();

      // If the email is already a reply, keep the subject the same, else add 'Re: ' 
      if (email.subject.slice(0, 3) === 'Re:') {
        document.querySelector('#compose-subject').value = email.subject;
      } else {
        document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
      }
      document.querySelector('#compose-recipients').value = email.sender;
      document.querySelector('#compose-body').innerHTML = `<br><br><div>On ${email.timestamp} ${email.sender} wrote:</div> <p class="reply-body">${email.body}</p>`;
      
    });

    // Create forward button
    const forwardButton = document.createElement('button');
    forwardButton.classList.add('email-forward-button');
    forwardButton.innerHTML = `
        <svg id="forward-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19">
          <path id="forward-icon-path" fill="rgb(84,84,84)" data-name="forward-24px" d="M23.7,5.3l-5-5a.967.967,0,0,0-1.4,0,.967.967,0,0,0,0,1.4L20.6,5H9a8.963,8.963,0,0,0-9,9v4a.945.945,0,0,0,1,1,.945.945,0,0,0,1-1V14A6.957,6.957,0,0,1,9,7H20.6l-3.3,3.3a.967.967,0,0,0,0,1.4.967.967,0,0,0,1.4,0l5-5A.967.967,0,0,0,23.7,5.3Z"/>
        </svg>
        Forward`;

    forwardButton.addEventListener('click', () => {
      if (!listenersLoaded) {
        minimizeCompose();
        expandCompose();
        closeCompose();
      }
      listenersLoaded = true;
      compose_email();
      document.querySelector('#compose-subject').value = `Fwd: ${email.subject}`;
      document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
    });

    // Create archive button
    const archive_button = document.createElement('button');
    archive_button.classList.add('email-archive-button'); 
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
      setTimeout(() => load_mailbox('inbox'), 250);
    });

    const replyForwardBox = document.createElement('div');
    replyForwardBox.classList.add('reply-forward-box');
    replyForwardBox.classList.add('button-box');
    replyForwardBox.appendChild(replyButton);
    replyForwardBox.appendChild(forwardButton);

    const buttonBox = document.createElement('div');
    buttonBox.classList.add('button-box');
    buttonBox.appendChild(replyForwardBox);
    buttonBox.appendChild(archive_button);
    document.querySelector('#email-view').appendChild(buttonBox);

    const buttonList = [replyButton, forwardButton, archive_button];
    buttonList.forEach(button => {
      button.addEventListener('mousedown', () => {
        button.classList.toggle('email-button-active')
      })
      button.addEventListener('mouseup', () => {
        button.classList.toggle('email-button-active')
      })
    });
    
    // Mark the opened email as read
    fetch(`/emails/${email_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    });
  });
}


// HELPER FUNCTIONS
function switchToMailboxArrows() {
  const leftArrow = document.querySelector('#left-arrow');
  const rightArrow = document.querySelector('#right-arrow');
  leftArrow.style.display = 'block';
  rightArrow.style.display = 'block';

  // Remove onclick event from email arrows 
  rightArrow.removeAttribute('onclick');
  leftArrow.removeAttribute('onclick');
  // Add onclick event to mailbox arrows
  rightArrow.onclick = () => handleRightArrowMailbox();
  leftArrow.onclick = () => handleLeftArrowMailbox();
}

function handleLeftArrowMailbox() {
  if (currentPage > 1) {
    currentPage--;
    if (localStorage.getItem('sent') === 'true') {
      load_mailbox('sent');
    } else if (localStorage.getItem('archive') === 'true') {
      load_mailbox('archive');
    } else {
      load_mailbox('inbox');
    }
  }
}

function handleRightArrowMailbox() {
  if ((currentPage * emailsPerPage) < totalEmails) {
    currentPage++;
    if (localStorage.getItem('sent') === 'true') {
      load_mailbox('sent');
    } else if (localStorage.getItem('archive') === 'true') {
      load_mailbox('archive');
    } else {
      load_mailbox('inbox');
    }
  }
}

function makeEmailBodyLinksClickable (emailBody) {
  const emailBodyArray = emailBody.split(/ |&nbsp;/);

  const emailBodyArrayWithLinks = emailBodyArray.map(word => {
    if (word.includes('http')) {
      return `<a href="${word}">${word}</a>`;
    } else {
      return word;
    }
  });
  return emailBodyArrayWithLinks.join(' ');
}

function resetSelectAll() {
  const selectAllCheckbox = document.querySelector('#select-all-checkbox');
  selectAllCheckbox.checked = false;

  const selectAllText = document.querySelector('#select-all-text');
  const allIconsDiv = document.querySelector('#all-icons-div');
  selectAllText.classList.remove('hidden');
  allIconsDiv.classList.add('hidden');
}

function showHideIcons() {
  // if any checkbox is checked, show icons
  const selectAllText = document.querySelector('#select-all-text');
  const allIconsDiv = document.querySelector('#all-icons-div');
  const selectAllCheckbox = document.querySelector('#select-all-checkbox');
  
  selectAllText.classList.add('hidden');
  allIconsDiv.classList.remove('hidden');
  allIconsDiv.classList.remove('negative-zidx');
     
  const checkboxes = document.querySelectorAll('.email-checkbox');
  let checkedCount = 0;
  checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
          checkedCount++;
      }
  });
  if (checkedCount === 0) {
      const selectAllText = document.querySelector('#select-all-text');
      const allIconsDiv = document.querySelector('#all-icons-div');
      selectAllText.classList.remove('hidden');
      allIconsDiv.classList.add('hidden');
      allIconsDiv.classList.add('negative-zidx');
      selectAllCheckbox.checked = false;
  } else if (checkedCount === checkboxes.length) {
      selectAllCheckbox.checked = true;
  } else if (checkedCount < checkboxes.length) {
      selectAllCheckbox.checked = false;
  }
}

function showAllIcons() {
  const iconCircleDivs = document.querySelectorAll('.icon-circle-div');
  iconCircleDivs.forEach(iconCircleDiv => {
    iconCircleDiv.style.display = 'inherit';
  });
}

function showTrashOnly() {
  const iconCircleDivs = document.querySelectorAll('.icon-circle-div');
  iconCircleDivs.forEach(iconCircleDiv => {
    iconCircleDiv.style.display = 'none';
  });
}

function minimizeCompose() {
  const composeForm = document.querySelector('#compose-form');
  const minimizeIcon = document.querySelector('#minimize-compose-icon');
  const composeFloatingDiv = document.querySelector('#compose-floating-div');

  minimizeIcon.addEventListener('click', () => {
    if (composeFloatingDiv.classList.contains('floating-div-fullscreen')) {
      composeFloatingDiv.classList.remove('floating-div-fullscreen');
    }
    if (composeForm.style.display === 'none') {
      composeForm.style.display = 'flex';
    } else {
      composeForm.style.display = 'none';
    }

    document.querySelector('#faded-background').classList.add('display-none');
  });
}

function closeCompose() {
  document.querySelector('#close-compose-icon').addEventListener('click', () => {
    document.querySelector('#compose-view').style.display = 'none';
    const composeFloatingDiv = document.querySelector('#compose-floating-div');
    if (composeFloatingDiv.classList.contains('floating-div-fullscreen')) {
      composeFloatingDiv.classList.remove('floating-div-fullscreen');
    }
    composeFloatingDiv.style.display = 'none';

    document.querySelector('#faded-background').classList.add('display-none');
  });
}

function expandCompose() {
  document.querySelector('#expand-compose-icon').addEventListener('click', () => {
    const composeForm = document.querySelector('#compose-form');
    composeForm.style.display = 'flex';
    document.querySelector('#compose-view').style.display = 'block';
    const composeFloatingDiv = document.querySelector('#compose-floating-div');
    if (composeFloatingDiv.classList.contains('floating-div-fullscreen')) {
      composeFloatingDiv.classList.remove('floating-div-fullscreen');
    } else {
      composeFloatingDiv.classList.add('floating-div-fullscreen');
    }

    const fadedBackground = document.querySelector('#faded-background');
    if (fadedBackground.classList.contains('display-none')) {
      fadedBackground.classList.remove('display-none');
    } else {
      fadedBackground.classList.add('display-none');
    }
  });
}