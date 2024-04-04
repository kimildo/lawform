import React, { Component, createContext } from 'react'

const Context = createContext()
const { Provider, Consumer: AutoformConsumer } = Context

let checkNecessaryData = []

class AutoformProvider extends Component {
    state = {
        templateData: undefined,
        bindData: {},
        necessaryData: {},
        activatedTooltip: '',
        lastChangedBindData: [],
    }

    actions = {
        setTemplateData: (value) => {
            this.setState({ templateData: value })
        },
        setBindData: (value, initial = false) => {
            if (!initial) {
                let lastChangedBindData = []
                for (let item in value) {
                    if (value[item] !== this.state.bindData[item]) {
                        lastChangedBindData.push(item)
                    }
                }
                this.setState(prevState => ({ bindData: Object.assign(prevState.bindData, value), lastChangedBindData: lastChangedBindData }))
            } else {
                this.setState(prevState => ({ bindData: Object.assign(prevState.bindData, value) }))
            }

        },
        setActivatedTooltip: (value) => {
            if (this.state.activatedTooltip === value) {
                this.setState({ activatedTooltip: '' })
            } else this.setState({ activatedTooltip: value })
        },
        resetLastChangedBindData: (value) => {
            this.setState({ lastChangedBindData: [] })
        },
        checkNecessary: (value) => {
            checkNecessaryData.push(value)
            this.setState({ necessaryData: checkNecessaryData })
        }

    }

    render () {
        const { state, actions } = this
        const value = { state, actions }
        return (
            <Provider value={value}>
                {this.props.children}
            </Provider>
        )
    }
}

// HOC
function withAutoformContext (WrappedComponent) {
    return function UseAutoformProvider (props) {
        return (
            <AutoformConsumer>
                {
                    ({ state, actions }) => (
                        <WrappedComponent
                            templateData={state.templateData}
                            bindData={state.bindData}
                            lastChangedBindData={state.lastChangedBindData}
                            necessaryData={state.necessaryData}
                            setTemplateData={actions.setTemplateData}
                            setBindData={actions.setBindData}
                            activatedTooltip={state.activatedTooltip}
                            setActivatedTooltip={actions.setActivatedTooltip}
                            resetLastChangedBindData={actions.resetLastChangedBindData}
                            checkNecessary={actions.checkNecessary}
                            {...props}
                        />
                    )
                }
            </AutoformConsumer>
        )
    }
}

export {
    AutoformProvider,
    AutoformConsumer,
    withAutoformContext
}