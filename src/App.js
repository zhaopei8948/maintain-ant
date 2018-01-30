import React, { Component } from 'react';
import { Button,
         List,
         Modal,
         Card,
         Toast,
         WhiteSpace,
         InputItem,
         Icon } from 'antd-mobile';
import styles from './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invtNo: '', orderNo: '',
      distNo: '', showModal: false,
      modalContent: <div>1</div>
    };
  }

  onClose = key =>() => {
    this.setState({
      [key]: false
    });
  }

  onShow = key => () => {
    //e.preventDefault();
    this.setState({
      [key]: true
    });
  }

  handleChange = type => (text) => {
    console.log('text is = [' + text + '] type = [' + type + ']');
    this.setState({[type]: text});
  }

  handleSubmit = type => (e) => {
    console.log("submit form type=" + type);
    let arr = [];
    let url = '';
    let method = '';
    let paramArr = [];
    if ('v' === type) {
      url = 'https://171.12.5.86:38080/api/v1/invts/getInvtDetail';
      method = 'get';
    } else {
      url = 'https://171.12.5.86:38080/api/v1/invts/reissue';
      method = 'post';
    }
    let formData = new FormData();
    let {invtNo, orderNo, distNo} = this.state;
    if (0 === invtNo.length && 0 === orderNo.length
        && 0 === distNo.length) {
      Toast.offline('三个值不能都为空，至少一个有值!');
      return;
    }
    formData.append('invtNo', invtNo);
    formData.append('orderNo', orderNo);
    formData.append('distNo', distNo);
    paramArr.push('invtNo=' + invtNo);
    paramArr.push('orderNo=' + orderNo);
    paramArr.push('distNo=' + distNo);
    if ('v' === type) {
      url += '?' + paramArr.join('&');
    }

    fetch(url, {
      method: method,
      body: ('v' === type) ? null : paramArr.join('&'),
      headers: ('v' === type) ? {} : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response) => {
      console.log('response.ok=[' + response.ok + ']');
      if (response.ok) {
        return response.json();
      } else {
        Toast.fail('请求失败!');
      }
    }).then((data) => {
      console.log('data=[' + JSON.stringify(data) + ']');
      if ('v' === type) {
        data.map((obj) => {
          arr.push(
              <Card key={obj.copNo}>
              <Card.Header title={obj.invtNo} />
              <Card.Body>
              <div>订单号: {obj.orderNo}<WhiteSpace/>
              内部编号: {obj.copNo}<WhiteSpace/>
              状态: {obj.appStatus}<WhiteSpace/>
              海关状态: {obj.cusStatus}
              </div>
              </Card.Body>
              </Card>
          );
        });
        this.setState({
          modalContent: <div>{arr}</div>
        });
        this.onShow('showModal')();
      } else {
        Toast.success('补发成功' + data.reissueAmount + '个');
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className={styles.App}>
        <div className={styles['App-header']}>
          <Icon type="success" size="lg"/>
          <div style={{ width: 60, height:60 }}></div>
          <h2>Welcome to React</h2>
        </div>
        <p className={styles['App-intro']}>
          补发清单及查看清单状态
        </p>
        <Modal
            visible={this.state.showModal}
            closable={true}
            transparent
            maskClosable={false}
            onClose={this.onClose('showModal')}
            title='清单详情'
            footer={[{ text: '确定', onPress: () => { console.log('ok'); this.onClose('showModal')(); } }]}
        >
            {this.state.modalContent}
        </Modal>
        <List renderHeader={() => ''}>
            <InputItem clear placeholder="清单号"
                onChange={this.handleChange('invtNo')}
                value={this.state.invtNo}
            >清单号</InputItem><WhiteSpace/>
            <InputItem clear placeholder="订单号"
                onChange={this.handleChange('orderNo')}
                value={this.state.orderNo}
            >订单号</InputItem><WhiteSpace/>
            <InputItem clear placeholder="核放单号"
                onChange={this.handleChange('distNo')}
                value={this.state.distNo}
            >核放单号</InputItem><WhiteSpace/>
            <Button type="primary" onClick={this.handleSubmit('s')}>
            补发</Button><WhiteSpace/>
            <Button type="primary" onClick={this.handleSubmit('v')}>
            查看清单状态</Button><WhiteSpace/>
        </List>
      </div>
    );
  }
}

export default App;
