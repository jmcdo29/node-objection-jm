const { exec } = require('child_process');

exec('echo RUNNING && coverage\\index.html', {cwd: './'}, (err, stdout, stderr) => {
  if(err) {
    return;
  }
});