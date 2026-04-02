import { transactions as seedTransactions } from "@/data/transactions"
import { DemoScenarioKey, Transaction } from "@/types"

function cloneTransactions(items: Transaction[]) {
  return items.map((item) => ({ ...item }))
}

const balanced = cloneTransactions(seedTransactions)

const overspending = cloneTransactions(seedTransactions).map((tx) => {
  if (tx.type === "expense") {
    return {
      ...tx,
      amount: Math.round(tx.amount * 1.35),
    }
  }

  return tx
})

const highSavings = cloneTransactions(seedTransactions).map((tx) => {
  if (tx.type === "income") {
    return {
      ...tx,
      amount: Math.round(tx.amount * 1.2),
    }
  }

  if (tx.type === "expense") {
    return {
      ...tx,
      amount: Math.round(tx.amount * 0.8),
    }
  }

  return tx
})

export const transactionScenarios: Record<DemoScenarioKey, Transaction[]> = {
  balanced,
  overspending,
  highSavings,
}

export function getScenarioTransactions(scenario: DemoScenarioKey) {
  return cloneTransactions(transactionScenarios[scenario])
}

export function getSeedTransactions() {
  return cloneTransactions(seedTransactions)
}
