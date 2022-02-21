import { Form, Input, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./FlowField.css";

const FlowField = () => {
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
      <div className="red">hello</div>
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "first"]}
                  rules={[{ required: true, message: "Add Employee" }]}
                >
                  <input
                    placeholder="Employee"
                    className="action-input"
                    style={{
                      padding: "5px",
                      border: "0.2px solid var(--light-brown)",
                      backgroundColor: "var(--lightest-brown)",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "last"]}
                  rules={[{ required: true, message: "Add Action" }]}
                >
                  <Input
                    placeholder="Action"
                    style={{
                      padding: "5px",
                      border: "0.2px solid var(--light-brown)",
                      backgroundColor: "var(--lightest-brown)",
                      borderRadius: "5px",
                    }}
                  />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "var(--light-brown)",
                  color: "var(--white)",
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  marginTop: "15px",
                }}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};

export default FlowField;
