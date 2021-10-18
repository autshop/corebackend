import { S3 } from "aws-sdk";
import { map } from "lodash";
//
class S3Service {
    private static createServiceInterfaceObject() {
        return new S3({ region: "eu-west-3" });
    }

    public static async syncShopAdminBucket(tenantId: number, tenantName: string) {
        const sourceBucket = `s3://autshop/tenant-${tenantId}`;
        const destinationBucket = `s3://admin.${tenantName}.shop.akosfi.com`;

        const serviceInterfaceObject = S3Service.createServiceInterfaceObject();

        const { Contents }: S3.ListObjectsOutput = await serviceInterfaceObject
            .listObjects({ Bucket: sourceBucket })
            .promise();

        await Promise.all(
            map(Contents || [], async ({ Key }) => {
                if (!Key) {
                    return;
                }

                await serviceInterfaceObject
                    .copyObject({
                        Bucket: destinationBucket,
                        CopySource: `${sourceBucket}/${Key}`,
                        Key
                    })
                    .promise();

                await serviceInterfaceObject
                    .deleteObject({
                        Bucket: sourceBucket,
                        Key
                    })
                    .promise();
            })
        );
    }
}

export default S3Service;
