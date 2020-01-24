import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import Moment from "react-moment";
import { connect } from "react-redux";

class DonationRow extends Component {
  state = {
    approveloading: false,
    finalizeloading: false,
    errorMessage: "",
    donorName: ""
  };

  componentDidMount() {
    this.renderDonorName();
  }

  renderDonorName() {
    const { gtFunds, from } = this.props;

    return Object.values(gtFunds).map((gtFunds, key) => {
      if (from === gtFunds.managerAddress) {
        return this.setState({
          donorName: `${gtFunds.primaryAdvisorFirstName} ${gtFunds.primaryAdvisorLastName}`
        });
      } else {
        return this.setState({ donorName: "Unknown Donor" });
      }
    });
  }

  render() {
    const {
      id,
      finalTradeOutput,
      donationAmount,
      inputCurrency,
      date
    } = this.props;

    return (
      <Table.Row>
        <Table.Cell>
          <Moment>{date}</Moment>
        </Table.Cell>
        <Table.Cell>{this.state.donorName}</Table.Cell>
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

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds
  };
};

export default connect(mapStateToProps, {})(DonationRow);
