/* eslint-disable import/first */
const sendMock = jest.fn();
const SqsClientMock = jest.fn().mockImplementation(() => ({
  sendMessage: sendMock,
  getQueueUrl: () => ({
    promise: jest.fn().mockResolvedValue({ QueueUrl: 'testURL' }),
  }),
  customizeRequests: jest.fn(),
}));

import { SQService } from '../../src/services/SQService';

describe('SQService', () => {
  beforeAll(() => {
    jest.restoreAllMocks();
  });
  describe('sendMessage', () => {
    const liveMock = new SqsClientMock();
    const svc = new SQService(liveMock);
    const expectedSendArgs = { MessageBody: 'my thing', QueueUrl: 'testURL' };
    describe('with good inputs', () => {
      it("doesn't throw an error", async () => {
        sendMock.mockReset();
        sendMock.mockReturnValue({
          promise: jest.fn().mockResolvedValue('It worked'),
        });
        expect.assertions(3);
        const output = await svc.sendMessage('my thing', 'aQueue');
        expect(output).toEqual('It worked');
        expect(sendMock).toHaveBeenCalledWith(expectedSendArgs);
        expect(sendMock).toHaveBeenCalledTimes(1);
      });
      describe('and specify attributes', () => {
        it('adds the attributes to the call params', async () => {
          sendMock.mockReset();
          sendMock.mockReturnValue({
            promise: jest.fn().mockResolvedValue('It worked'),
          });
          expect.assertions(3);
          const attrMap = { a: { DataType: 'b' } };
          const output = await svc.sendMessage('my thing', 'aQueue', attrMap);
          expect(output).toEqual('It worked');
          expect(sendMock).toHaveBeenCalledWith({
            ...expectedSendArgs,
            MessageAttributes: attrMap,
          });
          expect(sendMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
