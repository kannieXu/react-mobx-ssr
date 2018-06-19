import React from 'react'
import {
  Route
} from 'react-router-dom'
import list from '../views/list'
import detail from '../views/detail'
export default () => [
  <Route path="/list" component={list} key="route-list" />,
  <Route path="/detail" component={detail} key="route-detail" />
]