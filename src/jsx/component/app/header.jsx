import React from 'react'
import { ipcRenderer } from 'electron'

export default class Header extends React.Component {

  constructor(props) {
    super(props)
  }

  // 一覧が表示されているか
  get isListShown() {
    return window.outerHeight > 151
  }

  // 一覧を更新  
  updateList = () => {
    switch (this.props.listMode) {
      case "BOARDS":
        this.props.updateCurrentBoard()
        break
      case "THREADS":
        this.props.updateCurrentThread()
        break
      default:
        console.log("default")
    }
  }

  // 掲示板一覧に表示切り替え
  switchBoardsList = () => {
    this.props.setListMode("BOARDS")
    this.props.setCurrentUrl(this.props.getCurrentUrl("BOARDS"))
    if (this.isListShown && this.props.listMode != "BOARDS") return
    this.switchList()
  }

  // スレッド一覧に表示切り替え
  switchThreadsList = () => {
    this.props.setListMode("THREADS")
    this.props.setCurrentUrl(this.props.getCurrentUrl("THREADS"))
    if (this.isListShown && this.props.listMode != "THREADS") return
    this.switchList()
  }

  // 一覧の表示/非表示を切り替え
  switchList = () => {
    if (this.isListShown) {
      window.resizeTo(window.outerWidth, 151)
    } else {
      window.resizeTo(window.outerWidth, 600)
    }
  }

  _onKeyUpUrlHandler = (event) => {
    if (event.nativeEvent.key == 'Enter') {
      ipcRenderer.send('add-board', event.target.value)
    }
  }

  render() {
    // ボタンのアクティブ状態
    var autoUpdateClass = this.props.isAutoUpdate ? 'active ' : ''
    autoUpdateClass += 'btn btn-default btn-mini'
    var autoScrollClass = this.props.isAutoScroll ? 'active ' : ''
    autoScrollClass += 'btn btn-default btn-mini'

    return (
      <header className="toolbar toolbar-header">
        <div className="flex-container">
          {/*共通ボタン*/}
          <div className="flex-header-common-btns">
            <div className="btn-group">
              {/*更新*/}
              <button className="btn btn-default btn-mini" onClick={this.updateList}>
                <span className="icon icon-arrows-ccw"></span>
              </button>
              {/*掲示板一覧*/}
              <button className="btn btn-default btn-mini" onClick={this.switchBoardsList}>
                <span className="icon icon-menu"></span>
              </button>
              {/*スレッド一覧*/}
              <button className="btn btn-default btn-mini" onClick={this.switchThreadsList}>
                <span className="icon icon-window"></span>
              </button>
            </div>
          </div>
          {/*スレッドボタン*/}
          <div className="flex-header-thread-btns">
            <div className="btn-group">
              {/*自動更新*/}
              <button className={autoUpdateClass} onClick={this.props.switchAutoUpdate}>
                <span className="icon icon-clock"></span>
              </button>
              {/*自動スクロール*/}
              <button className={autoScrollClass} onClick={this.props.switchAutoScroll}>
                <span className="icon icon-down-bold"></span>
              </button>
            </div>  
          </div>
          {/*URL欄*/}
          <div className="flex-header-url">
            <input type="text" value={this.props.currentUrl}
              onChange={e => { this.props.setCurrentUrl(e.target.value) }}
              onKeyUp={this._onKeyUpUrlHandler}/>
          </div>
        </div>
      </header>
    )
  }

}
