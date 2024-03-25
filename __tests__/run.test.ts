import * as core from '@actions/core';
import * as helper from '../src/io-helper';
import { run } from '../src/run';
import artifactClient from '@actions/artifact';

import { describe, expect } from '@jest/globals';


let getInputsMock: jest.SpiedFunction<typeof helper.getInputs>;
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
let listArtifactsMock: jest.SpiedFunction<typeof artifactClient.listArtifacts>;

describe('run.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getInputsMock = jest.spyOn(helper, 'getInputs').mockImplementation();
        setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation();
        setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation();
        listArtifactsMock = jest.spyOn(artifactClient, 'listArtifacts').mockImplementation();
    });

    it('should work', async () => {
        const token = 'mytoken';
        const [owner, repository] = 'yakubique/list-artifacts'.split('/');
        const runID = 1234;

        const rightArtifacts = [
            {
                name: 'artifact-1',
                id: 0,
                size: 0
            },
            {
                name: 'artifact-3',
                id: 1,
                size: 0
            }
        ];

        getInputsMock.mockImplementation(() => {
            return {
                token,
                repository: `${owner}/${repository}`,
                runID,
                useGlob: true,
                name: 'artifact-*'
            } as helper.ActionInputs;
        });

        listArtifactsMock.mockImplementation(() => new Promise(resolve => {
            resolve({
                artifacts: [
                    ...rightArtifacts,
                    {
                        name: 'not-artifact',
                        id: 2,
                        size: 0
                    }
                ]
            });
        }));

        await run();
        expect(getInputsMock).toBeCalled();
        expect(listArtifactsMock).toBeCalledWith({
            latest: true,
            findBy: {
                token,
                workflowRunId: runID,
                repositoryName: repository,
                repositoryOwner: owner
            }
        });
        expect(setOutputMock).toHaveBeenNthCalledWith(1, 'result', rightArtifacts);
    });

    it('should error', async () => {
        getInputsMock.mockImplementation(() => {
            return {
                token: 'not - json',
                repository: 'ownerless'
            } as helper.ActionInputs;
        });

        await run();
        expect(getInputsMock).toBeCalled();
        expect(setOutputMock).not.toBeCalled();
        expect(setFailedMock).toBeCalledWith('Invalid repository: \'ownerless\'. Must be in format owner/repo');
    });
});

