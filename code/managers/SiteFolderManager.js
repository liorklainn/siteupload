


var fs = require('fs');
var path = require('path');

// get the site root dir if the zip that extracted contained the site root dir and not the sub folder of the site
var getSiteRootFolder = function(siteFolder) {
    var files = fs.readdirSync(siteFolder);
    if (files.length == 1)
    {
        // file name / directory name
        var rootDirName = path.join(siteFolder ,files[0]);
        console.log(rootDirName);
        if (fs.statSync(rootDirName).isDirectory())
        {
            return rootDirName;
        }
    }

    return null;
};

module.exports = {
    organizeSiteFolder: function (extractPath) {
        console.log('organizeSiteFolder start ' + extractPath);
        var siteRootFolder = getSiteRootFolder(extractPath);

        if (siteRootFolder)
        {
            var files = [];
            files = fs.readdirSync(siteRootFolder);
            files.forEach(function(file, index) {

                var sourcePath =  path.join(siteRootFolder,file);
                var destPath =  path.join(extractPath,file);

                console.log('move file to root folder ' + extractPath);
                fs.rename(sourcePath,destPath);
            });
        }

        console.log('organizeSiteFolder end');
    }

}
