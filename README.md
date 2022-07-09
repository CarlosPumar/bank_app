# BANK APP

- Create a route to create user:

  - User will provide there first name, last name, age and bank balance.
  - You will create user in database will this information and create a 10 digit
    random account number.

- Users should only be able to make transactions or add connections only after
  login.
- Users should be able to send and approve connection requests.
- Except the create user and login route, all other routes should use authentication,
  use can use bearer tokens which are at most valid for 15 mins.
- Users should have the ability to add connections using someone's bank account
  number.
- User should be able to see the name, age and bank account number of all their
  connections in a list.

- Users can remove a connection from their account.
- Users can send and receive money to accounts which are there connection. Each
  transaction should be in the database.
- Users should be able to see there past transactions.
- Make sure you handle all the edge cases and error scenarios for example:
  - What should happen when the user has zero balance and user tries to
    send money.
  - User tries to send money which is greater than their bank balance.
  - User tries to send money to someone who is no longer has them as their
    connection.

## How to run

### Development stage

```shell
docker-compose -f docker-compose.dev.yml up -d --build
```

localhost:3002

### Production stage

```shell
docker-compose -f docker-compose.prod.yml up -d --build
```

localhost:3003
