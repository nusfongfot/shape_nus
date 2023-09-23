import {
  addToForm,
  clearForm,
  formSelector,
  initialValues,
} from "@/store/slices/formSlice";
import { useAppDispatch } from "@/store/store";
import {
  Button,
  Form,
  Col,
  Row,
  Select,
  Checkbox,
  Input,
  Radio,
  DatePicker,
  DatePickerProps,
  RadioChangeEvent,
} from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const TableFormNoSSR = dynamic(() => import("@/components/table"), {
  ssr: false,
});

type Props = {};

export default function FormPage({}: Props) {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formReducer = useSelector(formSelector);
  const [datas, setDatas] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saveForms = localStorage.getItem("forms");
      if (saveForms) return JSON.parse(saveForms);
      return [];
    }
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addToForm({ field: name, value }));
  };

  const onFinish = (values: any) => {
    const newData = { ...formReducer, key: datas.length + 1 };
    setDatas([{ ...newData }, ...datas]);
    Object.keys(initialValues).forEach((field) => {
      form.setFieldsValue({
        [field]: initialValues[field as keyof typeof initialValues],
      });
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onChangeDate: DatePickerProps["onChange"] = (date, dateString) => {
    dispatch(addToForm({ field: "birthDate", value: dateString }));
  };
  const onChangeRadio = (e: RadioChangeEvent) => {
    dispatch(addToForm({ field: "gender", value: e.target.value }));
  };

  const clearFormData = () => {
    dispatch(clearForm());
    Object.keys(initialValues).forEach((field) => {
      form.setFieldsValue({
        [field]: initialValues[field as keyof typeof initialValues],
      });
    });
  };

  const handleDeleteRows = () => {
    localStorage.removeItem("forms");
    const removeRows = datas.filter((item) => !selectedRows.includes(item));
    setDatas(removeRows);
  };

  useEffect(() => {
    localStorage.setItem("forms", JSON.stringify(datas));
  }, [datas]);

  return (
    <>
      <Row justify={"space-between"} style={{ padding: 10 }}>
        <div />
        <h1>{t("form")}</h1>
        <Col span={3}>
          <Select
            defaultValue="lang"
            style={{ width: 80, marginBottom: 3 }}
            onChange={handleChange}
            options={[
              { value: "th", label: "th" },
              { value: "en", label: "en" },
            ]}
          />
          <Button onClick={() => router.push("/")}>{t("back")}</Button>
        </Col>
      </Row>

      <Row justify={"center"}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 10 }}
          // wrapperCol={{ span: 24 }}
          initialValues={formReducer}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{ border: "1px solid black", width: 1200, padding: 5 }}
        >
          <Row>
            <Form.Item
              label="คำนำหน้า"
              name="prefix"
              rules={[
                { required: true, message: "Please Select your Prefix!" },
              ]}
              style={{ width: 400 }}
            >
              <Select
                onChange={(e) =>
                  dispatch(addToForm({ field: "prefix", value: e }))
                }
                style={{ width: 180 }}
              >
                <Select.Option value="นาย">นาย</Select.Option>
                <Select.Option value="นาง">นาง</Select.Option>
                <Select.Option value="นางสาว">นางสาว</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="ชื่อจริง"
              name="firstName"
              rules={[
                { required: true, message: "Please input your firstName!" },
              ]}
              style={{ width: 400 }}
            >
              <Input
                style={{ width: 200 }}
                name="firstName"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Item>

            <Form.Item
              label="นามสกุล"
              name="lastName"
              rules={[
                { required: true, message: "Please input your lastName!" },
              ]}
              style={{ width: 340 }}
            >
              <Input
                style={{ width: 200 }}
                name="lastName"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Item>
          </Row>

          <Row justify={"start"}>
            <Form.Item
              label="วันเกิด"
              name="birthDate"
              rules={[
                { required: true, message: "Please input your birthDate!" },
              ]}
              style={{ width: 400 }}
            >
              <DatePicker
                style={{ width: 180 }}
                onChange={onChangeDate}
                name="birthDate"
              />
            </Form.Item>

            <Form.Item
              label="สัญชาติ"
              name="nationality"
              rules={[
                { required: true, message: "Please Select your nationality!" },
              ]}
            >
              <Select
                onChange={(e) =>
                  dispatch(addToForm({ field: "nationality", value: e }))
                }
                style={{ width: 400 }}
              >
                <Select.Option value="ไทย">ไทย</Select.Option>
                <Select.Option value="ลาว">ลาว</Select.Option>
              </Select>
            </Form.Item>
          </Row>

          <Form.Item
            label="เลขบัตรประชาชน"
            name="idCard"
            rules={[{ required: true, message: "Please input your id card!" }]}
            style={{ width: 400 }}
          >
            <Input
              style={{ width: 400 }}
              name="idCard"
              onChange={(e) => handleInputChange(e)}
              type="number"
            />
          </Form.Item>
          <Form.Item
            label="เพศ"
            name="gender"
            rules={[{ required: true, message: "Please input your gender!" }]}
            style={{ width: 400 }}
          >
            <Radio.Group
              onChange={onChangeRadio}
              name="genger"
              style={{ width: 400 }}
            >
              <Radio value={"male"}>ผู้ชาย</Radio>
              <Radio value={"female"}>ผู้หญิง</Radio>
              <Radio value={"none"}>ไม่ระบุ</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="เบอร์โทรศัพท์"
            name="phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
            style={{ width: 400 }}
          >
            <Input
              style={{ width: 400 }}
              name="phone"
              onChange={(e) => handleInputChange(e)}
              type="number"
            />
          </Form.Item>

          <Form.Item
            label="หนังสือเดินทาง"
            name="passport"
            // rules={[{ required: false, message: "Please input your id card!" }]}
            style={{ width: 400 }}
          >
            <Input
              style={{ width: 400 }}
              name="passport"
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>

          <Row justify={"space-between"}>
            <Form.Item
              label="เงินเดือนที่คาดหวัง"
              name="expectedSalary"
              rules={[
                {
                  required: true,
                  message: "Please input your expectedSalary!",
                },
              ]}
              style={{ width: 400 }}
            >
              <Input
                style={{ width: 400 }}
                name="expectedSalary"
                onChange={(e) => handleInputChange(e)}
                type="number"
              />
            </Form.Item>

            <Row style={{ marginRight: 20 }}>
              <Form.Item style={{ marginRight: 50 }}>
                <Button
                  type="primary"
                  style={{ background: "red" }}
                  onClick={clearFormData}
                >
                  ล้างข้อมูล
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  ส่งข้อมูล
                </Button>
              </Form.Item>
            </Row>
          </Row>
        </Form>
      </Row>

      <div style={{ margin: 30 }}>
        {selectedRows.length > 2 && (
          <Button
            type="primary"
            style={{ background: "red", marginBottom: 10 }}
            onClick={() => handleDeleteRows()}
          >
            ลบทั้งหมด
          </Button>
        )}
        <TableFormNoSSR
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          datas={datas}
          setDatas={setDatas}
        />
      </div>
    </>
  );
}
