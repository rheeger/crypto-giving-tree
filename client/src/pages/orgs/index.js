import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Button, Card, Menu } from "semantic-ui-react";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { connect } from "react-redux";
import { searchOrgs, fetchOrgs } from "../../store/actions/orgs";

class OrgIndex extends React.Component {
  state = {
    currentPage: 1,
    itemsPerPage: 15
  };

  componentDidMount() {
    this.props.searchOrgs(null);
    this.props.fetchOrgs();
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

    const results = new Intl.NumberFormat("en-US").format(
      this.props.orgs.total_results
    );

    const { currentPage, itemsPerPage } = this.state;

    // Logic for displaying items
    const indexOfLastOrg = currentPage * itemsPerPage;
    const indexOfFirstOrg = indexOfLastOrg - itemsPerPage;
    const currentOrganizations = Object.values(
      this.props.orgs.organizations
    ).slice(indexOfFirstOrg, indexOfLastOrg);

    const renderItems = currentOrganizations.map(index => {
      return {
        header: index.name,
        description: (
          <div>
            {index.city}, {index.state}
          </div>
        ),
        meta: <Card.Meta>TAX-ID: {index.strein}</Card.Meta>,
        extra: (
          <div
            style={{
              dlisplay: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Link
              style={{ marginLeft: ".4rem" }}
              to={`/orgs/${index.ein}/grants/new`}
            >
              <Button compact color="green">
                <i className="paper plane icon" />
                Offer Grant
              </Button>
            </Link>
            <Link to={`/orgs/${index.ein}`}>
              <Button compact color="blue">
                <i className="address card icon" />
                Org Details
              </Button>
            </Link>
          </div>
        )
      };
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
      i <=
      Math.ceil(
        Object.keys(this.props.orgs.organizations).length / itemsPerPage
      );
      i++
    ) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <Menu.Item
          key={number}
          id={number}
          onClick={handleClick}
          active={this.state.currentPage === number ? true : false}
        >
          {number}
        </Menu.Item>
      );
    });

    return (
      <div style={{ marginBottom: "5rem" }}>
        <Card.Group items={renderItems} />
        <Menu>
          {renderPageNumbers}
          <Menu.Item position="right">Found {results} organizations</Menu.Item>
        </Menu>
      </div>
    );
  }

  render() {
    const orgSearch = _.debounce(term => {
      this.props.searchOrgs(term);
      this.setState({ currentPage: 1 });
    }, 800);

    return (
      <div>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "900px" }}>
            <h2>Search Organizations:</h2>
            <SearchBar onSearchTermChange={orgSearch} onSubmit={orgSearch} />
            <div style={{ margin: "0 auto", maxWidth: "80vw" }}>
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
  fetchOrgs
})(OrgIndex);
