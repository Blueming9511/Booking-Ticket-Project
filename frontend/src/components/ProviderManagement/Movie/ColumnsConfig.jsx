import { Tag, Badge, Rate, Image, Dropdown, Button, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  StarFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import { convertDay, convertMoney } from "../../utils/Converter";


export const columns = (handleEdit, handleDelete) => [
  {
    title: "Poster",
    dataIndex: "thumbnail",
    key: "thumbnail",
    render: (src) => (
      <Image
        width={100}
        src={src}
        className="rounded-lg shadow-md hover:shadow-lg transition-all"
      />
    ),
    width: 150,
  },
  {
    title: "Movie Information",
    key: "info",
    render: (_, record) => (
      <div className="flex flex-col">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{record.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Tag color="blue">{record.genre}</Tag>
              <Tag color="purple">{convertDay(record.releaseDate)}</Tag>
              <Tag icon={<ClockCircleOutlined />}>{record.duration} mins</Tag>
            </div>
            <div className="flex items-center gap-2">
              <Rate
                disabled
                allowHalf
                defaultValue={record.rating / 2}
                character={<StarFilled />}
                className="text-sm"
              />
              <span className="text-gray-600">{record.rating?.toFixed(1)}/10</span>
            </div>
          </div>
          <Tooltip title="Box Office">
            <Badge
              count={convertMoney(record.boxOffice)}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full"
            />
          </Tooltip>
        </div>
        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Director:</span> {record.director}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Distributor:</span>{" "}
            {record.releasedBy}
          </p>
        </div>
      </div>
    ),
    width: 400,
  },
  {
    title: "Financials",
    key: "financials",
    render: (_, record) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Budget: {convertMoney(record.budget)}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          <span>Revenue: {convertMoney(record.boxOffice)}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Released: {convertDay(record.releaseDate)}
          </p>
          <p className="text-sm text-gray-500">Ended: {convertDay(record.endDate)}</p>
        </div>
      </div>
    ),
    width: 200,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 300,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag
        color={status === "Ended" ? "red" : "green"}
        className="flex items-center gap-1"
      >
        {status === "Ended" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Ended
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Now Showing
          </>
        )}
      </Tag>
    ),
    align: "center",
    width: 200,
  },
  {
    title: "Actions",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Edit",
              onClick: () => handleEdit(record),
            },
            {
              key: "delete",
              label: "Delete",
              onClick: () => handleDelete(record),
              danger: true
            },
          ],
        }}
        trigger={["click"]}
      >
        <Button
          icon={<EllipsisOutlined />}
          shape="default"
          style={{ padding: "0" }}
        />
      </Dropdown>
    ),
    width: 100,
  },
];
