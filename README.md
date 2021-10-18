# Fingerprint Election Voting System
Fingerprint based detection election. Manually you need to add fingerprint for dectection.

## How to run the project
### 1. Install nodejs 
https://www.geeksforgeeks.org/installation-of-node-js-on-windows/
(this link is for windows users.)
### 2. Start the Xammp  server
in mysql database 
* Create Database name "election"
* Create Table Voter
``` mysql
  CREATE TABLE `voter` (
  `voter_id` varchar(10) NOT NULL,
  `name` text NOT NULL,
  `surname` text NOT NULL,
  `middle_name` text NOT NULL,
  `gender` text NOT NULL,
  `birthdate` date NOT NULL,
  `address` varchar(100) NOT NULL,
  `contact_no` bigint(11) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `fingerprint` mediumblob DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `signed_up` tinyint(1) DEFAULT NULL,
  `voted_party` text DEFAULT NULL,
  `date&time` timestamp NOT NULL DEFAULT current_timestamp()
  )
``` 
* Create Table  'parties'
``` mysql
  CREATE TABLE `parties` (
  `party` varchar(40) NOT NULL,
  `vote_count` int(11) DEFAULT NULL
) 
```
* Create voter in voter table manually add voter_id, name,surname,middle_name,gender,birthdate,address ,fingerprint manually. And leave reamaining field null.
<br/>
* Create parties with name A,B,C,D,E,F,G,H
### 3. Run project 
* Go to FingerprintElectionVotingSystem directory
```
npm start
```
* install all the dependency with npm install ___
  ```JavaScript
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.5",
    "dotenv": "^10.0.0",
    "edge-py": "^0.1.0",
    "express": "^4.17.1",
    "hbs": "^4.1.2",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.3",
    "mysql": "^2.18.1",
    "node-localstorage": "^2.2.1",
    "nodemon": "^2.0.12"
   ```
* Type **localhost:5000** to start the project<br/>

 Home page<br/>

 ![image](https://user-images.githubusercontent.com/63836638/137672609-6906bb06-0c1d-4a64-845a-20845c7d9ec3.png)<br/>
 ***
 * Go to sign in page</br>
 
![image](https://user-images.githubusercontent.com/63836638/137691003-2048f326-61ac-414e-bc08-46d7b6fd42a0.png)<br/>
 ***
 * Write all the values exactly as written in the database<br/>
 
 * If sign in successfull then this message will be displayed<br/>
 
 ![image](https://user-images.githubusercontent.com/63836638/137672965-1a4f9f7e-e498-4178-93a6-1d9957feaf23.png)<br/>
 ***
* Then go to login page<br/>

![image](https://user-images.githubusercontent.com/63836638/137673055-413b26c9-a147-460b-8d99-cfafdc20fbc0.png)<br/>
***
* After sucessfull login page redirect to fingerprint detection page<br/>
![image](https://user-images.githubusercontent.com/63836638/137674143-8edb4bf3-535a-4a02-b0fe-e6641b13b20e.png)<br/>
***
* Enter your fingerprint manually</br>

* If same fingerprint is uploaded then page will be redirected to the voter page else error message will be dispayed<br/>
![image](https://user-images.githubusercontent.com/63836638/137673390-ba76be32-16ee-46e0-a0ee-590aa97eaf3a.png)<br/>
***
* Click on party which you want to vote <br/>

* And click on proceed<br/>
* Page will be redirect to home page
