## Introduction:

blog API, built for learning purposes.


## Main features:

- email/password authentication.
- quick login with google.
- forgot password, reset password.
- update personal information.
- create, search, comment blog.
- blog sorted by category, publisher.
- pagination to display maximum number of blogs.


## Main technologies:

- MongoDB Atlas: It provides a free cloud service to store MongoDB collections.
- Mongoose: An ODM (Object Data Modelling) library for MongoDB and Node.js.
- Node.js: A runtime environment to help build fast server applications using JS.
- Express.js: A popular Node.js framework to build scalable server-side for web applications.
- JSON Web Tokens or JWTs: A standard to securely authenticate HTTP requests.
- Oauth2: A framework to authorise third-party applications (e.g. Google).
- Docker: PaaS product to deliver containers.
- Docker-compose: CLI utility to run commands on multiple containers at once.


## Getting Started

#### Prerequisites

node & npm & docker & docker-compose installed.\
to use google login you need to setup the app on google cloud console, follow this ([tutorial](https://www.youtube.com/watch?v=idqhYcXxbPs)).

#### Clone & Setup environment variable

run the following commands: 

```
git clone git@github.com:medaampro/blog_app.git
cd blog_app && touch .env
```

add thoses lines to .env file:

```
PORT          = 8000
SERVER_URL    = "http://localhost:8000"
MONGO_URI     = "You can obtain it after creating a collection on mongodb atlas"

ACTIVE_TOKEN_SECRET  = "Choose it wisely"
ACCESS_TOKEN_SECRET  = "Choose it wisely"
REFRESH_TOKEN_SECRET = "Choose it wisely"

MAIL_CLIENT_ID       = "Copy it from google cloud console"
MAIL_CLIENT_SECRET   = "Copy it from google cloud console"
MAIL_REFRESH_TOKEN   = "Optional for this app, but you can generate one using get_tokens function inside ./helpers/google_api.js,
                        or using https://developers.google.com/oauthplayground/"
MAIL_ADDRESS         = "Google account"

SENDER_EMAIL       = "Google account from which you want to send emails"
SENDER_PASSWORD    = "App password generated from google account -> Security ->  2-Step Verification -> app passwords"
```


#### Start the app locally

run the following command: 

```
docker-compose up --build
```


#### Any more suggestions are always welcome in the PRs!
