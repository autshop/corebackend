import { ObjectSchema } from "utils/api/validator/types";
import {
    createIsArrayPreset,
    createIsEmailPreset,
    createIsNumberPreset,
    createMaxLengthPreset,
    createMinLengthPreset,
    createRequiredPreset
} from "utils/api/validator/presets";

const authPostRegisterBody: ObjectSchema = {
    email: {
        key: "email",
        validators: [createRequiredPreset("email"), createIsEmailPreset("email")]
    },
    password: {
        key: "password",
        validators: [createRequiredPreset("password")]
    },
    passwordAgain: {
        key: "passwordAgain",
        validators: [createRequiredPreset("passwordAgain")]
    }
};

export const orderCreateBody: ObjectSchema = {
    customerEmail: {
        key: "customerEmail",
        validators: [
            createRequiredPreset("customerEmail"),
            createIsEmailPreset("customerEmail"),
            createMinLengthPreset("customerEmail", 5),
            createMaxLengthPreset("customerEmail", 50)
        ]
    }
};

export const idParams: ObjectSchema = {
    id: {
        key: "id",
        validators: [createIsNumberPreset("id")]
    }
};

export const orderPutContactBody: ObjectSchema = {
    customerEmail: {
        key: "customerEmail",
        validators: [
            createRequiredPreset("customerEmail"),
            createIsEmailPreset("customerEmail"),
            createMinLengthPreset("customerEmail", 5),
            createMaxLengthPreset("customerEmail", 50)
        ]
    }
};

export const orderPutAddressBody: ObjectSchema = {
    country: {
        key: "country",
        validators: [
            createRequiredPreset("country"),
            createMinLengthPreset("country", 2),
            createMaxLengthPreset("country", 50)
        ]
    },
    addressLine: {
        key: "addressLine",
        validators: [
            createRequiredPreset("addressLine"),
            createMinLengthPreset("addressLine", 2),
            createMaxLengthPreset("addressLine", 50)
        ]
    },
    postalCode: {
        key: "postalCode",
        validators: [
            createIsNumberPreset("postalCode"),
            createMinLengthPreset("postalCode", 2),
            createMaxLengthPreset("postalCode", 50)
        ]
    },
    phoneNumber: {
        key: "phoneNumber",
        validators: [
            createRequiredPreset("phoneNumber"),
            createMinLengthPreset("phoneNumber", 2),
            createMaxLengthPreset("phoneNumber", 50)
        ]
    },
    firstName: {
        key: "firstName",
        validators: [
            createRequiredPreset("firstName"),
            createMinLengthPreset("firstName", 2),
            createMaxLengthPreset("firstName", 50)
        ]
    },
    lastName: {
        key: "lastName",
        validators: [
            createRequiredPreset("lastName"),
            createMinLengthPreset("lastName", 2),
            createMaxLengthPreset("lastName", 50)
        ]
    }
};

export const orderPutShippingMethodBody: ObjectSchema = {
    customerEmail: {
        key: "shippingMethodId",
        validators: [createRequiredPreset("shippingMethodId"), createIsNumberPreset("shippingMethodId")]
    }
};

export const orderPutItemsBody: ObjectSchema = {
    sizeIds: {
        key: "sizes",
        validators: [createRequiredPreset("sizes"), createIsArrayPreset("sizes")]
    }
};

export const orderDeleteItemsBody: ObjectSchema = {
    sizes: {
        key: "sizes",
        validators: [createRequiredPreset("sizes"), createIsArrayPreset("sizes")]
    }
};

const validatorSchemas = {
    params: { idParams },
    body: {
        orderCreateBody,
        authPostRegisterBody,
        orderPutAddressBody,
        orderPutItemsBody,
        orderDeleteItemsBody,
        orderPutContactBody,
        orderPutShippingMethodBody
    }
};

export default validatorSchemas;
