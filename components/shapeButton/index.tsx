import React, { useState } from "react";
import { Button, Card, Col, Row, Select } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

type Props = {};

export default function ShapeButton({}: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [datas, setDatas] = useState([
    { title: "trapezoid", id: 1 },
    { title: "rectangle", id: 2 },
    { title: "parallelogram", id: 3 },
    { title: "square", id: 4 },
    { title: "circle", id: 5 },
    { title: "oval", id: 6 },
  ]);

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleClicDown = () => {
    const moveToTop = datas.splice(3, 5);
    setDatas([...moveToTop, ...datas]);
  };
  const handleClickUp = () => {
    const moveToDown = datas.splice(0, 3);
    setDatas([...datas, ...moveToDown]);
  };

  const randomClickIndex = () => {
    const shuffledDatas = [...datas];
    shuffledDatas.sort(() => Math.random() - 0.5);
    setDatas(shuffledDatas);
  };

  const button = [
    { title: "triangle_left", fn: randomClickIndex },
    { title: "triangle_up", fn: handleClickUp },
    { title: "triangl_down", fn: handleClicDown },
    { title: "triangle_right", fn: randomClickIndex },
  ];
  return (
    <div>
      <Row justify={"space-between"} style={{ padding: 10 }}>
        <div />
        <h1>{t("layout")}</h1>
        <Row>
          <Select
            defaultValue="lang"
            style={{ width: 80, marginBottom: 3 }}
            onChange={handleChange}
            options={[
              { value: "th", label: "th" },
              { value: "en", label: "en" },
            ]}
          />
          <Button onClick={() => router.push("/form")}>{t("project2")}</Button>
        </Row>
      </Row>
      <Row gutter={16} justify={"center"}>
        {button.map((item) => (
          <Col span={3.5} key={item.title}>
            <Card
              bordered={false}
              style={{
                width: 150,
                marginTop: 30,
                display: "flex",
                justifyContent: "center",
              }}
              className={styles.card_inside}
              onClick={item.fn}
            >
              <div className={`${styles[item.title]}`} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row justify={"end"}>
        {datas.map((item, index) => (
          <Col span={7} key={item.id}>
            <Card
              bordered={false}
              style={{
                width: 220,
                marginTop: 30,
                height: 100,
                display: "flex",
                justifyContent: "center",
              }}
              className={styles.card_inside}
              onClick={randomClickIndex}
            >
              <div className={`${styles[item.title]}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
