import React from 'react'
import { List, Avatar } from 'antd'
import { Menu } from 'antd';
import queryString from 'query-string'
import Helmet from 'react-helmet'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
@inject(stores => {
  return {
    musicState: stores.appState
  }
}) @observer
export default class list extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.fetchMusiclist = this.fetchMusiclist.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  componentDidMount() {
    console.log('componentDidMount')
    this.fetchMusiclist()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.fetchMusiclist(nextProps.location)
    }
  }
  bootstrap() {
    const tab = this.getSearch()
    return this.props.musicState.fetchMusicList(tab || 'philosophy').then(() => {
      return true
    }).catch(() => {
      // console.log(err)
      return false
    })
  }
  fetchMusiclist(location) {
    const tab = this.getSearch(location)
    this.props.musicState.fetchMusicList(tab || 'philosophy')
  }
  handleClick(e) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?q=${e.key}`,
    })
  }
  getSearch(parms) {
    const location = parms || this.props.location
    const query = queryString.parse(location.search)
    const search = query.q || 'philosophy'
    return search
  }
  render() {
    const data = this.props.musicState.musicList
    const current = this.getSearch()
    return (
      <div>
        <Helmet>
          <title>this is list Componet</title>
          <meta name="description" content="this is a description from list component" />
        </Helmet>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="philosophy">
            哲学
        </Menu.Item>
          <Menu.Item key="science">
            科学
        </Menu.Item>
          <Menu.Item key="music">
            音乐
        </Menu.Item>
        </Menu>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{item.title} * {item.author[0]}</a>}
                description={item.summary || '暂无介绍'}
              />
            </List.Item>
          )}
        />
      </div >
    )
  }
}