import {
  observable,
  computed,
  toJS,
  action,
  extendObservable
} from 'mobx'
import { get } from '../util/http'

class ExtendObservable {
  constructor(data) {
    extendObservable(this, data)
  }
}
export default class AppState {
  @observable musicList
  @observable musicDetail
  @observable tab = undefined
  constructor(
    { musicList = [], musicDetail = {}, tab = null} = {}
  ) {
    this.musicList = musicList.map(list => new ExtendObservable(list))
    this.musicDetail = new ExtendObservable(musicDetail)
    this.tab = tab
  }
  @action fetchMusicList(tab) {
    return new Promise((resolve, reject) => {
      if (tab === this.tab && this.musicList.length) {
        resolve()
      } else {
        this.tab = tab
        this.musicList = []
        get('/book/search', {
          q: tab
        }).then(res => {
          this.musicList = res.books
          resolve()
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
  toJson() {
    return {
      musicList: toJS(this.musicList),
      tab: this.tab,
    }
  }
}