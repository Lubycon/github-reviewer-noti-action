# Lubycon Github Reviewer Slack Notify Action

## Usage

다음과 같은 깃헙 액션을 `.github/workflows` 디렉토리에 생성해주세요.

```yaml
name: Sample Action
on: [pull_request]

jobs:
  create-pr:
    runs-on: ubuntu-latest
    name: Slack Notification
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Fire Notification
        uses: Lubycon/github-reviewer-slack-noti-action
        with:
          base-branch: main
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          github-token: ${{ secrets.LUBYCON_GITHUB_TOKEN }}
          channel-id: 'my-slack-channel-id'
          my-slack-user-id: 'my-slack-user-id'
```

## Configuration

| 이름 | 설명 |
|-----|-----|
| `slack-bot-token` | 메세지를 보낼 슬랙봇 토큰. 루비콘 멤버라면 루비콘의 Org Secrets에 저장된 토큰을 사용할 수 있습니다 |
| `github-token` |  Github Personal Access Token. `repo` 스코프를 지정해서 생성해주세요 |
| `channel-id` | 슬랙 채널 ID |
| `my-slack-user-id` | 슬랙 유저 ID |
