import core from '@actions/core';
import { sendMessage } from 'utils/slack';
import { TARGET_SLACK_CHANNEL_ID } from 'utils/input';

async function main() {
  try {
    console.log('hi');
    sendMessage({
      channel: TARGET_SLACK_CHANNEL_ID,
      text: '테스트',
    });
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
