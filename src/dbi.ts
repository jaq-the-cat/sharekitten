import files from './files';

async function dbi() {
  if (process.argv.length != 3) return;
  switch (process.argv[2]) {
    case 'init':
      files.init();
      break;
    case 'clear':
      files.clear();
      break;
  }
}

dbi();
