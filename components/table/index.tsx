import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Table,
  Typography,
} from "antd";

type Props = {
  setSelectedRows: Dispatch<SetStateAction<any[]>>;
  selectedRows: any[];
  setDatas: Dispatch<SetStateAction<any[]>>;
  datas: any[];
};

interface FormStateStype {
  key: string;
  prefix: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  idCard: string;
  gender: string;
  phone: string;
  passport: string;
  expectedSalary: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: FormStateStype;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function TableForm({
  selectedRows,
  setSelectedRows,
  datas,
  setDatas,
}: Props) {
  const [form] = Form.useForm();
  // const [datas, setDatas] = useState(datas);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: FormStateStype) => record.key === editingKey;

  const edit = (record: Partial<FormStateStype> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as FormStateStype;

      const newData = [...datas];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDatas(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDatas(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRowsTable: FormStateStype[]
    ) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRowsTable: ",
      //   selectedRowsTable
      // );
      console.log("keyyy", selectedRowsTable);
      setSelectedRows(selectedRowsTable);
    },
  };

  const handleDeleteRow = (key: string) => {
    const remove = datas.filter((item) => item.key !== key);
    setDatas(remove);
  };

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "firstName",
      key: "firstName",
      width: "25%",
      editable: true,
      sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "เพศ",
      dataIndex: "gender",
      key: "gender",
      width: "15%",
      editable: true,
      sorter: (a: any, b: any) => a.gender.localeCompare(b.gender),
    },
    {
      title: "หมายเลขโทรศัพท์มือถือ",
      dataIndex: "phone",
      key: "phone",
      width: "25%",
      editable: true,
      sorter: (a: any, b: any) => a.phone.localeCompare(b.phone),
    },
    {
      title: "สัญชาติ",
      dataIndex: "nationality",
      key: "nationality",
      width: "25%",
      editable: true,
      sorter: (a: any, b: any) => a.nationality.localeCompare(b.nationality),
    },
    {
      title: "จัดการ",
      dataIndex: "edit",
      width: "25%",
      render: (_: any, record: FormStateStype) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Row justify={"space-between"}>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              style={{ color: "red" }}
              onClick={() => handleDeleteRow(record.key)}
            >
              Delete
            </Typography.Link>
          </Row>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: FormStateStype) => ({
        record,
        inputType: col.dataIndex === "phone" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={datas}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}
