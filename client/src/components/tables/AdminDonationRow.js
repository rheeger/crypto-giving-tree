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
    fundName: this.props.recipient
  };

  componentDidMount() {
    this.renderDonorName();
    this.renderFundName();
  }

  renderDonorName() {
    const { gtFunds, from } = this.props;
    return Object.values(gtFunds).map((gtFunds, key) => {
      if (from === gtFunds.managerAddress) {
        return this.setState({
          donorName: `${gtFunds.primaryAdvisorFirstName} ${gtFunds.primaryAdvisorLastName}`
        });
      } else {
        return this.props.recipient;
      }
    });
  }

  renderFundName() {
    const { gtFunds, recipient } = this.props;
    return Object.values(gtFunds).map((gtFunds, key) => {
      if (recipient === gtFunds.id) {
        return this.setState({ fundName: gtFunds.branchName });
      } else return null;
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
          <Link to={`/funds/${recipient}`}>{this.state.fundName}</Link>
        </Table.Cell>
        <Table.Cell>
          {donationAmount} {inputCurrency}
        </Table.Cell>
        <Table.Cell>${finalTradeOutput}</Table.Cell>
        <Table.Cell>
          <a
            href={`http://${process.env.REACT_APP_ETHERSCAN_PREFIX}etherscan.io/tx/${id}`}
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
