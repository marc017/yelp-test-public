# YELP Test

## _Backend Test_

API to get reviews for specific restaurants from YELP.
Also retrieves emotions using Google Vision API.

## Features

- Pass search parameters to get specific restaurant

## APIs Used

Dillinger uses a number of open source projects to work properly:

- YELP API
- Google Vision API

## Set up Instructions

Install the dependencies and devDependencies and start the server.

```sh
cd yelp-test
npm i
```

### Google API Setup MacOS

Export google credentials.

```sh
nano ~/.bash_profile
export GOOGLE_APPLICATION_CREDENTIALS=<path to google.json>
// finally exit and save nano
```

### Google API Setup Windows

```sh
set GOOGLE_APPLICATION_CREDENTIALS=<path to google.json>
```

### Start server

```sh
npm start
```

