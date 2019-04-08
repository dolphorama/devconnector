import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileGithub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "def6b962eb5c9b0d48b3",
      clientSecrect: "828adef735d455ec466f0a47f3b87998699484f4",
      count: 5,
      sort: "created and asc",
      repos: []
    };
  }
  componentDidMount() {
    const { username } = this.props;
    const { count, sort, clientId, clientSecrect } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos? per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecrect}`
    )
      .then(res => res.json())
      .then(data => {
        if (this.ref.myRef) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log());
  }
  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <Link to={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </Link>
            </h4>
            <p>{repo.description}</p>
            <div className="col-md-6">
              <span className="span badge badge-info mr-1">
                Stars: {repo.stargazers_count}
              </span>
              <span className="span badge badge-secondary mr-1">
                Watchers: {repo.watchers_count}
              </span>
              <span className="span badge badge-success">
                Forks: {repo.forks_count}
              </span>
            </div>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Latest GitHub repos</h3>
        {repoItems}
      </div>
    );
  }
}
ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
};
export default ProfileGithub;
