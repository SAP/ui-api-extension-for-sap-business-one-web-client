declare module "sbo/ui/core/Control" {
    /**
     * Base Class for Controls.
     * A control is a core element that provides users with the means to interact with the Web Client application. 
     * These controls are UI elements, such as buttons, input fields, or grid/table that can handle user interaction, maintain their state, and manage any relevant data. All controls follow SAP's Fiori design guidelines, making it easy to create a consistent user interface and user experience across all SAP applications. 
     * Each control comes with properties, aggregation, events, and methods.
     *
     */
    export default interface Control {
        /**
         * Return the global unique identifier of control
         */
        getGuid(): Promise<string>;

        /**
         * @since 2608
         * 
         * Get the control type
         * @returns The control type as string
         * 
         */
        getControlType(): Promise<string>;
    }

    /**
     * @since 2605
     *  
     * Enumeration of supported control types.
     */
    export const enum ControlType {
        Button = "b1.sdk.Button",
        CheckBox = "b1.sdk.CheckBox",
        Input = "b1.sdk.Input",
        ComboBox = "b1.sdk.ComboBox",
        StaticText = "b1.sdk.StaticText",
        MessageStrip = "b1.sdk.MessageStrip",
        HBox = "b1.sdk.HBox",
        DatePicker = "b1.sdk.DatePicker",
        TimePicker = "b1.sdk.TimePicker",
        ObjectStatus = "b1.sdk.ObjectStatus",
        MenuButton = "b1.sdk.MenuButton",
        Image = "b1.sdk.Image",
        TextArea = "b1.sdk.TextArea",
        RadioButton = "b1.sdk.RadioButton",
        RadioButtonGroup = "b1.sdk.RadioButtonGroup",
        ObjectNumber = "b1.sdk.ObjectNumber",
        ProgressIndicator = "b1.sdk.ProgressIndicator",
        SegmentedButton = "b1.sdk.SegmentedButton",
        Grid = "b1.sdk.Grid",
        Form = "b1.sdk.Form",
        FileUploader = "b1.sdk.FileUploader",
        ChooseFromList = "b1.sdk.ChooseFromList",
        MultiComboBox = "b1.sdk.MultiComboBox",
        MultiInput = "b1.sdk.MultiInput",
        Section = "b1.sdk.Section",
        TreeTable = "b1.sdk.TreeTable"
    }
}

declare module "sbo/ui/core/SDKEnv" {
    import DataModel from "sbo/ui/model"
    import Button from "sbo/m/Button"
    import CheckBox from "sbo/m/CheckBox"
    import ComboBox from "sbo/m/ComboBox"
    import StaticText from "sbo/m/StaticText"
    import Input from "sbo/m/Input"
    import Section from "sbo/m/Section"
    import Grid from "sbo/m/Grid"
    import { MessageBoxType, MessageBoxAction } from "sbo/m/MessageBox";
    import MessageStrip from "sbo/m/MessageStrip"
    import HBox from "sbo/m/HBox"
    import DatePicker from "sbo/m/DatePicker"
    import TimePicker from "sbo/m/TimePicker"
    import ObjectStatus from "sbo/m/ObjectStatus"
    import MenuButton from "sbo/m/MenuButton"
    import MenuItem from "sbo/m/MenuItem"
    import Image from "sbo/m/Image"
    import TextArea from "sbo/m/TextArea"
    import LightBoxItem from "sbo/m/LightBoxItem"
    import RadioButton from "sbo/m/RadioButton"
    import RadioButtonGroup from "sbo/m/RadioButtonGroup"
    import ObjectNumber from "sbo/m/ObjectNumber"
    import ProgressIndicator from "sbo/m/ProgressIndicator"
    import SegmentedButton from "sbo/m/SegmentedButton"
    import SegmentedButtonItem from "sbo/m/SegmentedButtonItem"
    import { PageMode } from "sbo/m/library"
    import Dialog from "sbo/ui/core/Dialog"
    import Form from "sbo/ui/layout/form/Form"
    import FormContainer from "sbo/ui/layout/form/FormContainer"
    import FileUploader from "sbo/ui/unified/FileUploader"
    import ChooseFromList from "sbo/m/ChooseFromList"
    import MultiComboBox from "sbo/m/MultiComboBox"
    import MultiInput from "sbo/m/MultiInput"
    import Token from "sbo/m/Token"
    import TreeTable from "sbo/m/TreeTable"
    import Control from "sbo/ui/core/Control"

    /**
     * @since 2405
     * 
     * It is the type of the current SDK environment.  
     */
    export interface SDKEnv {
        /**
         *  Gets the active view.
         */
        ActiveView(): Promise<ActiveView>;
        /**
         *  Gets supported service.
         */
        getService(): Promise<Service>;
        /**
         * Shows the message box.
         */
        showMessageBox(
            messageBoxType: MessageBoxType,
            messageText: string,
            messageOptions?: {
                title: string,
                initialFocus?: MessageBoxAction,
                actions?: MessageBoxAction[],
            }
        ): Promise<void>;
        /**
         * Shows a toast message.
         */
        showToastMessage(messageText: string): Promise<void>;
        /**
         * Opens an external URL or a relative View Link URL.
         */
        open(url: string): Promise<void>;
        /**
         * @since 2502
         * 
         * Creates a dialog by specifying an unique id.
         */
        newDialog(param: { id: string }): Promise<Dialog>;
        /**
         * @since 2508
         * 
         * Refreshes the view to reload data
         */
        refresh(): Promise<void>;

