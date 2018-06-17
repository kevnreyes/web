import { install as installServiceWorker } from 'offline-plugin/runtime';
import Uwave from './Uwave';
import youTubeSource from './sources/youtube';
import soundCloudSource from './sources/soundcloud';

function readApplicationConfig() {
  try {
    return JSON.parse(document.getElementById('u-wave-config').textContent);
  } catch (e) {
    return {};
  }
}

const uw = new Uwave(readApplicationConfig());

// Configure the Media sources to be used by this üWave client instance.
uw.source(youTubeSource());
uw.source(soundCloudSource());

window.uw = uw;

uw.build().then(() => {
  uw.renderToDOM(document.querySelector('#app'));
  document.querySelector('#app-loading').innerHTML = '';
  document.querySelector('#jss').textContent = '';

  installServiceWorker();
}).catch((err) => {
  document.querySelector('.LoadingScreen-notice').textContent = `Error: ${err.message}`;

  setTimeout(() => {
    throw err;
  }, 0);
});
