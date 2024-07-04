import React, { useState, useEffect } from 'react';
import { Button, Space, Table, Input, Select,Modal,Form} from 'antd';
import {dbForm} from "./firebaseConfigForm";
import {get,ref,remove,update} from "firebase/database"
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";

const { Option } = Select;
const Resume = () => {
  
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEditedRowData, setCurrentEditedRowData] = useState({});
  const [editableRows, setEditableRows] = useState({}); // Add this line
  const [editedRowData, setEditedRowData] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) =>
        <div>
          {record.name}
        </div>
    },
    
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (_, record) =>
      <div>
      {record.email}

    </div>
    },
    {
      title: 'Phone No.',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
      render: (_, record) =>
          record.phone
    },  
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      sorter: (a, b) => a.rank.localeCompare(b.rank),
      sortOrder: sortedInfo.columnKey === 'rank' ? sortedInfo.order : null,
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
      filteredValue: filteredInfo.rank || null,
      onFilter: (value, record) => record.rank.includes(value),
      ellipsis: true,
      render: (_, record) =>
          record.rank,
    },
    {
      title: 'Resume',
      dataIndex: 'resume',
      key: 'resume',
      ellipsis: true,
      render: resume => (
        <a href={resume} target="_blank" rel="noopener noreferrer">
          View Resume
        </a>
      ),
    },
    {
      title: 'Certificate Type',
      dataIndex: 'certificate',
      key: 'certificate',
      sorter: (a, b) => a.rank.localeCompare(b.certificate),
      sortOrder: sortedInfo.columnKey === 'certificate' ? sortedInfo.order : null,
      filters: [
        { text: 'COC', value: 'COC' },
        { text: 'Watchkeeping', value: 'Watchkeeping' },
        { text: 'COOK COC', value: 'COOK COC' },
        { text: 'COP', value: 'COP' },
      ],
      filteredValue: filteredInfo.certificate || null,
      onFilter: (value, record) => record.certificate.includes(value),
      ellipsis: true,
      render: (_, record) =>
          record.certificate
        
    },
    {
      title: 'INDOS No',
      dataIndex: 'indos',
      key: 'indos',
      sorter: (a, b) => a.name.localeCompare(b.indos),
      sortOrder: sortedInfo.columnKey === 'indos' ? sortedInfo.order : null,
      ellipsis: true,
      render: (_, record) =>
          record.indos
  
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleDeleteRow(record.key, record.resume)}>Delete</Button>
        </Space>
      ),
    },  
  ];


  
  useEffect(() => {
    const usersRef = ref(dbForm, "userFormData"); 

    get(usersRef)
      .then((snapshot) => {
        console.log("Snapshot exists:", snapshot.exists());
        if (snapshot.exists()) {
          
          console.log("Fetched data:",data);
          const usersArray = [];


          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            console.log("Fetched data from Firebase:", data);
            const userId = childSnapshot.key;
            usersArray.push({
              key: userId,
              name: user.name,
              email: user.email, 
              resume: user.resumeURL, 
              rank: user.rank,
              phone:user.phoneNo, 
              indos:user.indosNo,
              certificate:user.certificateType,
            });
          });
          
          
          console.log("Parsed data for the table:", usersArray);
          setData(usersArray);
        }else{
          console.log("No data found in Firebase.");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);



  const handleDeleteRow = (key, resume) => {
    console.log("Deleting row with key:", key);
    console.log("Resume URL:", resume);

    const usersRef = ref(dbForm, "userFormData/" + key);
  
    remove(usersRef)
      .then(() => {
        console.log("Data deleted successfully from Firebase.");
  
        if (resume) {
          console.log("Deleting file with URL:", resume);
          const storage = getStorage();
          const resumeRef = storageRef(storage, resume);
          console.log(resumeRef);

          deleteObject(resumeRef)
            .then(() => {
              console.log("File deleted successfully from Firebase Storage.");
            })
            .catch((error) => {
              console.error("Error deleting file from Firebase Storage:", error);
            });
        }
        const updatedData = data.filter((row) => row.key !== key);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };
  
  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};

export default Resume;