        /**
         * @since 2602
         * 
         * Authenticate an external service. 
         * @param serviceUrl The URL of the external service to authenticate.
         * @param useCache A boolean indicating whether to use cached token if available. By default, this is set to true.
         * 
         * @returns A promise that resolves to a boolean indicating whether the authentication was successful.
         */
        authenticateExternalService(serviceUrl: string, useCache?: boolean): Promise<boolean>;
    }
    /**
     * JavaScript primitive values of type number and that don’t have a fractional part. To keep the implementation efficient, the constraint is not enforced. Declaring a property as type int is rather for information reasons. The corresponding object expects any given value to be an integer value. The default value of the type is the number 0.
     */
    export type int = number;
    /**
     * A string type that represents CSS size values.
     *
     * The CSS specifications calls this the `'<length> type'`. Allowed values are CSS sizes like "1px"
     * or "2em" or "50%". The special values `auto` and `inherit` are also accepted as well as mathematical
     * expressions using the CSS3 `calc(expression)` operator. Furthermore, length units representing
     * a percentage of the current viewport dimensions: width (vw), height (vh), the smaller of the two (vmin),
     * or the larger of the two (vmax) can also be defined as a CSS size.
     *
     * Note that CSS does not allow all these values for every CSS property representing a size. E.g. `padding-left`
     * doesn't allow the value `auto`. So even if a value is accepted by `sap.ui.core.CSSSize`, it still might
     * have no effect in a specific context. In other words: UI5 controls usually don't extend the range of
     * allowed values in CSS.
     *
     * **Units**
     *
     * Valid font-relative units are `em, ex` and `rem`. Viewport relative units `vw, vh, vmin, vmax` are also
     * valid. Supported absolute units are `cm, mm, in, pc, pt` and `px`.Other units are not supported yet.
     *
     * **Mathematical Expressions**
     *
     * Expressions inside the `calc()` operator are only roughly checked for validity. Not every value that
     * this type accepts might be a valid expression in the sense of the CSS spec. But vice versa, any expression
     * that is valid according to the spec should be accepted by this type. The current implementation is based
     * on the {@link http://dev.w3.org/csswg/css-values-3/#calc-syntax CSS3 Draft specification from 22 April
     * 2015}.
     *
     * Noteworthy details:
     * 	 - whitespace is mandatory around a '-' or '+' operator and optional otherwise
     * 	 - parentheses are accepted but not checked for being balanced (a restriction of regexp based checks)
     *
     * 	 - semantic constraints like type restrictions are not checked
     *
     * Future versions of UI5 might check `calc()` expressions in more detail, so applications should not assume
     * that a value, that is invalid according to the CSS spec but currently accepted by this type still will
     * be accepted by future versions of this type.
     */
    export type CSSSize = string;
    /**
     * A string type that represents an RFC 3986 conformant URI.
     */
    type URI = string;
    /**
     * @since 2405
     * 
     * The active view in the current UI page. Below methods can be used for List View and Detail View.
     */
    export interface ActiveView<ModelType = DataModel> {
        /**
         * Returns the GUID of the list view.
         */
        getGuid(): Promise<string>;
        /**
         * Returns the view type.
         */
        getViewType(): Promise<string>;
        /**
         * Hides the busy indicator of the view.
         */
        hideBusy(): Promise<void>;
        /**
         * Shows the busy indicator of the view.
         */
        showBusy(): Promise<void>;
        /**
         * Returns the data of model with name modelName, which is defined in the extension.
         */
        getCustomizedData(modelName: string): Promise<any>;
        /**
         * Sets the data to the model with name modelName, which is defined in the extension.
         */
        setCustomizedData(data: object, modelName: string): Promise<void>;
        /**
         * @since 2502
         * 
         * Returns the dialog.
         */
        getWindow(): Promise<Dialog>;
        /**
         * Get the Button control by GUID.
         */
        Button(guid: string): Promise<Button>;
        /**
         * Get the Button control by GUID.
         */
        CheckBox(guid: string): Promise<CheckBox>;
        /**
         * Get the ComboBox control by GUID.
         */
        ComboBox(guid: string): Promise<ComboBox>;
        /**
         * Get the StaticText control by GUID.
         */
        StaticText(guid: string): Promise<StaticText>;
        /**
         * Get the Input control by GUID.
         */
        Input(guid: string): Promise<Input>;
        /**
         * Get the Section control by GUID.
         */
        Section(guid: string): Promise<Section>;
        /**
         * Get the Grid control by GUID.
         */
        Grid(guid: string): Promise<Grid>;
        /**
         * @since 2502
         * 
         * Get the MessageStrip control by GUID.
         */
        MessageStrip(guid: string): Promise<MessageStrip>;
        /**
         * @since 2502
         * 
         * Get the HBox control by GUID.
         */
        HBox(guid: string): Promise<HBox>;
        /**
         * @since 2502
         * 
         * Get the DatePicker control by GUID.
         */
        DatePicker(guid: string): Promise<DatePicker>;
        /**
         * @since 2502
         * 
         * Get the TimePicker control by GUID.
         */
        TimePicker(guid: string): Promise<TimePicker>;
        /**
         * @since 2502
         * 
         * Get the ObjectStatus control by GUID.
         */
        ObjectStatus(guid: string): Promise<ObjectStatus>;
        /**
         * @since 2502
         * 
         * Get the MenuButton control by GUID.
         */
        MenuButton(guid: string): Promise<MenuButton>;
        /**
         * @since 2502
         * 
         * Get the MenuItem control by GUID.
         */
        MenuItem(guid: string): Promise<MenuItem>;
        /**
         * @since 2502
         * 
         * Get the Image control by GUID.
         */
        Image(guid: string): Promise<Image>;
        /**
         * @since 2502
         * 
         * Get the TextArea control by GUID.
         */
        TextArea(guid: string): Promise<TextArea>;
        /**
         * @since 2502
         * 
         * Get the LightBoxItem control by GUID.
         */
        LightBoxItem(guid: string): Promise<LightBoxItem>;
        /**
         * @since 2502
         * 
         * Get the RadioButton control by GUID.
         */
        RadioButton(guid: string): Promise<RadioButton>;
        /**
         * @since 2502
         * 
         * Get the RadioButton control by GUID.
         */
        RadioButtonGroup(guid: string): Promise<RadioButtonGroup>;
        /**
         * @since 2502
         * 
         * Get the ObjectNumber control by GUID.
         */
        ObjectNumber(guid: string): Promise<ObjectNumber>;
        /**
         * @since 2502
         * 
         * Get the ProgressIndicator control by GUID.
         */
        ProgressIndicator(guid: string): Promise<ProgressIndicator>;
        /**
         * @since 2502
         * 
        * Get the SegmentedButton control by GUID.
        */
        SegmentedButton(guid: string): Promise<SegmentedButton>;
        /**
         * @since 2502
         * 
         * Get the SegmentedButtonItem control by GUID.
         */
        SegmentedButtonItem(guid: string): Promise<SegmentedButtonItem>;
        /**
         * @since 2502
         * 
         * Get the Form control by GUID.
         */
        Form(guid: string): Promise<Form>;
        /**
         * @since 2502
         * 
         * Get the FormContainer control by GUID.
         */
        FormContainer(guid: string): Promise<FormContainer>;
        /**
         * @since 2508
         * 
         * Get the FileUploader control by GUID.
         */
        FileUploader(guid: string): Promise<FileUploader>;

