# volume-sync-gcp

Start by defining environment variables before or while calling docker-compose:
```
export GCP_BUCKET_NAME=""  # bucket name (without prefix gs://)
export GCP_SYNC_DIRECTORY=""  # directory to synchronize, will be bind-mounted to container
export GCP_PROJECT_ID="" 
export INCLUDE_FILE_PATTERN=""  # regex pattern of files to include. Missing or empty will imply all files. Currently not implemented.
export GCP_KEY_FILE_FULL_PATH="" # full file system path to the service account .json key file.

docker-compose up -d
```