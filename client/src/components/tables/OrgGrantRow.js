import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { fetchFund } from "../../store/actions/funds";
import { connect } from "react-redux";

class OrgGrantRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: ""
  };

  renderStatus() {
    const { grantApproval, approvalDetails } = this.props;
    if (grantApproval === "false" && approvalDetails !== {}) {
      return (
        <div>
          <i className="times circle icon red"></i>; Rejected
        </div>
      );
    }

    if (grantApproval === true) {
      return (
        <div>
          <i className="check circle icon green"></i> Completed
        </div>
      );
    }
    if (grantApproval === false) {
      return (
        <div>
          <i className="clock icon yellow"></i> In Review
        </div>
      );
    }
  }

  render() {
    const { id, fund, amount, description, date, gtFunds } = this.props;

    return (
      <Table.Row>
        <Table.Cell singleLine>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/funds/${fund}`}>
            {gtFunds[fund]
              ? gtFunds[fund].branchName
              : fund.slice(0, 6) + "..." + fund.slice(-6)}
          </Link>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>${amount} </Table.Cell>
        <Table.Cell singleLine>{this.renderStatus()}</Table.Cell>
        <Table.Cell singleLine textAlign="center">
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/tx/${id}`}
            target="blank"
          >
            <Button compact>
              <i className="external alternarte icon" />
              View on Etherscan
            </Button>
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }
}
const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds
  };
};

export default connect(mapStateToProps, { fetchFund })(OrgGrantRow);
