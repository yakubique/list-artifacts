import { buildOutput } from '@yakubique/atils/dist';
import * as core from '@actions/core';
import type { Artifact, FindOptions } from '@actions/artifact';
import artifactClient from '@actions/artifact';
import { Minimatch } from 'minimatch';
import { ActionInputs, getInputs } from './io-helper';

enum Outputs {
    result = 'result',
}

const setOutputs = buildOutput(Outputs);

(async function run() {
    try {
        const inputs: ActionInputs = getInputs();

        const options: FindOptions = {};
        if (inputs.token) {
            const [repositoryOwner, repositoryName] = inputs.repository.split('/');
            if (!repositoryOwner || !repositoryName) {
                throw new Error(
                    `Invalid repository: '${inputs.repository}'. Must be in format owner/repo`
                );
            }

            options.findBy = {
                token: inputs.token,
                workflowRunId: inputs.runID,
                repositoryName,
                repositoryOwner
            };
        }

        let artifacts: Artifact[] = [];
        const listArtifactResponse = await artifactClient.listArtifacts({
            latest: true,
            ...options
        });
        artifacts = listArtifactResponse.artifacts;

        if (inputs.useGlob) {
            const matcher = new Minimatch(inputs.name);
            artifacts = artifacts.filter(artifact => matcher.match(artifact.name));
        }

        setOutputs({
            result: artifacts
        });

        core.info('Success!');
    } catch (err: any) {
        core.setFailed(err.message);
    }
})();
