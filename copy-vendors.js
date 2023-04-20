let fs = require('fs');

function copyToVendorfolder(filePath, fileName) {
  try {
    fs.copyFile(filePath+fileName, 'public/js/vendor/'+fileName, (err) => {
      if (err) throw err;
      console.log(' * '+fileName);
    });
  } catch(e){}
}

console.log('Updating vendor folder...');

copyToVendorfolder('node_modules/socket.io/client-dist/', 'socket.io.min.js');
copyToVendorfolder('node_modules/socket.io/client-dist/', 'socket.io.min.js.map');