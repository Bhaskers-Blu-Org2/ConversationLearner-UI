/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as React from 'react'
import { TextAction, EntityBase, Memory } from '@conversationlearner/models'
import SessionPayloadRenderer from './SessionPayloadRenderer'
import * as Util from '../../Utils/util'

interface Props {
    sessionAction: TextAction
    entities: EntityBase[]
    // TODO: Find better alternative than null
    // When memories is null it's assumed parent doesn't have access to it and intends to fallback to the entity names
    memories: Memory[] | null
}

export default class Component extends React.Component<Props> {
    render() {
        const { entities, memories, sessionAction } = this.props
        const defaultEntityMap = Util.getDefaultEntityMap(entities)
        const renderStringUsingEntityNames = sessionAction.renderValue(defaultEntityMap, { preserveOptionalNodeWrappingCharacters: true })
        const renderStringUsingCurrentMemory = memories === null
            ? null
            : sessionAction.renderValue(Util.createEntityMapFromMemories(entities, memories), { fallbackToOriginal: true })

        return <SessionPayloadRenderer
            original={renderStringUsingEntityNames}
            currentMemory={renderStringUsingCurrentMemory}
        />
    }
}