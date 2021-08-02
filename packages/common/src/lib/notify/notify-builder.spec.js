const mockDebug = jest.fn();
const mockInfo = jest.fn();
const mockError = jest.fn();

jest.doMock('../logger', () => ({
  debug: mockDebug,
  info: mockInfo,
  error: mockError,
}));

const mockNotifySendEmailFn = jest.fn();
const mockPrepareUploadFn = jest.fn();

const mockCreateNotifyClient = jest.fn(() => ({
  prepareUpload: mockPrepareUploadFn,
  sendEmail: mockNotifySendEmailFn,
}));

jest.doMock('./notify-factory', () => ({
  createNotifyClient: () => mockCreateNotifyClient,
}));

const NotifyBuilder = require('./notify-builder');

describe('lib/notify/notify-builder', () => {
  describe('NotifyBuilder', () => {
    let templateId;
    let destinationEmail;
    let reference;
    let templatePersonalisation;
    let emailReplyToId;

    beforeEach(() => {
      templateId = '123-abc';
      destinationEmail = 'a@b.com';
      reference = 'xyz/123/abc';
      templatePersonalisation = { x: 'y', a: 'b' };
      emailReplyToId = '000';

      NotifyBuilder.reset();
    });

    describe('getNotifyClient', () => {
      test('sets the client implicitly if not explicitly provided', async () => {
        await NotifyBuilder.setTemplateId(templateId)
          .setReference('abc/123')
          .setDestinationEmailAddress(destinationEmail)
          .sendEmail();

        expect(mockInfo.mock.calls).toEqual([
          ['Resetting the notify client'],
          [`Sending email via notify`],
          ['Notify client was not set. Creating...'],
        ]);

        expect(mockDebug.mock.calls).toEqual([
          [{ templateId: '123-abc' }, 'Setting template ID'],
          [{ reference: 'abc/123' }, 'Setting reference'],
          [{ destinationEmail: 'a@b.com' }, 'Setting destination email address'],
          [{ notifyClient: expect.any(Function) }, 'Setting notify client'],
          [
            {
              notifyClient: expect.any(Function),
              templateId: '123-abc',
              destinationEmail: 'a@b.com',
              templatePersonalisation: 'Has 0 value(s) set.',
              emailReplyToId: '',
            },
          ],
        ]);
      });
    });

    test('can build and send an email', async () => {
      const client = mockCreateNotifyClient();

      await NotifyBuilder.setNotifyClient(client)
        .setTemplateId(templateId)
        .setReference('abc/123')
        .setDestinationEmailAddress(destinationEmail)
        .setTemplateVariablesFromObject(templatePersonalisation)
        .sendEmail();

      expect(mockInfo.mock.calls).toEqual([
        ['Resetting the notify client'],
        [`Sending email via notify`],
      ]);

      expect(mockDebug.mock.calls).toEqual([
        [{ notifyClient: client }, 'Setting notify client'],
        [{ templateId: '123-abc' }, 'Setting template ID'],
        [{ reference: 'abc/123' }, 'Setting reference'],
        [{ destinationEmail: 'a@b.com' }, 'Setting destination email address'],
        ['Setting template variables from object.'],
        [{ key: 'x', value: 'redacted' }, 'Setting template personalisation variable.'],
        [{ key: 'a', value: 'redacted' }, 'Setting template personalisation variable.'],
        [
          {
            notifyClient: client,
            templateId: '123-abc',
            destinationEmail: 'a@b.com',
            templatePersonalisation: 'Has 2 value(s) set.',
            emailReplyToId: '',
          },
        ],
      ]);

      expect(mockNotifySendEmailFn).toHaveBeenCalledWith(templateId, destinationEmail, {
        personalisation: templatePersonalisation,
        reference: 'abc/123',
      });
    });

    describe('sendEmail', () => {
      describe('guards', () => {
        test('throws if template id is not set', async () => {
          try {
            await NotifyBuilder.sendEmail();
          } catch (e) {
            expect(e).toEqual(new Error('Template ID must be set before an email can be sent.'));
          }
        });

        test('throws if destination email address is not set', async () => {
          try {
            await NotifyBuilder.setTemplateId('123').sendEmail();
          } catch (e) {
            expect(e).toEqual(
              new Error('A destination email address must be set before an email can be sent.')
            );
          }
        });

        test('throws if reference is not set', async () => {
          try {
            await NotifyBuilder.setTemplateId('123')
              .setDestinationEmailAddress('abc@example.com')
              .sendEmail();
          } catch (e) {
            expect(e).toEqual(new Error('A reference must be set before an email can be sent.'));
          }
        });
      });
    });

    describe('addFileToTemplateVariables', () => {
      test('prepares the upload', () => {
        const fileValue = 'File object, or Buffer value goes here.';
        NotifyBuilder.setNotifyClient(mockCreateNotifyClient()).addFileToTemplateVariables(
          'file key',
          fileValue
        );
        expect(mockPrepareUploadFn).toHaveBeenCalledWith(fileValue);
      });
    });

    describe('setTemplateVariable', () => {
      test('with redact', () => {
        NotifyBuilder.setTemplateVariable('a key', 'a value');

        expect(mockDebug.mock.calls).toEqual([
          [
            {
              key: 'a key',
              value: 'redacted',
            },
            'Setting template personalisation variable.',
          ],
        ]);
      });

      test('without redact', () => {
        NotifyBuilder.setTemplateVariable('a key', 'a value', false);

        expect(mockDebug.mock.calls).toEqual([
          [
            {
              key: 'a key',
              value: 'a value',
            },
            'Setting template personalisation variable.',
          ],
        ]);
      });
    });

    describe('err', () => {
      [
        {
          description: 'err.response',
          setUp: () => {
            mockNotifySendEmailFn.mockRejectedValue({
              response: {
                data: 'some bad response',
                status: 500,
                headers: {
                  a: 'b',
                },
              },
              message: 'everything went badly',
            });
          },
          expectation: () => {
            expect(mockError).toHaveBeenCalledWith(
              {
                message: 'everything went badly',
                data: 'some bad response',
                status: 500,
                headers: {
                  a: 'b',
                },
              },
              `Problem sending email - response`
            );
          },
        },
        {
          description: 'err.request',
          setUp: () => {
            mockNotifySendEmailFn.mockRejectedValue({
              request: {
                a: 'b',
              },
              message: 'something bad in request',
            });
          },
          expectation: () => {
            expect(mockError).toHaveBeenCalledWith(
              {
                message: 'something bad in request',
                request: {
                  a: 'b',
                },
              },
              `Problem sending email - request`
            );
          },
        },
        {
          description: 'else',
          setUp: () => {
            mockNotifySendEmailFn.mockRejectedValue({
              message: 'something else',
            });
          },
          expectation: () => {
            expect(mockError).toHaveBeenCalledWith(
              {
                err: {
                  message: 'something else',
                },
              },
              `Problem sending email`
            );
          },
        },
      ].forEach(({ description, setUp, expectation }) => {
        test(description, async () => {
          setUp();

          await NotifyBuilder.setNotifyClient(mockCreateNotifyClient())
            .setTemplateId(templateId)
            .setReference(reference)
            .setDestinationEmailAddress(destinationEmail)
            .setTemplateVariablesFromObject(templatePersonalisation)
            .setEmailReplyToId(emailReplyToId)
            .sendEmail();

          expect(mockNotifySendEmailFn).toHaveBeenCalledWith(templateId, destinationEmail, {
            personalisation: templatePersonalisation,
            reference,
            emailReplyToId,
          });

          expectation();
        });
      });
    });
  });
});
