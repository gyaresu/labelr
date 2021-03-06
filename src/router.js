import app from 'ampersand-app'
import React from 'react'
import Router from 'ampersand-router'
import uuid from 'node-uuid'
import qs from 'qs'
import xhr from 'xhr'
import PublicPage from './pages/public'
import ReposPage from './pages/repos'
import RepoDetailPage from './pages/repo-detail'
import Layout from './layout'

export default Router.extend({
  renderPage (page, opts = {layout: true}) {
    if (opts.layout) {
      page = (
        <Layout me={app.me}>
          {page}
        </Layout>
      )
    }

    React.render(page, document.body)
  },
  routes: {
    '': 'public',
    'repos': 'repos',
    'login': 'login',
    'logout': 'logout',
    'repo/:owner/:name': 'repoDetail',
    'auth/callback?:query': 'authCallback'
  },
  public () {
    this.renderPage(<PublicPage/>, {layout: false})
  },
  repos () {
    this.renderPage(<ReposPage repos={app.me.repos}/>)
  },
  login () {
    const state = uuid()
    window.localStorage.state = state
    window.location = 'https://github.com/login/oauth/authorize?' + qs.stringify({
      client_id: 'fde62ce35fbc3180d0fe',
      redirect_uri: window.location.origin + '/auth/callback',
      scope: 'user, repo',
      state: state
    })
  },
  repoDetail (owner, name) {
    console.log(owner, name)
    this.renderPage(<RepoDetailPage/>)
  },
  logout () {
    window.localStorage.clear()
    window.location = '/'
  },
  authCallback (query) {
    query = qs.parse(query)
    if (query.state === window.localStorage.state) {
      delete window.localStorage.state
      console.log('THEY MATCH!')
      console.log(query.code)
      xhr({
        url: 'https://humanjs-gareth.herokuapp.com/authenticate/' + query.code,
        json: true
      }, (err, resp, body) => {
        if (err) {
          console.error('Something broke ', err)
        }
        app.me.token = body.token
        this.redirectTo('/repos')
      })
    }
  }
})