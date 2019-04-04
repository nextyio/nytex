import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Form, Modal, Select, Input, Button, Cascader } from 'antd'
import config from '@/config'
import I18N from '@/I18N'
import CommunityService from '@/service/CommunityService'

const FormItem = Form.Item

export default Form.create()(
    class C extends BaseComponent {
        state = {
            communityTrees: []
        }

        componentDidMount () {
            this.getCommunityTrees()
        }

        getCommunityTrees () {
            this.getAllCommunities().then((communityTrees) => {
                this.setState({
                    communityTrees
                })
            })
        }


        async getAllCommunities() {
            const communityService = new CommunityService()

            return new Promise((resolve, reject) => {
                communityService.getAll().then((data) => {
                    const cascaderItems =  data.map((item) => {
                        return {
                            value: item._id,
                            label: item.name,
                            parentId: item.parentCommunityId,
                        }
                    })

                    const rootCascaderItems = _.filter(cascaderItems, {
                        parentId: null
                    })

                    rootCascaderItems.forEach((rootCascaderItem) => {
                        const children = _.filter(cascaderItems, {
                            parentId: rootCascaderItem.value
                        })

                        if (children && children.length) {
                            rootCascaderItem.children = children
                        }
                    })

                    resolve(rootCascaderItems)
                }).catch((err) => {
                    reject(err)
                })
            })
        }

        ord_render () {
            const {visible, onCancel, onCreate, form} = this.props
            const {getFieldDecorator} = form
            const formItemLayout = {
                labelCol: {span: 6},
                wrapperCol: {span: 18}
            }

            const footerModal = (
                <div>
                    <Button onClick={onCreate} className="ant-btn-ebp" type="primary">{I18N.get('social.joincommunity.button.join')}</Button>
                    <Button onClick={onCancel}>{I18N.get('social.joincommunity.button.cancel')}</Button>
                </div>
            )

            const community_fn = getFieldDecorator('community', {
                initialValue: [],
                rules: [{required: true, message: I18N.get('social.joincommunity.community.required')}]
            })
            const community_el = (
                <Cascader options={this.state.communityTrees} placeholder="" changeOnSelect/>
            )

            return (
                <Modal
                    visible={visible}
                    title={I18N.get('social.joincommunity.button.join')}
                    footer={footerModal}
                    okText="Create"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="Community">
                            {community_fn(community_el)}
                        </FormItem>
                    </Form>
                </Modal>
            )
        }
    },
)
