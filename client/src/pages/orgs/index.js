import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Button, Card } from "semantic-ui-react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { connect } from "react-redux";
import { searchOrgs, fetchOrgs } from "../../store/actions/orgs";
import { updateAppTab } from "../../store/actions/appTab";

class OrgIndex extends React.Component {
  componentDidMount() {
    this.props.searchOrgs(null);
    this.props.fetchOrgs();
    this.props.updateAppTab("orgs");
  }

  renderOrgs() {
    if (!this.props.orgs.organizations) {
      return <div style={{ textAlign: "center" }}> Loading... </div>;
    }

    if (this.props.orgs.organizations === "404") {
      return (
        <div style={{ textAlign: "center" }}>
          {" "}
          Oops! No results found... Try a different search{" "}
        </div>
      );
    }

    const items = this.props.orgs.organizations.map(index => {
      return {
        header: index.name,
        description: (
          <div>
            {index.city}, {index.state}
          </div>
        ),
        meta: <Card.Meta>TAX-ID: {index.strein}</Card.Meta>,
        extra: (
          <div>
            <Link to={`/orgs/${index.ein}`} className="ui two-buttons">
              <Button floated="right" basic color="green">
                <i className="address card icon" />
                org details
              </Button>
            </Link>
            <Link
              to={`/orgs/${index.ein}/grants/new`}
              className="ui two-buttons"
            >
              <Button floated="left" basic color="red">
                <i className="paper plane icon" />
                offer grant
              </Button>
            </Link>
          </div>
        )
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    const orgSearch = _.debounce(term => {
      this.props.searchOrgs(term);
    }, 800);

    const results = new Intl.NumberFormat("en-US").format(
      this.props.orgs.total_results
    );

    return (
      <div>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "900px" }}>
            <SearchBar onSearchTermChange={orgSearch} onSubmit={orgSearch} />
            <div style={{ margin: "0 auto", maxWidth: "80vw" }}>
              <p>Found {results} organizations</p>
              {this.renderOrgs()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { orgs: state.orgs };
};

export default connect(mapStateToProps, {
  searchOrgs,
  fetchOrgs,
  updateAppTab
})(OrgIndex);
