import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react';
import { State } from '../types';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import Webchat from './Webchat'
import LogDialogAdmin from './LogDialogAdmin'
import { Activity } from 'botframework-directlinejs'
import { BlisAppBase, LogDialog } from 'blis-models'
import { deleteLogDialogAsync } from '../actions/deleteActions'

interface ComponentState {
    selectedActivity: Activity | null
}

class LogDialogModal extends React.Component<Props, ComponentState> {
    state = {
        selectedActivity: null
    }

    generateHistory(): Activity[] {
        if (!this.props.logDialog) {
            return [];
        }

        const { actions, logDialog, user } = this.props;

        return logDialog.rounds.map((round, i) => {
            const userActivity: Activity = {
                id: `${i}:0`,
                from: {
                    id: user.id,
                    name: user.name
                },
                type: "message",
                text: round.extractorStep.text
            }

            const botActivities: Activity[] = round.scorerSteps.map((scorerStep, j) => {
                let action = actions.filter(a => a.actionId === scorerStep.predictedAction)[0]
                return {
                    id: `${i}:${j}`,
                    from: {
                        id: "BlisTrainer",
                        name: "BlisTrainer"
                    },
                    type: "message",
                    text: action.payload
                } as Activity;
            })

            return [userActivity, ...botActivities]
        }).reduce((a, b) => a.concat(b));
    }

    onClickDelete() {
        this.props.deleteLogDialogAsync(this.props.app.appId, this.props.logDialog.logDialogId)
        // TODO: Would be better to close the dialog after it has been confirmed the delete was successful
        // How do we wait until the promise above has been resolved?
        this.props.onClose()
    }

    onSelectWebChatActivity(activity: Activity) {
        this.setState({
            selectedActivity: activity
        })
    }

    onPostWebChatActivity(activity: Activity) {
        console.log(`activity posted: `, activity)
    }

    render() {
        let history = this.generateHistory();
        return (
            <div>
                <Modal
                    isOpen={this.props.open}
                    isBlocking={true}
                    containerClassName='blis-modal blis-modal--large'
                >
                    <div className="blis-chatmodal">
                        <div className="blis-chatmodal_webchat">
                            <Webchat
                                sessionType={"chat"}
                                history={history}
                                onSelectActivity={activity => this.onSelectWebChatActivity(activity)}
                                onPostActivity={activity => this.onPostWebChatActivity(activity)}
                            />
                        </div>
                        <div className="blis-chatmodal_controls">
                            <div className="blis-chatmodal_admin-controls">
                                <LogDialogAdmin
                                    logDialog={this.props.logDialog}
                                    selectedActivity={this.state.selectedActivity}
                                />
                            </div>
                            <div className="blis-chatmodal_modal-controls">
                                <PrimaryButton
                                    onClick={() => this.props.onClose()}
                                    ariaDescription='Done'
                                    text='Done'
                                />

                                <DefaultButton
                                    onClick={() => this.onClickDelete()}
                                    ariaDescription='Delete'
                                    text='Delete'
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteLogDialogAsync
    }, dispatch);
}
const mapStateToProps = (state: State, ownProps: ReceivedProps) => {
    return {
        apps: state.apps,
        user: state.user,
        actions: state.actions
    }
}

export interface ReceivedProps {
    open: boolean,
    onClose: Function,
    logDialog: LogDialog,
    app: BlisAppBase
}

// Props types inferred from mapStateToProps & dispatchToProps
const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps & ReceivedProps;

export default connect<typeof stateProps, typeof dispatchProps, ReceivedProps>(mapStateToProps, mapDispatchToProps)(LogDialogModal);