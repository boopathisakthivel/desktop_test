const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });

function getInstallerConfig () {
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'release-builds');

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Electron-app-win32-ia32/'),
    authors: 'Boopathi Sakthivel',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'electron-desktop-app.exe',
    setupExe: 'electron-desktop-app-installer.exe',
    setupIcon: path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico')
  });
}