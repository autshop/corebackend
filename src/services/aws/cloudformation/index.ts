import { CloudFormation } from "aws-sdk";
import { compact, forEach, find, get } from "lodash";
//
import { DBConfig } from "services/elephantSQL/util";
import { AWSSystemParameters } from "services/aws/cloudformation/types";

class CloudformationService {
    private static createServiceInterfaceObject() {
        return new CloudFormation({ region: "eu-west-3" });
    }

    private static getSystemParameters(): Promise<AWSSystemParameters> {
        return new Promise(async (resolve, reject) => {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            serviceInterfaceObject.describeStacks((err, { Stacks }) => {
                if (err) {
                    console.log("Describe system stacks error.");
                    console.log(err);
                    return reject(err);
                }

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

                const systemParameters: AWSSystemParameters = {
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

                resolve(systemParameters);
            });
        });
    }

    public static createShop(tenantId: number, tenantName: string, dbConfig: DBConfig) {
        return new Promise(async (resolve, reject) => {
            const systemParameters: AWSSystemParameters = await CloudformationService.getSystemParameters();
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            serviceInterfaceObject.createStack(
                {
                    StackName: `shop-store-${tenantId}`,
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
                },
                (err, data) => {
                    if (err) {
                        console.log("error");
                        console.log(err);
                        reject(err);
                    }
                    console.log(data);
                    resolve(data);
                }
            );
        });
    }

    public static async deleteShop(tenantId: string) {
        try {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            await serviceInterfaceObject.deleteStack({ StackName: `tenant-${tenantId}` });
        } catch (e) {}
    }

    public static async pollShopCreationStatus(tenantId: number) {
        try {
            while (true) {
                const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
                const stacks = await serviceInterfaceObject.describeStacks({ StackName: `shop-store-${tenantId}` });

                console.log(stacks);

                await (async () => {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                })();

                if (false) {
                    break;
                }
            }
        } catch (e) {}
    }
}

export default CloudformationService;
