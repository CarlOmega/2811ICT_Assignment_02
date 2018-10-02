# Summary
This is a solution for Assignment 1 in 2811ICT *  Web Programming.


# Installation
## Node Server
Change directory to **server** and run **npm install**. Run server by running **node server.js** and the Node server will start listening on port 3000. Node server is set up to accept CORS from **localhost:4200**.

# Installation
Change directory to **chat* app** an run **npm install**. You can run the Angular server by **ng serve**. As CORS is set up on the Node server, this will still allow you send data between the Angular chat app and the node server. **ng build** will create the distributable, compiled version of the Angular app. The Node server will already be preconfigured to run **dist/index.html**.

# Documentation
## Git Layout
I used a simple milestone workflow with this project. Using test driven development style to make sure each part worked before moving onto the next part. I started with login page then displaying the groups, then once that was working well I moved onto modifying the data. I did piece by piece until all requirements were met.

The git layout was simple and just used two folders:
  * server : to store the server and all assests for the node.js file
    * test : contains mocha tests for node.js
    * images : stores the images uploaded to the server
  * chat-app : the folder to store the angular project

## Data Structures
The database consists of two collections:
  * users : this stores the users data including:
    * username
    * password
    * email
    * permissions : this is to tell if they are a super admin
  * groups : to store all the groups on the chat app
    * name
    * members[] : store the members of the group
    * admins[] : store all the group admins
    * channels[]
      * name
      * members
      * history[] : to store all the messages
        * message
        * author
        * photo : photo if there is one
        * profile : profile of author

## REST API
Routes: all under api/
* POST login:
    * describtion: This API route is to test if a user can log in. it also returns the groups for the user.
    * parameters: username, password
    * returns: groups that user is in else false if failed

* POST upload:
    * describtion: using formitable allows uploading images to the server
    * parameters: formitiable form with image
    * returns: url of where the image is stored
    
* POST user/changeimage:
    * describtion: updates the databse to store the url of the profile image
    * parameters: username, url
    * returns: url

* GET getusers:
    * describtion: gets the info of all the users for super admins
    * parameters: null
    * returns: all the users inside of the user collection
    
* GET groups:
    * describtion: gets all the groups on the server under a username
    * parameters: username
    * returns: groups that the user is in

* DELETE group/delete:
    * describtion: deletes a group from the collection
    * parameters: groupName
    * returns: true if success false otherwise

* DELETE channel/delete:
    * describtion: deletes a channel from inside the given group
    * parameters: groupName, channelName
    * returns: true if success false otherwise

* POST group/create:
    * describtion: creates a new group in the groups collection and adds user to it
    * parameters: newGroupName, username
    * returns: the new group created else false if group exsists
  
* POST channel/create:
    * describtion: creates a new channel inside the given group and adds the creator to it
    * parameters: groupName, username, newChannelName
    * returns: the created channel else false if channel exsists

* POST user/create:
    * describtion: creates a new user with normal permissions
    * parameters: username, email, password
    * returns: the new user created else false if user is taken

* POST user/change:
    * describtion: updates what group or channel the user is in or their admin status
    * parameters: type (type of action), username, groupName, channelName
    * returns: true is succes else false

* POST user/promote:
    * describtion: updates a user to be super admin or normal user 
    * parameters: id, type (0 for normal 2 for super)
    * returns: true if success else false 

* DELETE user/delete:
    * describtion: deletes a user from the collection users
    * parameters: id
    * returns: true if success else false

## Angular Architecture