        /**
         * @since 2508
         * 
         * Get the ChooseFromList control by GUID.
         */
        ChooseFromList(guid: string): Promise<ChooseFromList>;

        /**
         * @since 2602
         * 
         * Get the MultiComboBox control by GUID.
         */
        MultiComboBox(guid: string): Promise<MultiComboBox>;
        
        /**
         * @since 2602
         * 
         * Get the MultiInput control by GUID.
         */
        MultiInput(guid: string): Promise<MultiInput>;

        /**
         * @since 2602
         * 
         * Get the Token control by GUID.
         */
        Token(guid: string): Promise<Token>;

        /**
         * @since 2702
         * 
         * Get the TreeTable control by GUID.
         */
        TreeTable(guid: string): Promise<TreeTable>;

        /**
         * @since 2608
         * 
         * Get control by GUID.
         * 
         * @param guid 
         */
        getControl(guid: string): Promise<Control>;

        /**
         * @since 2608
         * 
         * Get control type by GUID.
         * 
         * @param guid 
         */
        getControlType(guid: string): Promise<string>;

        /**
         * @since 2608
         * 
         * Get the basic view information of the current view.
         * 
         */
        getViewInfo(): Promise<Record<string, unknown>>;

        /**
         * @since 2608
         * 
         * Get UIAPI i18n text of the current view.
         * 
         * @param i18nKey
         * @param params
         */
        getI18nText(i18nKey: string, params?: string[]): Promise<string>;
    }

    /**
     * @since 2502
     * 
     * The type of the business object key.
     *
     * @example
     * ```typescript
     * const salesOrderObjectKey: ObjectKeyType = { keys: [ { name: "DocEntry", value: 1 } ], object: "ORDR" };
     * const bpObjectKey: ObjectKeyType = { keys: [ { name: "CardCode", value: "C20000" } ], object: "OCRD" };
     * ```
     */
    export interface ObjectKeyType {
        /**
         * The key-value pairs of the business object.
         */
        keys: { name: string, value: number | string }[],
        /**
         * The table name of the business object
         */
        object: string
    }

    /**
     * @since 2405
     * 
     * The active view in the current UI page. Below methods can be used for Detail View.
     */
    export interface DetailView<ModelType = DataModel> extends ActiveView {
        /**
         * @since 2502
         * 
         * Get the keys of the current business object in the detail view. 
         * 
         * @returns A promise that resolves to the ObjectKeyType.
        */
        getObjectKey(): Promise<ObjectKeyType>;
        /**
         * @since 2502
         * 
         * Returns the current detail view mode.
         */
        getPageMode(): Promise<PageMode>;
        /**
         * @since 2508
         * 
         * Sets the section that should be selected.
         */
        setSelectedSection(guid: string): Promise<void>;
    }
    /**
     * The supported service including Service Layer APIs, View Link APIs and External Service APIs.
     */
    export interface Service {
        /**
         * Service Layer APIs support methods get, post, put, patch and delete.
         * Internally Service Layer oData V4 is used. 
         */
        ServiceLayer: {
            /**
             * Get data.
             * @param url 
             */
            get(url: string, headers?: object): Promise<Response>;
            /**
             * Post data.
             * @param url 
             * @param data 
             */
            post(url: string, data: object, headers?: object): Promise<Response>;
            /**
             * Put data.
             * @param url 
             * @param data 
             */
            put(url: string, data: object, headers?: object): Promise<void | Response>;
            /**
             * Patch data.
             * @param url 
             * @param data 
             */
            patch(url: string, data: object, headers?: object): Promise<void | Response>;

            /**
             * Delete data.
             * @param url 
             */
            delete(url: string, headers?: object): Promise<void | Response>;
        };
        /**
         * View Link APIs support methods get.
         */
        ViewLinkService: {
            /**
             * Get data.
             * @param url 
             */
            get(url: string, headers?: object): Promise<Response>;
        };
        /**
         * External Service APIs support methods get, post, put, patch and delete.
         */
        ExternalService: {
            /**
             * Get data.
             * @param url 
             */
            get(url: string, options: options): Promise<Response>;
            /**
             * Post data.
             * @param url 
             * @param data 
             */
            post(url: string, data: object | string, options: options): Promise<Response>;
            /**
             * Put data.
             * @param url 
             * @param data 
             */
            put(url: string, data: object | string, options: options): Promise<void | Response>;
            /**
             * Patch data.
             * @param url 
             * @param data 
             */
            patch(url: string, data: object | string, options: options): Promise<void | Response>;
            /**
             * Delete data.
             * @param url 
             */
            delete(url: string, data: object | string, options: options): Promise<void | Response>;
        }
    }
    /**
     * The parameter options of External Service APIs should have the following members.
     */
    export interface options {
        /**
         * Additional headers to be sent with the request
         */
        headers: object;
        /**
         * The mode of the request for handling cross-origin requests, e.g., "cors" (default), "no-cors", "same-origin"
         */
        mode: string;
    }
    /**
     * Service Response
     */
    export interface Response {
        //Return true if the response is successful, otherwise, returns false
        isSuccess(): boolean;
        //Return the status code of the response
        getStatus(): int;
        //Return headers of the response (not used by external services)
        getHeaders(): object;
        //Return data of the response
        getData(): any;

    }
}

