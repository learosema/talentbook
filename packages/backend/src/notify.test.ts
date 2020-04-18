import { mocked } from 'ts-jest/utils';
import { getRepository, Repository } from 'typeorm';
import { PushMessage } from './entities/push-message';
import { notify, MessageTemplates } from './notify';

/**
 * mock typeORM database stuff.
 */
jest.mock('typeorm', () => ({
  PrimaryColumn: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  Like: jest.fn(),
  getConnection: jest.fn(),
  getRepository: jest.fn(),
}));

beforeEach(() => {
  mocked(getRepository).mockClear();
});

describe('Notify test', () => {
  test('notify function', async () => {
    const fakeDb: PushMessage[] = [];
    const fakeRepo = {
      insert: jest
        .fn()
        .mockImplementation((entity: PushMessage) =>
          Promise.resolve(fakeDb.push(entity))
        ),
    } as Partial<Repository<PushMessage>>;
    mocked(getRepository).mockImplementation(
      () => fakeRepo as Repository<PushMessage>
    );
    const message = MessageTemplates.inviteAccepted('Max', 'JavaScript');
    await notify('Max', 'Lea', message);
    expect(fakeDb.length).toEqual(1);
    expect(fakeDb[0].message).toEqual(message);
  });
});
