import { CloudFormation } from "aws-sdk";
import { compact, find, forEach, get } from "lodash";
//
import { DBConfig } from "services/elephantSQL/util";
import { AWSSystemParameters } from "services/aws/cloudformation/types";
import ShopService from "services/db/shop";
import { ShopStatus } from "db/models/shop";

class CloudformationService {
    private static createServiceInterfaceObject() {
        return new CloudFormation({ region: "eu-west-3" });
    }

    private static createShopStackName(tenantId: number) {
        return `shop-store-${tenantId}`;
    }

    private static async getSystemParameters(): Promise<AWSSystemParameters> {
        const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
        const { Stacks }: CloudFormation.DescribeStacksOutput = await serviceInterfaceObject.describeStacks().promise();

        const compactedStacks = compact(Stacks);
        let mergedOutputs: CloudFormation.Output[] = [];
        forEach(compactedStacks, stack => {
            mergedOutputs = [...mergedOutputs, ...(stack.Outputs || [])];
        });

        const getValueByKey = (key: string) =>
            get(
                find(mergedOutputs, ({ OutputKey = "" }) => OutputKey === key),
                "OutputValue",
                ""
            );

        console.log(mergedOutputs);

        return {
            VPC: getValueByKey("VPC"),
            ALBListenerStoreAPI: getValueByKey("ALBListenerStoreAPI"),
            StoreAPICluster: getValueByKey("StoreAPICluster"),
            LoadBalancerUrlStoreAPI: getValueByKey("LoadBalancerUrlStoreAPI"),
            CanonicalHostedZoneIDStoreAPI: getValueByKey("CanonicalHostedZoneIDStoreAPI"),
            ALBListenerStorefront: getValueByKey("ALBListenerStorefront"),
            StorefrontCluster: getValueByKey("StorefrontCluster"),
            LoadBalancerUrlStorefront: getValueByKey("LoadBalancerUrlStorefront"),
            CanonicalHostedZoneIDStorefront: getValueByKey("CanonicalHostedZoneIDStorefront")
        };
    }

    public static async createShop(tenantId: number, tenantName: string, dbConfig: DBConfig) {
        const systemParameters: AWSSystemParameters = await CloudformationService.getSystemParameters();
        const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
        return await serviceInterfaceObject
            .createStack({
                StackName: CloudformationService.createShopStackName(tenantId),
                TemplateURL: "https://autshop.s3.eu-west-3.amazonaws.com/deployments/new-store.yaml",
                Capabilities: ["CAPABILITY_NAMED_IAM"],
                Parameters: [
                    { ParameterKey: "VPC", ParameterValue: systemParameters.VPC },
                    { ParameterKey: "ClusterStoreAPI", ParameterValue: systemParameters.StoreAPICluster },
                    { ParameterKey: "ClusterStorefront", ParameterValue: systemParameters.StorefrontCluster },
                    { ParameterKey: "TenantId", ParameterValue: String(tenantId) },
                    { ParameterKey: "TenantName", ParameterValue: tenantName },
                    { ParameterKey: "HostedZoneId", ParameterValue: "Z0334966BUBL2CGRBGQ2" },
                    {
                        ParameterKey: "LoadBalancerDNSStoreAPI",
                        ParameterValue: systemParameters.LoadBalancerUrlStoreAPI
                    },
                    {
                        ParameterKey: "CanonicalHostedZoneIDStoreAPI",
                        ParameterValue: systemParameters.CanonicalHostedZoneIDStoreAPI
                    },
                    {
                        ParameterKey: "LoadBalancerDNSStorefront",
                        ParameterValue: systemParameters.LoadBalancerUrlStorefront
                    },
                    {
                        ParameterKey: "CanonicalHostedZoneIDStorefront",
                        ParameterValue: systemParameters.CanonicalHostedZoneIDStorefront
                    },
                    { ParameterKey: "ListenerStoreAPI", ParameterValue: systemParameters.ALBListenerStoreAPI },
                    { ParameterKey: "ListenerStorefront", ParameterValue: systemParameters.ALBListenerStorefront },
                    { ParameterKey: "Priority", ParameterValue: String(tenantId) },
                    { ParameterKey: "EnvDbUsername", ParameterValue: dbConfig.username },
                    { ParameterKey: "EnvDbPassword", ParameterValue: dbConfig.password },
                    { ParameterKey: "EnvDbServer", ParameterValue: dbConfig.server },
                    { ParameterKey: "EnvDbName", ParameterValue: dbConfig.databaseName },
                    { ParameterKey: "EnvDbPort", ParameterValue: "5432" }
                ]
            })
            .promise();
    }

    public static async deleteShop(tenantId: number) {
        try {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            await serviceInterfaceObject.deleteStack({
                StackName: CloudformationService.createShopStackName(tenantId)
            });
        } catch (e) {}
    }

    public static async pollShopCreationStatus(tenantId: number) {
        while (true) {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            const { Stacks }: CloudFormation.DescribeStacksOutput = await serviceInterfaceObject
                .describeStacks({ StackName: CloudformationService.createShopStackName(tenantId) })
                .promise();

            const stack: CloudFormation.Stack = get(Stacks, "[0]");

            if (stack.StackStatus === ShopStatus.CREATE_COMPLETE) {
                await ShopService.updateShopStatus(tenantId, ShopStatus.CREATE_COMPLETE);
                return;
            } else if (stack.StackStatus === ShopStatus.CREATE_IN_PROGRESS) {
                await ShopService.updateShopStatus(tenantId, ShopStatus.CREATE_IN_PROGRESS);
                await (async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                })();
            } else {
                await ShopService.updateShopStatus(tenantId, ShopStatus.ERROR);
                throw new Error("Failed to create stack.");
            }
        }
    }
}

export default CloudformationService;