declare module "sbo/ui/core/library" {
    /**
     * @since 2405
     * 
     * Marker for the correctness of the current value.
     *
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'ValueState'.
     */
    export const enum ValueState {
        /**
         * State is not valid.
         */
        Error = "Error",
        /**
         * State is informative.
         */
        Information = "Information",
        /**
         * State is valid.
         */
        Success = "Success",
        /**
         * State is valid but with a warning.
         */
        Warning = "Warning",
        /**
         * State is not specified.
         */
        None = "None"
    }
    /**
     * @since 2405
     * 
     * Configuration options for text alignments.
     */
    export const enum TextAlign {
        /**
         * Locale-specific positioning at the beginning of the line.
         */
        Begin = "Begin",
        /**
         * Centered text alignment.
         */
        Center = "Center",
        /**
         * Locale-specific positioning at the end of the line.
         */
        End = "End",
        /**
         * Sets no text align, so the browser default is used.
         */
        Initial = "Initial",
        /**
         * Hard option for left alignment.
         */
        Left = "Left",
        /**
         * Hard option for right alignment.
         */
        Right = "Right",
    }
    /**
     * @since 2405
     * 
     * Configuration options for the direction of texts.
     */
    export const enum TextDirection {
        /**
         * Inherits the direction from its parent control/container.
         */
        Inherit = "Inherit",
        /**
         * Specifies left-to-right text direction.
         */
        LTR = "LTR",
        /**
         * Specifies right-to-left text direction.
         */
        RTL = "RTL",
    }
    /**
     * @since 2405
     * 
     * Configuration options for horizontal alignments of controls.
     *
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'HorizontalAlign'.
     */
    export const enum HorizontalAlign {
        /**
         * Hyphenation will be used to break words on syllables where possible.
         */
        Begin = "Begin",
        /**
         * Normal text wrapping will be used. Words won't break based on hyphenation.
         */
        Center = "Center",
        /**
         * Locale-specific positioning at the end of the line
         */
        End = "End",
        /**
         * Hard option for left alignment
         */
        Left = "Left",
        /**
         * Hard option for right alignment
         */
        Right = "Right",
    }
    /**
     * @since 2405
     * 
     * Defines the selection mode of the menu items.
     *
     * This enum is part of the 'sap/ui/core/library' module export and must be accessed by the property 'ItemSelectionMode'.
     */
    export const enum SelectionMode {
        /**
         * Multi selection mode (more than one menu item can be selected).
         */
        "MultiToggle" = "MultiToggle",
        /**
         * Single selection mode (only one menu item can be selected).
         */
        "Single" = "Single",
        /**
         * No selection mode.
         */
        "None" = "None"
    }
    /**
     * @since 2405
     * 
     * Selection Behavior on Rows
     */
    export const enum SelectionBehavior {
        /**
         * Rows can be selected on the complete row.
         */
        "Row" = "Row",
        /**
         * Rows can only be selected on the row (and the selector is hidden)
         */
        "RowOnly" = "RowOnly",
        /**
         * Rows can only be selected on the row selector.
         */
        "RowSelector" = "RowSelector"
    }
    /**
     * @since 2405
     * 
     * Operators for the Filter.
     */
    export const enum ModelFilterOperator {
        /**
         * FilterOperator between
         */
        "BT" = "BT",
        /**
         * FilterOperator contains
         */
        "Contains" = "Contains",
        /**
         * FilterOperator equals
         */
        "EQ" = "EQ",
        /**
         * FilterOperator ends with
         */
        "EndsWith" = "EndsWith",
        /**
         * FilterOperator greater or equals
         */
        "GE" = "GE",
        /**
         * FilterOperator greater than
         */
        "GT" = "GT",
        /**
         * FilterOperator less or equals
         */
        "LE" = "LE",
        /**
         * FilterOperator less than
         */
        "LT" = "LT",
        /**
         * FilterOperator "Not Between"
         */
        "NB" = "NB",
        /**
         * FilterOperator not equals
         */
        "NE" = "NE",
        /**
         * FilterOperator not contains
         */
        "NotContains" = "NotContains",
        /**
         * FilterOperator not ends with
         */
        "NotEndsWith" = "NotEndsWith",
        /**
         * FilterOperator not starts with
         */
        "NotStartsWith" = "NotStartsWith",
        /**
         * FilterOperator starts with
         */
        "StartsWith" = "StartsWith"
    }
    /**
     * @since 2502
     * 
     * Enumeration of supported types of messages.
     * 
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'MessageType'.
     */
    export const enum MessageType {
        /**
         * Message is an error
         */
        Error = "Error",

        /**
         * Message is an information
         */
        Information = "Information",

        /**
         * Message has no specific level
         */
        None = "None",

        /**
         * Message is a success message
         */
        Success = "Success",

        /**
         * Message is a warning
         */
        Warning = "Warning"
    }
    /**
     * @since 2502
     * 
     * The types of Calendar.
     * 
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'CalendarType'.
     */
    export const enum CalendarType {
        /**
         * The Thai buddhist calendar
         */
        Buddhist = "Buddhist",

        /**
         * The Gregorian calendar
         */
        Gregorian = "Gregorian",

        /**
         * The Islamic calendar
         */
        Islamic = "Islamic",

        /**
         * The Japanese emperor calendar
         */
        Japanese = "Japanese",

        /**
         * The Persian Jalali calendar
         */
        Persian = "Persian"
    }
    /**
     * @since 2502
     * 
     * Configuration options for text wrapping.
     * 
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'Wrapping'.
     */
    export const enum Wrapping {
        /**
         * Inserts actual line breaks in the text at the wrap point.
         */
        Hard = "Hard",
        /**
         * The standard browser behavior is considered for wrapping.
         */
        None = "None",
        /**
         * Wrapping shall not be allowed.
         */
        Off = "Off",
        /**
         * The text is actually on the same line but displayed within several lines.
         */
        Soft = "Soft"
    }

