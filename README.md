# OmoiOmoi Transcripts

A solution for storing and viewing transcripts from [Jitsi Meet](https://github.com/jitsi/jitsi-meet). Provides an 
interface for viewing and searching transcripts, as well as storage in a database (Postgres).

# Usage

This project is deployed to https://transcripts.omoiomi.org. You are welcome to sign up for an account there. At first, 
you will not see meetings. You will want to configure [jigasi](https://github.com/jitsi/jigasi) with the following 
entry:

```
org.jitsi.jigasi.transcription.SEND_JSON_REMOTE_URLS=https://transcripts.omoiomoi.org/api/meetingEvent
```

After configuration and following meetings, you will then see transcribed meetings in the OmoiOmoi UI.

# Development

## Tech Stack

* **Play Framework** and **Scala** for the REST API
* **React.js** and **Redux** for the UI


# Deployment

## Prerequisites

If you prefer to run your own instance of OmoiOmoi Transcripts, you will need the following:

1. A Postgres database.
2. An account with [Auth0](https://auth0.com). They offer a free tier with support for up to 7,000 users.
3. An application and an API configured in the Auth0 web console.
4. [SBT](https://www.scala-sbt.org/) installed.

## Building a Docker image

Perhaps the easiest way to deploy OmoiOmoi Transcripts is via a Docker container. To build a Docker image:

1. `git clone https://github.com/megafarad/omoiomoi.git`
2. Create a file named `.env` in the omoiomoi/ui directory, with the following entries:
```
REACT_APP_AUTH0_DOMAIN=<<your tenant domain>>
REACT_APP_AUTH0_CLIENT_ID=<<your Auth0 app client id>>
REACT_APP_AUTH0_AUDIENCE=<<your Auth0 API audience>>
REACT_APP_AUTH0_SCOPE=read:meetings
```
3. `cd omoiomoi/ui`
4. `yarn build`
5. `cd ..` 
6. `sbt docker:publishLocal`

Once SBT is finished, you will have an image in Docker that you can deploy.

## Application Secret

Before deploying to production, you will need to generate an application secret. In the project directory, type 
`sbt playGenerateSecret`. Keep the generated secret somewhere for configuration as an environment variable.

## Environment Variables

The following environment variables are expected for configuration:

| Environment Variable | Function                                                                                                                                   | Default Value                     |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| `DB_URL`             | The Postgres Database URL                                                                                                                  | jdbc:postgresql://localhost:5432/ |
| `DB_USER`            | The database user                                                                                                                          | postgres                          |
| `DB_PASSWORD`        | The database password                                                                                                                      | postgres                          |
| `AUTH0_DOMAIN`       | Domain for Auth0. Configured in the Auth0 web console.                                                                                     | -                                 |
| `AUTH0_AUDIENCE`     | The Auth0 API Audience. Also configured in the Auth0 console.                                                                              | -                                 |
| `APPLICATION_SECRET` | The Play Framework Application Secret. More info is available [here](https://www.playframework.com/documentation/2.8.x/ApplicationSecret). | changeme                          |
| `HOST_DOMAIN`        | The domain that will host OmoiOmoi Transcripts.                                                                                            | -                                 |

# License

Copyright (C) Chris Carrington.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see https://www.gnu.org/licenses/.
