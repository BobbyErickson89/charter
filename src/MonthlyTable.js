import { useEffect, useState } from "react"
import axios from "axios"
import { Modal } from "react-bootstrap"

const MonthlyTable = (props) => {
    let monthlyTotal = 0
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    useEffect(() => {
        // getting the transactions for the correct month
        const transactions = props.transactions.filter((t) => {
            return new Date(t.date).getMonth() === props.month
        })
    }, [])

    const showTransactions = () => {
        // getting the transactions for the correct month
        const transactions = props.transactions.filter((t) => {
            return new Date(t.date).getMonth() === props.month
        })

        if (!transactions || transactions.length < 1) {
            return (
                <tr>
                    <td align="center" colSpan={4}>
                        No Transactions This Month
                    </td>
                </tr>
            )
        }

        const transactionRows = () => {
            return transactions.map((transaction) => {
                let total = 0
                if (transaction.total > 100) {
                    // automatically adding 50 since the we know the transaction was over
                    total += 50
                    monthlyTotal += 50
                    let totalOverOneHundred = Math.floor(
                        transaction.total - 100
                    )
                    // putting '* 2' at the end here because any transaction over 100 is 2 points
                    total += totalOverOneHundred * 2
                    monthlyTotal += totalOverOneHundred * 2
                } else if (transaction.total > 50 && transaction.total <= 100) {
                    let totalUnderOneHundred = transaction.total - 50
                    total += Math.floor(totalUnderOneHundred)
                    monthlyTotal += Math.floor(totalUnderOneHundred)
                }

                return (
                    <tr key={`${transaction.id}-${transaction.date}`}>
                        <th scope="row">{transaction.id}</th>
                        <td>{transaction.date}</td>
                        <td>${Number(transaction.total).toFixed(2)}</td>
                        <td>{total}</td>
                    </tr>
                )
            })
        }

        return (
            <>
                {transactionRows()}
                <tr>
                    <td />
                    <td />
                    <td />
                    <td style={{ fontWeight: "bold" }}>
                        Monthly Total: {monthlyTotal}
                    </td>
                </tr>
            </>
        )
    }

    console.log("monthly total: ", monthlyTotal)
    return (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <h5 style={{ paddingLeft: "8px" }}>
                Purchases for {months[props.month]}
            </h5>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Transaction ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total</th>
                        <th scope="col">Reward Points Earned</th>
                    </tr>
                </thead>
                <tbody>{showTransactions()}</tbody>
            </table>
        </div>
    )
}

export default MonthlyTable
