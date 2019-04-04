import React from 'react'
import AdminPage from '../BaseAdmin'

import '../admin.scss'
import './style.scss'

import { Col, Row, Breadcrumb, Icon, Input } from 'antd'
import RewardList from './List/Container'
import Navigator from '../shared/Navigator/Component'

export default class extends AdminPage {

    state = {
        usernameFilter: ''
    }

    async componentDidMount() {
        await super.componentDidMount()
        await this.props.getRewardList()
    }

    handleSearchUser(value) {
        this.setState({usernameFilter: value})
    }

    onChangeDatePicker(date, dateString) {
        this.props.getRewardList({
            startDate: dateString[0],
            endDate: dateString[1]
        })
    }

    ord_renderContent () {

        let list = this.props.list

        if (this.state.usernameFilter) {
            list = list.filter((item) => {
                let regExp = new RegExp(this.state.usernameFilter, 'i')

                return (
                    regExp.test(item.userId && item.userId.username) || regExp.test(item.walletAddress)
                )
            })
        }

        return (
            <div className="p_admin_index ebp-wrap">
                <div className="ebp-header-divider" />
                <div className="d_box">
                    <div className="p_admin_breadcrumb">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/">
                                <Icon type="home" />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>Admin</Breadcrumb.Item>
                            <Breadcrumb.Item>Rewards</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="p_admin_content">
                        <Row>
                            <Col span={4} className="admin-left-column wrap-box-navigator">
                                <Navigator selectedItem={'rewards'}/>
                            </Col>
                            <Col span={20} className="admin-right-column wrap-box-user">
                                {<div class="pull-right">
                                    <Input.Search onSearch={this.handleSearchUser.bind(this)}
                                                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                  placeholder="Search user"/>
                                </div>}
                                <div class="vert-gap-sm clearfix"/>
                                <RewardList onChangeDatePicker={this.onChangeDatePicker.bind(this)} list={list} loading={this.props.loading} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
