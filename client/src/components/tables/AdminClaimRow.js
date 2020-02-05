import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button } from "semantic-ui-react";
import { approveClaim, deleteClaim } from "../../store/actions/claims";
import { claimOrg } from "../../store/actions/orgs";
import history from "../../history";
import Moment from "react-moment";
import { fetchOrg } from "../../store/actions/orgs";

class AdminGrantRow extends Component {
  state = {
    approveloading: false,
    rejectloading: false,
    errorMessage: "",
    orgName: this.props.selectedOrg
  };

  componentDidMount() {
    this.renderOrgName();
  }

  onApprove = async () => {
    const {
      approveClaim,
      id,
      claimIndex,
      gtOrgs,
      selectedOrg,
      claimOrg
    } = this.props;
    this.setState({ approveloading: true });
    await approveClaim(id, gtOrgs[selectedOrg].contractAddress, claimIndex);
    await claimOrg(selectedOrg, id);
    this.setState({ approveloading: false });
    this.props.onSubmit();
  };

  onReject = async () => {
    const { deleteClaim, id } = this.props;
    this.setState({ rejectloading: true });
    await deleteClaim(id);
    this.setState({ rejectloading: false });
    history.push("/admin");
  };

  renderOrgName() {
    const { gtOrgs, selectedOrg } = this.props;
    return Object.values(gtOrgs).map((gtOrgs, key) => {
      if (selectedOrg === gtOrgs.id) {
        return this.setState({ orgName: gtOrgs.name });
      } else return null;
    });
  }

  render() {
    const {
      id,
      selectedOrg,
      contact,
      fname,
      lname,
      wallet,
      date,
      gtOrgs
    } = this.props;
    if (!gtOrgs[selectedOrg]) {
      return <div>Loading...</div>;
    }

    return (
      <Table.Row>
        <Table.Cell singleLine>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/orgs/${selectedOrg}`}>
            {gtOrgs[selectedOrg].name} (EIN: {selectedOrg})
          </Link>
        </Table.Cell>
        <Table.Cell singleLine>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/address/${wallet}`}
          >{`${fname} ${lname}`}</a>
        </Table.Cell>
        <Table.Cell>
          <a href={`mailto:${contact}`}>{contact}</a>
        </Table.Cell>
        <Table.Cell>
          <Button.Group>
            <Button
              loading={this.state.approveloading}
              onClick={this.onApprove}
              color="green"
              compact
            >
              Approve
            </Button>
            <Button.Or />
            <Button
              loading={this.state.rejectloading}
              onClick={this.onReject}
              color="red"
              compact
            >
              Reject
            </Button>
          </Button.Group>
        </Table.Cell>
        <Table.Cell singleLine>
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

export default connect(mapStateToProps, {
  approveClaim,
  deleteClaim,
  fetchOrg,
  claimOrg
})(AdminGrantRow);
