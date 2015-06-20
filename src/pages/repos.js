import React from 'react'
import ampersandMixin from 'ampersand-react-mixin'

export default React.createClass({
  displayName: 'ReposPage',
  mixins: [ampersandMixin],

  render () {
    const {repos} = this.props
    return (
      <div>
        <h1>Repos Page</h1>
        <div>
          {repos.map((repo) => {
            return (
              <div>
                <a href="">{repo.full_name}</a>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})