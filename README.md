# sharekitten

Very simple and somewhat secure JS-less file sharing website 

## Routes
- `[GET] /, /upload`

Index, for uploading files

- `[GET] /upload/:id`

Downloads a file with specified ID

- `[POST] /upload`

Uploads a file. Limit is 2GB every 2h per person
