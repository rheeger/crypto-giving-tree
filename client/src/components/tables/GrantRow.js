import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { fetchOrg } from "../../store/actions/orgs";

class GrantRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: ""
  };

  componentDidMount() {
    const { fetchOrg, recipient } = this.props;
    fetchOrg(recipient);
  }
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
    const { id, recipient, amount, description, date, gtOrgs } = this.props;
    if (!gtOrgs[recipient]) {
      return <div>Loading...</div>;
    }
    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/orgs/${recipient}`}>{gtOrgs[recipient].name} </Link>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>${amount} </Table.Cell>
        <Table.Cell>{this.renderStatus()}</Table.Cell>
        <Table.Cell>
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
    gtOrgs: state.gtOrgs
  };
};

export default connect(mapStateToProps, { fetchOrg })(GrantRow);
