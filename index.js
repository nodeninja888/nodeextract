const unzipper = require('unzipper');
const fs = require('fs');
function unzipArchive(zipPath, extractPath, password) {
    zipPath = __dirname + '/../passwordZip.zip';
    extractPath = "./extractedFiles";
    password = "PASSWORD";
    // Opening zip archive, gives us access to its root directory in the .then()-callback
    unzipper.Open.file(zipPath).then((centralDirectory) => {
        return new Promise((resolve, reject) => {
            console.log(1);
            console.log(centralDirectory.files.length)
            // Iterate through every file inside there (this includes directories and files in subdirectories)
            for (let i = 0; i < centralDirectory.files.length; i++) {
                const file = centralDirectory.files[i];

                filepath = "./newNode/" + file.path;
                console.log(filepath);
                // Now this is a very 'quick n dirty' way of checking if it is a subdirectory, but so far it hasn't failed me ;)
                if (file.path.endsWith("/")) {
                    filepath = filepath.slice(0, filepath.length - 1);
                    fs.mkdirSync(filepath);
                } else {
                    // This can get problematic when your archive contains alot of files, since the file.stream() works async and you have a limit of open writers.
                    // If you fall into that category, my first thought would be using tail-recursion and start the next write in the .on('finished', ...)
                    file.stream(password).pipe(fs.createWriteStream(filepath))
                        .on('finished', resolve)
                        .on('error', reject);
                }
            }
        });
    });
} 

unzipArchive();