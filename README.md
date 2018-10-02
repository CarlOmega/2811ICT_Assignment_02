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
 * login:
  * describtion:
  * parameters:
  * returns:

## Angular Architecture
