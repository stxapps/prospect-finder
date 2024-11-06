import * as fs from 'fs';
import * as csv from '@fast-csv/parse';

import { getCurrentDateTimeString } from './utils';

const getItem = (rawItem) => {
  const username = rawItem.username;
  const verified = rawItem.verified === 'TRUE';
  const nFollowers = parseInt(rawItem.followers_count, 10);
  const nLikes = parseInt(rawItem.tweet_like_count, 10);
  const nRetweets = parseInt(rawItem.tweet_retweet_count, 10);
  const nReplies = parseInt(rawItem.tweet_reply_count, 10);
  const nQuotes = parseInt(rawItem.tweet_quote_count, 10);

  return { username, verified, nFollowers, nLikes, nRetweets, nReplies, nQuotes };
};

const doSelect = (item) => {
  //if (item.verified) return true;
  //if (item.nFollowers >= 100) return true;
  if (item.nLikes >= 11) return true;
  //if (item.nRetweets >= 10) return true;
  //if (item.nReplies >= 10) return true;
  //if (item.nQuotes >= 10) return true;

  return false;
};

const _main = (items) => {
  const usernames = [], links = [];

  for (const item of items) {
    if (!doSelect(item)) continue;

    const { username } = item;
    if (usernames.includes(username)) continue;

    usernames.push(username);
    links.push('https://x.com/' + username);
  }

  console.log(`Got ${usernames.length} usernames`);

  const dir = './out/twitter';
  const dt = getCurrentDateTimeString();

  fs.writeFileSync(`${dir}/${dt}-username.txt`, usernames.join('\n'));
  fs.writeFileSync(`${dir}/${dt}-links.txt`, links.join('\n'));
};

const main = () => {
  const inFPath = './in/kaggle/crypto-query-tweets.csv';

  const items = [];
  fs.createReadStream(inFPath)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', rawItem => {
      items.push(getItem(rawItem));
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`);
      _main(items);
    });
};
main();
