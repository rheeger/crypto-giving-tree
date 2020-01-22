import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  createGrant,
  selectOrg,
  fetchOrgs,
  createOrgAndContract,
  updateNCStatus
} from "../../../store/actions";
import GrantForm from "../../../components/GrantForm";
import Header from "../../../components/Header";
import { fundContract } from "../../../ethereum/fund";
import { BigNumber as BN } from "bignumber.js";

class NewGrant extends React.Component {
  state = {
    ready: "false",
    loading: false
  };

  componentDidMount = async () => {
    const { selectOrg, fetchOrgs, match } = this.props;
    this.setState({ ready: "false" });
    selectOrg(match.params.ein);
    fetchOrgs();
  };

  setupOrg = async id => {
    await this.props.createOrgAndContract(id, this.props.org.organization.name);
    await this.props.fetchOrgs();
  };

  onSubmit = async formValues => {
    const { match, web3, gtOrgs, createGrant } = this.props;
    this.setState({ loading: true });
    await this.renderStatusChange(
      "Step 1 of 2: Awaiting Submission...",
      "Please confirm smart contract interaction.",
      "pending"
    );
    const fund = fundContract(formValues.selectedFund.id);

    const id = await fund.methods
      .createGrant(
        formValues.grantDescription,
        BN(formValues.grantAmount)
          .multipliedBy(10 ** process.env.REACT_APP_STABLECOIN_DECIMALS)
          .toFixed(),
        gtOrgs[match.params.ein].contractAddress
      )
      .send({ from: web3.account })
      .on("transactionHash", async tx => {
        const heading = "Step 2 of 2: Submitting Grant...";
        const message = "Please do not refresh this page.";
        const status = "pending";
        await this.renderStatusChange(heading, message, status);
        console.log(tx);
      });
    const index = await fund.methods.getGrantsCount().call();
    await createGrant(formValues, id.transactionHash, match.params.ein, index);
    await this.renderStatusChange(
      "Reccomendation Submitted!",
      "Our staff will review your grant for approval.",
      "success"
    );
    this.setState({ loading: false });
  };

  renderBranchForm = () => {
    this.setState({ ready: "true" });
  };

  renderWhatsThis = () => {
    this.setState({ ready: "false" });
  };

  renderStatusChange = async (headline, message, status) => {
    const { updateNCStatus } = this.props;
    await updateNCStatus(headline, message, status);
    return;
  };

  render() {
    if (!this.props.org.organization || !this.props.gtOrgs) {
      return (
        <div>
          <Header />

          <div>Loading Organization Details</div>
        </div>
      );
    }

    if (
      this.state.ready === "true" &&
      this.props.gtOrgs[`${this.props.match.params.ein}`]
    ) {
      return (
        <div>
          <Header />
          <div
            className="ui container"
            style={{ display: "flex-flow", justifyContent: "center" }}
          >
            <div
              style={{ padding: "1rem", marginBottom: "1rem", width: "600px" }}
            >
              <h4>You're reccomending a grant to:</h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>{this.props.org.organization.name}</h1>
                <div>
                  <Button
                    onClick={this.renderWhatsThis}
                    className="ui button basic yellow"
                  >
                    What's this?
                  </Button>
                  <Link
                    to={`/orgs/${this.props.org.organization.ein}`}
                    className="ui button basic green"
                  >
                    <i className="address card icon" />
                    Org Details
                  </Link>
                </div>
              </div>

              <GrantForm
                onSubmit={this.onSubmit}
                loading={this.state.loading}
                gtFunds={this.props.gtFunds}
              />
            </div>
          </div>
        </div>
      );
    }

    if (
      (this.state.ready === "true" &&
        this.props.gtOrgs &&
        !this.props.gtOrgs[`${this.props.match.params.ein}`]) ||
      (this.state.loading === true &&
        this.props.gtOrgs[`${this.props.match.params.ein}`] === undefined)
    ) {
      this.setupOrg(this.props.match.params.ein);
      return (
        <div>
          <Header />
          <div className="ui container">
            <div
              style={{
                textAlign: "center",
                display: "flex-flow",
                alignContent: "center"
              }}
            >
              <h1>Hang tight!</h1>
              <p>Looks like you'll be the first to reccomend a grant to: </p>
              <h3>{this.props.org.organization.name}</h3>
              <h6>
                We're setting up their account. We'll process your grant
                reccomendation next.
              </h6>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <div
          style={{
            margin: "75px auto",
            textAlign: "left",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "40vh",
            maxWidth: "350px"
          }}
        >
          <div>
            <h1>What is a Grant? </h1>
            <p>some things to know...</p>
            <h3>
              1. Each grant represents an reccomendation for your Fund to make a
              donation to an organziation.
            </h3>
            <h3>
              2. Set an amount you'd like to grant and provide a short
              description memo, if desired.
            </h3>
            <h3>
              3. The staff at &nbsp;
              <span
                style={{ fontFamily: "all-round-gothic", fontSize: "1.5rem" }}
              >
                endaoment
              </span>
              &nbsp; will review the grant, notify the organization and finalize
              distribution.
            </h3>
            <br />

            <Button
              onClick={this.renderBranchForm}
              floated="left"
              className="ui button basic green"
            >
              Got It!
            </Button>
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
    org: state.org,
    gtOrgs: state.gtOrgs
  };
};

export default connect(mapStateToProps, {
  selectOrg,
  fetchOrgs,
  createOrgAndContract,
  createGrant,
  updateNCStatus
})(NewGrant);
