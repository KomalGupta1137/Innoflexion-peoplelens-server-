# bff-server

## 1. Just the BFF Server
```bash
sudo apt-get install redis-server
sudo service redis-server status
```

```bash
npm install && npm run build && NODE_ENV=development npm run watch:build
```

To run in docker

```
docker build . -f .\development.dockerfile -t bff-server
```

then

```
docker run --name bff-server -d -p 4000:4000 bff-server
```

## 2. The whole shebang

1.

You
will
need
4
different
terminal
windows

If
your
structure
is
like
this:

```bash
SJCMACD3EJHTD8:pl itadmin$ ls -1
pl-bff
pl-data-generator
pl-privacy-mock-api-server
```

2.

In
terminal
1

```
cd pl-data-generator
docker-compose -f postgres.yml up
```

3.

In
terminal
2

```
cd pl-data-generator
npm install && npm run build && NODE_ENV=development npm run start
```

4.

In
terminal
3

```
cd pl-privacy-mock-api-server
npm install && npm run build && NODE_ENV=development npm run start
```

5.

In
terminal
4

```
cd pl-bff/bff-server
npm install && npm run build && NODE_ENV=development npm run watch:build
```

6.

Generate
a
token

```bash
curl 'localhost:4000/api/unauth/testToken?email=pigud@humro.navy'
```

7.

Go
to
graphql
bin
https://graphqlbin.com
Use
the
URL http://localhost:4000/api/gql?i
in
the
first
screen
Then
in
the
headers
add
the
following:

```json
{
  "Authorization": "Bearer <token from step 6>"
}
```

8.

Now
try
a
GraphQL
Query
example

```graphql
{
  getDashboardData(
    dashboardInput: { endDate: "2022-01-01", startDate: "2020-01-01" }
  ) {
    peopleDrivers {
      myTeam {
        user {
          userId
          firstName
          lastName
        }
        childCount
        reportees {
          user {
            userId
            firstName
            lastName
          }
          childCount
        }
      }
    }
  }
}
```
