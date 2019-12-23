import React from 'react';
import styles from './index.module.css';
import { Upload, message, Button, Icon, Table, Popconfirm } from 'antd';

import * as XLSX from 'xlsx';

const Column = Table.Column;

const SESSION_KEY = 'employees';

class DataPage extends React.Component {

  constructor(props) {
    super(props);
    const value = sessionStorage.getItem(SESSION_KEY)
    this.state = {
      employees: value ? JSON.parse(value) : [],
      value:''
    }
  }

  //删除
  handleDelete = id =>{
    const employees = [...this.state.employees];
    console.log(employees)
    this.setState({ employees: employees.filter(item => item.id !== id) });
    message.success("删除成功："+id)
  }


 //添加
  handleAdd =()=> {
    const employees = [...this.state.employees]
    const id = this.input.value;
    const newEmployees = {id}
    this.setState({employees:[...employees,newEmployees],value:''})
  }

  addValue=(e)=>{
    this.setState({
      value:e.target.value
    })
  }

  onReturn =()=>{
    this.props.history.goBack();
  }

  render() {
    const props = {
      name: 'file',
      accept: '.xlsx, .xls',
      showUploadList: false,
      beforeUpload: (file, fileList) => {
        console.log(file, fileList);
        // const { files } = file.target;
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();
        fileReader.onload = event => {
          try {
            const { result } = event.target;
            // 以二进制流方式读取得到整份excel表格对象
            const workbook = XLSX.read(result, { type: 'binary' });
            let data = []; // 存储获取到的数据
            // 遍历每张工作表进行读取（这里默认只读取第一张表）
            for (const sheet in workbook.Sheets) {
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                // 利用 sheet_to_json 方法将 excel 转成 json 数据
                data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                // break; // 如果只取第一张表，就取消注释这行
              }
            }
            console.log(data);
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
            this.setState({
              employees: data
            })
            message.success('数据保存成功')
          } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            console.log('文件类型不正确', e);
            return;
          }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file);
      },
      onChange(info) {
        console.log(info)
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        // if (info.file.status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }

      },
    };
    return <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
      <div className={styles.container}>
      <Upload {...props}>
        <Button>
          <Icon type="upload" />读取过滤序号
        </Button>
      </Upload>

        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
         添加工号
        </Button>&emsp;&emsp;
        <input type="text" ref={input => this.input = input} onChange={this.addValue} value = {this.state.value}  placeholder="请输入添加工号"/>
        <Button onClick={this.onReturn} type="primary" style={{ left:500}}>
          返回
        </Button>
        <Table
        bordered
        pagination={{
          pageSize: 50
        }}
        scroll={{ y: 450}}
        dataSource={this.state.employees}
        rowKey={record => record.id}>
        <Column title="工号" key="id" dataIndex="id" width='25%'/>

        <Column title="操作" key="x" dataIndex="" render={
          (text, record) =>(<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete( record.id)}>
            <a>删除</a>
          </Popconfirm>)}
           />
      </Table>
    </div>
    </div>
  }
}

function mapStateToProps({ lottery }) {
  return {
    prizes: lottery.prizes
  }
}

export default DataPage;