    /**
     * @since 2502
     * 
     * Colors to highlight certain UI elements.
     * 
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'IndicationColor'.
     */
    export const enum IndicationColor {
        /**
         * Indication Color 1
         */
        Indication01 = "Indication01",
        /**
         * Indication Color 2
         */
        Indication02 = "Indication02",
        /**
         * Indication Color 3
         */
        Indication03 = "Indication03",
        /**
         * Indication Color 4
         */
        Indication04 = "Indication04",
        /**
         * Indication Color 5
         */
        Indication05 = "Indication05",
        /**
         * Indication Color 6
         */
        Indication06 = "Indication06",
        /**
         * Indication Color 7
         */
        Indication07 = "Indication07",
        /**
         * Indication Color 8
         */
        Indication08 = "Indication08",
        /**
         * Indication Color 9
         */
        Indication09 = "Indication09",
        /**
         * Indication Color 10
         */
        Indication10 = "Indication10",
        /**
         * Indication Color 11
         */
        Indication11 = "Indication11",
        /**
         * Indication Color 12
         */
        Indication12 = "Indication12",
        /**
         * Indication Color 13
         */
        Indication13 = "Indication13",
        /**
         * Indication Color 14
         */
        Indication14 = "Indication14",
        /**
         * Indication Color 15
         */
        Indication15 = "Indication15",
        /**
         * Indication Color 16
         */
        Indication16 = "Indication16",
        /**
         * Indication Color 17
         */
        Indication17 = "Indication17",
        /**
         * Indication Color 18
         */
        Indication18 = "Indication18",
        /**
         * Indication Color 19
         */
        Indication19 = "Indication19",
        /**
         * Indication Color 20
         */
        Indication20 = "Indication20"
    }
}

declare module "sbo/ui/base/Event" {
    /**
     * An Event object consisting of an ID, a source and a map of parameters.
     */
    export default interface Event {
        /**
         * Returns the id of the event.
         *
         * @returns The ID of the event
         */
        getId(): string;
        /**
         * Returns the event provider on which the event was fired.
         *
         * @returns The source of the event
         */
        getSource(): any;
        /**
         * Returns an object with all parameter values of the event.
         *
         * @returns All parameters of the event
         */
        getParameters(): any;
        /**
         * Returns the value of the parameter with the given name.
         *
         * @returns Value of the named parameter
         */
        getParameter(sName: string): any;
        /**
         * Prevent the default action of this event.
         *
         * **Note:** This function only has an effect if preventing the default action of the event is supported
         * by the event source.
         */
        preventDefault(): void;
    }
}
declare module "sbo/ui/core/mvc/Controller" {
    import { SDKEnv } from "sbo/ui/core/SDKEnv";
    import Event from "sbo/ui/base/Event"
    /**
     * A generic controller interface for the Model-View-Controller concept.
     *
     * Should be implemented by the typed controllers.
     */
    export default interface Controller {
        /**
         * Event handler when initializing the current view.
         * @param {SDKEnv} oEnv the current sdk environment
         * @param {Event} oEvent the view init event
         */
        onInit?(oEnv: SDKEnv, oEvent: Event): Promise<void>;

        /**
         * Event handler when loading data to the current view. It is asynchronously triggered after onInit.
         * @param {SDKEnv} oEnv the current sdk environment
         * @param {Event} oEvent the view dataLoad event
         */
        onDataLoad?(oEnv: SDKEnv, oEvent: Event): Promise<void>;

