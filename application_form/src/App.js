import React, { useState,useEffect } from "react";
import {  getDownloadURL, uploadBytesResumable,ref} from "firebase/storage";
import { storage, database } from "./firebase";
import { Button, Form, Input, Select, message,Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {ref as sRef,push, set ,get} from "firebase/database";

const { Option } = Select;

function App() {
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailExists, setEmailExists] = useState(false)

    const uploadProps = {
    beforeUpload: async (file) => {
      console.log("Before upload:", file);
      await uploadFiles(file);
      return false; 
    },
  };

  const checkEmailExists = async (email) => {
    const emailRef = sRef(database, "userFormData");
    const snapshot = await get(emailRef);
    if (snapshot.exists()) {
      const entries = snapshot.val();
      return Object.values(entries).some((entry) => entry.email === email);
    }
    return false;
  };

  useEffect(() => {
    if (formSubmitted) {
      setEmailExists(false); // Reset the emailExists state after successful form submission
    }
  }, [formSubmitted]);


  const handleEmailChange = async (e) => {
    const enteredEmail = e.target.value;
    const exists = await checkEmailExists(enteredEmail);
    setEmailExists(exists);
  };
  
  
  
  
  const onFinish = async (values, file) => {
    try {
      
      console.log("Download URL:", downloadURL);
      console.log("After upload:", file);
      
      const { name, email, indosNo, phoneNo, certificateType, rank } = values.user;
      const formData = {
        name,
        email,
        indosNo,
        phoneNo,
        certificateType,
        rank,
        resumeURL: downloadURL,
      };

      
  
      const newEntryRef = push(sRef(database, "userFormData"));
      await set(newEntryRef, formData);
  
      console.log("Form values:", formData);
      console.log("New Entry Ref:", newEntryRef);
   
  
      
      message.success("Form submitted successfully.");
      
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      
    }
  };
  
  
  
  

  const uploadFiles = async (file) => {
   
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(prog);
        },
        (error) => {
          console.log("Error uploading file:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Resolved Download URL:", downloadURL);  
            resolve(downloadURL);
            setDownloadURL(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  
  };
  


  return (
    <div className="App">
      {formSubmitted ? ( // Show success message if the form is submitted
        <div className="form-container" style={{ textAlign: "center" }}>
          <h2>Form submitted successfully!</h2>
          <Button type="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      ) : (
        <Form
          labelCol={{ span: 8}}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          onFinish={(values, file) => {
            console.log(file);
            onFinish(values, file);
          }}
          style={{ maxWidth: 600, margin: "auto", marginTop: 30, paddingTop: '20px' }} // Add margin between heading and form
        >
          <h1 style={{ textAlign: "center", marginBottom: 20 }}>Application Form</h1>
          <Form.Item
            name={['user', 'name']}
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input style={{ marginBottom: '10px'}}/>
          </Form.Item>

          <Form.Item
            name={['user', 'email']}
            label="Email Address"
            rules={[
              {
                required: true,
                message: "Please input your email address!",
                type: "email",
              },
            ]}
          >
            <Input onChange={handleEmailChange} style={{ marginBottom: '10px'}}/>
          </Form.Item>
          {emailExists && (
        <p style={{ color: "red" }}>This email is already taken. Please use a different email.</p>
      )}

          <Form.Item
            name={['user', 'indosNo']}
            label="INDOS NO"
            rules={[
              {
                required: true,
                message: "Please input your INDOS number!",
              },
            ]}
          >
            <Input style={{ marginBottom: '10px'}}/>
          </Form.Item>

          <Form.Item
            name={['user', 'phoneNo']}
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input style={{ marginBottom: '10px'}} />
          </Form.Item>

          <Form.Item
            name={['user', 'certificateType']}
            label="Certificate Type"
            rules={[{ required: true, message: "Please select certificate type!" }]}
          >
            <Select>
              <Option value="COC">COC</Option>
              <Option value="Watchkeeping">Watchkeeping</Option>
              <Option value="COP">COP</Option>
              <Option value="COOK COP">COOK COP</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['user', 'rank']}
            label="Rank"
            rules={[{ required: true, message: "Please select rank!" }]}
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

          <Form.Item label="Upload Resume" name="file">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <h5 style={{ textAlign: "center" }}>Uploaded {progress}%</h5>

          <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
            <Button type="primary" htmlType="submit" disabled={!downloadURL}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default App;
