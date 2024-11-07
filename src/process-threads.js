import * as fs from 'fs';
import * as path from 'path';

import { isObject, getCurrentDateTimeString } from './utils';

const storeUsername = (usernames, username) => {
  const lun = username.toLowerCase();
  if (usernames.includes(lun)) return;
  usernames.push(lun);
};

const getOutUsernames = () => {
  const outDir = './out/threads';
  const fnames = fs.readdirSync(outDir);

  const outUsernames = [];
  for (const fname of fnames) {
    const fpath = path.join(outDir, fname);
    if (!fpath.endsWith('-username.txt')) continue;

    const data = fs.readFileSync(fpath, 'utf8');
    const lines = data.split('\n');
    outUsernames.push(...lines);
  }

  return outUsernames;
};

const main = () => {
  const inFPath = './in/threads/graphql.txt';

  const data = fs.readFileSync(inFPath, 'utf8');
  const lines = data.split('\n');

  const texts = [], objs = []; let text = '';
  for (const line of lines) {
    text += line;

    if (line === '}') {
      texts.push(text);
      text = '';
    }
  }
  for (text of texts) {
    const obj = JSON.parse(text);
    objs.push(obj);
  }

  const inUsernames = [];
  for (const obj of objs) {
    if (isObject(obj.data.feedData)) {
      for (const edge of obj.data.feedData.edges) {
        if (isObject(edge.node.text_post_app_thread)) {
          for (const item of edge.node.text_post_app_thread.thread_items) {
            const username = item.post.user.username;
            storeUsername(inUsernames, username);
          }
        }
        if (isObject(edge.node.suggested_users)) {
          for (const sgt of edge.node.suggested_users.suggestions) {
            const username = sgt.user.username;
            storeUsername(inUsernames, username);
          }
        }
      }
      continue;
    }
    if (isObject(obj.data.recommendedUsers)) {
      for (const edge of obj.data.recommendedUsers.edges) {
        const username = edge.node.username;
        storeUsername(inUsernames, username);
      }
      continue;
    }
    if (isObject(obj.data.searchResults)) {
      for (const edge of obj.data.searchResults.edges) {
        for (const item of edge.node.thread.thread_items) {
          const username = item.post.user.username;
          storeUsername(inUsernames, username);
        }
      }
      continue;
    }

    console.log('Invalid obj:', obj);
  }

  console.log(`Got ${inUsernames.length} usernames`);

  const outUsernames = getOutUsernames();

  const usernames = [], links = []
  for (const username of inUsernames) {
    if (outUsernames.includes(username)) continue;

    usernames.push(username);
    links.push(`https://www.threads.net/@${username}`);
  }

  console.log(`Got ${usernames.length} new usernames`);

  const dir = './out/threads';
  const dt = getCurrentDateTimeString();

  fs.writeFileSync(`${dir}/${dt}-username.txt`, usernames.join('\n'));
  fs.writeFileSync(`${dir}/${dt}-links.txt`, links.join('\n'));
};
main();
