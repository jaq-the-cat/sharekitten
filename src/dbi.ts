import files from './files';

async function dbi() {
  if (process.argv.length != 3) return;
  switch (process.argv[2]) {
    case 'reset':
      files.resetDb();
      break;
    case 'clear':
      files.clear();
      break;
  }
}

dbi();
