import React, { useState } from 'react'
import Table from '../../components/Table'
import Pagination from '../../components/Pagingnation'

export default function Promotion() {
  const columns = [
    { key: 'id', header: 'ID', width: 'w-1/12' },
    { key: 'name', header: 'Name', width: 'w-3/12' },
    { key: 'age', header: 'Age', width: 'w-1/12' },
    { key: 'email', header: 'Email', width: 'w-4/12' },
    { key: 'status', header: 'Status', width: 'w-2/12' }
  ]

  // Define table data
  const data = [
    { id: 1, name: 'John Doe', age: 28, email: 'john.doe@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 34, email: 'jane.smith@example.com', status: 'Inactive' },
    { id: 3, name: 'Alice Johnson', age: 22, email: 'alice.johnson@example.com', status: 'Active' },
    { id: 4, name: 'Bob Brown', age: 45, email: 'bob.brown@example.com', status: 'Active' },
    { id: 5, name: 'Charlie Davis', age: 30, email: 'charlie.davis@example.com', status: 'Inactive' },
    { id: 6, name: 'Eve White', age: 25, email: 'eve.white@example.com', status: 'Active' },
    { id: 7, name: 'Frank Wilson', age: 40, email: 'frank.wilson@example.com', status: 'Active' },
    { id: 8, name: 'Grace Lee', age: 29, email: 'grace.lee@example.com', status: 'Inactive' },
    { id: 9, name: 'Henry Moore', age: 35, email: 'henry.moore@example.com', status: 'Active' },
    { id: 10, name: 'Ivy Taylor', age: 27, email: 'ivy.taylor@example.com', status: 'Active' }
  ]
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // Number of items per page

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Get current page data
  // const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>List Promotion</h1>
      <Table columns={columns} data={data} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}
