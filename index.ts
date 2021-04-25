import { sendMessage } from 'utils/slack';
import { TARGET_SLACK_CHANNEL_ID } from 'utils/input';

async function main() {
  console.log('hi');
  sendMessage({
    channel: TARGET_SLACK_CHANNEL_ID,
    text: '테스트',
  });
}

main();
