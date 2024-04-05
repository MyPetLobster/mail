# Yard Sale - CS50W - Project 3 Mail 
### By Cory Suzuki - April 2024

This project was developed to satisfy the requirements for CS50W Project 3 Mail. 

After completing the project requirements, I decided to add additional features to further challenge myself. With the previous project, Commerce, I spent a ton of time creating a custom look for my auction site. I used Sass for the styling in that project and much of the actual functionality was done with Python. For this project, in order to adhere to the project guidelines, I was only able to use JavaScript, HTML, and CSS. This was a great opportunity to learn to use JavaScript for purposes beyond basic interactivity in my projects. 

Even with these rules in mind, it wasn't until I was finished with my project that I realized I actually broke one of those rules by creating a custom_filters.py file. This was only used to parse a user's username from their email address in order to select the proper jpg file. I deleted the file and changed the names of the jpg files to match the usernames stored in the database. 

My biggest challenge was implementing state management with JavaScript. I spent some time reading about the History API and how to use it to manage state. Getting the back and forward buttons in my browser to work was simple using history.push/replaceState, but I got stuck for a bit trying to figure out how to make the refresh button work properly. In the end I decide to pass an empty string to the pushState and replaceState methods. Then in order to update the url in the address bar, I used hashed urls. I still need to learn more about this, I have a feeling there are better ways to handle this. But I didn't want to spend a ton of time on this one feature, so once I finally got it working, I moved on.


## Youtube Video Demonstration

**Submission Video (5 minutes)**

<a href=""><img src="" height="150px"></a>

**Director's Cut (12 minutes)**

<a href=""><img src="" height="150px"></a>



## Imgur Albums
**Site Screenshots**

<img src="" height="275px"></a>


## Project Specifications

### Send Mail


### Mailbox


### View Email


### Archive and Unarchive


### Reply


## Additional Features

1. **Batch Email Processing**

2. **Pagination**

3. **Clone Gmail Features and Styles**
    - Hover effects, icons, and colors are all inspired by Gmail.
    - Search bar and buttons are styled to match Gmail.
    - Additional proper hamburger icon. None of this three-line nonsense.
    - Clicking hamburger will collapse sidebar.
    - Clone Gmail's compose form, including expanding and minimizing form.

4. **Profile Pictures**
    - First implemented using template tags custom_filters.py file, but I read the instructions again and noticed I was ONLY 
    supposed to use JavaScript, HTML and CSS, so I just changed the name of the profile picture jpgs to match the usernames stored in the database.




## Usage

### Optional -- Included Test Database
- A test database is included with sample data for testing and demonstration purposes.


### Installation and startup
1. Install Django.
2. Clone the project repository.
3. Set up the database and run migrations. (Optional: use the included test database)
4. Run the Django development server.


```bash
```

## Things I Learned and Challenges
