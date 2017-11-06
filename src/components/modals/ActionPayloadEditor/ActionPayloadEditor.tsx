import * as React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
// import CustomEntryComponent from './Entry'
// import CustomMention from './Mention'
import { IMention } from './mentions'
import { mentionTrigger, getEntities } from './utilities'
import './ActionPayloadEditor.css'
import 'draft-js/dist/Draft.css'
// import 'draft-js-mention-plugin/lib/plugin.css'

interface Props {
  allSuggestions: IMention[]
  editorState: EditorState
  placeholder: string
  onChange: (editorState: EditorState) => void
  onFocus: () => void
  onBlur: () => void
}

interface State {
  suggestions: IMention[]
}

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  mentionPrefix: mentionTrigger,
  mentionTrigger,
  // mentionComponent: CustomMention
})
const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

export default class extends React.Component<Props, State> {
  domEditor: any

  state = {
    suggestions: this.props.allSuggestions
  }

  setDomEditorRef = (ref: any) => this.domEditor = ref

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  onSearchChange = ({ value }: { value: string }) => {
    console.log(`onSearchChange: ${value}`)
    const entities = getEntities(this.props.editorState, `${mentionTrigger}mention`)
    const existingEntityIds = entities.map(e => e.entity.data.mention.id)
    const filteredMentions = this.props.allSuggestions.filter(m => !existingEntityIds.includes(m.id))
    this.setState({
      suggestions: defaultSuggestionsFilter(value, filteredMentions),
    })
  }

  onClickEditorContainer = () => {
    this.domEditor.focus()
  }

  onFocus = () => {
    this.props.onFocus()
  }

  onBlur = () => {
    this.props.onBlur()
  }

  render() {
    return (
      <div className="editor" onClick={this.onClickEditorContainer}>
        <Editor
          placeholder={this.props.placeholder}
          editorState={this.props.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.setDomEditorRef}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          /* entryComponent={CustomEntryComponent} */
        />
      </div>
    )
  }
}