import { mocked } from 'jest-mock';
import { Repository } from 'typeorm';
import { PushMessage } from './entities/push-message';
import { notify, MessageTemplates } from './notify';
import { AppDataSource } from './data-source';

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

/**
 * mock Data Source
 */
jest.mock('./data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  }
}));

beforeEach(() => {
  mocked(AppDataSource.getRepository).mockClear();
});

describe('Notify test', () => {
  test('notify function', async () => {
    const fakeDb: PushMessage[] = [];
    mocked(AppDataSource.getRepository<PushMessage>).mockImplementation(
      () => ({
        insert: jest
          .fn()
          .mockImplementation((entity: PushMessage) =>
            Promise.resolve(fakeDb.push(entity))
          ),
      }) as unknown as Repository<PushMessage>
    );
    const message = MessageTemplates.inviteAccepted('Max', 'JavaScript');
    await notify('Max', 'Lea', message);
    expect(fakeDb.length).toEqual(1);
    expect(fakeDb[0].message).toEqual(message);
  });
});
