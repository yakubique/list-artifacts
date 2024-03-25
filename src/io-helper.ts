import * as core from '@actions/core';
import { getBooleanInput, getNumberInput } from '@yakubique/atils/dist';

export enum Inputs {
    Name = 'name',
    Token = 'token',
    UseGlob = 'useGlob',
    Repository = 'repository',
    RunID = 'run-id'
}

export interface ActionInputs {
    name: string;
    token: string;
    useGlob: boolean;
    repository: string;
    runID: number;
}

export function getInputs(): ActionInputs {
    const result: ActionInputs | any = {};

    result.name = core.getInput(Inputs.Name, { required: true });
    result.token = core.getInput(Inputs.Token, { required: true });

    result.useGlob = getBooleanInput(Inputs.UseGlob, { required: false });
    result.repository = core.getInput(Inputs.Repository, { required: false });
    result.runID = getNumberInput(Inputs.RunID, { required: false });

    return result;
}
