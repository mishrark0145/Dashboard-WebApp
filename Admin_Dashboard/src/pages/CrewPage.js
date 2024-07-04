import React, { useState, useEffect } from 'react';
import { Table, Input, Select, Button, Modal, Form, InputNumber,DatePicker} from 'antd';
import { ref, push, update, remove, onValue } from 'firebase/database';
import { dbResume,app} from "./firebaseConfig";
import moment from 'moment';
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';

const CrewPage = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [crewMembersData, setCrewMembersData] = useState([]);                                                                     
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    fetchCrewMembers();
  }, []);

  const fetchCrewMembers = () => {
    onValue(ref(dbResume, 'crewMembers'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const crewDataArray = Object.entries(data).map(([key, value]) => ({ key, ...value }));
        setCrewMembersData(crewDataArray);
      }
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      form.resetFields();
      setVisible(false);
      if (editingKey !== '') {
        update(ref(dbResume, `crewMembers/${editingKey}`), values);
        setEditingKey('');
      } else {
        const formattedValues = {
          ...values,
          joiningDate: moment(values.joiningDate).format(dateFormat), // Format using Moment.js
        };
  
        push(ref(dbResume, 'crewMembers'), formattedValues)
          .catch((error) => {
            console.log('Push failed:', error.message);
          });
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    setEditingKey('');
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingKey(record.key);
    showModal();
  };

  const handleDelete = (key) => {
    remove(ref(dbResume, `crewMembers/${key}`))
      .then(() => {
        console.log('Delete successful!');
        const index = findIndexByKey(key);
        if (index !== -1) {
          const updatedData = [...crewMembersData];
          updatedData.splice(index, 1);
          setCrewMembersData(updatedData);
        }
      })
      .catch((error) => {
        console.log('Delete failed:', error.message);
      });
  }

  const findIndexByKey = (key) => {
    return crewMembersData.findIndex((item) => item.key === key);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      filters: [
        { text: 'Captain', value: 'Captain' },
        { text: 'Chief Captain', value: 'Chief Captain' },
        { text: 'Engineer', value: 'Engineer' },
        { text: 'Chief Officer', value: 'Chief Officer' },
        { text: '2nd Officer', value: '2nd Officer' },
        { text: '3rd Officer', value: '3rd Officer' },
        { text: 'Additional 3rd Officer', value: 'Additional 3rd Officer' },
        { text: 'Chief Engineer', value: 'Chief Engineer' },
        { text: '2nd Engineer', value: '2nd Engineer' },
        { text: '3rd Engineer', value: '3rd Engineer' },
        { text: '4th Engineer', value: '4th Engineer' },
        { text: '5th Engineer/TME', value: '5th Engineer/TME' },
        { text: 'ETO', value: 'ETO' },
        { text: 'CADET', value: 'CADET' },
        { text: 'Bosun', value: 'Bosun' },
        { text: 'Pumpman', value: 'Pumpman' },
        { text: 'Able Seamen', value: 'Able Seamen' },
        { text: 'ORDINARY SEAMEN', value: 'ORDINARY SEAMEN' },
        { text: 'OILER/MOTOR MAN', value: 'OILER/MOTOR MAN' },
        { text: 'WIPER', value: 'WIPER' },
        { text: 'CHIEF COOK', value: 'CHIEF COOK' },
        { text: 'GENERAL STEWARD', value: 'GENERAL STEWARD' },
        { text: '1st MASTER', value: '1st MASTER' },
        { text: '2nd MASTER', value: '2nd MASTER' },
        { text: 'ED1', value: 'ED1' },
        { text: 'ED2', value: 'ED2' },
        { text: 'ELECTRICIAN', value: 'ELECTRICIAN' }
      ],
      onFilter: (value, record) => record.designation === value,
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      render: (joiningDate) => (
        <span title={joiningDate}>{joiningDate}</span>
      ),
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Certificate Type',
      dataIndex: 'certificateType',
      key: 'certificateType',
      filters: [
        { text: 'COC', value: 'COC' },
        { text: 'Watchkeeping', value: 'Watchkeeping' },
        { text: 'COOK COC', value: 'COOK COC' },
        { text: 'COP', value: 'COP' },
      ],
      onFilter: (value, record) => record.certificateType === value,
    },
    {
      title: 'Certificate Number',
      dataIndex: 'certificateNumber',
      key: 'certificateNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h1>Crew Members</h1>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Add New Crew Member
      </Button>
      <Table
        columns={columns}
        dataSource={crewMembersData}
        pagination={{ pageSize: 10 }}
        onChange={(pagination, filters, sorter) => console.log(sorter)}
      />

      <Modal
        title={editingKey ? 'Edit Crew Member' : 'Add New Crew Member'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true }]}
          >
            <Select>
            <option value="Captain">Captain</option>
            <option value="First Officer">Chief Captain</option>
            <option value="Engineer">Engineer</option>
            <option value="Chief Officer">Chief Officer</option>
            <option value="2nd Officer">2nd Officer</option>
            <option value="3rd Officer">3rd Officer</option>
            <option value="Additional 3rd Officer">Additional 3rd Officer</option>
            <option value="Chief Engineer">Chief Engineer</option>
            <option value="2nd Engineer">2nd Engineer</option>
            <option value="3rd Engineer">3rd Engineer</option>
            <option value="4th Engineer">4th Engineer</option>
            <option value="5th Engineer/TME">5th Engineer/TME</option>
            <option value="ETO">ETO</option>
            <option value="CADET">CADET</option>
            <option value="Bosun">Bosun</option>
            <option value="Pumpman">Pumpman</option>
            <option value="Able Seamen">Able Seamen</option>
            <option value="ORDINARY SEAMEN">ORDINARY SEAMEN</option>
            <option value="OILER/MOTOR MAN">OILER/MOTOR MAN</option>
            <option value="WIPER">WIPER</option>
            <option value="CHIEF COOK">CHIEF COOK</option>
            <option value="GENERAL STEWARD">GENERAL STEWARD</option>
            <option value="1st MASTER">1st MASTER</option>
            <option value="2nd MASTER">2nd MASTER</option>
            <option value="ED1">ED1</option>
            <option value="ED2">ED2</option>
            <option value="ELECTRICIAN">ELECTRICIAN</option>
            </Select>
          </Form.Item>
          <Form.Item name="nationality" label="Nationality">
            <Input />
          </Form.Item>
          <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
            <input type="date" name="joiningDate" id="joiningDate" className="ant-input" />
          </Form.Item>
          <Form.Item name="email" label="Email Address">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Age">
            <InputNumber />
          </Form.Item>
          <Form.Item name="certificateType" label="Certificate Type">
            <Select>
              <Option value="COC">COC</Option>
              <Option value="COP">COP</Option>
              <Option value="COOK COC">COOK COC</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="certificateNumber" label="Certificate Number">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CrewPage;
