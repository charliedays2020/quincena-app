// Ajusta el proyecto Android generado por Capacitor: firma, versión y permisos.
const fs = require('fs');
const run = process.env.GITHUB_RUN_NUMBER || '1';
const g = 'android/app/build.gradle';
let s = fs.readFileSync(g, 'utf8');
s = s.replace(/versionCode \d+/, 'versionCode ' + run).replace(/versionName "[^"]*"/, 'versionName "1.0.' + run + '"');
if (!s.includes('signingConfigs')) {
  s = s.replace(/buildTypes \{/, `signingConfigs {
        release {
            storeFile file('../../keystore/quincena.jks')
            storePassword 'quincena2026'
            keyAlias 'quincena'
            keyPassword 'quincena2026'
        }
    }
    buildTypes {`);
  s = s.replace(/release \{\s*\n(\s*)minifyEnabled/, (m, sp) => 'release {\n' + sp + 'signingConfig signingConfigs.release\n' + sp + 'minifyEnabled');
}
fs.writeFileSync(g, s);
const m = 'android/app/src/main/AndroidManifest.xml';
let x = fs.readFileSync(m, 'utf8');
const perms = ['POST_NOTIFICATIONS', 'SCHEDULE_EXACT_ALARM', 'RECEIVE_BOOT_COMPLETED', 'WAKE_LOCK'];
for (const p of perms) {
  const line = `<uses-permission android:name="android.permission.${p}" />`;
  if (!x.includes(`android.permission.${p}"`)) x = x.replace('</manifest>', '    ' + line + '\n</manifest>');
}
fs.writeFileSync(m, x);
console.log(fs.readFileSync(g, 'utf8').match(/signingConfig[\s\S]{0,80}/g));
