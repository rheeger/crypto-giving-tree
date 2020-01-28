import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchFunds } from "../store/actions/funds";
import { fetchDonations } from "../store/actions/donations";
import { fetchOrgs } from "../store/actions/orgs";
import { fetchUnapprovedGrants } from "../store/actions/grants";
import { fetchUnapprovedClaims } from "../store/actions/claims";
import { Grid, Table } from "semantic-ui-react";
import AdminDonationRow from "../components/tables/AdminDonationRow";
import history from "../history";
import AdminGrantRow from "../components/tables/AdminGrantRow";
import AdminClaimRow from "../components/tables/AdminClaimRow";
import NavHeader from "../components/Header";

class AdminPanel extends Component {
  componentDidMount = () => {
    const {
      fetchFunds,
      fetchDonations,
      fetchOrgs,
      fetchUnapprovedGrants,
      fetchUnapprovedClaims
    } = this.props;

    fetchUnapprovedGrants();
    fetchFunds();
    fetchDonations();
    fetchOrgs();
    fetchUnapprovedClaims();
  };

  onApproveSubmit = async () => {
    await this.props.fetchUnapprovedGrants();
  };

  renderGrantRow() {
    if (Object.keys(this.props.gtGrants).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          Nothing to approve.
        </div>
      );
    }

    return Object.values(this.props.gtGrants)
      .reverse()
      .map((grant, index) => {
        if (grant.grantApproval === false) {
          return (
            <AdminGrantRow
              key={grant.id}
              id={grant.id}
              recipient={grant.selectedOrg}
              amount={grant.grantAmount}
              date={grant.grantDate}
              description={grant.grantDescription}
              selectedFund={grant.selectedFund}
              grantIndex={grant.grantIndex}
              onSubmit={this.onApproveSubmit}
              gtFunds={this.props.gtFunds}
            />
          );
        } else {
          return (
            <div style={{ textAlign: "center", padding: "10px" }}>
              Nothing to approve.
            </div>
          );
        }
      });
  }

  renderClaimRow() {
    if (Object.keys(this.props.gtClaims).length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          Nothing to approve.
        </div>
      );
    }

    return Object.values(this.props.gtClaims).map((claim, index) => {
      if (!claim.claimApprovalDetails) {
        return null;
      }
      if (claim.claimApprovalDetails.claimApproval === false) {
        return (
          <AdminClaimRow
            key={claim.id}
            id={claim.id}
            selectedOrg={claim.selectedOrg}
            date={claim.claimDate}
            fname={claim.orgAdminFirstName}
            lname={claim.orgAdminLastName}
            contact={claim.orgAdminEmail}
            wallet={claim.orgAdminWallet}
            claimIndex={claim.claimIndex}
            onSubmit={this.onApproveSubmit}
            gtOrgs={this.props.gtOrgs}
          />
        );
      } else {
        return (
          <div style={{ textAlign: "center", padding: "10px" }}>
            Nothing to approve.
          </div>
        );
      }
    });
  }

  renderDonationRow() {
    return Object.values(this.props.gtDonations).map((donation, index) => {
      return (
        <AdminDonationRow
          from={donation.from}
          recipient={donation.to}
          finalTradeOutput={donation.finalTradeOutput}
          donationAmount={donation.inputAmount}
          inputCurrency={donation.inputCurrency}
          date={donation.donationDate}
          key={donation.id}
          id={donation.id}
          gtFunds={this.props.gtFunds}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    if (!this.props.gtFunds) {
      return <div> Loading... </div>;
    } else if (Object.values(this.props.gtFunds).length < 1) {
      return <div> Loading...</div>;
    } else if (!this.props.gtClaims) {
      return <div> Loading... </div>;
    } else if (Object.values(this.props.gtDonations).length < 1) {
      return <div> Loading... </div>;
    } else if (this.props.web3 === "null") {
      return <div> Loading... </div>;
    } else if (
      this.props.web3.account &&
      this.props.web3.account !== process.env.REACT_APP_GT_ADMIN
    ) {
      history.push("/");
    }

    return (
      <div>
        <NavHeader />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "900px" }}>
            <Grid className="Container">
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Admin Panel:</h3>
                  {/* {this.renderCards()} */}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Grants Awaiting Approval:</h3>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>Request Date</HeaderCell>
                        <HeaderCell>Issuing Fund</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>View</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Reject</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderGrantRow()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Claims Awaiting Approval:</h3>
                  <Table>
                    <Header>
                      <Row>
                        <HeaderCell>Request Date</HeaderCell>
                        <HeaderCell>Requesting Organization</HeaderCell>
                        <HeaderCell>Requesting Admin</HeaderCell>
                        <HeaderCell>Contact</HeaderCell>
                        <HeaderCell>View</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Reject</HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderClaimRow()}</Body>
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
                        <HeaderCell>To</HeaderCell>
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
    web3: state.web3connect,
    gtGrants: state.gtGrants,
    gtOrgs: state.gtOrgs,
    gtDonations: state.gtDonations,
    gtClaims: state.gtClaims
  };
};

export default connect(mapStateToProps, {
  fetchUnapprovedGrants,
  fetchFunds,
  fetchDonations,
  fetchOrgs,
  fetchUnapprovedClaims
})(AdminPanel);
