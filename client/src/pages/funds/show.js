import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchFund,
  fetchFundDAIBalance,
  fetchFundGrants,
  fetchOrgs,
  fetchGrantableDAIBalance,
  fetchFundDonations
} from "../../store/actions";
import { Card, Grid, Table } from "semantic-ui-react";
import ContributionForm from "../../components/ContributionForm";
import GrantRow from "../../components/tables/GrantRow";
import DonationRow from "../../components/tables/DonationRow";
import NavHeader from "../../components/Header";
import moment from "moment";

class FundShow extends Component {
  componentDidMount = () => {
    const {
      fetchFundDAIBalance,
      match,
      fetchFundGrants,
      fetchOrgs,
      fetchGrantableDAIBalance,
      fetchFundDonations
    } = this.props;

    fetchFundDAIBalance(match.params.address);
    fetchGrantableDAIBalance(match.params.address);
    fetchFundDonations(match.params.address);
    fetchFundGrants(match.params.address);
    fetchOrgs();
  };

  renderGrantRow() {
    if (Object.keys(this.props.gtGrants).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          No grants reccommended, yet. &nbsp;
          <Link
            to="/orgs"
            style={{ marginLeft: "1rem" }}
            className="ui button basic blue"
          >
            <i className="sistrix medium icon" />
            Organizations
          </Link>
        </div>
      );
    }
    return Object.values(this.props.gtGrants)
      .reverse()
      .map((grant, key) => {
        if (grant.selectedFund === this.props.match.params.address) {
          return (
            <GrantRow
              key={key}
              id={grant.id}
              recipient={grant.selectedOrg}
              amount={grant.grantAmount}
              date={grant.grantDate}
              description={grant.grantDescription}
            />
          );
        } else {
          return (
            <div style={{ textAlign: "center", padding: "10px" }}>
              No grants reccommended.
            </div>
          );
        }
      });
  }

  renderDonationRow() {
    if (Object.keys(this.props.gtDonations).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          No token donations received.
        </div>
      );
    }
    return Object.values(this.props.gtDonations)
      .reverse()
      .map((donation, key) => {
        if (donation.to === this.props.match.params.address) {
          return (
            <DonationRow
              from={donation.from}
              finalTradeOutput={donation.finalTradeOutput}
              donationAmount={donation.inputAmount}
              inputCurrency={donation.inputCurrency}
              date={donation.donationDate}
              key={key}
              id={donation.id}
            />
          );
        } else {
          return (
            <div style={{ textAlign: "center", padding: "10px" }}>
              No token donations received.
            </div>
          );
        }
      });
  }

  renderCards() {
    const {
      id,
      branchName,
      datePlanted,
      managerAddress,
      primaryAdvisorFirstName,
      primaryAdvisorLastName,
      primaryAdvisorEmail,
      primaryAdvisorAddress,
      primaryAdvisorCity,
      primaryAdvisorState,
      primaryAdvisorZip,
      fundDAI,
      grantableDAI
    } = this.props.gtFunds[this.props.match.params.address];

    const items = [
      {
        style: { overflowWrap: "break-word" },
        header: branchName,
        meta: "Created: " + moment(datePlanted).format("MM/DD/YY h:mma"),
        description: "Address: " + id,
        fluid: true
      },
      {
        style: { overflowWrap: "break-word" },
        header: "$" + fundDAI,
        meta: "Fund Balance",
        description: "Available to Grant: $" + grantableDAI
      },
      {
        style: { overflowWrap: "break-word" },
        header: primaryAdvisorFirstName + " " + primaryAdvisorLastName,
        meta: "Primary Advisor",
        description: "Managing Wallet: " + managerAddress
      },
      {
        style: { overflowWrap: "break-word" },
        header: primaryAdvisorAddress,
        meta:
          primaryAdvisorCity +
          ", " +
          primaryAdvisorState +
          " " +
          primaryAdvisorZip,
        description: "e-Mail: " + primaryAdvisorEmail
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    if (Object.keys(this.props.gtFunds).length < 1) {
      return (
        <div>
          <NavHeader />
          Loading...{" "}
        </div>
      );
    }

    if (!this.props.gtFunds[this.props.match.params.address]) {
      return (
        <div>
          <NavHeader />
          <div className="ui container">
            <div
              style={{
                textAlign: "center",
                display: "flex-flow",
                alignContent: "center"
              }}
            >
              <h1>Oops!</h1>
              <h3>
                Looks like this isn't your Fund. Please choose a different Fund
                or start a new one.
              </h3>
              <br></br>
              <div>
                <Link to={`/funds/new`} className="ui button basic green">
                  <i className="plus circle icon" />
                  New Fund
                </Link>
                <Link to={`/funds`} className="ui button basic green">
                  <i className="eye icon" />
                  My Funds
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <NavHeader />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "900px" }}>
            <Grid className="Container">
              <Grid.Row>
                <Grid.Column width={10}>
                  <h3>Fund details:</h3>
                  {this.renderCards()}
                </Grid.Column>

                <Grid.Column width={6}>
                  <h3>
                    Donate to{" "}
                    {
                      this.props.gtFunds[this.props.match.params.address]
                        .branchName
                    }
                    :
                  </h3>
                  <ContributionForm
                    recievingFund={this.props.match.params.address}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Extended Grants:</h3>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>Request Date</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderGrantRow()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Recieved Donations:</h3>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>Donation Date</HeaderCell>
                        <HeaderCell>From</HeaderCell>
                        <HeaderCell>Property Donated</HeaderCell>
                        <HeaderCell>Exchanged Amount</HeaderCell>
                        <HeaderCell>Status</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderDonationRow()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
              {/* 
					<Link route={`/funds/${this.props.address}/grants`}>
						<a>
							<Button primary>View Grants</Button>
						</a>
					</Link>
					<Link route={`/`}>
						<a>
							<Button secondary>See All</Button>
						</a>
					</Link> */}
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds,
    web3: state.web3connect.web3,
    gtGrants: state.gtGrants,
    gtOrgs: state.gtOrgs,
    gtDonations: state.gtDonations
  };
};

export default connect(mapStateToProps, {
  fetchFundDAIBalance,
  fetchFund,
  fetchFundGrants,
  fetchOrgs,
  fetchGrantableDAIBalance,
  fetchFundDonations
})(FundShow);
