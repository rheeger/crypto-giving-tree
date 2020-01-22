import React from "react";
import { connect } from "react-redux";
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
import { object } from "prop-types";

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

    if (Object.keys(gtOrgs).length > 0 && !gtOrgs[match.params.ein]) {
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
                Please wait, while we set up an account. We'll process your
                organization claim next.
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
            margin: "0px auto",
            textAlign: "left",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            width: "700px"
          }}
        >
          <div style={{ width: "500px" }}>
            <h1>Submit claim for: {org.organization.name}</h1>
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
