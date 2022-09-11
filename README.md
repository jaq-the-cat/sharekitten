# sharekitten

Very simple and secure JS-less file sharing website 

## Routes
- `[GET] /, /upload`

Index, for uploading files

- `[GET] /upload/:id`

Downloads a file with specified ID

- `[GET] /uploads`

List of public files

- `[POST] /upload`

Uploads a file. Limit is 2GB every 2h per person

## Setup

- Clone the repo with `git clone https://github.com/jaq-the-cat/sharekitten`

- Edit the .env file with your desired configurations and set the path where the database and files will be stored

- Setup the SQLITE3 database with `yarn db-init`

## Usage

### Development/Debug mode

- Set `NODE_ENV` to `development` in the `.env` file

- Run the `yarn debug` command

### Production mode

- Set `NODE_ENV` to `production` in the `.env` file

- Configure and run the `yarn deploy` command to deploy the application

- Run the `yarn start` command to run the application

## Contributing

Contribute however you want lol
