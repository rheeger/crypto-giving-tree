import React, { Component } from "react";
import history from "../../history";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button } from "semantic-ui-react";
import { approveGrant, deleteGrant } from "../../store/actions/grants";
import { fetchOrg } from "../../store/actions/orgs";

class AdminGrantRow extends Component {
  state = {
    approveloading: false,
    rejectloading: false,
    errorMessage: "",
    fundName: this.props.selectedFund
  };

  componentDidMount() {
    this.renderFundName();
  }
  onApprove = async () => {
    const { approveGrant, id, grantIndex, selectedFund } = this.props;
    this.setState({ approveloading: true });
    await approveGrant(id, selectedFund, grantIndex);
    this.setState({ approveloading: false });
    this.props.onSubmit();
    history.push("/admin");
  };

  onReject = async () => {
    const { deleteGrant, id } = this.props;
    this.setState({ rejectloading: true });
    await deleteGrant(id);
    this.setState({ rejectloading: false });
    history.push("/admin");
  };

  renderFundName() {
    const { gtFunds, selectedFund } = this.props;
    return Object.values(gtFunds).map((gtFunds, key) => {
      if (selectedFund === gtFunds.id) {
        return this.setState({ fundName: gtFunds.branchName });
      } else return null;
    });
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
    const {
      id,
      selectedFund,
      recipient,
      amount,
      description,
      date,
      gtOrgs
    } = this.props;
    if (!gtOrgs[recipient]) {
      return <div>Loading...</div>;
    }

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/funds/${selectedFund}`}>{this.state.fundName}</Link>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/orgs/${recipient}`}>
            {gtOrgs[recipient].name} (EIN: {recipient})
          </Link>
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
        <Table.Cell>
          <Button
            loading={this.state.approveloading}
            onClick={this.onApprove}
            color="green"
            compact
          >
            Approve
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            loading={this.state.rejectloading}
            onClick={this.onReject}
            color="red"
            compact
          >
            Reject
          </Button>
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

export default connect(mapStateToProps, {
  approveGrant,
  deleteGrant,
  fetchOrg
})(AdminGrantRow);
