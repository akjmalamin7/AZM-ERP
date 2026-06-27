/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

interface BulkSMSBDConfig {
  api_key: string;
  senderid: string;
}

interface SendMessageParams {
  to: string;
  message: string;
}

export default class BulkSMSBD {
  private api_key: string;
  private senderid: string;

  constructor({ api_key, senderid }: BulkSMSBDConfig) {
    this.api_key = api_key;
    this.senderid = senderid;
  }

  async send_message({ to, message }: SendMessageParams): Promise<any> {
    const receiver = to.replace("+", "");

    try {
      if (!this.api_key) {
        throw new Error("Missing api_key");
      }

      if (!this.senderid) {
        throw new Error("Missing senderid");
      }

      const payload = {
        api_key: this.api_key,
        senderid: this.senderid,
        number: receiver,
        message,
      };

      const response = await axios.post(
        "https://bulksmsbd.net/api/smsapi",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error sending message to BulkSMSBD:",
        error?.response?.data || error.message,
      );

      throw error;
    }
  }
}
