import { CodeBuild } from "aws-sdk";
import { find } from "lodash";
//
import delay from "utils/helpers/delay";

export enum CodeBuildProjectType {
    SHOP_STOREADMIN = "shop-storeadmin",
    SHOP_STOREFRONT = "shop-storefront"
}

class CodeBuildService {
    private static createServiceInterfaceObject() {
        return new CodeBuild({ region: "eu-west-3" });
    }

    private static createApiURL(tenantName: string) {
        return `http://api.${tenantName}.shop.akosfi.com`;
    }

    private static prepareEnvironmentVariablesOverride(
        tenantId: number,
        tenantName: string,
        codeBuildProjectType: CodeBuildProjectType
    ): CodeBuild.EnvironmentVariables {
        switch (codeBuildProjectType) {
            case CodeBuildProjectType.SHOP_STOREADMIN:
                return [
                    { name: "TENANT_ID", value: String(tenantId) },
                    { name: "REACT_APP_SERVER_URL", value: CodeBuildService.createApiURL(tenantName) }
                ];
            case CodeBuildProjectType.SHOP_STOREFRONT:
                return [
                    { name: "TENANT_ID", value: String(tenantId) },
                    { name: "NEXT_PUBLIC_TENANT_NAME", value: tenantName },
                    { name: "NEXT_PUBLIC_SERVER_URL", value: CodeBuildService.createApiURL(tenantName) }
                ];
            default:
                return [];
        }
    }

    public static async startBuild(
        tenantId: number,
        tenantName: string,
        codeBuildProjectType: CodeBuildProjectType
    ): Promise<string> {
        const serviceInterfaceObject = CodeBuildService.createServiceInterfaceObject();

        const environmentVariablesOverride: CodeBuild.EnvironmentVariables = CodeBuildService.prepareEnvironmentVariablesOverride(
            tenantId,
            tenantName,
            codeBuildProjectType
        );

        const { build }: CodeBuild.StartBuildOutput = await serviceInterfaceObject
            .startBuild({ projectName: codeBuildProjectType, environmentVariablesOverride })
            .promise();

        if (!build) {
            throw new Error("Build failed.");
        }

        return String(build.id);
    }

    public static async pollBuilds(ids: string[]) {
        const serviceInterfaceObject = CodeBuildService.createServiceInterfaceObject();

        while (true) {
            const { builds }: CodeBuild.BatchGetBuildsOutput = await serviceInterfaceObject
                .batchGetBuilds({ ids })
                .promise();

            const isAllBuildsCompletedAndSucceeded = !find(
                builds,
                ({ currentPhase, buildStatus }) => currentPhase !== "COMPLETED" || buildStatus !== "SUCCEEDED"
            );
            if (isAllBuildsCompletedAndSucceeded) {
                break;
            }

            const isAnyBuildCompletedAndNotSucceeded = find(
                builds,
                ({ currentPhase, buildStatus }) => currentPhase === "COMPLETED" && buildStatus !== "SUCCEEDED"
            );
            if (isAnyBuildCompletedAndNotSucceeded) {
                throw new Error("Build failed.");
            }

            await delay(15000);
        }
    }
}

export default CodeBuildService;
