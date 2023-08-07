import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
    const [customers, setCustomers] = useState([])

    useEffect(() => {
        axios.get('/db/customers.json').then((res) => {
            setCustomers(res.data)
        })
    }, [])

    const calculateRewardPoints = (transactions) => {
        let total = 0

        transactions.map((transaction) => {
            let today = new Date()
            let threeMonthsAgo = today.setMonth(today.getMonth() - 3)
            let transactionDate = new Date(transaction.date).getTime()

            if (transactionDate >= threeMonthsAgo && transaction.total > 50) {
                console.log('date: ', new Date(transactionDate))
                if (transaction.total > 100) {
                    total += 50
                    let totalOverOneHundred = Math.floor(
                        transaction.total % 100
                    )
                    // putting '* 2' at the end here because any transaction over 100 is 2 points
                    total += totalOverOneHundred * 2
                } else {
                    let totalUnderOneHundred = transaction.total % 50
                    total += Math.floor(totalUnderOneHundred)
                }
            }
        })

        return total
    }

    const showCustomers = () => {
        if (!customers) {
            return (
                <tr>
                    <td align="center" colSpan={3}>
                        No Customers to display
                    </td>
                </tr>
            )
        }

        return customers.map((customer) => {
            return (
                <tr key={`${customer.id}-${customer.last_name}`}>
                    <th scope="row">{customer.id}</th>
                    <td>{customer.first_name}</td>
                    <td>{customer.last_name}</td>
                    <td>{calculateRewardPoints(customer.transactions)}</td>
                </tr>
            )
        })
    }

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Customer ID</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Reward Points (Last 3 Months)</th>
                </tr>
            </thead>
            <tbody>{showCustomers()}</tbody>
        </table>
    )
}

export default App
