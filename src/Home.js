import React, { useState } from 'react';
import "antd/dist/antd.css";
import { Layout, Modal, Card, Spin, Result, Form, Button, Select } from 'antd';
import './index.css';
import MD5 from "crypto-js/md5";
import ShowFailure from './component/ShowFailure';
import { encode as base64_encode } from 'base-64';

const { Content } = Layout;
const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};


function Home() {

    const [endAge, setEndAge] = useState();
    const [startAge, setStartAge] = useState();
    const [gender, setGender] = useState();
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [result, setResult] = useState(false)


    const onFinish = () => {
        setLoading(true)
        const url = "http://localhost:3000/api_gateway/v1/recommendations/userattribute/trending";
        const username = "test.till.2";
        const password = MD5("Test@123");

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CAP-API-AUTH-ORG-ID': 123,
                'X-CAP-API-AUTH-ORG-ID': 50104,
                'Accept': 'application/json',
                'Authorization': 'Basic ' + base64_encode(username + ":" + password)
            },
            params: {
                'agegroup': encodeURIComponent('{start:' + startAge + ',end:' + endAge + '}'),
                'fashiontype': encodeURIComponent('{upper:shirt,lower:pant}'),
                'gender': gender,
                'limit': 3,
                'offset': 0
            }
        }
        fetch(url, {requestOptions})
            .then(resp => {
                if (!resp.ok) {
                    throw Error("Could not fetch data for that resource");
                }
                return resp.json()
            })
            .then(data => {
                console.log(data)
                setIsModalVisible(true)
                setData(data.recommendedItems.items)
                setLoading(false);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);

    };

    function handleAgeChange(value) {
        console.log(`selected ${value}`);
        switch (value) {
            case "1":
                setStartAge(0);
                setEndAge(17);
                break;
            case "2":
                setStartAge(18);
                setEndAge(25);
                break;
            case "3":
                setStartAge(26);
                setEndAge(35);
                break;
            case "4":
                setStartAge(36);
                setEndAge(45);
                break;
            case "5":
                setStartAge(46);
                setEndAge(100);
                break;
            default:
                break;
        }
    }

    function handleGenderChange(value) {
        console.log(`selected ${value}`);
        switch (value) {
            case 1:
                setGender("M")
                break;
            case 2:
                setGender("F")
            default:
                break;
        }
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <Content className="content-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            {isLoading ? <Spin tip="Loading..." style={{ marginLeft: '44%', marginTop: '13%' }}></Spin> :
                <Form
                    {...layout}
                    style={{ marginTop: '10%', marginLeft: '10%' }}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Age"
                        className="form-group"
                        name="age"
                        rules={[{ required: true, message: 'Please input your Age!' }]}
                    >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select the Age"
                            optionFilterProp="children"
                            onChange={handleAgeChange}
                        >
                            <Option value="1">Less than 18</Option>
                            <Option value="2">18-25</Option>
                            <Option value="3">26-35</Option>
                            <Option value="4">36-45</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please input your Gender!' }]}
                    >
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select the Gender"
                            optionFilterProp="children"
                            onChange={handleGenderChange}
                        >
                            <Option value="1">Male</Option>
                            <Option value="2">Female</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                    </Button>
                    </Form.Item>
                </Form>
            }

            <Modal title="Here are your recommendations !!" visible={isModalVisible} onOk={handleOk}>
                <p style={{ alignItems: "center" }}>Age:{endAge}</p>
                <p>Gender:{gender === "F" ? "Female" : "Male"}</p>
                <Card bordered={true} style={{ width: 300, marginLeft: '18%' }}>

                    {data.map((data, key) => {
                        return (
                            <span key={key}>
                                <p style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' }}> {data.values.name} </p>
                            </span>);
                    })}
                </Card>
            </Modal>
            {result ?
                <div>
                    <Result
                        status="500"
                        subTitle="Sorry, something went wrong."
                        extra={<Button type="primary">Back Home</Button>}
                    />
                </div> : ''}
        </Content>
    );
}


export default Home;