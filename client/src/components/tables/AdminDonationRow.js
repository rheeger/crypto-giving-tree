import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

class AdminDonationRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: "",
    donorName: "Unknown Donor",
    treeName: this.props.recipient
  };

  componentDidMount() {
    this.renderDonorName();
    this.renderTreeName();
  }

  renderDonorName() {
    const { gtTrees, from } = this.props;
    return Object.values(gtTrees).map((gtTrees, key) => {
      if (from === gtTrees.managerAddress) {
        return this.setState({
          donorName: `${gtTrees.primaryAdvisorFirstName} ${gtTrees.primaryAdvisorLastName}`
        });
      } else {
        return this.props.recipient;
      }
    });
  }

  renderTreeName() {
    const { gtTrees, recipient } = this.props;
    return Object.values(gtTrees).map((gtTrees, key) => {
      if (recipient === gtTrees.id) {
        return this.setState({ treeName: gtTrees.branchName });
      }
    });
  }

  render() {
    const {
      id,
      finalTradeOutput,
      donationAmount,
      inputCurrency,
      date,
      recipient
    } = this.props;

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>{this.state.donorName}</Table.Cell>
        <Table.Cell>
          <Link to={`/trees/${recipient}`}>{this.state.treeName}</Link>
        </Table.Cell>
        <Table.Cell>
          {donationAmount} {inputCurrency}
        </Table.Cell>
        <Table.Cell>${finalTradeOutput}</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}.etherscan.io/tx/${id}`}
            target="blank"
          >
            <Button color="green" basic>
              View on Etherscan
            </Button>
          </a>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default AdminDonationRow;
