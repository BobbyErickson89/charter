import { useEffect, useState } from "react"
import axios from "axios"
import { Modal } from "react-bootstrap"
import MonthlyTable from "./MonthlyTable"

const App = () => {
    const [customers, setCustomers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState([])

    const currentMonth = new Date().getMonth()
    const lastMonth = currentMonth - 1
    const twoMonthsAgo = currentMonth - 2

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get("/db/customers.json").then((res) => {
                    setCustomers(res.data)
                })
            } catch (err) {
                console.error(err)
            }
        }

        getData()
    }, [])

    const calculateTotalRewardPoints = (transactions) => {
        let total = 0

        transactions.map((transaction) => {
            if (transaction.total > 100) {
                // automatically adding 50 since the we know the transaction was over
                total += 50
                let totalOverOneHundred = Math.floor(transaction.total - 100)
                // putting '* 2' at the end here because any transaction over 100 is 2 points
                total += totalOverOneHundred * 2
            } else if (transaction.total > 50 && transaction.total <= 100) {
                let totalUnderOneHundred = transaction.total - 50
                total += Math.floor(totalUnderOneHundred)
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
                <tr
                    key={`${customer.id}-${customer.last_name}`}
                    className="points-modal"
                    onClick={() => {
                        setModalData(customer.transactions)
                        setShowModal(true)
                        console.log(modalData)
                    }}
                >
                    <th scope="row">{customer.id}</th>
                    <td>{customer.first_name}</td>
                    <td>{customer.last_name}</td>
                    <td>
                        <span>
                            {calculateTotalRewardPoints(customer.transactions)}
                            {" points"}
                        </span>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <table
                className="table table-hover"
                style={{ width: 1100, marginLeft: "auto", marginRight: "auto" }}
            >
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

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <MonthlyTable transactions={modalData} month={currentMonth} />
                <MonthlyTable transactions={modalData} month={lastMonth} />
                <MonthlyTable transactions={modalData} month={twoMonthsAgo} />
            </Modal>
        </>
    )
}

export default App
