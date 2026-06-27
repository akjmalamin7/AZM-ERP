import { Document, Schema, model } from "mongoose";

const gateways = ["reve", "ada", "bulksmsbd"] as const;
type EventSetup = {
  status: boolean;
  gateway: (typeof gateways)[number];
  format: string;
};
const event_setup = {
  status: {
    type: Boolean,
    default: false,
  },
  gateway: {
    type: String,
    enum: gateways,
    default: "bulksmsbd",
  },
  format: {
    type: String,
    default: "",
  },
};

interface IReveIntegration {
  api_key: string;
  secret_key: string;
  caller_id: string;
}

interface IAdaIntegration {
  username: string;
  password: string;
  sender: string;
}

interface IBulkSMSBDIntegration {
  senderid: string;
  api_key: string;
}

export interface ISMSProps extends Document {
  integrations: {
    reve: IReveIntegration;
    ada: IAdaIntegration;
    bulksmsbd: IBulkSMSBDIntegration;
  };
  setup: {
    promotion: EventSetup;
  };
}

export const sms_integration_schema = new Schema<ISMSProps>({
  integrations: {
    reve: {
      api_key: {
        type: String,
        default: "",
      },
      secret_key: {
        type: String,
        default: "",
      },
      caller_id: {
        type: String,
        default: "",
      },
    },
    ada: {
      username: {
        type: String,
        default: "",
      },
      password: {
        type: String,
        default: "",
      },
      sender: {
        type: String,
        default: "",
      },
    },
    bulksmsbd: {
      senderid: {
        type: String,
        default: "",
      },
      api_key: {
        type: String,
        default: "",
      },
    },
  },
  setup: {
    promotion: event_setup,
  },
});
export const SMSIntegrationModel = model(
  "SMSIntegrationModel",
  sms_integration_schema,
);
