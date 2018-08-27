# Shorty: URL Shortener

## Local Setup

Make sure you have the following installed on your system:

- [docker](https://www.docker.com/get-started)
- [Node.js v10.9.0](https://nodejs.org/dist/v10.9.0/node-v10.9.0.pkg)

### Instructions

1. Start Docker
2. Clone this Repository
3. From the root folder of this repository, run the following commands:

- Install dependencies
  ```sh
  npm i
  ```
- Download MongoDB Docker Container and start service
  ```sh
  ./docker.sh
  ```
- Verify Setup
  ```sh
  npm t
  ```
  - Start the Application
  ```sh
  npm start
  ```

## Web UI

The Shorty service will start on PORT 3000 by default. You can access a **very
basic UI** by visiting http://localhost:3000.

The basic UI lets you create a short URL by entering a valid URL (HTML5
Validation leveraged).

For a valid URL, you'll be shown a results page which shows the following:

- the original URL
- the short URl
- the stats URL

Clicking on any of the URLs will open them in a new tab.

## REST APIs

You can access the following REST APIs:

- Shorten a URL

```
POST /api/v1/shorty
```

Takes the following JSON Payload in the body:

```
{
  url: 'url to shorten'
}
```

Response:

```
{
  shortUrl: 'shortened URL',
  statsUrl: 'stats URL'
}
```

- Shortened Redirect URL

```
GET /:code
```

Redirects to the original URL

- Stats URL

```
GET /api/v1/stats/:code?limit=#&skip=#
```

The query parameters `limit` and `skip` are optional. They control the number of
visitor records that are returned. The daily counts are returned for all visits
for the URL and not affected by `limit` and `skip`.

Response:

```
{
  "code":"kREVh-K0T",
  "url":"http://www.virk.cc",
  "visits":[
    {
      "_id":"5b834363d32a29900417da10",
      "ip":"127.0.0.1",
      "client":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      "date":"2018-08-27T00:18:43.042Z",
      "code":"kREVh-K0T"
    }
  ],
  "stats":[
    {
      "_id": {
        "month":8,
        "day":27,
        "year":2018
      },
      "count":1
    }
  ]
}
```

## Screenshots

![Home Page](/screenshots/1.png)

![Home Page - Filled Form](/screenshots/2.png)

![Results Page](/screenshots/3.png)

![Stats API](/screenshots/4.png)
