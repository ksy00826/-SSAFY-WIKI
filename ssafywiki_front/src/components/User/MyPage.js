import React, { useState } from "react";
import {} from "@ant-design/icons";
import { Layout, theme, Row, Col, Image, Divider, Tooltip, Button } from "antd";
import { getUserProfile } from "utils/UserApi";
import { AuditOutlined } from "@ant-design/icons";

import UserNavbar from "components/Common/UserNavbar";
import LawnGraph from "./LawnGraph";

const { Header, Content, Footer, Sider } = Layout;

const MyPage = () => {
  const [nickname, setNickname] = React.useState();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  React.useEffect(() => {
    getUserProfile().then((result) => {
      console.log(result);
      setNickname(result.nickname);
    });
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <UserNavbar selectedKey="1"></UserNavbar>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Row justify="space-around" align="middle">
              <Col span={1}>
                <Image
                  width={50}
                  src="https://ssafywiki-s3.s3.ap-northeast-2.amazonaws.com/Wed%20Nov%2008%202023%2017%3A41%3A06%20GMT%2B0900%20%28%ED%95%9C%EA%B5%AD%20%ED%91%9C%EC%A4%80%EC%8B%9C%29eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsb3ZlMDA4MjZAbmF2ZXIuY29tIiwiaWF0IjoxNjk5NDMxMzA4LCJleHAiOjE2OTk1MjEzMDh9.5dTeMKW4GBzrVv1B7JFWJWlDycf855gJEl2qogVy9Vc.jpg"
                />
              </Col>
              <Col span={3}>
                <h1>{nickname}</h1>
              </Col>
              <Tooltip placement="top" title="내 문서 바로가기">
                <Button type="default" icon={<AuditOutlined />} />
              </Tooltip>
              <Col span={17}></Col>
            </Row>

            {/* <Divider orientation="left" orientationMargin="0">
              <b>My Contribute</b>
            </Divider> */}
            <Row justify="space-around" align="middle">
              <Col span={1}></Col>
            </Row>
            <LawnGraph></LawnGraph>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};
export default MyPage;
