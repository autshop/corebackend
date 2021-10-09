import { CloudFormation } from "aws-sdk";

class CloudformationService {
    private static createServiceInterfaceObject() {
        return new CloudFormation({ region: "eu-west-3" });
    }

    public static async createShop(tenantId: string) {
        try {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            await serviceInterfaceObject.createStack({
                StackName: `shop-store-${tenantId}`,
                TemplateURL: "",
                Capabilities: ["CAPABILITY_NAMED_IAM"],
                Parameters: [{ ParameterKey: "", ParameterValue: "" }]
            });
        } catch (e) {}
    }

    public static async deleteShop(tenantId: string) {
        try {
            const serviceInterfaceObject: CloudFormation = CloudformationService.createServiceInterfaceObject();
            await serviceInterfaceObject.deleteStack({ StackName: `tenant-${tenantId}` });
        } catch (e) {}
    }
}
