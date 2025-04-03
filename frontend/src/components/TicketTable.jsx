import React from 'react';
import { Table, Tag, Button } from 'antd';

const TicketTable = ({ data, onCancelTicket }) => {
  const columns = [
    {
      title: 'Movie',
      dataIndex: 'movie',
      key: 'movie',
      sorter: (a, b) => a.movie.localeCompare(b.movie),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend' // Default sort by date ascending
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.time.localeCompare(b.time),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Seats',
      dataIndex: 'seats',
      key: 'seats',
      render: seats => (
        <>
          {seats.map(seat => (
            <Tag color="blue" key={seat}>
              {seat}
            </Tag>
          ))}
        </>
      ),
      // Sort by number of seats
      sorter: (a, b) => a.seats.length - b.seats.length,
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      // Remove $ sign and convert to number for sorting
      sorter: (a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status === 'Completed' ? 'green' : 
                    status === 'Cancelled' ? 'red' : 'orange';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ['ascend', 'descend']
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        record.status === 'Upcoming' ? (
          <Button
            type="link"
            danger
            onClick={() => onCancelTicket(record.key)}
          >
            Cancel
          </Button>
        ) : null
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      // Add this to make the table show sorted state visually
      showSorterTooltip={{
        title: 'Click to sort',
        placement: 'top'
      }}
    />
  );
};

export default TicketTable;