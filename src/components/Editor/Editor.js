/*
Copyright 2017 Bitnami.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// @flow
import React, { Component } from 'react'
import AceEditor from 'react-ace'
import brace from 'brace' // eslint-disable-line
import 'brace/mode/python'
import 'brace/mode/javascript'
import 'brace/theme/solarized_dark'
import './Editor.scss'
import type { Func, Cluster } from 'utils/Types'
import FuncDetail from './FuncDetailContainer'

export default class Editor extends Component {

  props: {
    func: Func,
    cluster: Cluster,
    onRun: () => void,
    onSave: () => void,
    onDelete: () => void
  }

  state: {
    content: string,
    edited?: boolean,
  }

  hotkeysMap = [
    { name: 'save',
      bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
      exec: () => this.save()
    }
  ]

  constructor(props: any) {
    super(props)
    this.state = {
      content: props.func ? props.func.spec.function : ''
    }
  }

  componentWillReceiveProps(nextProps: { [string]: any }) {
    if (nextProps.func !== this.props.func) {
      this.setState({ content: nextProps.func ? nextProps.func.spec['function'] : '' })
    }
  }

  onTextChange = (text: string) => {
    this.setState({ content: text, edited: true })
  }

  save = () => {
    const { func, cluster } = this.props
    const params = {
      ...func,
      spec: { 'function': this.state.content }
    }
    this.props.onSave(func, cluster, params)
    this.setState({ edited: false })
  }

  delete = () => {
    const { func, cluster } = this.props
    this.props.onDelete(func, cluster)
  }

  render() {
    const { func } = this.props
    let mode = (func && func.spec.runtime) || 'javascript'
    if (mode.indexOf('python') !== -1) {
      mode = 'python'
    }
    return (
      <div className='editor'>
        <div className='editorInnerContainer'>
          {!func && this.renderEmptyView()}
          {func && <AceEditor
            mode={mode}
            theme='solarized_dark'
            onChange={this.onTextChange}
            value={this.state.content}
            name='UNIQUE_ID_OF_DIV'
            commands={this.hotkeysMap}
            enableBasicAutocompletion
          />}
          {func && this.renderFooter()}
        </div>
        {func && <FuncDetail />}
      </div>
    )
  }

  renderFooter() {
    return (
      <div className='editorFooter'>
        {this.state.edited && <a href='#' onClick={this.save}>Save</a>}
      </div>
    )
  }
  renderEmptyView() {
    return (
      <div className='editorEmpty'>
        <p>{':)'}<br />
          {'Choose a function or create a new one'}
        </p>
      </div>
    )
  }
}
