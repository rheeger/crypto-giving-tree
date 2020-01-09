import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Button } from "semantic-ui-react";
import { approveGrant, deleteGrant } from "../../store/actions";
import history from "../../history";
import Moment from "react-moment";
import { fetchOrg } from "../../store/actions";

class AdminGrantRow extends Component {
  state = {
    approveloading: false,
    rejectloading: false,
    errorMessage: "",
    treeName: this.props.selectedTree
  };

  componentDidMount() {
    this.renderTreeName();
  }
  onApprove = async () => {
    const { approveGrant, id, grantIndex, selectedTree } = this.props;
    this.setState({ approveloading: true });
    await approveGrant(id, selectedTree, grantIndex);
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

  renderTreeName() {
    const { gtTrees, selectedTree } = this.props;
    return Object.values(gtTrees).map((gtTrees, key) => {
      if (selectedTree === gtTrees.id) {
        console.log("match found");
        return this.setState({ treeName: gtTrees.branchName });
      }
    });
  }

  render() {
    const {
      id,
      selectedTree,
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
          <Link to={`/trees/${selectedTree}`}>{this.state.treeName}</Link>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/orgs/${recipient}`}>
            {gtOrgs[recipient].name} (EIN: {recipient})
          </Link>
        </Table.Cell>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>${amount}</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/tx/${id}`}
            target="blank"
          >
            <Button color="blue" basic>
              View on Etherscan
            </Button>
          </a>
        </Table.Cell>
        <Table.Cell>
          <Button
            loading={this.state.approveloading}
            onClick={this.onApprove}
            color="green"
            basic
          >
            Approve
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            loading={this.state.rejectloading}
            onClick={this.onReject}
            color="red"
            basic
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