        /**
         * Event handler when exiting from the current view.
         * @param {SDKEnv} oEnv the current sdk environment
         * @param {Event} oEvent the view exit event
         */
        onExit?(oEnv: SDKEnv, oEvent: Event): Promise<void>;
    }
}
declare module "sbo/ui/core/Item" {
    /**
     * @since 2405
     * 
     * A control base type.
     */
    export default interface Item {
        /**
         * Gets current value of property `key`.
         *
         * Key of the combo box item.
         * 
         * Mandatory property and no default value.
         *
         * @returns Value of property `key`
         */
        getKey(): Promise<string>;
        /**
         * Sets current value of property `key`.
         *
         * Key of the combo box item.
         *
         * Mandatory property and no default value.
         *
         * @returns Promise<void>
         */
        setKey(sKey: string): Promise<void>;
        /**
         * Gets current value of property `text`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets current value of property `text`.
         *
         * Control introduction/title.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets current value of property `enabled`.
         *
         * Determine whether the control is enabled.
         * 
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;
        /**
         * Sets current value of property `enabled`.
         *
         * Determine whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;
        /**
         * Gets current value of property `additionalText`.
         *
         * Additional text to be displayed along with this item.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `additionalText`
         */
        getAdditionalText(): Promise<string>;
        /**
         * Sets current value of property `additionalText`.
         *
         * Additional text to be displayed along with this item.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setAdditionalText(sAdditionalText: string): Promise<void>;
    }
}
declare module "sbo/ui/core/SubSection" {
    import Group from "sbo/ui/core/Group";
    /**
     * @since 2405
     * 
     * Subsection is a second-level information container, which is generally used in an object page layout.
     */
    export default interface SubSection {
        /**
         * Global unique identifier.
         * 
         * Return the global unique identifier of subSection
         * 
         * Mandatory property and no default value.
         */
        getGuid(): Promise<string>;
        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the subSection is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether the subSection is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Gets current value of property `text`.
         *
         * Subsection title.
         * 
         * Default value is `empty string`.
         * 
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets a new value for property `text`.
         *
         * Subsection title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets groups in section.
         *
         * Default value is `empty array`.
         * 
         * @returns Promise<Group[]>
         */
        getGroups(): Promise<Group[]>;
    }
}
declare module "sbo/ui/core/Group" {
    import Control from "sbo/ui/core/Control";
    import { int } from "sbo/ui/core/SDKEnv";
    /**
     * @since 2405
     * 
     * Group arranges labels and fields (like input fields) into groups and rows.
     */
    export default interface Group {
        /**
         * Global unique identifier.
         * 
         * Return the global unique identifier of group.
         * 
         * Mandatory property and no default value.
         */
        getGuid(): Promise<string>;
        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the group is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether the group is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Gets current value of property `text`.
         *
         * group title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets a new value for property `text`.
         *
         * group title.
         * 
         * Default value is `empty string`.
         * 
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets current value of property `align`.
         *
         * Show group on right side if assign value right.
         *
         * Default value is `left`.
         * 
         * @returns Value of property `align`
         */
        getAlign(): Promise<string>;
        /**
         * Sets a new value for property `align`.
         *
         * Show group on right side if assign value right.
         * 
         * Default value is `left`.
         *
         * @returns Promise<void>
         */
        setAlign(sAlign: string): Promise<void>;
        /**
         * Gets items in group.
         *
         * Default value is `empty array`.
         * 
         * @returns Promise<Control[]>
         */
        getItems(): Promise<Control[]>;
        /**
         * Gets current value of property `width`.
         *
         * Default display two group each line, if you want to use entire line for one group, set to 12.
         * 
         * Default value is `6`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<int>;
        /**
         * Sets current value of property `width`.
         *
         * Default display two group each line, if you want to use entire line for one group, set to 12.
         * 
         * Default value is `6`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: int): Promise<void>;
    }
}
declare module "sbo/ui/core/Row" {
    import Input from "sbo/m/Input"
    import Button from "sbo/m/Button"
    import CheckBox from "sbo/m/CheckBox"
    import ComboBox from "sbo/m/ComboBox"
    import StaticText from "sbo/m/StaticText"
    import MessageStrip from "sbo/m/MessageStrip"
    import DatePicker from "sbo/m/DatePicker"
    import HBox from "sbo/m/HBox"
    import TimePicker from "sbo/m/TimePicker"
    import ObjectStatus from "sbo/m/ObjectStatus"
    import MenuButton from "sbo/m/MenuButton"
    import MenuItem from "sbo/m/MenuItem"
    import Image from "sbo/m/Image"
    import TextArea from "sbo/m/TextArea"
    import LightBoxItem from "sbo/m/LightBoxItem"
    import RadioButton from "sbo/m/RadioButton"
    import RadioButtonGroup from "sbo/m/RadioButtonGroup"
    import ObjectNumber from "sbo/m/ObjectNumber"
    import ProgressIndicator from "sbo/m/ProgressIndicator"
    import SegmentedButton from "sbo/m/SegmentedButton"
    import SegmentedButtonItem from "sbo/m/SegmentedButtonItem"
    import ChooseFromList from "sbo/m/ChooseFromList"
    import MultiComboBox from "sbo/m/MultiComboBox"
    import MultiInput from "sbo/m/MultiInput"
    import Token from "sbo/m/Token"
    /**
     * @since 2405
     *
     */
    export default interface Row {
        /**
         * Returns the index of the row in the grid.
         * 
         * @returns The context's index within the binding's collection. 
         */
        getIndex(): number;

        /**
         * Returns the Input cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The Input control guid
         */
        Input(sCtrlGuid?: string): Promise<Input>;

        /**
         * Returns the Button cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The Button control guid
         */
        Button(sCtrlGuid?: string): Promise<Button>;

        /**
         * Returns the CheckBox cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The CheckBox control guid
         */
        CheckBox(sCtrlGuid?: string): Promise<CheckBox>;

        /**
         * Returns the ComboBox cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The ComboBox control guid
         */
        ComboBox(sCtrlGuid?: string): Promise<ComboBox>;

        /**
         * Returns the StaticText cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The StaticText control guid
         */
        StaticText(sCtrlGuid?: string): Promise<StaticText>;

        /**
         * @since 2502
         * 
         * Returns the MessageStrip cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The MessageStrip control guid
         */
        MessageStrip(sCtrlGuid?: string): Promise<MessageStrip>;

        /**
         * @since 2502
         * 
         * Returns the HBox cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The HBox control guid
         */
        HBox(sCtrlGuid?: string): Promise<HBox>;

        /**
         * @since 2502
         * 
         * Returns the DatePicker cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The DatePicker control guid
         */
        DatePicker(sCtrlGuid?: string): Promise<DatePicker>;

