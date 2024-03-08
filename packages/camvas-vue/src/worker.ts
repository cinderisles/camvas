import { load } from 'camvas';

load().then((message) => {
  console.log('msg', message);
  postMessage(message);
});
