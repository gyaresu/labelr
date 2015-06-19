import app from 'ampersand-app'
import React from 'react'
import Router from 'ampersand-router'
import uuid from 'node-uuid'
import qs from 'qs'
import xhr from 'xhr'
import PublicPage from './pages/public'
import ReposPage from './pages/repos'
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
    'auth/callback?:query': 'authCallback'
  },
  public () {
    this.renderPage(<PublicPage/>, {layout: false})
  },
  repos () {
    this.renderPage(<ReposPage/>)
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