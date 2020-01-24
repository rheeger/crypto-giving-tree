import React from "react";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import {
  selectOrg,
  createOrgClaim,
  fetchOrgs,
  createOrgAndContract,
  updateNCStatus
} from "../../store/actions";
import ClaimForm from "../../components/ClaimForm";
import Header from "../../components/Header";
import { orgContract } from "../../ethereum/org";

class Claim extends React.Component {
  state = {
    loading: false,
    ready: false
  };

  componentDidMount() {
    const { selectOrg, match, fetchOrgs } = this.props;
    selectOrg(match.params.ein);
    fetchOrgs();
  }

  setupOrg = async () => {
    const { org, match, fetchOrgs, createOrgAndContract } = this.props;
    await createOrgAndContract(match.params.ein, org.organization.name);
    await fetchOrgs();
  };

  onSubmit = async formValues => {
    const { createOrgClaim, web3, gtOrgs, match } = this.props;
    this.setState({ loading: true });
    await this.renderStatusChange(
      "Step 1 of 2: Awaiting Organization Claim...",
      "Please approve smart contract interaction.",
      "pending"
    );
    const org = orgContract(gtOrgs[match.params.ein].contractAddress);
    const id = await org.methods
      .claimRequest(
        formValues.orgAdminFirstName,
        formValues.orgAdminLastName,
        true,
        formValues.orgAdminEmail,
        web3.account
      )
      .send({ from: web3.account })
      .on("transactionHash", async transId => {
        await this.renderStatusChange(
          "Step 2 of 2: Submitting Organization Claim...",
          "Please do not refresh this page.",
          "pending"
        );
        console.log(transId);
        return transId;
      });
    const index = await org.methods.getClaimsCount().call();
    await createOrgClaim(formValues, id, index - 1, match.params.ein);
    await this.renderStatusChange(
      "Claim Submitted!",
      "Our staff will review your claim for approval.",
      "success"
    );
    this.setState({ loading: false });
  };

  renderClaimForm = () => {
    this.setState({ ready: true });
  };

  renderWhatsThis = () => {
    this.setState({ ready: false });
  };

  renderStatusChange = async (headline, message, status) => {
    const { updateNCStatus } = this.props;
    await updateNCStatus(headline, message, status);
    return;
  };

  render() {
    const { org, gtOrgs, match } = this.props;
    if (!org.organization || !gtOrgs) {
      return <div> Loading... </div>;
    }

    if (
      Object.keys(gtOrgs).length > 0 &&
      !gtOrgs[match.params.ein] &&
      this.state.ready
    ) {
      this.setupOrg();
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
              <p>Looks like nobody's reccomended a grant to: </p>
              <h3>{org.organization.name}</h3>
              <h6>
                Please wait, while we set up the organization's account. We'll
                process your organization claim next.
              </h6>
            </div>
          </div>
        </div>
      );
    }
    if (gtOrgs[match.params.ein] && this.state.ready) {
      return (
        <div>
          <Header />

          <div
            style={{
              margin: "0px auto",
              marginBottom: "5rem",
              textAlign: "left",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              width: "700px"
            }}
          >
            <div style={{ width: "600px" }}>
              <h4>Submit claim for: </h4>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>{org.organization.name}</h1>
                <div>
                  <Button
                    onClick={this.renderWhatsThis}
                    className="small ui button basic yellow"
                  >
                    What's this?
                  </Button>
                  <Link
                    to={`/orgs/${org.organization.ein}`}
                    className="small ui button basic green"
                  >
                    <i className="address card icon" />
                    Org Details
                  </Link>
                </div>
              </div>
              <p>Tax ID (EIN): {org.organization.ein}</p>
              <ClaimForm
                orgName={org.organization.name}
                onSubmit={this.onSubmit}
                loading={this.state.loading}
              />
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
            margin: "5rem auto",
            textAlign: "left",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            maxWidth: "350px"
          }}
        >
          <div>
            <h1>What is a Claim? </h1>
            <p>some things to know...</p>
            <h3>
              1. You can submit a claim if you represent the organization in
              question.
            </h3>
            <h3>
              2. Please provide an Ethereum wallet address and your contact
              information in order to submit a claim.
            </h3>
            <h3>
              3. The staff at &nbsp;
              <span
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "600",
                  fontSize: "1.5rem"
                }}
              >
                endaoment
              </span>
              &nbsp; will review the claim, and reach out to confirm your
              identity.
            </h3>
            <br />

            <Button
              onClick={this.renderClaimForm}
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
    org: state.org,
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    gtOrgs: state.gtOrgs
  };
};

export default connect(mapStateToProps, {
  selectOrg,
  createOrgClaim,
  fetchOrgs,
  createOrgAndContract,
  updateNCStatus
})(Claim);
