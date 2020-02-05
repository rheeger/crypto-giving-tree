import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchFunds } from "../store/actions/funds";
import { fetchDonations } from "../store/actions/donations";
import { fetchOrgs } from "../store/actions/orgs";
import { fetchUnapprovedGrants } from "../store/actions/grants";
import { fetchUnapprovedClaims } from "../store/actions/claims";
import { Grid, Table, Menu } from "semantic-ui-react";
import AdminDonationRow from "../components/tables/AdminDonationRow";
import history from "../history";
import AdminGrantRow from "../components/tables/AdminGrantRow";
import AdminClaimRow from "../components/tables/AdminClaimRow";
import NavHeader from "../components/Header";

class AdminPanel extends Component {
  state = {
    currentPage: 1,
    itemsPerPage: 10
  };

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
              grantApproval={grant.grantApproval}
              approvalDetails={grant.approvalDetails}
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

    return Object.values(this.props.gtClaims)
      .reverse()
      .map((claim, index) => {
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

  renderDonationsPaginationItems() {
    const { Header, Row, HeaderCell, Body } = Table;
    const { currentPage, itemsPerPage } = this.state;

    // Logic for displaying items
    const indexOfLastTodo = currentPage * itemsPerPage;
    const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
    const currentDonations = Object.values(this.props.gtDonations)
      .reverse()
      .slice(indexOfFirstTodo, indexOfLastTodo);

    const renderDonations = currentDonations.map((donation, index) => {
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
          transStatus={donation.transStatus}
        />
      );
    });

    // Logic for displaying page numbers

    const handleClick = event => {
      this.setState({
        currentPage: Number(event.target.id)
      });
    };

    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(Object.keys(this.props.gtDonations).length / itemsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <Menu.Item key={number} id={number} onClick={handleClick}>
          {number}
        </Menu.Item>
      );
    });

    return (
      <Table width={16}>
        <Header>
          <Row>
            <HeaderCell>Donation Date</HeaderCell>
            <HeaderCell>From</HeaderCell>
            <HeaderCell>To</HeaderCell>
            <HeaderCell>Donated</HeaderCell>
            <HeaderCell>Proceeds</HeaderCell>
            <HeaderCell textAlign="center">Status</HeaderCell>
            <HeaderCell></HeaderCell>
          </Row>
        </Header>
        <Body>{renderDonations}</Body>
        <Table.Footer textAlign="center">
          <Table.Row>
            <Table.HeaderCell colSpan="16">
              <Menu floated="right" pagination>
                {renderPageNumbers}
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    if (!this.props.gtFunds) {
      return (
        <div>
          <NavHeader /> Loading...{" "}
        </div>
      );
    } else if (Object.values(this.props.gtFunds).length < 1) {
      return (
        <div>
          <NavHeader /> Loading...
        </div>
      );
    } else if (!this.props.gtClaims) {
      return (
        <div>
          <NavHeader /> Loading...{" "}
        </div>
      );
    } else if (Object.values(this.props.gtDonations).length < 1) {
      return (
        <div>
          <NavHeader /> Loading...{" "}
        </div>
      );
    } else if (this.props.web3 === "null") {
      return (
        <div>
          <NavHeader /> Loading...{" "}
        </div>
      );
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
          <div style={{ maxWidth: "90%" }}>
            <Grid className="Container">
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Admin Panel:</h3>
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
                        <HeaderCell textAlign="center">Status</HeaderCell>
                        <HeaderCell></HeaderCell>
                        <HeaderCell></HeaderCell>
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
                        <HeaderCell singleLine>Requesting Admin</HeaderCell>
                        <HeaderCell>Contact</HeaderCell>
                        <HeaderCell textAlign="center">Status</HeaderCell>
                        <HeaderCell></HeaderCell>
                      </Row>
                    </Header>
                    <Body>{this.renderClaimRow()}</Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <h3>Recieved Donations:</h3>
                  {this.renderDonationsPaginationItems()}
                </Grid.Column>
              </Grid.Row>
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