        /**
         * @since 2502
         * 
         * Returns the TimePicker cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The TimePicker control guid
         */
        TimePicker(sCtrlGuid?: string): Promise<TimePicker>;

        /**
         * @since 2502
         * 
         * Returns the ObjectStatus cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The ObjectStatus control guid
         */
        ObjectStatus(sCtrlGuid?: string): Promise<ObjectStatus>;

        /**
         * @since 2502
         * 
         * Returns the MenuButton cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The MenuButton control guid
         */
        MenuButton(sCtrlGuid?: string): Promise<MenuButton>;

        /**
         * @since 2502
         * 
         * Returns the MenuItem cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The MenuItem control guid
         */
        MenuItem(sCtrlGuid?: string): Promise<MenuItem>;

        /**
         * @since 2502
         * 
         * Returns the Image cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The Image control guid
         */
        Image(sCtrlGuid?: string): Promise<Image>;

        /**
         * @since 2502
         * 
         * Returns the TextArea cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The TextArea control guid
         */
        TextArea(sCtrlGuid?: string): Promise<TextArea>;

        /**
         * @since 2502
         * 
         * Returns the LightBoxItem cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The LightBoxItem control guid
         */
        LightBoxItem(sCtrlGuid?: string): Promise<LightBoxItem>;

        /**
         * @since 2502
         * 
         * Returns the RadioButton cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The RadioButton control guid
         */
        RadioButton(sCtrlGuid?: string): Promise<RadioButton>;

        /**
         * @since 2502
         * 
         * Returns the RadioButtonGroup cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The RadioButtonGroup control guid
         */
        RadioButtonGroup(sCtrlGuid?: string): Promise<RadioButtonGroup>;

        /**
         * @since 2502
         * 
         * Returns the ObjectNumber cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The ObjectNumber control guid
         */
        ObjectNumber(sCtrlGuid?: string): Promise<ObjectNumber>;

        /**
         * @since 2502
         * 
         * Returns the ProgressIndicator cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The ProgressIndicator control guid
         */
        ProgressIndicator(sCtrlGuid?: string): Promise<ProgressIndicator>;

        /**
         * @since 2502
         * 
         * Returns the SegmentedButton cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The SegmentedButton control guid
         */
        SegmentedButton(sCtrlGuid?: string): Promise<SegmentedButton>;

        /**
         * @since 2502
         * 
         * Returns the SegmentedButtonItem cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The SegmentedButtonItem control guid
         */
        SegmentedButtonItem(sCtrlGuid?: string): Promise<SegmentedButtonItem>;
        /**
         * @since 2502
         * 
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Returns the ChooseFromList cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The ChooseFromList control guid
         */
        ChooseFromList(sCtrlGuid?: string): Promise<ChooseFromList>;
        /**
         * @since 2602
         * 
         * Returns the MultiComboBox cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The MultiComboBox control guid
         */
        MultiComboBox(sCtrlGuid?: string): Promise<MultiComboBox>;
        /**
         * @since 2602
         * 
         * Returns the MultiInput cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The MultiInput control guid
         */
        MultiInput(sCtrlGuid?: string): Promise<MultiInput>;
        /**
         * @since 2602
         * 
         * Returns the Token cell of the grid row.
         * 
         * @param {string} sCtrlGuid - The Token control guid
         */
        Token(sCtrlGuid?: string): Promise<Token>;
    }
}
declare module "sbo/ui/core/Column" {
    import { HorizontalAlign } from "sbo/ui/core/library";
    import { CSSSize, int } from "sbo/ui/core/SDKEnv";
    /**
     * @since 2405
     * 
     * Column allows users to define column specific properties that will be applied when rendering the table.
     */
    export default interface Column {
        /**
         * Global unique identifier.
         * 
         * Return the global unique identifier of column
         * 
         * Mandatory property and no default value.
         */
        getGuid(): Promise<string>;
        /**
         * Gets current value of property `text`.
         * 
         * Label of the column which is displayed in the column header.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets a new value for property `text`.
         *
         * Label of the column which is displayed in the column header.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets the tooltip that should be shown for this Element.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the column.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip that should be shown for this Element.
         * 
         * Default value is `empty string`.
         * 
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;
        /**
         * Gets width of the column in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;
        /**
         * Sets width of the column in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;
        /**
         * Gets the minimum width of a column in pixels.
         * 
         * Default value is `0`.
         *
         * @returns Value of property `minWidth`
         */
        getMinWidth(): Promise<int>;
        /**
         * Sets the minimum width of a column in pixels.
         * 
         * Default value is `0`.
         * 
         * @returns Promise<void>
         */
        setMinWidth(minWidth: int): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Hides or shows a column on the UI.
         *
         * Default value is `true`.
         * 
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Hides or shows a column on the UI.
         *
         * Default value is `true`.
         * 
         * @returns Promise<void>
         */
        setVisible(visible: boolean): Promise<void>;
        /**
         * Gets current value of property `useDefaultSort`.
         *
         * If set to false, you need to implement the sorting logic in the grid sort event.
         *
         * Default value is `true`.
         * 
         * @returns Value of property `useDefaultSort`
         */
        getUseDefaultSort(): Promise<boolean>;
        /**
         * Sets a new value for property `useDefaultSort`.
         *
         * If set to false, you need to implement the sorting logic in the grid sort event.
         * 
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setUseDefaultSort(useDefaultSort: boolean): Promise<void>;
        /**
         * Gets current value of property `sortProperty`.
         *
         * Specifies the binding property on which the column will sort.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `sortProperty`
         */
        getSortProperty(): Promise<string>;
        /**
         * Sets a new value for property `sortProperty`.
         *
         * Specifies the binding property on which the column will sort.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setSortProperty(sortProperty: string): Promise<void>;
        /**
         * Gets current value of property `filtered`.
         *
         * Indicates if the column is filtered.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `filtered`
         */
        getFiltered(): Promise<boolean>;
        /**
         * Gets current value of property `filterProperty`.
         *
         * Specifies the binding property on which the column shall be filtered.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `filterProperty`
         */
        getFilterProperty(): Promise<string>;
        /**
         * Sets a new value for property `filterProperty`.
         *
         * Specifies the binding property on which the column shall be filtered.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setFilterProperty(filterProperty: string): Promise<void>;
        /**
         * Gets current value of property `hAlign`.
         *
         * Horizontal alignment of the column content. Controls with a text align do not inherit the horizontal alignment. You have to set the text align directly on the template.
         *
         * Default value is `Begin`.
         *
         * @returns Value of property `hAlign`
         */
        getHAlign(): Promise<HorizontalAlign>;
        /**
         * Sets a new value for property `hAlign`.
         *
         * Horizontal alignment of the column content. Controls with a text align do not inherit the horizontal alignment. You have to set the text align directly on the template.
         * 
         * Default value is `Begin`.
         *
         * @returns Promise<void>
         */
        setHAlign(hAlign: HorizontalAlign): Promise<void>;
        /**
         * @since 2502
         * 
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
    }
}
declare module "sbo/ui/core/Dialog" {
    import Control from "sbo/ui/core/Control";
    import { ValueState } from "sbo/ui/core/library";
    import { URI, CSSSize } from "sbo/ui/core/SDKEnv";
    import Form from "sbo/ui/layout/form/Form";
    import Button from "sbo/m/Button";

    /**
     * @since 2502
     * 
     * A Dialog is a pop-up that interrupts the current application processing. 
     * It is used to prompt the user for information or a response.
     */
    export default interface Dialog extends Control {
        /**
         * Gets the dialog type, either `Simple` or `Complex`.
         *
         * @returns Value of property `type`
         */
        getType(): Promise<"Simple" | "Complex">;

