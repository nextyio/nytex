import React             from 'react';
import {Row, Col, Table} from 'antd'
import BasePage          from '../../page/StandardPage'
import ListProposal      from './listProposal'
import UserWallet        from './userWallet'
import VoteAbsorption    from './voteAbsorption'
import CreateProposal    from './createProposal'
import './style/index.scss'
import {useSelector}     from "react-redux";

const Preemptive = () => {
  const detailVote = useSelector(state => state.preemptive.detail_vote)

  return (
    <BasePage>
      <div className="preemptive">
        <div className="proposal">
          <div className="center">
            <h3 className="preemptive--header-2">Proposals</h3>
          </div>
          <Row>
            <Col lg={12}>
              <ListProposal/>
            </Col>
            <Col lg={12}>
              <UserWallet/>
            </Col>
          </Row>
        </div>
        {
          detailVote ?
          <div>
            <VoteAbsorption/>
          </div>
            :
          <div>
            <CreateProposal/>
          </div>
        }
      </div>
    </BasePage>
  )
}

export default Preemptive;
