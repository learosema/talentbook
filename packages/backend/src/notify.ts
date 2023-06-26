import { PushMessage } from './entities/push-message';
import { AppDataSource } from './data-source';

export const MessageTemplates = {
  inviteAccepted: (from: string, group: string) =>
    `${from} accepted your invite to join ${group}.`,
};

export async function notify(
  from: string,
  target: string,
  message: string
): Promise<void> {
  console.log('NOTIFY ', from, '->', target, ':', message);
  try {
    const notifyRepo = AppDataSource.getRepository(PushMessage);
    const memo = new PushMessage();
    memo.message = message;
    memo.sender = from;
    memo.target = target;
    memo.timestamp = new Date().toISOString();
    memo.read = false;
    await notifyRepo.insert(memo);
  } catch (ex: any) {
    console.error(ex);
  }
}