        /**
         * Gets current value of property `title`.
         *
         * Title text appears in the Dialog header.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;

        /**
         * Sets a new value for property `title`.
         *
         * Title text appears in the Dialog header.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(sTitle: string): Promise<void>;

        /**
         * Gets current value of property `contentWidth`.
         *
         * Preferred width of the content in the Dialog.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `contentWidth`
         */
        getContentWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `contentWidth`.
         *
         * Preferred width of the content in the Dialog.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setContentWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `contentHeight`.
         *
         * Preferred height of the content in the Dialog.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `contentHeight`
         */
        getContentHeight(): Promise<CSSSize>;

        /**
         * Sets a new value for property `contentHeight`.
         *
         * Preferred height of the content in the Dialog.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setContentHeight(sHeight: CSSSize): Promise<void>;

        /**
         * Gets current value of property `draggable`.
         *
         * Indicates whether the Dialog is draggable.
         *
         * Default value is `true`.
         *
         * @returns Value of property `draggable`
         */
        getDraggable(): Promise<boolean>;

        /**
         * Sets a new value for property `draggable`.
         *
         * Indicates whether the Dialog is draggable.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setDraggable(bDraggable: boolean): Promise<void>;

        /**
         * Gets current value of property `resizable`.
         *
         * Indicates whether the Dialog is resizable.
         *
         * Default value is `true`.
         *
         * @returns Value of property `resizable`
         */
        getResizable(): Promise<boolean>;

        /**
         * Sets a new value for property `resizable`.
         *
         * Indicates whether the Dialog is resizable.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setResizable(bResizable: boolean): Promise<void>;

        /**
         * Gets current value of property `showHeader`.
         *
         * Determines whether the header is shown inside the Dialog.
         *
         * Default value is `true`.
         *
         * @returns Value of property `showHeader`
         */
        getShowHeader(): Promise<boolean>;

        /**
         * Sets a new value for property `showHeader`.
         *
         * Determines whether the header is shown inside the Dialog.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setShowHeader(bShowHeader: boolean): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Icon displayed in the Dialog header.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<URI>;

        /**
         * Sets a new value for property `icon`.
         *
         * Icon displayed in the Dialog header.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: URI): Promise<void>;

        /**
         * Gets current value of property `state`.
         *
         * Affects the icon and the title color. If a value other than None is set, a predefined icon will be added to the Dialog. 
         * Setting the icon property will overwrite the predefined icon.
         *
         * Default value is `None`.
         *
         * @returns Value of property `state`
         */
        getState(): Promise<ValueState>;

        /**
         * Sets a new value for property `state`.
         *
         * Affects the icon and the title color. If a value other than None is set, a predefined icon will be added to the Dialog. 
         * Setting the icon property will overwrite the predefined icon.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setState(sState: ValueState): Promise<void>;

        /**
         * Gets current value of property `horizontalScrolling`.
         *
         * Indicates if the user can scroll horizontally inside the Dialog when the content is bigger than the content area.
         *
         * Default value is `true`.
         *
         * @returns Value of property `horizontalScrolling`
         */
        getHorizontalScrolling(): Promise<boolean>;

        /**
         * Sets a new value for property `horizontalScrolling`.
         *
         * Indicates if the user can scroll horizontally inside the Dialog when the content is bigger than the content area.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setHorizontalScrolling(bHorizontalScrolling: boolean): Promise<void>;

        /**
         * Open the dialog with optional context parameter.
         * 
         * @returns Promise<any>
         */
        open(context?: any): Promise<any>;

        /**
         * Close the dialog with optional context data, which is returned back to the parent view.
         * 
         * @returns Promise<void>
         */
        close(context?: any): Promise<void>;
    }
}
