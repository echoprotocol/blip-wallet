import fs from "fs";
import download from "download";

/**
 * 
 * @param {String} url 
 * @param {String} os 
 */
const downloadBuild = async (url, os, filename) => {
   
    console.log(`[${os}] Downloading build... ${url}`);        

    const destination = `resources/${os}/bin`;

    if (fs.existsSync(url)) { // check local file
        fs.copyFileSync(url, `${destination}/${filename}`);
    } else {
        await download(url, destination, { filename });
    }
    

    fs.chmodSync(`${destination}/${filename}`, 0o777);

    console.log(`[${os}] Downloaded.`);

};

(async () => {

    try {

        const downloadUrl = process.env.DOWNLOAD_ECHO_NODE_URL;
        const downloadOS = process.env.DOWNLOAD_ECHO_NODE_OS;


        if (!downloadUrl) {
            throw new Error('You need to set process.env.DOWNLOAD_ECHO_NODE_URL');
            process.exit(1);
        }

        if (!downloadOS) {
            throw new Error('You need to set process.env.DOWNLOAD_ECHO_NODE_OS');            
        }

        await downloadBuild(downloadUrl, downloadOS, 'echo_node');
        

    } catch (e) {
        console.log(e);
        process.exit(1);
    }
    
    
})();
