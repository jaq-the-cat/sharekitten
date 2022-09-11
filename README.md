# sharekitten

Very simple and secure JS-less file sharing website 

## Routes
- `[GET] /, /upload`

Index, for uploading files

- `[GET] /upload/:id`

Downloads a file with specified ID

- `[GET] /uploads`

List of public files. By default, each page consists of 30 files.

- `[POST] /upload`

Uploads a file. Limit is 2GB every 6h per person

## Setup

- Clone the repo with `git clone https://github.com/jaq-the-cat/sharekitten`

- Edit the `src/config.ts` and `.env` files with your desired configurations

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
