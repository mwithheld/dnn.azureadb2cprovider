import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./style.less";
import { SingleLineInputWithError, GridSystem, Label, Button, InputGroup, Dropdown } from "@dnnsoftware/dnn-react-common";
// import {
//     siteBehavior as SiteBehaviorActions
// } from "../../../../actions";
import util from "../../../utils";
import resx from "../../../resources";

class ProfileMappingEditor extends Component {
    constructor() {
        super();

        this.state = {
            profileMappingDetail: {
                DnnProfilePropertyName: "",
                B2cClaimName: "",
                B2cExtensionName: ""
            },
            error: {
                dnnProfilePropertyName: true,
                b2cClaimName: true
            },
            triedToSubmit: false
        };
    }

    componentDidMount() {
        const {props} = this;
        if (props.profileMappingId) {
            // TODO - Get profile mapping
            //props.dispatch(SiteBehaviorActions.getSiteAlias(props.aliasId));
        }
    }

    /* eslint-disable react/no-did-update-set-state */
    componentDidUpdate(prevProps) {
        const {props, state} = this;
        if ((props !== prevProps) && props.profileMappingDetail ) {
            if (props.profileMappingDetail["DnnProfilePropertyName"] === undefined || props.profileMappingDetail["DnnProfilePropertyName"] === "") {
                state.error["dnnProfilePropertyName"] = true;
            }
            else if (props.profileMappingDetail["DnnProfilePropertyName"] !== "" && props.profileMappingDetail["DnnProfilePropertyName"] !== undefined) {
                state.error["dnnProfilePropertyName"] = false;
            }
    
            this.setState({
                profileMappingDetail: Object.assign({}, props.profileMappingDetail),
                triedToSubmit: false,
                error: state.error
            });
        }
    }

    onSettingChange(key, event) {
        let {state, props} = this;
        let profileMappingDetail = Object.assign({}, state.profileMappingDetail);

        if (profileMappingDetail[key] === "" && key === "DnnProfilePropertyName") {
            state.error["dnnProfilePropertyName"] = true;
        }
        else if (profileMappingDetail[key] !== "" && key === "DnnProfilePropertyName") {
            state.error["dnnProfilePropertyName"] = false;
        }

        if (profileMappingDetail[key] === "" && key === "B2cClaimName") {
            state.error["b2cClaimName"] = true;
        }
        else if (profileMappingDetail[key] !== "" && key === "B2cClaimName") {
            state.error["b2cClaimName"] = false;
        }

        if (key === "B2cExtensionName") {
            profileMappingDetail[key] = event.value;
        }
        else {
            profileMappingDetail[key] = typeof (event) === "object" ? event.target.value : event;
        }

        this.setState({
            profileMappingDetail: profileMappingDetail,
            triedToSubmit: false,
            error: state.error
        });

        // TODO - Dispatch this change
        //props.dispatch(SiteBehaviorActions.siteAliasClientModified(aliasDetail));
    }

    getProfilePropertyOptions() {
        let options = [];
        
        // TODO - Get the profile property options (maybe from the props?)

        // if (this.props.siteAliases.BrowserTypes !== undefined) {
        //     options = this.props.siteAliases.BrowserTypes.map((item) => {
        //         return { label: item, value: item };
        //     });
        // }
        return options;
    }

    onSave() {
        const {props, state} = this;
        this.setState({
            triedToSubmit: true
        });
        if (state.error.dnnProfilePropertyName || state.error.b2cClaimName) {
            return;
        }

        props.onUpdate(state.profileMappingDetail);
    }

    onCancel() {
        const {props} = this;

        // TODO - Handle cancel action

        // if (props.siteAliasClientModified) {
        //     util.utilities.confirm(resx.get("SettingsRestoreWarning"), resx.get("Yes"), resx.get("No"), () => {
        //         props.dispatch(SiteBehaviorActions.cancelSiteAliasClientModified());
        //         props.Collapse();
        //     });
        // }
        // else {
        //     props.Collapse();
        // }
    }

    /* eslint-disable react/no-danger */
    render() {
        /* eslint-disable react/no-danger */
        if (this.state.profileMappingDetail !== undefined || this.props.id === "add") {
            const columnOne = <div key="column-one" className="left-column">
                <InputGroup>
                    <Label
                        label={resx.get("lblDnnProfilePropertyName")}
                    />
                    <Dropdown
                        options={this.getProfilePropertyOptions()}
                        value={this.state.profileMappingDetail.DnnProfilePropertyName}
                        onSelect={this.onSettingChange.bind(this, "DnnProfileProperty")}
                    />
                </InputGroup>

                <InputGroup>
                    <Label
                        label={resx.get("lblB2cClaimName")}
                    />
                    <SingleLineInputWithError
                        inputStyle={{ margin: "0" }}
                        withLabel={false}
                        error={this.state.error.B2cClaimName && this.state.triedToSubmit}
                        errorMessage={resx.get("InvalidB2cClaimName")}
                        value={this.state.profileMappingDetail.B2cClaimName}
                        onChange={this.onSettingChange.bind(this, "B2cClaim")}
                    />
                </InputGroup>
            </div>;
            const columnTwo = <div key="column-two" className="right-column">
                <InputGroup>
                    <Label
                        label={resx.get("lblB2cExtensionName")}
                    />
                    <SingleLineInputWithError
                        withLabel={false}
                        value={this.state.profileMappingDetail.B2cExtensionName}
                        onChange={this.onSettingChange.bind(this, "B2cClaim")}
                    />
                </InputGroup>
            </div>;

            return (
                <div className="profilemapping-editor">
                    <GridSystem numberOfColumns={2}>{[columnOne, columnTwo]}</GridSystem>
                    <div className="editor-buttons-box">
                        <Button
                            type="secondary"
                            onClick={this.onCancel.bind(this)}>
                            {resx.get("Cancel")}
                        </Button>
                        <Button
                            type="primary"
                            onClick={this.onSave.bind(this)}>
                            {resx.get("SaveSettings")}
                        </Button>
                    </div>
                </div>
            );
        }
        else return <div />;
    }
}

ProfileMappingEditor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    profileMappingDetail: PropTypes.object,
    profileMappingId: PropTypes.string,
    Collapse: PropTypes.func,
    onUpdate: PropTypes.func,
    id: PropTypes.string,
    siteAliasClientModified: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        aliasDetail: state.siteBehavior.aliasDetail,
        siteAliases: state.siteBehavior.siteAliases,
        siteAliasClientModified: state.siteBehavior.siteAliasClientModified
    };
}

export default connect(mapStateToProps)(ProfileMappingEditor);