/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceModel from "@/models/balance/balance_model";
import TransactionModel from "@/models/balance/transaction_model";

type Reason = "sale" | "salary" | "loan" | "expense" | "investment" | "other";

type Type = "credit" | "debit";

interface IUpdateBalance {
  amount: number;
  type: Type;
  reason: Reason;
  note?: string;
  user?: string;
}

class BalanceManager {
  // Get or create balance
  private async getBalanceDoc() {
    let balanceDoc: any = await BalanceModel.findOne();

    if (!balanceDoc) {
      balanceDoc = await BalanceModel.create({ balance: 0 });
    }

    return balanceDoc;
  }

  // Core update method
  async update({ amount, type, reason, note, user }: IUpdateBalance) {
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const balanceDoc = await this.getBalanceDoc();

    // Debit
    if (type === "debit") {
      if (balanceDoc.balance < amount) {
        throw new Error("Insufficient balance");
      }
      balanceDoc.balance -= amount;
    }

    // Credit
    if (type === "credit") {
      balanceDoc.balance += amount;
    }

    await balanceDoc.save();

    const transaction = await TransactionModel.create({
      amount,
      type,
      reason,
      note,
      user,
    });

    return {
      balance: balanceDoc,
      transaction,
    };
  }

  // Helper methods (optional but powerful)
  async credit(data: Omit<IUpdateBalance, "type">) {
    return this.update({ ...data, type: "credit" });
  }

  async debit(data: Omit<IUpdateBalance, "type">) {
    return this.update({ ...data, type: "debit" });
  }
}

export default new BalanceManager();
