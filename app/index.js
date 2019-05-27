const {Storage} = require('@google-cloud/storage');
const watch = require('node-watch');

const PROJECT_ID = process.env.PROJECT_ID;
const KEY_FILE = '/keyfile';
const BASE_DIR = process.env.BASE_DIR;
const BUCKET_NAME = process.env.BUCKET_NAME;
const INCLUDE_FILE_PATTERN = process.env.INCLUDE_FILE_PATTERN;

const storage = new Storage({
    projectId: PROJECT_ID,
    keyFilename: KEY_FILE
});

async function listBuckets() {
    await storage.getBuckets().then(( list ) => {
        const buckets = list[0];
        buckets.forEach(bucket => {
            console.log(bucket.name);
        });
    }).catch( ( err ) => {
        console.warn(err);
    } );
}

async function listBucketFiles( bucketName ) {
    const [files] = await storage.bucket(bucketName).getFiles();

    
    files.forEach(file => {
        console.log(file.name, file.metadata.updated);
    });
    
}

//listBuckets();
//listBucketFiles( bucketName );

watch(BASE_DIR, { recursive: true }, function(evt, name) {

    const bucket = storage.bucket( BUCKET_NAME );
    const filename = name.replace(BASE_DIR, '');
    console.log('Watch Event: ', evt, name);

    if (evt === 'update') {
        console.log('Beginning upload: ', filename);
        bucket.upload( name, { destination: filename } ).then( ( file ) => {
            console.log( filename, 'Uploaded as generation ', file[0].metadata.generation);
        }).catch( ( err ) => {
            console.warn( err );
        });
    }
    if (evt === 'remove') {
        const file = bucket.file( filename );
        file.exists().then( ( exists ) => {
            if ( exists[0] ) {
                file.delete().then( () => {
                    console.log('Deleted', filename, 'from', bucket.name);
                }).catch( ( err ) => {
                    console.warn( err );
                });
            }
        });
    }
    
});
