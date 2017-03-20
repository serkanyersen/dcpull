# dcpull
This is a little script that will run `docker-compose pull SERVICE` command and pull all of it's dependencies too.

## Usage
Install the script
```bash
npm -g install dcpull
# or
yarn global add dcpull
```

Go to a directory with `docker-compose.yml` file and run:

```bash
dcpull service-name # replace this with actual name
```

Script will show you all dependencies that will be pulled, you can say `yes` to continue and pull everything.
