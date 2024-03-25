import * as core from '@actions/core';
import { describe, expect } from '@jest/globals';
import { ActionInputs, getInputs, Inputs } from '../src/io-helper';

let getInputMock: jest.SpiedFunction<typeof core.getInput>;

describe('io-helper.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getInputMock = jest.spyOn(core, 'getInput').mockImplementation();
    });

    it('should get proper input', () => {
        getInputMock.mockImplementation((name, _) => {
            switch (name) {
                case Inputs.Name:
                    return 'artifact-name';
                case Inputs.Token:
                    return 'github.token';
                case Inputs.UseGlob:
                    return 'false';
                case Inputs.Repository:
                    return 'yakubique/list-artifacts';
                case Inputs.RunID:
                    return '1234';
                default:
                    return '';
            }
        });

        const inputs = getInputs();
        expect(inputs).toEqual({
            name: 'artifact-name',
            token: 'github.token',
            useGlob: false,
            repository: 'yakubique/list-artifacts',
            runID: 1234
        } as ActionInputs);
    });
});

