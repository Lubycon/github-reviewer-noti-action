/**
 * https://docs.mattermost.com/developer/interactive-messages.html
 */
interface MattermostMessageAttachmentAction {
  id: string;
  name: string;
  integration: {
    url: string;
    context?: {
      action: string;
    };
  };
}

interface MattermostMessageAttachmentFields {
  title: string;
  value: string;
  short?: boolean;
}

/**
 * https://docs.mattermost.com/developer/message-attachments.html
 */
export interface MattermostMessageAttachment {
  pretext?: string;
  text?: string;
  actions?: MattermostMessageAttachmentAction[];
  color?: string;
  fallback: string;
  author_name?: string;
  author_link?: string;
  author_icon?: string;
  title?: string;
  title_link?: string;
  fields?: MattermostMessageAttachmentFields[];
  image_url?: string;
  thumb_url?: string;
}

/**
 * https://developers.mattermost.com/integrate/incoming-webhooks/
 */
export interface MattermostMessageParams {
  text?: string;
  channel?: string;
  username?: string;
  icon_url?: string;
  icon_emoji?: string;
  attachments?: MattermostMessageAttachment[];
  type?: string;
}
