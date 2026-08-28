declare module "sbo/m/library" {
    /**
     * @since 2405
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'ButtonType'.
     */
    export const enum ButtonType {
        /**
         * Accept type
         */
        Accept = "Accept",
        /**
         * Back type (back navigation button for header)
         */
        Back = "Back",
        /**
         * Default type (no special styling)
         */
        Default = "Default",
        /**
         * Emphasized type
         */
        Emphasized = "Emphasized",
        /**
         * Ghost type
         */
        Ghost = "Ghost",
        /**
         * Reject style
         */
        Reject = "Reject",
        /**
         * Transparent type
         */
        Transparent = "Transparent",
        /**
         * Unstyled type (no styling)
         */
        Unstyled = "Unstyled",
        /**
         * Up type (up navigation button for header)
         */
        Up = "Up",
    }
    /**
     * @since 2405
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'InputType'.
     */
    export const enum InputType {
        /**
         * Support format like number1+unit1+number2+unit2, such as "1.234Lb11.000Oz".
         */
        Measure = "Measure",
        /**
         * There is a "%" behind the input area.
         */
        Percent = "Percent",
        /**
         * Currency format.
         */
        Price = "Price",
        /**
         * Float format, with rounding accuracy setting for quantity.
         */
        Quantity = "Quantity",
        /**
         * Float format, with rounding accuracy setting for rate.
         */
        Rate = "Rate",
        /**
         * Text format.
         */
        String = "String",
        /**
         * Currency format.
         */
        Sum = "Sum",
        /**
         * Currency format.
         */
        Tax = "Tax",
        /**
         * Float format, with rounding accuracy setting for unit.
         */
        Unit = "Unit",
        /**
         * Integer format, without Fractional part.
         */
        Integer = "Integer",
        /**
         * Display "Hr" behind the input area.
         */
        Hour = "Hour",
    }
    /**
     * @since 2405
     * 
     * Available wrapping types for text controls that can be wrapped that enable you to display the text as hyphenated.
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'WrappingType'.
     */
    export const enum WrappingType {
        /**
         * Hyphenation will be used to break words on syllables where possible.
         */
        Hyphenated = "Hyphenated",
        /**
         * Normal text wrapping will be used. Words won't break based on hyphenation.
         */
        Normal = "Normal",
    }
    /**
     * @since 2502
     * 
     * Determines the behavior of items along the cross-axis.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'FlexAlignItems'.
     */
    export const enum FlexAlignItems {
        /**
         * The flex item's margin edges are placed flush against the cross-start edge of the line
         */
        Baseline = "Baseline",
        /**
         * The flex item's margin boxes are centered in the cross-axis within the line
         */
        Center = "Center",
        /**
         * The flex item's margin edges are placed flush with the cross-end edge of the line
         */
        End = "End",
        /**
         * Inherits the value from its parent
         */
        Inherit = "Inherit",
        /**
         * The flex item's margin edges are placed flush with the cross-start edge of the line
         */
        Start = "Start",
        /**
         * The flex item's margin boxes are close to the same size as the line as possible
         */
        Stretch = "Stretch"
    }

    /**
     * Determines the direction of child elements.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'FlexDirection'.
     */
    export const enum FlexDirection {
        /**
         * @since 2502
         * 
         * Flex items are laid out along the direction of the block axis (usually top to bottom)
         */
        Column = "Column",
        /**
         * Flex items are laid out along the reverse direction of the block axis (usually bottom to top)
         */
        ColumnReverse = "ColumnReverse",
        /**
         * Inherits the value from its parent
         */
        Inherit = "Inherit",
        /**
         * Flex items are laid out along the direction of the inline axis (text direction)
         */
        Row = "Row",
        /**
         * Flex items are laid out along the reverse direction of the inline axis (against the text direction)
         */
        RowReverse = "RowReverse"
    }

    /**
     * @since 2502
     * 
     * Determines the behavior along the main axis.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'FlexJustifyContent'.
     */
    export const enum FlexJustifyContent {
        /**
         * Flex items are packed toward the center of the line
         */
        Center = "Center",
        /**
         * Flex items are packed toward the end of the line
         */
        End = "End",
        /**
         * Inherits the value from its parent
         */
        Inherit = "Inherit",
        /**
         * Flex items are evenly distributed in the line, with half-size spaces on either end
         */
        SpaceAround = "SpaceAround",
        /**
         * Flex items are evenly distributed in the line
         */
        SpaceBetween = "SpaceBetween",
        /**
         * Flex items are packed toward the start of the line
         */
        Start = "Start"
    }

    /**
     * @since 2502
     * 
     * Modes in which a control will render empty indicator if its content is empty.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'EmptyIndicatorMode'.
     */
    export const enum EmptyIndicatorMode {
        /**
         * Empty indicator will be rendered depending on the context in which the control is placed
         */
        Auto = "Auto",
        /**
         * Empty indicator is never rendered
         */
        Off = "Off",
        /**
         * Empty indicator is rendered always when the control's content is empty
         */
        On = "On"
    }

    /**
     * @since 2502
     * 
     * Different modes for a MenuButton.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'MenuButtonMode'.
     */
    export const enum MenuButtonMode {
        /**
         * Default Regular type - MenuButton appears as a regular button, pressing it opens a menu
         */
        Regular = "Regular",
        /**
         * Split type - MenuButton appears as a split button separated into two areas
         */
        Split = "Split"
    }

    /**
     * @since 2502
     * 
     * Enumeration providing options for docking of some element to another.
     * 
     * This enum is part of the 'sbo/ui/core/library' module export and must be accessed by the property 'PopupDock'.
     */
    export const enum PopupDock {
        /**
         * Begin bottom
         */
        BeginBottom = "BeginBottom",
        /**
         * Begin center
         */
        BeginCenter = "BeginCenter",
        /**
         * Begin top
         */
        BeginTop = "BeginTop",
        /**
         * Center bottom
         */
        CenterBottom = "CenterBottom",
        /**
         * Center center
         */
        CenterCenter = "CenterCenter",
        /**
         * Center top
         */
        CenterTop = "CenterTop",
        /**
         * End bottom
         */
        EndBottom = "EndBottom",
        /**
         * End center
         */
        EndCenter = "EndCenter",
        /**
         * End top
         */
        EndTop = "EndTop",
        /**
         * Left bottom
         */
        LeftBottom = "LeftBottom",
        /**
         * Left center
         */
        LeftCenter = "LeftCenter",
        /**
         * Left top
         */
        LeftTop = "LeftTop",
        /**
         * Right bottom
         */
        RightBottom = "RightBottom",
        /**
         * Right center
         */
        RightCenter = "RightCenter",
        /**
         * Right top
         */
        RightTop = "RightTop"
    }

    /**
     * @since 2502
     * 
     * Different page modes for current view.
     * 
     * This enum is part of the 'sbo/m/library' module export and must be accessed by the property 'PageMode'.
     */
    export const enum PageMode {
        /**
         * Indicate the current view is in the state of creating a business object.
         */
        addMode = "Create",
        /**
         * Indicate the current view is in the state of editing a business object.
         */
        editMode = "Edit",
        /**
         * Indicate the current view is in the state of viewing a business object.
         */
        viewMode = "View"
    }
}
declare module "sbo/m/MessageBox" {
    /**
     * @since 2405
     * 
     * Enumeration of the pre-defined icons that can be used in a MessageBox.
     *
     * This enum is part of the 'sbo/m/MessageBox' module export and must be accessed by the property 'Icon'.
     */
    export const enum MessageBoxType {
        /**
         * Displays an error dialog with no icon.
         */
        None = "None",
        /**
         * Displays an error dialog with an ERROR icon.
         */
        Error = "Error",
        /**
         * Displays a success dialog with a SUCCESS icon.
         */
        Success = "Success",
        /**
         * Displays a warning dialog with a WARNING icon.
         */
        Warning = "Warning",
        /**
         * Displays a warning dialog with a INFORMATION icon.
         */
        Information = "Information",
        /**
         * Displays a warning dialog with a QUESTION icon.
         */
        Question = "Question",
    }
    /**
     * @since 2405
     * 
     * Enumeration of supported actions in a MessageBox.
     *
     * Each action is represented as a button in the message box. The values of this enumeration are used for
     * both, specifying the set of allowed actions as well as reporting back the user choice.
     *
     * This enum is part of the 'sbo/m/MessageBox' module export and must be accessed by the property 'Action'.
     */
    export const enum MessageBoxAction {
        /**
         * Adds an "Abort" button to the message box.
         */
        ABORT = "ABORT",
        /**
         * Adds a "Cancel" button to the message box.
         */
        CANCEL = "CANCEL",
        /**
         * Adds a "Close" button to the message box.
         */
        CLOSE = "CLOSE",
        /**
         * Adds a "Delete" button to the message box.
         */
        DELETE = "DELETE",
        /**
         * Adds an "Ignore" button to the message box.
         */
        IGNORE = "IGNORE",
        /**
         * Adds a "No" button to the message box.
         */
        NO = "NO",
        /**
         * Adds an "OK" button to the message box.
         */
        OK = "OK",
        /**
         * Adds a "Retry" button to the message box.
         */
        RETRY = "RETRY",
        /**
         * Adds a "Yes" button to the message box.
         */
        YES = "YES",
    }
}

declare module "sbo/m/Button" {
    import Control from "sbo/ui/core/Control";
    import { URI } from "sbo/ui/core/SDKEnv";
    import { ButtonType } from "sbo/m/library";
    /**
     * @since 2405
     * 
     * Enables users to trigger actions.
     *
     * For the `Button` UI, you can define text, icon, or both. You can also specify whether the text or the
     * icon is displayed first.
     *
     * You can set the `Button` as enabled or disabled. An enabled `Button` can be pressed by clicking or tapping
     * it and it changes its style to provide visual feedback to the user that it is pressed or hovered over
     * with the mouse cursor. A disabled `Button` appears inactive and cannot be pressed.
     */
    export default interface Button
        extends Control {
        /**
         * Gets current value of property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;
        /**
         * Sets a new value for property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled?: boolean): Promise<void>;
        /**
         * Gets current value of property `text`.
         * 
         * Determines the text of the `Button`.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets a new value for property `text`.
         *
         * Determines the text of the `Button`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets current value of property `buttonType`.
         *
         * Defines the `Button` type.
         *
         * Default value is `Default`.
         *
         * @returns Value of property `buttonType`
         */
        getButtonType(): Promise<ButtonType>;
        /**
         * Sets a new value for property `buttonType`.
         *
         * Defines the `Button` type.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `Default`.
         *
         * @returns Promise<void>
         */
        setButtonType(buttonType: ButtonType): Promise<void>;
        /**
         * Gets the tooltip of the Button.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the Button.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip for the Button.
         * 
         * Default value is `empty string`.
         * 
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;
        /**
          * Gets current value of property `icon`.
          *
          * Defines the icon to be displayed as graphical element within the `Button`. It can be an image or an icon
          * from the icon font.
          *
          * Default value is `empty string`.
          *
          * @returns Value of property `icon`
          */
        getIcon(): Promise<URI>;
        /**
         * Sets a new value for property `icon`.
         *
         * Defines the icon to be displayed as graphical element within the `Button`. It can be an image or an icon
         * from the icon font.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(text: string): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the button is visible. Invisible buttons are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the button is visible. Invisible buttons are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
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
         * Fires event press to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePress(): Promise<void>;
    }
}
declare module "sbo/m/Input" {
    import Control from "sbo/ui/core/Control";
    import Item from "sbo/ui/core/Item";
    import { InputType } from "sbo/m/library";
    import { ValueState, TextDirection, TextAlign } from "sbo/ui/core/library";
    /**
     * @since 2405
     * 
     * Allows the user to enter and edit text or numeric values in one line.
     */
    export default interface Input extends Control {
        /**
         * Gets current value of property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;
        /**
         * Sets a new value for property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         * 
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;
        /**
         * Gets current value of property `enabled`.
         *
         * Determines whether the control can be triggered by the user.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;
        /**
         * Sets a new value for property `enabled`.
         *
         * Determines whether the control can be triggered by the user.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;
        /**
         * Gets current value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;
        /**
         * Sets the value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;
        /**
         * Gets current value of property `inputType`.
         *
         * Defines the `Input` type.
         *
         * Default value is `String`.
         *
         * @returns Value of property `inputType`
         */
        getInputType(): Promise<InputType>;
        /**
        * a new value for property `inputType`.
        *
        * Defines the `Input` type.
        *
        * Default value is `String`.
        *
        * @returns  Promise<void>
        */
        setInputType(sInputType: InputType): Promise<void>;
        /**
         * Gets the tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the control.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip for the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>.
         */
        setTooltip(sTooltip: string): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;
        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;
        /**
        * Gets current value of property `hideLabel`.
        *
        * Determines whether to hide label.
        *
        * Default value is `false`.
        *
        * @returns Value of property `hideLabel`
        */
        getHideLabel(): Promise<boolean>;
        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction are left-to-right (LTR) and right-to-left (RTL).
         *
         * Default value is `LTR`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;
        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction are left-to-right (LTR) and right-to-left (RTL).
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `LTR`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;
        /**
         * Gets current value of property `textAlign`.
         *
         * Determines the text alignment in the text elements.
         *
         * Default value is `Right`.
         *
         * @returns Value of property `textAlign`
         */
        getTextAlign(): Promise<TextAlign>;
        /**
         * Sets a new value for property `textAlign`.
         *
         * Determines the text alignment in the text elements.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `Right`.
         *
         * @returns Promise<void>
         */
        setTextAlign(sTextAlign: TextAlign): Promise<void>;
        /**
         * Gets current value of property `maxLength`.
         *
         * Maximum number of characters.
         * 
         * Default value is `0`.
         *
         * @returns Value of property `maxLength`
         */
        getMaxLength(): Promise<number>;
        /**
         * Sets a new value for property `maxLength`.
         *
         * Maximum number of characters. 
         * 
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setMaxLength(nMaxLength: number): Promise<void>;
        /**
         * Gets current value of property `value`.
         *
         * Defines the value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;
        /**
         * Setter for property `value`.
         * 
         * Defines the value of the control.
         *
         * Default value is empty string.
         *
         * @returns Promise<void>
         */
        setValue(sValue: string): Promise<void>;
        /**
         * Gets current value of property `wrapping`.
         *
         * Determines the wrapping of the text within the `Label`. When set to `false` (default), the label text
         * will be truncated and and an ellipsis will be added at the end. If set to `true`, the label text will
         * wrap.
         *
         * Default value is `false`.
         *
         * @returns Value of property `wrapping`
         */
        getWrapping(): Promise<boolean>;
        /**
         * Sets a new value for property `wrapping`.
         *
         * Determines the wrapping of the text within the `Label`. When set to `false` (default), the label text
         * will be truncated and and an ellipsis will be added at the end. If set to `true`, the label text will
         * wrap.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setWrapping(bWrapping: boolean): Promise<void>;
        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;
        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;
        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;
        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;
        /**
         * Gets current value of property `showSuggestion`.
         *
         * If this is set to true, suggest event is fired when user types in the input. Changing the suggestItems
         * aggregation in suggest event listener will show suggestions within a popup. 
         *
         * Default value is `false`.
         *
         * @returns Value of property `showSuggestion`
         */
        getShowSuggestion(): Promise<boolean>;
        /**
         * Sets a new value for property 'showSuggestion'.
         *
         * If this is set to true, suggest event is fired when user types in the input. Changing the suggestItems
         * aggregation in suggest event listener will show suggestions within a popup.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowSuggestion(bShowSuggestion: boolean): Promise<void>;
        /**
         * Gets content of aggregation `suggestionItems`.
         *
         * `SuggestionItems` are the items which will be shown in the suggestions list. 
         * 
         * Default value is `empty array`.
         *          
         *  @returns Promise<Item[]>
         */
        getSuggestionItems(): Promise<Item[]>;
        /**
         * Gets current value of property `currency`.
         * 
         * The currency part ($, EUR…) of a Currency (Sum,Tax,Price…) Input. When input bind the currency property, the 
         * currency value will be validated and can not be empty.
         * 
         * Default value is `null`.
         *
         * @returns Value of property `currency`
         */
        getCurrency(): Promise<string>;
        /**
         * Sets a new value of property `currency`.
         * 
         * The currency part ($, EUR…) of a Currency (Sum,Tax,Price…) Input. When input bind the currency property, the 
         * currency value will be validated and can not be empty.
         * 
         * Default value is `null`.
         *
         * @returns Promise<void>
         */
        setCurrency(sCurrency: string): Promise<void>;
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
         * Fires event change to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event suggest to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSuggest(mParameters: { suggestValue?: string }): Promise<void>
    }
}
declare module "sbo/m/StaticText" {
    import Control from "sbo/ui/core/Control";
    import { WrappingType } from "sbo/m/library";
    /**
     * @since 2405
     * 
     * The StaticText control can be used for embedding longer text paragraphs, that need text wrapping, into your app. If the configured text value contains HTML code or script tags, those will be escaped.
     */
    export default interface StaticText extends Control {
        /**
         * Gets current value of property label.
         *
         * Label of the control
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;
        /**
         * Sets a new value for property 'label'.
         *
         * Label of the control
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;
        /**
         * Gets current value of property `hideLabel`.
         *
         * Determines whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;
        /**
         * Gets current value of property `text`.
         *
         * Determines th text to be displayed.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets a new value for property `text`.
         *
         * Determines text to be displayed.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets current value of property `maxLines`.
         *
         * Limits the number of lines for wrapping texts.
         * 
         * No default value.
         *
         * @returns Value of property `maxLines`
         */
        getMaxLines(): Promise<number>;
        /**
         * Sets a new value for property `maxLines`.
         *
         * Limits the number of lines for wrapping texts.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         * 
         * No default value.
         *
         * @returns Promise<void>
         */
        setMaxLines(nMaxLines: number): Promise<void>;
        /**
         * Gets current value of property `renderWhitespace`.
         *
         * Specifies how whitespace inside the control are handled. If true, whitespace will be preserved
         * by the browser.
         *
         * Default value is `true`.
         *
         * @returns Value of property `renderWhitespace`
         */
        getRenderWhitespace(): Promise<boolean>;
        /**
         * Sets a new value for property `renderWhitespace`.
         *
         * Specifies how whitespace inside the control are handled. If true, whitespace will be preserved
         * by the browser.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setRenderWhitespace(bRenderWhitespace: boolean): Promise<void>;
        /**
         * Gets current value of property `wrapping`.
         *
         * Determines the wrapping of the text. When set to `false`, the label text
         * will be truncated and and an ellipsis will be added at the end. If set to `true`, the label text will
         * wrap.
         *
         * Default value is `true`.
         *
         * @returns Value of property `wrapping`
         */
        getWrapping(): Promise<boolean>;
        /**
         * Sets a new value for property `wrapping`.
         *
         * Determines the wrapping of the text. When set to `false`, the label text
         * will be truncated and and an ellipsis will be added at the end. If set to `true`, the label text will
         * wrap.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setWrapping(bWrapping: boolean): Promise<void>;
        /**
         * Gets current value of property `wrappingType`.
         *
         * Defines the type of wrapping to be used.
         *
         * Default value is `Normal`.
         *
         * @returns Value of property `wrappingType`
         */
        getWrappingType(): Promise<WrappingType>;
        /**
         * Sets a new value for property `wrappingType`.
         *
         * Defines the type of wrapping to be used.
         *
         * Default value is `Normal`.
         *
         * @returns Promise<void>
         */
        setWrappingType(sWrappingType: WrappingType): Promise<void>;
        /**
         * Gets current value of property 'visible'.
         *
         * Invisible inputs are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Invisible inputs are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Gets the tooltip of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the control.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip for the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;
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
declare module "sbo/m/CheckBox" {
    import Control from "sbo/ui/core/Control";
    /**
     * @since 2405
     * 
     * Allows the user to set a binary value, such as true/false or yes/no for an item.
     */
    export default interface CheckBox extends Control {
        /**
         * Gets current value of property `selected`.
         *
         * Determines whether the `CheckBox` is selected (checked).
         *
         * When this property is set to `true`, the control is displayed as selected, unless the value of the `partiallySelected`
         * property is also set to `true`. In this case, the control is displayed as partially selected.
         *
         * Default value is `false`.
         *
         * @returns Value of property `selected`
         */
        getSelected(): Promise<boolean>;
        /**
         * Sets a new value for property `selected`.
         *
         * Determines whether the `CheckBox` is selected (checked).
         *
         * When this property is set to `true`, the control is displayed as selected, unless the value of the `partiallySelected`
         * property is also set to `true`. In this case, the control is displayed as partially selected.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setSelected(bSelected: boolean): Promise<void>;
        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;
        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;
        /**
         * Gets current value of property `hideLabel`.
         *
         * Determines whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;
        /**
         * Gets the tooltip of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the control.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip for the BusyDialog.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;
        /**
         * Gets current value of property `editable`.
         *
         * Specifies whether the user shall be allowed to edit the state of the checkbox
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;
        /**
         * Sets a new value for property `editable`.
         *
         * Specifies whether the user shall be allowed to edit the state of the checkbox
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
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
         * Fires event select to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSelect(mParameters: { selected?: boolean }): Promise<void>;
    }
}
declare module "sbo/m/ComboBox" {
    import Control from "sbo/ui/core/Control";
    import Item from "sbo/ui/core/Item";
    import { ValueState } from "sbo/ui/core/library";
    /**
     * @since 2405
     * 
     * This control is a drop-down list for selecting and filtering values. 
     * The control represents a drop-down menu with a list of the available options and a text input field to narrow down the options.
     */
    export default interface ComboBox extends Control {
        /**
         * Gets current value of property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;
        /**
         * Sets a new value for property `editable`.
         *
         * Defines whether the control can be modified by the user or not.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(editable: boolean): Promise<void>;
        /**
         * Reflector for the internal header's selectedKey property.
         * 
         * Default value is `empty string`.
         *
         * @returns The current property value.
         */
        getSelectedKey(): Promise<string>;
        /**
         * Reflector for the internal header's selectedKey property.
         * 
         * Default value is `empty string`.
         *
         * @returns this Pointer for chaining.
         */
        setSelectedKey(selectedKey: string): Promise<void>;
        /**
         * Gets the tooltip of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the control.
         */
        getTooltip(): Promise<string>;
        /**
         * Sets the tooltip for the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(tooltip: string): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(visible: boolean): Promise<void>;
        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;
        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(label: string): Promise<void>;
        /**
         * Gets current value of property `hideLabel`.
         *
         * Determines whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;
        /**
         * Gets current value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;
        /**
         * Sets the value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;
        /**
         * Gets current value of property `filterSecondaryValues`.
         *
         * Indicates whether filter apply to additionalText.
         *
         * Default value is `false`.
         *
         * @returns Value of property `filterSecondaryValues`
         */
        getFilterSecondaryValues(): Promise<boolean>;
        /**
         * Sets a new value for property `filterSecondaryValues`.
         *
         * Indicates whether filter apply to additionalText.
         *
         * Default value is `false`.
         * 
         * @returns Promise<void>
         */
        setFilterSecondaryValues(filterSecondaryValues: boolean): Promise<void>;
        /**
         * Gets current value of property `showSecondaryValues`.
         *
         * Indicates whether the text values of the `additionalText` property are shown.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showSecondaryValues`
         */
        getShowSecondaryValues(): Promise<boolean>;
        /**
         * Sets a new value for property `showSecondaryValues`.
         *
         * Indicates whether the text values of the `additionalText` property are shown.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowSecondaryValues(showSecondaryValues: boolean): Promise<void>;
        /**
         * Gets content of aggregation `items`.
         * 
         * Default value is `empty array`.
         *
         * Flex items within the control.
         */
        getItems(): Promise<Item[]>;
        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;
        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(valueState: ValueState): Promise<void>;
        /**
         * Gets current value of property `valueState`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;
        /**
         * Sets a new value for property `valueState`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(valueStateText: string): Promise<void>;
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
         * Fires event change to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event loadItems to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireLoadItems(): Promise<void>;
    }
}
declare module "sbo/m/Section" {
    import SubSection from "sbo/ui/core/SubSection";
    import Control from "sbo/ui/core/Control";
    /**
     * @since 2405
     * 
     * Section is a top-level information container, which is generally used in an object page layout and is for the purpose of aggregating subsections containing second-level information. 
     */
    export default interface Section extends Control {
        /**
         * Gets current value of property `visible`.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(visible: boolean): Promise<void>;
        /**
         * Gets current value of property `text`.
         *
         * Optional text displayed inside the dialog.
         *
         * Default value is `Start`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets the text for the control.
         * 
         * Default value is `Start`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
        /**
         * Gets current value of property `subSections`.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<SubSection[]>
         */
        getSubSections(): Promise<SubSection[]>;
        /**
         * Gets current value of property `showTitle`.
         *
         * Determines whether the text is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `showTitle`
         */
        getShowTitle(): Promise<boolean>;
        /**
         * Sets a new value of property `showTitle`.
         *
         * Determines whether the text is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setShowTitle(showTitle: boolean): Promise<void>;
    }
}
declare module "sbo/m/Grid" {
    import { SelectionBehavior, SelectionMode } from "sbo/ui/core/library";
    import Control from "sbo/ui/core/Control";
    import { CSSSize, int } from "sbo/ui/core/SDKEnv";
    import Column from "sbo/ui/core/Column";
    import Row from "sbo/ui/core/Row";
    /**
     * @since 2405
     * 
     * This control provides a comprehensive set of features for displaying and dealing with vast amounts of data.
     */
    export default interface Grid extends Control {
        /**
         * Gets current value of property `title`.
         *
         * Title text appears in the grid.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;
        /**
         * Sets a new value for property `title`.
         *
         * Title text appears in the grid.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(title: string): Promise<void>;
        /**
         * Gets current value of property `rowsData`.
         *
         * The property for binding data.
         * 
         * Default value is `empty array`.
         * 
         * @returns Value of property `rowsData`
         */
        getRowsData(): Promise<any[]>;
        /**
         * Gets the value of property `visibleRowCount`.
         * 
         * The number of visible rows of the grid.
         * 
         * Default value is `20`.
         * 
        * @returns Promise<void>
        */
        getVisibleRowCount(): Promise<number>;
        /**
         * Sets a new value of property `visibleRowCount`.
         * 
         * The number of visible rows of the grid.
         * 
         * Default value is `20`.
         * 
        * @returns Promise<void>
        */
        setVisibleRowCount(visibleRowCount: number): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Hides or shows a control on the UI.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Hides or shows a control on the UI.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(visible: boolean): Promise<void>;
        /**
         * Gets current value of property `selectionMode`.
         *
         * Defines selection mode of the table.
         *
         * Default value is `multiple`.
         *
         * @returns Value of property `selectionMode`
         */
        getSelectionMode(): Promise<SelectionMode>;
        /**
         * Sets a new value of property `selectionMode`.
         *
         * Defines selection mode of the table.
         *
         * Default value is `multiple`.
         *
         * @returns Promise<void>
         */
        setSelectionMode(selectionMode: SelectionMode): Promise<void>;
        /**
         * Gets current value of property `columnHeaderHeight`.
         *
         * Defines header row height in pixel.
         * 
         * Default value is `0`.
         *
         * @returns Value of property `columnHeaderHeight`
         */
        getColumnHeaderHeight(): Promise<number>;
        /**
         * Sets a new value of property `columnHeaderHeight`.
         *
         * Defines header row height in pixel.
         * 
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setColumnHeaderHeight(columnHeaderHeight: number): Promise<void>;
        /**
         * Gets current value of property `columnHeaderVisible`.
         *
         * Flag whether the column header is visible or not.
         *
         * Default value is `true`.
         *
         * @returns Value of property `columnHeaderVisible`
         */
        getColumnHeaderVisible(): Promise<boolean>;
        /**
         * Sets a new value of property `columnHeaderVisible`.
         *
         * Flag whether the column header is visible or not.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setColumnHeaderVisible(columnHeaderVisible: boolean): Promise<void>;
        /**
         * Gets current value of property `enableSelectAll`.
         *
         * Specifies if a select all button should be displayed in the top left corner. This button is only displayed if the row selector is visible and the selection mode is set to any kind of multi selection.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enableSelectAll`
         */
        getEnableSelectAll(): Promise<boolean>;
        /**
         * Sets a new value of property `enableSelectAll`.
         *
         * Specifies if a select all button should be displayed in the top left corner. This button is only displayed if the row selector is visible and the selection mode is set to any kind of multi selection.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnableSelectAll(enableSelectAll: boolean): Promise<void>;
        /**
         * Gets current value of property `firstVisibleRow`.
         *
         * Defines first visible row.
         *
         * Default value is `0`.
         *
         * @returns Value of property `firstVisibleRow`
         */
        getFirstVisibleRow(): Promise<number>;
        /**
         * Sets a new value of property `firstVisibleRow`.
         *
         * Defines first visible row.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setFirstVisibleRow(firstVisibleRow: number): Promise<void>;
        /**
         * Gets current value of property `rowHight`.
         *
         * Defines row height in pixel.
         * 
         * Default value is `0`.
         *
         * @returns Value of property `rowHight`
         * */
        getRowHeight(): Promise<number>;
        /**
         * Sets a new value of property `rowHight`.
         *
         * Defines row height in pixel.
         * 
         * Default value is `0`.
         *
         * @returns Promise<void>
         * */
        setRowHeight(rowHeight: number): Promise<void>;
        /**
         * Gets current value of property `selectionBehavior`.
         *
         * Defines selection behavior of the Table. This property defines whether the row selector is displayed and whether the row, the row selector or both can be clicked to select a row.
         *
         * Default value is `RowSelector`.
         *
         * @returns Value of property `selectionBehavior`
         */
        getSelectionBehavior(): Promise<SelectionBehavior>;
        /**
        * Sets a new value of property `selectionBehavior`.
        *
        * Defines selection behavior of the Table. This property defines whether the row selector is displayed and whether the row, the row selector or both can be clicked to select a row.
        *
        * Default value is `RowSelector`.
        *
        * @returns Promise<void>
        */
        setSelectionBehavior(selectionBehavior: SelectionBehavior): Promise<void>;
        /**
         * Gets current value of property `showNoData`.
         *
         * Defines whether or not the text specified in the `noDataText` property is displayed.
         *
         * Default value is `true`.
         *
         * @returns Value of property `showNoData`
         */
        getShowNoData(): Promise<boolean>;
        /**
         * Sets a new value for property `showNoData`.
         *
         * Defines whether or not the text specified in the `noDataText` property is displayed.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setShowNoData(showNoData: boolean): Promise<void>;
        /**
         * Gets current value of property `width`.
         *
         * Defines the width of the table.
         * 
         * Default value is `100%`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;
        /**
         * Sets a new value for property `width`.
         *
         * Defines the width of the table.
         * 
         * Default value is `100%`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;
        /**
         * Gets content of aggregation `noData`.
         *
         * Defines the custom visualization if there is no data available. 
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `noData`
         */
        getNoData(): Promise<string>;
        /**
         * Sets the aggregated `noData`.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setNoData(noData: string): Promise<void>;
        /**
         * Gets current busy state.
         *
         * Default value is `false`.
         * 
         * @returns value of current busy state.
         */
        getBusy(): Promise<boolean>;
        /**
         * Enables/Disables busy state.
         *
         * Default value is `false`.
         * 
         * @returns Promise<void>
         */
        setBusy(busy: boolean): Promise<void>;
        /**
         * Get binding data size.
         */
        getSize(): Promise<int>;
        /**
         * Get the editable status.
         */
        getEditable(): Promise<boolean>;
        /**
         * Get selection mode of the grid.
         */
        getSelectionMode(): Promise<SelectionMode>;
        /**
         * Removes complete selection.
         */
        clearSelection(): Promise<void>;
        /**
         * Zero-based indices of selected items, wrapped in an array. An empty array means "no selection".
         */
        getSelectedIndices(): Promise<int[]>;
        /**
         * The actual selected items indices in data, not the indices on UI (Maybe the data is sorted / filtered).
         */
        getAllSelectedIndices(): Promise<int[]>;
        /**
         * Sets a new value for property selectedIndex.
         * 
         * Zero-based index of selected item. Index value for no selection is -1. When multi-selection is enabled and multiple items are selected, the method returns the lead selected item. Sets the zero-based index of the currently selected item. This method removes any previous selections. When the given index is invalid, the call is ignored.
         * When called with a value of null or undefined, the default value of the property will be restored.
         * 
         * Default value is -1.
         * 
         * @param iSelectedIndex - New value for property selectedIndex
         */
        setSelectedIndex(iSelectedIndex?: int): Promise<void>;
        /**
         * Adds the given selection interval to the selection. In case of single selection, only iIndexTo is added to the selection.
         * @param {int} iIndexFrom - The index from which the selection should start
         * @param {int} iIndexTo - The index up to which to select
         */
        addSelectionInterval(iIndexFrom?: int, iIndexTo?: int): Promise<void>;
        /**
         * Removes the given selection interval from the selection. In case of single selection, only iIndexTo is removed from the selection.
         * @param {int} iIndexFrom - The index from which the selection should start
         * @param {int} iIndexTo - The index up to which to select
         */
        removeSelectionInterval(iIndexFrom?: int, iIndexTo?: int): Promise<void>;
        /**
         * Get of binding data.
         * @param iRowIndex - The index of row
         */
        getRowData(iRowIndex?: int): Promise<any>;
        /**
         * Get the indices of filtered data
         */
        getFilteredIndices(): Promise<int[]>;
        /**
         * The grid is initialized.
         */
        ready(): Promise<void>;
        /**
         * Set filter.
         * @param options - The parameter `options` should have the following members: 
         * - {object[]} filters - Additional filters to be set with the grid.
         * - {boolean} and - Determine if need create logical AND combinations of filter.
         */
        setFilter(options?: object): Promise<void>;
        /**
         * Clear sorting in the grid columns.
         */
        resetSort(): Promise<void>;
        /**
         * Remove the rows of data.
         * @param {int[]} indices - The indices of data to be removed
         */
        removeRows(indices?: int[]): Promise<void>;
        /**
         * @since 2608
         * 
         * Scroll to a specified row index in the Grid.
         *
         * @param rowIndex - The index of row
         */
        scrollToRowIndex(rowIndex: number): Promise<void>;
        /**
         * Get column by guid.
         * @param {string} sCtrlGuid - The column control guid
         */
        Column(sCtrlGuid?: string): Promise<Column>;
        /**
         * Get all the columns. 
         */
        getColumns(): Promise<Column[]>;
        /**
         * Get Row by index.
         * @param {int} iIndex - The index of row
         */
        Row(iIndex?: int): Promise<Row>;
        /**
         * @since 2508
         * 
         * Fires event ItemPressed to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireItemPressed(mParameters: { value?: object }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event rowSelectionChange to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireRowSelectionChange(mParameters: { rowIndex?: int, rowIndices?: int[], selectAll?: boolean, userInteraction?: boolean }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event firstVisibleRowChanged to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireFirstVisibleRowChanged(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event sort to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSort(mParameters: { column?: object, sortOrder?: string, columnAdded?: boolean }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event filter to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireFilter(mParameters: { column?: object, value?: string }): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event paste to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePaste(mParameters: { data?: string[][] }): Promise<void>;
    }
}

declare module "sbo/m/MessageStrip" {
    import Control from "sbo/ui/core/Control";
    import { MessageType } from "sbo/ui/core/library";
    import { URI } from "sbo/ui/core/SDKEnv";
    /**
     * @since 2502
     * 
     * MessageStrip control enables the embedding of application-related messages in the application.
     */
    export default interface MessageStrip extends Control {
        /**
         * Gets current value of property `customIcon`.
         * 
         * Represents an RFC3986 conformant URI starting with 'sap-icon://'.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `customIcon`
         */
        getCustomIcon(): Promise<URI>;

        /**
         * Sets a new value for property `customIcon`.
         * 
         * Represents an RFC3986 conformant URI starting with 'sap-icon://'.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setCustomIcon(sCustomIcon: URI): Promise<void>;

        /**
         * Gets current value of property `showCloseButton`.
         *
         * Determines if the message has a close button in the upper right corner.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showCloseButton`
         */
        getShowCloseButton(): Promise<boolean>;

        /**
         * Sets a new value for property `showCloseButton`.
         *
         * Determines if the message has a close button in the upper right corner.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowCloseButton(bShowCloseButton: boolean): Promise<void>;

        /**
         * Gets current value of property `showIcon`.
         *
         * Determines if an icon is displayed for the message.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showIcon`
         */
        getShowIcon(): Promise<boolean>;

        /**
         * Sets a new value for property `showIcon`.
         *
         * Determines if an icon is displayed for the message.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowIcon(bShowIcon: boolean): Promise<void>;

        /**
         * Gets current value of property `text`.
         *
         * Determines the text of the message.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * Determines the text of the message.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `type`.
         *
         * Determines the type of message.
         *
         * Default value is `Information`.
         *
         * @returns Value of property `type`
         */
        getType(): Promise<MessageType>;

        /**
         * Sets a new value for property `type`.
         *
         * Determines the type of message.
         *
         * Default value is `Information`.
         *
         * @returns Promise<void>
         */
        setType(sType: MessageType): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Closes the MessageStrip.
         * 
         * @returns Promise<void>
         */
        close(): Promise<void>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event close to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireClose(): Promise<void>;
    }
}

declare module "sbo/m/HBox" {
    import Control from "sbo/ui/core/Control";
    import { FlexDirection, FlexJustifyContent, FlexAlignItems } from "sbo/m/library";
    import { CSSSize } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * The HBox control builds the container for a horizontal flexible box layout.
     */
    export default interface HBox extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;

        /**
         * Sets a new value for property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * The width of the flexible box.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * The width of the flexible box.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `direction`.
         *
         * Determines the direction of the layout of child elements.
         *
         * Default value is `Row`.
         *
         * @returns Value of property `direction`
         */
        getDirection(): Promise<FlexDirection>;

        /**
         * Sets a new value for property `direction`.
         *
         * Determines the direction of the layout of child elements.
         *
         * Default value is `Row`.
         *
         * @returns Promise<void>
         */
        setDirection(sDirection: FlexDirection): Promise<void>;

        /**
         * Gets current value of property `justifyContent`.
         *
         * Determines the layout behavior along the main axis.
         *
         * Default value is `Start`.
         *
         * @returns Value of property `justifyContent`
         */
        getJustifyContent(): Promise<FlexJustifyContent>;

        /**
         * Sets a new value for property `justifyContent`.
         *
         * Determines the layout behavior along the main axis.
         *
         * Default value is `Start`.
         *
         * @returns Promise<void>
         */
        setJustifyContent(sJustifyContent: FlexJustifyContent): Promise<void>;

        /**
         * Gets current value of property `alignItems`.
         *
         * Determines the layout behavior of items along the cross-axis.
         *
         * Default value is `Stretch`.
         *
         * @returns Value of property `alignItems`
         */
        getAlignItems(): Promise<FlexAlignItems>;

        /**
         * Sets a new value for property `alignItems`.
         *
         * Determines the layout behavior of items along the cross-axis.
         *
         * Default value is `Stretch`.
         *
         * @returns Promise<void>
         */
        setAlignItems(sAlignItems: FlexAlignItems): Promise<void>;

        /**
         * Gets content of aggregation `items`.
         *
         * Flex items within the flexible box layout.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<any[]>
         */
        getItems(): Promise<any[]>;
    }
}

declare module "sbo/m/DatePicker" {
    import Control from "sbo/ui/core/Control";
    import { ValueState, TextAlign, CalendarType } from "sbo/ui/core/library";

    /**
     * @since 2502
     * 
     * DatePicker control lets users select a localized date using touch, mouse, or keyboard input.
     */
    export default interface DatePicker extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `value`.
         *
         * The value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;

        /**
         * Sets a new value for property `value`.
         *
         * The value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValue(sValue: string): Promise<void>;

        /**
         * Gets current value of property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;

        /**
         * Sets a new value for property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `displayFormat`.
         *
         * Determines the format, displayed in the input field, by default the medium format of the used locale is used
         *
         * @returns Value of property `displayFormat`
         */
        getDisplayFormat(): Promise<string>;

        /**
         * Sets a new value for property `displayFormat`.
         *
         * Determines the format, displayed in the input field, by default the medium format of the used locale is used
         *
         * @returns Promise<void>
         */
        setDisplayFormat(sDisplayFormat: string): Promise<void>;

        /**
         * Gets current value of property `displayFormatType`.
         *
         * Determines the calendar type for the displayed format.
         *
         * @returns Value of property `displayFormatType`
         */
        getDisplayFormatType(): Promise<CalendarType>;

        /**
         * Sets a new value for property `displayFormatType`.
         *
         * Determines the calendar type for the displayed format.
         *
         * @returns Promise<void>
         */
        setDisplayFormatType(sDisplayFormatType: CalendarType): Promise<void>;

        /**
         * Gets current value of property `valueFormat`.
         *
         * Determines the format of the value property.
         * 
         * Default value is `yyyyMMdd`.
         *
         * @returns Value of property `valueFormat`
         */
        getValueFormat(): Promise<string>;

        /**
         * Gets current value of property `placeholder`.
         *
         * Defines a short hint intended to aid the user with data entry when the control has no value, if no placeholder is set, the used displayFormat is displayed as a placeholder
         *
         * @returns Value of property `placeholder`
         */
        getPlaceholder(): Promise<string>;

        /**
         * Sets a new value for property `placeholder`.
         *
         * Defines a short hint intended to aid the user with data entry when the control has no value, if no placeholder is set, the used displayFormat is displayed as a placeholder
         *
         * @returns Promise<void>
         */
        setPlaceholder(sPlaceholder: string): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Determines whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Determines whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Defines the state of the control.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Defines the state of the control.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;

        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;

        /**
         * Gets current value of property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Value of property `textAlign`
         */
        getTextAlign(): Promise<TextAlign>;

        /**
         * Sets a new value for property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Promise<void>
         */
        setTextAlign(sTextAlign: TextAlign): Promise<void>;

        /**
         * Gets current value of property `maxDate`.
         *
         * Maximum date that can be shown and selected in the DatePicker. This must be a JavaScript date object.
         * 
         * @returns Value of property `maxDate`
         */
        getMaxDate(): Promise<any>;

        /**
         * Sets a new value for property `maxDate`.
         *
         * Maximum date that can be shown and selected in the DatePicker. This must be a JavaScript date object.
         *
         * @returns Promise<void>
         */
        setMaxDate(sMaxDate: any): Promise<void>;

        /**
         * Gets current value of property `minDate`.
         *
         * Minimum date that can be shown and selected in the DatePicker. This must be a JavaScript date object.
         *
         * @returns Value of property `minDate`
         */
        getMinDate(): Promise<any>;

        /**
         * Sets a new value for property `minDate`.
         *
         * Minimum date that can be shown and selected in the DatePicker. This must be a JavaScript date object.
         *
         * @returns Promise<void>
         */
        setMinDate(sMinDate: any): Promise<void>;

        /**
         * Gets current value of property `showCurrentDateButton`.
         *
         * Determine whether there is a shortcut navigation to Today.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showCurrentDateButton`
         */
        getShowCurrentDateButton(): Promise<boolean>;

        /**
         * Sets a new value for property `showCurrentDateButton`.
         *
         * Determine whether there is a shortcut navigation to Today.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowCurrentDateButton(bShowCurrentDateButton: boolean): Promise<void>;

        /**
         * Gets current value of property `showFooter`.
         *
         * Hides or shows the popover's footer.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showFooter`
         */
        getShowFooter(): Promise<boolean>;

        /**
         * Sets a new value for property `showFooter`.
         *
         * Hides or shows the popover's footer.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowFooter(bShowFooter: boolean): Promise<void>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event change to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
    }
}

declare module "sbo/m/TimePicker" {
    import Control from "sbo/ui/core/Control";
    import { ValueState, TextAlign } from "sbo/ui/core/library";

    /**
     * @since 2502
     * 
     * TimePicker control enables users to fill time related input fields using touch, mouse, or keyboard input.
     */
    export default interface TimePicker extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `value`.
         *
         * The value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;

        /**
         * Sets a new value for property `value`.
         *
         * The value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValue(sValue: string): Promise<void>;

        /**
         * Gets current value of property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;

        /**
         * Sets a new value for property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `displayFormat`.
         *
         * Determines the format, displayed in the input field.
         *
         * Default value is `HH:mm`.
         *
         * @returns Value of property `displayFormat`
         */
        getDisplayFormat(): Promise<string>;

        /**
         * Sets a new value for property `displayFormat`.
         *
         * Determines the format, displayed in the input field.
         *
         * Default value is `HH:mm`.
         *
         * @returns Promise<void>
         */
        setDisplayFormat(sDisplayFormat: string): Promise<void>;

        /**
         * Gets current value of property `valueFormat`.
         *
         * Determines the format of the value property.
         *
         * Default value is `HHmm`.
         *
         * @returns Value of property `valueFormat`
         */
        getValueFormat(): Promise<string>;

        /**
         * Gets current value of property `placeholder`.
         *
         * Defines a short hint intended to aid the user with data entry when the control has no value.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `placeholder`
         */
        getPlaceholder(): Promise<string>;

        /**
         * Sets a new value for property `placeholder`.
         *
         * Defines a short hint intended to aid the user with data entry when the control has no value.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setPlaceholder(sPlaceholder: string): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Determines whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Determines whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Defines the state of the control.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Defines the state of the control.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;

        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;

        /**
         * Gets current value of property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Value of property `textAlign`
         */
        getTextAlign(): Promise<TextAlign>;

        /**
         * Sets a new value for property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Promise<void>
         */
        setTextAlign(sTextAlign: TextAlign): Promise<void>;

        /**
         * Gets current value of property `showCurrentTimeButton`.
         *
         * Determine whether there is a shortcut navigation to current time.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showCurrentTimeButton`
         */
        getShowCurrentTimeButton(): Promise<boolean>;

        /**
         * Sets a new value for property `showCurrentTimeButton`.
         *
         * Determine whether there is a shortcut navigation to current time.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowCurrentTimeButton(bShowCurrentTimeButton: boolean): Promise<void>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event change to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
    }
}

declare module "sbo/m/ObjectStatus" {
    import Control from "sbo/ui/core/Control";
    import { URI } from "sbo/ui/core/SDKEnv";
    import { ValueState, TextDirection } from "sbo/ui/core/library";
    import { EmptyIndicatorMode } from "sbo/m/library";

    /**
     * @since 2502
     * 
     * ObjectStatus control displays status information that can be either text with a value state, or an icon.
     */
    export default interface ObjectStatus extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `text`.
         *
         * Defines the ObjectStatus text.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * Defines the ObjectStatus text.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `active`.
         *
         * Indicates if the ObjectStatus text and icon can be clicked/tapped by the user.
         *
         * Default value is `true`.
         *
         * @returns Value of property `active`
         */
        getActive(): Promise<boolean>;

        /**
         * Sets a new value for property `active`.
         *
         * Indicates if the ObjectStatus text and icon can be clicked/tapped by the user.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setActive(bActive: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `state`.
         *
         * Defines the state of the control. The allowed values are from the enum type `sbo.ui.core.ValueState` and `sbo.ui.core.IndicationColor`.
         *
         * Default value is `None`.
         *
         * @returns Value of property `state`
         */
        getState(): Promise<string>;

        /**
         * Sets a new value for property `state`.
         *
         * Defines the state of the control. The allowed values are from the enum type `sbo.ui.core.ValueState` and `sbo.ui.core.IndicationColor`.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setState(sState: string): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<URI>;

        /**
         * Sets a new value for property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: URI): Promise<void>;

        /**
         * Gets current value of property `emptyIndicatorMode`.
         *
         * Determines how empty text is displayed.
         *
         * Default value is `Off`.
         *
         * @returns Value of property `emptyIndicatorMode`
         */
        getEmptyIndicatorMode(): Promise<EmptyIndicatorMode>;

        /**
         * Sets a new value for property `emptyIndicatorMode`.
         *
         * Determines how empty text is displayed.
         *
         * Default value is `Off`.
         *
         * @returns Promise<void>
         */
        setEmptyIndicatorMode(sMode: EmptyIndicatorMode): Promise<void>;

        /**
         * Gets current value of property `inverted`.
         *
         * Determines whether the background color reflects the set state instead of the control's text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `inverted`
         */
        getInverted(): Promise<boolean>;

        /**
         * Sets a new value for property `inverted`.
         *
         * Determines whether the background color reflects the set state instead of the control's text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setInverted(bInverted: boolean): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event press to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePress(): Promise<void>;
    }
}

declare module "sbo/m/MenuItem" {
    import Control from "sbo/ui/core/Control";
    import { URI } from "sbo/ui/core/SDKEnv";
    import { TextDirection } from "sbo/ui/core/library";

    /**
     * @since 2502
     * 
     * A MenuItem is a control to create items for the MenuButton.
     */
    export default interface MenuItem extends Control {
        /**
         * Gets current value of property `key`.
         *
         * Can be used as input for subsequent actions.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `key`
         */
        getKey(): Promise<string>;

        /**
         * Sets a new value for property `key`.
         *
         * Can be used as input for subsequent actions.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setKey(sKey: string): Promise<void>;

        /**
         * Gets current value of property `text`.
         *
         * The text to be displayed for the item.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * The text to be displayed for the item.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<URI>;

        /**
         * Sets a new value for property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: URI): Promise<void>;

        /**
         * Gets current value of property `enabled`.
         *
         * Determines whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Determines whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `startsSection`.
         *
         * Defines whether a visual separator should be rendered before the item.
         *
         * Default value is `false`.
         *
         * @returns Value of property `startsSection`
         */
        getStartsSection(): Promise<boolean>;

        /**
         * Sets a new value for property `startsSection`.
         *
         * Defines whether a visual separator should be rendered before the item.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setStartsSection(bStartsSection: boolean): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event press to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePress(): Promise<void>;
    }
}

declare module "sbo/m/MenuButton" {
    import Control from "sbo/ui/core/Control";
    import { CSSSize, URI } from "sbo/ui/core/SDKEnv";
    import { TextDirection } from "sbo/ui/core/library";
    import { ButtonType, MenuButtonMode, PopupDock } from "sbo/m/library";
    import MenuItem from "sbo/m/MenuItem";

    /**
     * @since 2502
     * 
     * MenuButton control enables the user to show a hierarchical menu.
     */
    export default interface MenuButton extends Control {
        /**
         * Gets current value of property `text`.
         *
         * Defines the text of the MenuButton.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * Defines the text of the MenuButton.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<URI>;

        /**
         * Sets a new value for property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: URI): Promise<void>;

        /**
         * Gets current value of property `enabled`.
         *
         * Determines whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Determines whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `type`.
         *
         * Defines the type of the MenuButton.
         *
         * Default value is `Transparent`.
         *
         * @returns Value of property `type`
         */
        getType(): Promise<ButtonType>;

        /**
         * Sets a new value for property `type`.
         *
         * Defines the type of the MenuButton.
         *
         * Default value is `Transparent`.
         *
         * @returns Promise<void>
         */
        setType(sType: ButtonType): Promise<void>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `buttonMode`.
         *
         * Defines whether the MenuButton is set to Regular or Split mode.
         *
         * Default value is `Regular`.
         *
         * @returns Value of property `buttonMode`
         */
        getButtonMode(): Promise<MenuButtonMode>;

        /**
         * Sets a new value for property `buttonMode`.
         *
         * Defines whether the MenuButton is set to Regular or Split mode.
         *
         * Default value is `Regular`.
         *
         * @returns Promise<void>
         */
        setButtonMode(sButtonMode: MenuButtonMode): Promise<void>;

        /**
         * Gets current value of property `useDefaultActionOnly`.
         *
         * Controls whether the default action handler is invoked always or it is invoked only until a menu item is selected.
         * Usable only if buttonMode is set to Split.
         *
         * Default value is `false`.
         *
         * @returns Value of property `useDefaultActionOnly`
         */
        getUseDefaultActionOnly(): Promise<boolean>;

        /**
         * Sets a new value for property `useDefaultActionOnly`.
         *
         * Controls whether the default action handler is invoked always or it is invoked only until a menu item is selected.
         * Usable only if buttonMode is set to Split.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setUseDefaultActionOnly(bUseDefaultActionOnly: boolean): Promise<void>;

        /**
         * Gets current value of property `menuPosition`.
         *
         * Specifies the position of the popup menu with enumerated options.
         *
         * Default value is `BeginBottom`.
         *
         * @returns Value of property `menuPosition`
         */
        getMenuPosition(): Promise<PopupDock>;

        /**
         * Sets a new value for property `menuPosition`.
         *
         * Specifies the position of the popup menu with enumerated options.
         *
         * Default value is `BeginBottom`.
         *
         * @returns Promise<void>
         */
        setMenuPosition(sMenuPosition: PopupDock): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Specifies the element's text directionality with enumerated options.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Specifies the element's text directionality with enumerated options.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width of the MenuButton in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width of the MenuButton in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets content of aggregation `items`.
         *
         * Defines the menu that opens for this button.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<MenuItem[]>
         */
        getItems(): Promise<MenuItem[]>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event itemSelected to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireItemSelected(mParameters: { item?: object }): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event loadItems to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireLoadItems(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event defaultAction to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireDefaultAction(): Promise<void>;
    }
}

declare module "sbo/m/Image" {
    import Control from "sbo/ui/core/Control";
    import { CSSSize, URI } from "sbo/ui/core/SDKEnv";
    import LightBoxItem from "sbo/m/LightBoxItem";

    /**
     * @since 2502
     * 
     * Image control displays image loaded from a remote or local server.
     */
    export default interface Image extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `src`.
         *
         * Relative or absolute path to URL where the image file is stored.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `src`
         */
        getSrc(): Promise<URI>;

        /**
         * Sets a new value for property `src`.
         *
         * Relative or absolute path to URL where the image file is stored.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setSrc(sSrc: URI): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `height`.
         *
         * Height in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `height`
         */
        getHeight(): Promise<CSSSize>;

        /**
         * Sets a new value for property `height`.
         *
         * Height in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setHeight(sHeight: CSSSize): Promise<void>;

        /**
         * Gets current value of property `alt`.
         *
         * The alternative text that is displayed in case the image is not available, or cannot be displayed.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `alt`
         */
        getAlt(): Promise<string>;

        /**
         * Sets a new value for property `alt`.
         *
         * The alternative text that is displayed in case the image is not available, or cannot be displayed.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setAlt(sAlt: string): Promise<void>;

        /**
         * Gets current value of property `lazyLoading`.
         *
         * Enables lazy loading for images that are offscreen.
         *
         * Default value is `false`.
         *
         * @returns Value of property `lazyLoading`
         */
        getLazyLoading(): Promise<boolean>;

        /**
         * Sets a new value for property `lazyLoading`.
         *
         * Enables lazy loading for images that are offscreen.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setLazyLoading(bLazyLoading: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determines whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets content of aggregation `imageContent`.
         *
         * Items displayed in the popup.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<LightBoxItem[]>
         */
        getImageContent(): Promise<LightBoxItem[]>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event load to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireLoad(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event press to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePress(): Promise<void>;
    }
}

declare module "sbo/m/TextArea" {
    import Control from "sbo/ui/core/Control";
    import { TextDirection, ValueState, Wrapping } from "sbo/ui/core/library";
    import { CSSSize } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * TextArea control is used to enter multiple lines of text.
     */
    export default interface TextArea extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Determine whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Determine whether the control is editable.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;

        /**
         * Sets a new value for property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Defines the text directionality of the input field.
         *
         * Default value is `LTR`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Defines the text directionality of the input field.
         *
         * Default value is `LTR`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;
        /**
         * Gets current value of property `rows`.
         *
         * Defines the number of visible text lines for the control.
         *
         * Default value is `4`.
         *
         * @returns Value of property `rows`
         */
        getRows(): Promise<number>;

        /**
         * Sets a new value for property `rows`.
         *
         * Defines the number of visible text lines for the control.
         *
         * Default value is `4`.
         *
         * @returns Promise<void>
         */
        setRows(iRows: number): Promise<void>;

        /**
         * Gets current value of property `cols`.
         *
         * Defines the visible width of the control, in average character widths.
         *
         * Default value is `1000`.
         *
         * @returns Value of property `cols`
         */
        getCols(): Promise<number>;

        /**
         * Sets a new value for property `cols`.
         *
         * Defines the visible width of the control, in average character widths.
         *
         * Default value is `1000`.
         *
         * @returns Promise<void>
         */
        setCols(iCols: number): Promise<void>;

        /**
         * Gets current value of property `maxLength`.
         *
         * Defines the maximum number of characters that the value can be.
         *
         * Default value is `0`.
         *
         * @returns Value of property `maxLength`
         */
        getMaxLength(): Promise<number>;

        /**
         * Sets a new value for property `maxLength`.
         *
         * Defines the maximum number of characters that the value can be.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setMaxLength(iMaxLength: number): Promise<void>;

        /**
         * Gets current value of property `value`.
         *
         * Defines the value of the control.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;

        /**
         * Sets a new value for property `value`.
         *
         * Defines the value of the control.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValue(sValue: string): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Visualizes the validation state of the control.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Visualizes the validation state of the control.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;

        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text that appears in the value state message pop-up.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;

        /**
         * Gets current value of property `growing`.
         *
         * Indicates the ability of the control to automatically grow and shrink dynamically with its content.
         *
         * Default value is `false`.
         *
         * @returns Value of property `growing`
         */
        getGrowing(): Promise<boolean>;

        /**
         * Sets a new value for property `growing`.
         *
         * Indicates the ability of the control to automatically grow and shrink dynamically with its content.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setGrowing(bGrowing: boolean): Promise<void>;

        /**
         * Gets current value of property `growingMaxLines`.
         *
         * Defines the maximum number of lines that the control can grow.
         *
         * Default value is `0`.
         *
         * @returns Value of property `growingMaxLines`
         */
        getGrowingMaxLines(): Promise<number>;

        /**
         * Sets a new value for property `growingMaxLines`.
         *
         * Defines the maximum number of lines that the control can grow.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setGrowingMaxLines(iGrowingMaxLines: number): Promise<void>;

        /**
         * Gets current value of property `height`.
         *
         * Defines the height of the control in CSS units.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `height`
         */
        getHeight(): Promise<CSSSize>;

        /**
         * Sets a new value for property `height`.
         *
         * Defines the height of the control.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setHeight(sHeight: CSSSize): Promise<void>;
        /**
         * Gets current value of property `width`.
         *
         * Defines the width of the control in CSS units.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Defines the width of the control in CSS units.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `showExceededText`.
         *
         * Determines whether the characters, exceeding the maximum allowed character count, are visible in the input field.
         *
         * Default value is `false`.
         *
         * @returns Value of property `showExceededText`
         */
        getShowExceededText(): Promise<boolean>;

        /**
         * Sets a new value for property `showExceededText`.
         *
         * Determines whether the characters, exceeding the maximum allowed character count, are visible in the input field.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setShowExceededText(bShowExceededText: boolean): Promise<void>;

        /**
         * Gets current value of property `valueLiveUpdate`.
         *
         * Indicates when the value property gets updated with the user changes.
         *
         * Default value is `false`.
         *
         * @returns Value of property `valueLiveUpdate`
         */
        getValueLiveUpdate(): Promise<boolean>;

        /**
         * Sets a new value for property `valueLiveUpdate`.
         *
         * Indicates when the value property gets updated with the user changes.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setValueLiveUpdate(bValueLiveUpdate: boolean): Promise<void>;

        /**
         * Gets current value of property `wrapping`.
         *
         * Indicates how the control wraps the text.
         *
         * Default value is `None`.
         *
         * @returns Value of property `wrapping`
         */
        getWrapping(): Promise<Wrapping>;

        /**
         * Sets a new value for property `wrapping`.
         *
         * Indicates how the control wraps the text.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setWrapping(sWrapping: Wrapping): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event change to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
    }
}

declare module "sbo/m/LightBoxItem" {
    import Control from "sbo/ui/core/Control";
    import { URI } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * LightBoxItem control represents an item which is displayed within a LightBox.
     */
    export default interface LightBoxItem extends Control {
        /**
         * Gets current value of property `imageSrc`.
         *
         * Source for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `imageSrc`
         */
        getImageSrc(): Promise<URI>;

        /**
         * Sets a new value for property `imageSrc`.
         *
         * Source for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setImageSrc(sImageSrc: URI): Promise<void>;

        /**
         * Gets current value of property `alt`.
         *
         * Alt value for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `alt`
         */
        getAlt(): Promise<string>;

        /**
         * Sets a new value for property `alt`.
         *
         * Alt value for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setAlt(sAlt: string): Promise<void>;

        /**
         * Gets current value of property `subtitle`.
         *
         * Subtitle text for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `subtitle`
         */
        getSubtitle(): Promise<string>;

        /**
         * Sets a new value for property `subtitle`.
         *
         * Subtitle text for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setSubtitle(sSubtitle: string): Promise<void>;

        /**
         * Gets current value of property `title`.
         *
         * Title text for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;

        /**
         * Sets a new value for property `title`.
         *
         * Title text for the image.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(sTitle: string): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
    }
}

declare module "sbo/m/RadioButton" {
    import Control from "sbo/ui/core/Control";
    import { TextAlign, TextDirection, ValueState } from "sbo/ui/core/library";
    import { CSSSize } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * RadioButton is a control similar to a checkbox, but it allows you to choose only one of the predefined set of options.
     * Multiple radio buttons have to belong to the same group (have the same value for groupName) in order to be mutually exclusive.
     */
    export default interface RadioButton extends Control {
        /**
         * Gets current value of property `text`.
         *
         * Specifies the text displayed next to the radio button.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * Specifies the text displayed next to the radio button.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `selected`.
         *
         * Specifies the select state of the radio button.
         *
         * Default value is `false`.
         *
         * @returns Value of property `selected`
         */
        getSelected(): Promise<boolean>;

        /**
         * Sets a new value for property `selected`.
         *
         * Sets the state of the RadioButton to selected.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setSelected(bSelected: boolean): Promise<void>;

        /**
         * Gets current value of property `enabled`.
         *
         * Specifies if the radio button is disabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Specifies if the radio button is disabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Specifies whether the user can select the radio button.
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Specifies whether the user can select the radio button.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether the user can see the radio button.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether the user can see the radio button.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `key`.
         *
         * Indicates a unique key for radio button
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `key`
         */
        getKey(): Promise<string>;

        /**
         * Sets a new value for property `key`.
         *
         * Indicates a unique key for the radio button
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setKey(sKey: string): Promise<void>;

        /**
         * Gets current value of property `groupName`.
         *
         * Name of the radio button group the current radio button belongs to.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `groupName`
         */
        getGroupName(): Promise<string>;

        /**
         * Sets a new value for property `groupName`.
         *
         * Name of the radio button group the current radio button belongs to.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setGroupName(sGroupName: string): Promise<void>;

        /**
         * Gets current value of property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Value of property `textAlign`
         */
        getTextAlign(): Promise<TextAlign>;

        /**
         * Sets a new value for property `textAlign`.
         *
         * Determines the text alignment.
         *
         * Default value is `Begin`.
         *
         * @returns Promise<void>
         */
        setTextAlign(sTextAlign: TextAlign): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Gets current value of property `useEntireWidth`.
         *
         * Indicates if the given width will be applied for the whole RadioButton or only it's label.
         * By Default width is set only for the label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `useEntireWidth`
         */
        getUseEntireWidth(): Promise<boolean>;

        /**
         * Sets a new value for property `useEntireWidth`.
         *
         * Indicates if the given width will be applied for the whole RadioButton or only it's label. 
         * By Default width is set only for the label.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setUseEntireWidth(bUseEntireWidth: boolean): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width of the RadioButton or it's label depending on the useEntireWidth property.
         * By Default width is set only for the label.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width of the RadioButton or it's label depending on the useEntireWidth property.
         * By Default width is set only for the label.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setToolTip(sToolTip: string): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event select to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSelect(mParameters: { selected?: boolean }): Promise<void>;
    }
}

declare module "sbo/m/RadioButtonGroup" {
    import Control from "sbo/ui/core/Control";
    import { TextDirection, ValueState } from "sbo/ui/core/library";
    import { CSSSize, int } from "sbo/ui/core/SDKEnv";
    import RadioButton from "sbo/m/RadioButton";

    /**
     * @since 2502
     * 
     * radio button group used as a wrapper for a group of b1.sdk.RadioButton controls, which can be used as a single UI element. You can select only one of the grouped radio buttons at a time.
     */
    export default interface RadioButtonGroup extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `enabled`.
         *
         * Switches the enabled state of the control. All RadioButtons inside a disabled group are disabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Switches the enabled state of the control. All RadioButtons inside a disabled group are disabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Specifies whether the user can change the selected value of the RadioButtonGroup.
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Specifies whether the user can change the selected value of the RadioButtonGroup.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `selectedIndex`.
         *
         * Determines the index of the selected/checked RadioButton. 
         * Default is 0. If no radio button is selected, the selectedIndex property will return -1.
         *
         * Default value is `0`.
         *
         * @returns Value of property `selectedIndex`
         */
        getSelectedIndex(): Promise<int>;

        /**
         * Sets a new value for property `selectedIndex`.
         *
         * Determines the index of the selected/checked RadioButton.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setSelectedIndex(nSelectedIndex: int): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc. 
         * Changing this property will also change the state of all radio buttons inside the group.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc. 
         * Changing this property will also change the state of all radio buttons inside the group.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Specifies the width of the RadioButtonGroup.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Specifies the width of the RadioButtonGroup.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `columns`.
         *
         * Specifies the maximum number of radio buttons displayed in one line.
         *
         * Default value is `1`.
         *
         * @returns Value of property `columns`
         */
        getColumns(): Promise<int>;

        /**
         * Sets a new value for property `columns`.
         *
         * Specifies the maximum number of radio buttons displayed in one line.
         *
         * Default value is `1`.
         *
         * @returns Promise<void>
         */
        setColumns(nColumns: int): Promise<void>;
        /**
        * Gets content of aggregation `items`.
        *
        * Aggregation of items to be displayed.
        * 
        * Default value is `empty array`.
        *
        * @returns Promise<RadioButton[]>
        */
        getItems(): Promise<RadioButton[]>;
        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
        /**
         * @since 2508
         * 
         * Fires event select to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSelect(mParameters: { selectedIndex?: int }): Promise<void>;
    }
}

declare module "sbo/m/ObjectNumber" {
    import Control from "sbo/ui/core/Control";
    import { ValueState, TextDirection, TextAlign } from "sbo/ui/core/library";
    import { EmptyIndicatorMode } from "sbo/m/library";

    /**
     * @since 2502
     * 
     * The ObjectNumber control displays number and number unit properties for an object. The number can be displayed using semantic colors to provide additional meaning about the object to the user.
     */
    export default interface ObjectNumber extends Control {
        /**
         * Gets current value of property `number`.
         *
         * Defines the number field.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `number`
         */
        getNumber(): Promise<string>;

        /**
         * Sets a new value for property `number`.
         *
         * Defines the number field.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setNumber(sNumber: string): Promise<void>;

        /**
         * Gets current value of property `unit`.
         *
         * Defines the number units qualifier.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `unit`
         */
        getUnit(): Promise<string>;

        /**
         * Sets a new value for property `unit`.
         *
         * Defines the number units qualifier.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setUnit(sUnit: string): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `state`.
         *
         * Determines the object number's value state. 
         *
         * Default value is `None`.
         *
         * @returns Value of property `state`
         */
        getState(): Promise<ValueState>;

        /**
         * Sets a new value for property `state`.
         *
         * Determines the object number's value state. 
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setState(sState: ValueState): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the number and unit text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the number and unit text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Gets current value of property `textAlign`.
         *
         * Sets the horizontal alignment of the number and unit.
         *
         * Default value is `Begin`.
         *
         * @returns Value of property `textAlign`
         */
        getTextAlign(): Promise<TextAlign>;

        /**
         * Sets a new value for property `textAlign`.
         *
         * Sets the horizontal alignment of the number and unit.
         *
         * Default value is `Begin`.
         *
         * @returns Promise<void>
         */
        setTextAlign(sTextAlign: TextAlign): Promise<void>;

        /**
         * Gets current value of property `active`.
         *
         * Indicates if the ObjectNumber text and icon can be clicked/tapped by the user.
         *
         * Default value is `false`.
         *
         * @returns Value of property `active`
         */
        getActive(): Promise<boolean>;

        /**
         * Sets a new value for property `active`.
         *
         * Indicates if the ObjectNumber text and icon can be clicked/tapped by the user.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setActive(bActive: boolean): Promise<void>;

        /**
         * Gets current value of property `inverted`.
         *
         * Determines whether the background color reflects the set state instead of the control's text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `inverted`
         */
        getInverted(): Promise<boolean>;

        /**
         * Sets a new value for property `inverted`.
         *
         * Determines whether the background color reflects the set state instead of the control's text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setInverted(bInverted: boolean): Promise<void>;

        /**
         * Gets current value of property `emptyIndicatorMode`.
         *
         * Specifies if an empty indicator should be displayed when there is no number.
         *
         * Default value is `Off`.
         *
         * @returns Value of property `emptyIndicatorMode`
         */
        getEmptyIndicatorMode(): Promise<EmptyIndicatorMode>;

        /**
         * Sets a new value for property `emptyIndicatorMode`.
         *
         * Specifies if an empty indicator should be displayed when there is no number.
         *
         * Default value is `Off`.
         *
         * @returns Promise<void>
         */
        setEmptyIndicatorMode(sMode: EmptyIndicatorMode): Promise<void>;

        /**
         * Gets current value of property `emphasized`.
         *
         * Indicates if the object number should appear emphasized.
         *
         * Default value is `true`.
         *
         * @returns Value of property `emphasized`
         */
        getEmphasized(): Promise<boolean>;

        /**
         * Sets a new value for property `emphasized`.
         *
         * Indicates if the object number should appear emphasized.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEmphasized(bEmphasized: boolean): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
    }
}

declare module "sbo/m/ProgressIndicator" {
    import Control from "sbo/ui/core/Control";
    import { ValueState, TextDirection } from "sbo/ui/core/library";
    import { CSSSize } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * The ProgressIndicator control shows the progress of a process in a graphical way.
     */
    export default interface ProgressIndicator extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `state`.
         *
         * Specifies the state of the bar.
         *
         * Default value is `None`.
         *
         * @returns Value of property `state`
         */
        getState(): Promise<ValueState>;

        /**
         * Sets a new value for property `state`.
         *
         * Specifies the state of the bar.
         *
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setState(sState: ValueState): Promise<void>;

        /**
         * Gets current value of property `percentValue`.
         *
         * Specifies the numerical value in percent for the length of the progress bar.
         *
         * Default value is `0`.
         *
         * @returns Value of property `percentValue`
         */
        getPercentValue(): Promise<number>;

        /**
         * Sets a new value for property `percentValue`.
         *
         * Specifies the numerical value in percent for the length of the progress bar.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setPercentValue(nPercentValue: number): Promise<void>;

        /**
         * Gets current value of property `displayValue`.
         *
         * Specifies the text value to be displayed in the bar.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `displayValue`
         */
        getDisplayValue(): Promise<string>;

        /**
         * Sets a new value for property `displayValue`.
         *
         * Specifies the text value to be displayed in the bar.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setDisplayValue(sDisplayValue: string): Promise<void>;

        /**
         * Gets current value of property `showValue`.
         *
         * Indicates whether the displayValue should be shown in the ProgressIndicator.
         *
         * Default value is `true`.
         *
         * @returns Value of property `showValue`
         */
        getShowValue(): Promise<boolean>;

        /**
         * Sets a new value for property `showValue`.
         *
         * Indicates whether the displayValue should be shown in the ProgressIndicator.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setShowValue(bShowValue: boolean): Promise<void>;

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
         * Sets a new value for property `enabled`.
         *
         * Determine whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `displayAnimation`.
         *
         * Determines whether a percentage change is displayed with animation.
         *
         * Default value is `true`.
         *
         * @returns Value of property `displayAnimation`
         */
        getDisplayAnimation(): Promise<boolean>;

        /**
         * Sets a new value for property `displayAnimation`.
         *
         * Determines whether a percentage change is displayed with animation.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setDisplayAnimation(bDisplayAnimation: boolean): Promise<void>;

        /**
         * Gets current value of property `displayOnly`.
         *
         * Determines whether the control is in display-only state where the control has different visualization and cannot be focused.
         *
         * Default value is `false`.
         *
         * @returns Value of property `displayOnly`
         */
        getDisplayOnly(): Promise<boolean>;

        /**
         * Sets a new value for property `displayOnly`.
         *
         * Determines whether the control is in display-only state where the control has different visualization and cannot be focused.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setDisplayOnly(bDisplayOnly: boolean): Promise<void>;

        /**
         * Gets current value of property `height`.
         *
         * Specifies the height of the control in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `height`
         */
        getHeight(): Promise<CSSSize>;

        /**
         * Sets a new value for property `height`.
         *
         * Specifies the height of the control in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setHeight(sHeight: CSSSize): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Specifies the element's text directionality with enumerated options.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Specifies the element's text directionality with enumerated options.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Specifies the width of the control in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Specifies the width of the control in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;
    }
}

declare module "sbo/m/SegmentedButton" {
    import Control from "sbo/ui/core/Control";
    import { CSSSize } from "sbo/ui/core/SDKEnv";
    import SegmentedButtonItem from "sbo/m/SegmentedButtonItem";

    /**
     * @since 2502
     * 
     * A horizontal control made of multiple buttons, which can display a title or an image.
     */
    export default interface SegmentedButton extends Control {
        /**
         * Gets current value of property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Control introduction/title.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
         * Gets current value of property `hideLabel`.
         *
         * Whether to hide label.
         *
         * Default value is `false`.
         *
         * @returns Value of property `hideLabel`
         */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets current value of property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;

        /**
         * Sets a new value for property `mandatory`.
         *
         * Whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `selectedKey`.
         *
         * Key of the selected item.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `selectedKey`
         */
        getSelectedKey(): Promise<string>;

        /**
         * Sets a new value for property `selectedKey`.
         *
         * Key of the selected item.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setSelectedKey(sSelectedKey: string): Promise<void>;

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
         * Sets a new value for property `enabled`.
         *
         * Determine whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `tooltip`
         */
        getTooltip(): Promise<string>;

        /**
         * Sets a new value for property `tooltip`.
         *
         * Tooltip text when user hover on this control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets content of aggregation `items`.
         *
         * Aggregation of items to be displayed.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<SegmentedButtonItem[]>
         */
        getItems(): Promise<SegmentedButtonItem[]>;

        /**
         * Get the text of the selected item.
         *
         * @returns The selected text.
         */
        getSelectedText(): Promise<string>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event selectionChange to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireSelectionChange(mParameters: { item?: object, selectionChange?: { oldValue?: string, value?: string } }): Promise<void>;
    }
}

declare module "sbo/m/SegmentedButtonItem" {
    import Control from "sbo/ui/core/Control";
    import { URI } from "sbo/ui/core/SDKEnv";
    import { TextDirection } from "sbo/ui/core/library";
    import { CSSSize } from "sbo/ui/core/SDKEnv";

    /**
     * @since 2502
     * 
     * Used for creating buttons for the SegmentedButton.
     */
    export default interface SegmentedButtonItem extends Control {
        /**
         * Gets current value of property `key`.
         *
         * Key of the item.
         *
         * @returns Value of property `key`
         */
        getKey(): Promise<string>;

        /**
         * Sets a new value for property `key`.
         *
         * Key of the item.
         *
         * @returns Promise<void>
         */
        setKey(sKey: string): Promise<void>;

        /**
         * Gets current value of property `text`.
         *
         * Display text.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;

        /**
         * Sets a new value for property `text`.
         *
         * Display text.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<URI>;

        /**
         * Sets a new value for property `icon`.
         *
         * Represents an RFC3986 conformant URI.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: URI): Promise<void>;

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
         * Sets a new value for property `enabled`.
         *
         * Determine whether the control is enabled.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Determine whether the control is visible.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width in CSS units.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Value of property `textDirection`
         */
        getTextDirection(): Promise<TextDirection>;

        /**
         * Sets a new value for property `textDirection`.
         *
         * Available options for the text direction.
         *
         * Default value is `Inherit`.
         *
         * @returns Promise<void>
         */
        setTextDirection(sTextDirection: TextDirection): Promise<void>;

        /**
         * Sets the focus to the stored focus DOM reference.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * @since 2508
         * 
         * Fires event press to attached listeners.
         * 
         * @returns Promise<void>
         */
        firePress(): Promise<void>;
    }
}


declare module "sbo/m/ChooseFromList" {
    import Control from "sbo/ui/core/Control";
    import { ValueState } from "sbo/ui/core/library";
    /**
     * @since 2508
     * 
     * Allows users to select items from a table defined in B1. 
     */
    export default interface ChooseFromList extends Control {
        /**
         * Gets current value of property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;
        /**
         * Sets a new value for property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;
        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;
        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;
        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;
        /**
        * Gets current value of property `hideLabel`.
        *
        * Determines whether to hide label.
        *
        * @returns Value of property `hideLabel`
        */
        getHideLabel(): Promise<boolean>;
        /**
         * Gets current value of property `value`.
         *
         * Defines the value of the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;
        /**
         * Setter for property `value`.
         * 
         * Defines the value of the control.
         *
         * @returns Promise<void>
         */
        setValue(sValue: string): Promise<void>;
        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;
        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;
        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;
        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;
      
        /**
         * Gets the current value of the `showLinkButton` property.
         *
         * Determines whether the link button is displayed.
         * 
         * Default value is `false`.
         *
         * @returns A promise that resolves to a boolean indicating the visibility of the link button.
         */
        getShowLinkButton(): Promise<boolean>;

        /**
         * Sets a new value for the `showLinkButton` property.
         *
         * Determines whether the link button is displayed.
         *
         * @param bShowLinkButton - A boolean value to set the visibility of the link button.
         * @returns A promise that resolves when the value is set.
         */
        setShowLinkButton(bShowLinkButton: boolean): Promise<void>;

        /**
         * Gets the current value of the `filter` property.
         *
         * Defines the OData filter criteria for the control.
         *
         * @returns A promise that resolves to a string representing the OData filter value.
         */
        getFilter(): Promise<string>;

        /**
         * Sets a new value for the `filter` property.
         *
         * Defines the OData filter criteria for the control.
         *
         * @param sFilter - A string value to set as the filter.
         * @returns A promise that resolves when the filter value is set.
         */
        setFilter(sFilter: string): Promise<void>;

        /**
         * Gets the current value of the `linkTo` property.
         * 
         * Defines the B1 table name associated to the control.
         * 
         * @returns A promise that resolves to a string representing the B1 table name.
         */
        getLinkTo(): Promise<string>;
        /**
         * Sets a new value for the `linkTo` property.
         * 
         * Defines the B1 table name associated to the control.
         * 
         * @param sLinkTo - A string value to set as the B1 table name.
         * @returns A promise that resolves when the B1 table name is set.
         */
        setLinkTo(sLinkTo: string): Promise<void>;

        /**
         * Gets the current value of the `multiSelection` property.
         * 
         * Defines whether the control allows multiple selections.
         * 
         * @returns A promise that resolves to a boolean indicating if multiple selections are allowed.
         */
        getMultiSelection(): Promise<boolean>;

        /**
         * Sets a new value for the `multiSelection` property.
         * 
         * Defines whether the control allows multiple selections.
         * 
         * @param bMultiSelection - A boolean value to set the multi-selection mode.
         * @returns A promise that resolves when the multi-selection mode is set.
         */
        setMultiSelection(bMultiSelection: boolean): Promise<void>;

        /**
         * Focuses the current control.
         * 
         * @returns A promise that resolves when the focus is set.
         */
        focus(): Promise<void>;

        /**
         * Gets the selected item's description.
         * 
         * @returns A promise that resolves to a string representing the selected item's description.
         */
        getSelectedText(): Promise<string>;

        /**
         * Fires the change event to attached listeners.
         *
         * @param mParameters - An object containing the parameters for the change event.
         * 
         * @param mParameters.value - The new value of the control.
         * @param mParameters.oldValue - The old value of the control.
         * 
         * @returns A promise that resolves when the change event is fired.
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;
    }
}

declare module "sbo/m/MultiComboBox" {
    import Control from "sbo/ui/core/Control";
    import Item from "sbo/ui/core/Item";
    import { ValueState } from "sbo/ui/core/library";
    /**
     * @since 2602
     * 
     * MultiComboBox control provides a list box with items and a text field allowing the user to either type a value directly into the control or choose from the list of existing items. 
     */
    export default interface MultiComboBox extends Control {
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
        * Gets current value of property `hideLabel`.
        *
        * Determines whether to hide label.
        *
        * @returns Value of property `hideLabel`
        */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets the tooltip of the Button.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the Button.
         */
        getTooltip(): Promise<string>;

        /**
         * Sets the tooltip for the Button.
         * 
         * Default value is `empty string`.
         * 
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

        /**
         * Gets current value of property `selectedKeys`.
         *
         * Defines the keys of the selected items.
         * 
         * Default value is `empty string array`.
         *
         * @returns Value of property `selectedKeys`
         */
        getSelectedKeys(): Promise<string[]>;

        /**
         * Setter for property `selectedKeys`.
         * 
         * Defines keys of the selected items.
         *
         * @returns Promise<void>
         */
        setSelectedKeys(sKeys: string[]): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value e.g., Error, Success, etc.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;

        /**
         * Sets a new value for property `valueStateText`.
         *
         * Defines the text of the value state message popup. If this is not specified, a default text is shown
         * from the resource bundle.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;

        /**
         * Gets the current value of the `showSecondaryValues` property.
         *
         * Indicates whether the text values of the additionalText property of an item are shown.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `showSecondaryValues`
         */
        getShowSecondaryValues(): Promise<boolean>;

        /**
         * Sets a new value for the `showSecondaryValues` property.
         *
         * Determines whether the text values of the additionalText property of an item are shown.
         *
         * @param bShowSecondaryValues - A boolean value
         *
         * @returns Promise<void>
         */
        setShowSecondaryValues(bShowSecondaryValues: boolean): Promise<void>;

        /**
         * Gets the current value of the `showSelectAll` property.
         *
         * Indicates if the select all checkbox is visible on top of suggestions.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `showSelectAll`
         */
        getShowSelectAll(): Promise<boolean>;

        /**
         * Sets a new value for the `showSelectAll` property.
         *
         * Determines if the select all checkbox is visible on top of suggestions.
         *
         * @param bShowSelectAll - A boolean value
         *
         * @returns Promise<void>
         */
        setShowSelectAll(bShowSelectAll: boolean): Promise<void>;

        /**
         * Gets content of aggregation `items`.
         * 
         * Default value is `empty array`.
         *
         * Flex items within the control.
         */
        getItems(): Promise<Item[]>;

        /**
         * Focuses the current control.
         * 
         * @returns A promise that resolves when the focus is set.
         */
        focus(): Promise<void>;

        /**
         * Fires event selectionChange to attached listeners.
         * 
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {object} changedItem - Item which selection is changed.
         * @param {Array<object>} changedItems - Array of items whose selection has changed.
         * @param {boolean} selected - Selection state: true if item is selected, false if item is not selected.
         * @param {boolean} selectAll - Indicates whether the select all action is triggered or not.
         *
         * @returns Promise<void>
         */
        fireSelectionChange(mParameters: { changedItem?: object, changedItems?: object[], selected?: boolean, selectAll?: boolean }): Promise<void>;

        /**
         * Fires event selectionFinish to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {Array<object>} selectedItems - The selected items which are selected after list box has been closed
         * 
         * @returns Promise<void>
         */
        fireSelectionFinish(mParameters: { selectedItems?: object[] }): Promise<void>;

        /**
         * Fires event loadItems to attached listeners.
         * 
         * @returns Promise<void>
         */
        fireLoadItems(): Promise<void>;
    }
}

declare module "sbo/m/MultiInput" {
    import Control from "sbo/ui/core/Control";
    import { int } from "sbo/ui/core/SDKEnv";
    import Item from "sbo/ui/core/Item";
    import Token from "sbo/m/Token";
    /**
     * @since 2602
     * 
     * The MultiInput field allows the user to enter multiple values, which are displayed as tokens.
     */
    export default interface MultiInput extends Control {
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the control is visible. Invisible controls are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `label`.
         *
         * Defines the label of the control.
         * 
         * @returns Value of property `label`
         */
        getLabel(): Promise<string>;

        /**
         * Sets a new value for property `label`.
         *
         * Defines the label of the control.
         * 
         * Default value is `empty string`.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * @returns Promise<void>
         */
        setLabel(sLabel: string): Promise<void>;

        /**
        * Gets current value of property `hideLabel`.
        *
        * Determines whether to hide label.
        *
        * @returns Value of property `hideLabel`
        */
        getHideLabel(): Promise<boolean>;

        /**
         * Gets the tooltip of the Button.
         * 
         * Default value is `empty string`.
         *
         * @returns The tooltip of the Button.
         */
        getTooltip(): Promise<string>;

        /**
         * Sets the tooltip for the Button.
         * 
         * Default value is `empty string`.
         * 
         * @returns Promise<void>
         */
        setTooltip(sTooltip: string): Promise<void>;

        /**
         * Gets current value of property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enabled`
         */
        getEnabled(): Promise<boolean>;

        /**
         * Sets a new value for property `enabled`.
         *
         * Whether the `Button` is enabled.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnabled(bEnabled: boolean): Promise<void>;

		/**
         * Gets current value of property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;
		
        /**
         * Sets a new value for property `editable`.
         *
         * Defines whether the control can be modified by the user or not. 
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         * 
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

		/**
         * Gets current value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Value of property `mandatory`
         */
        getMandatory(): Promise<boolean>;
		
        /**
         * Sets the value of property `mandatory`.
         * 
         * Determines whether display a red asterisk before label text.
         *
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMandatory(bMandatory: boolean): Promise<void>;

        /**
         * Gets current value of property `maxTokens`.
         *
         * Defines the max number of tokens that is allowed in control.
         * 
         * Default value is `10`.
         *
         * @returns Value of property `maxTokens`
         */
        getMaxTokens(): Promise<int>;

        /**
         * Setter for property `maxTokens`.
         * 
         * Defines the max number of tokens that is allowed in control.
         *
         * @returns Promise<void>
         */
        setMaxTokens(nMaxTokens: int): Promise<void>;

        /**
         * Gets current value of property `showValueHelp`.
         *
         * a value help indicator will be displayed inside the control.
         *
         * Default value is `true`.
         *
         * @returns Value of property `showValueHelp`
         */
        getShowValueHelp(): Promise<boolean>;

        /**
         * Sets a new value for property `showValueHelp`.
         *
         * a value help indicator will be displayed inside the control.
         *
         * @returns Promise<void>
         */
        setShowValueHelp(bShowValueHelp: boolean): Promise<void>;

        /**
         * Gets the current value of the `showSuggestion` property.
         *
         * Indicates whether suggest event is fired when user types in the control.
         * 
         * Default value is `true`.
         *
         * @returns Value of property `showSuggestion`
         */
        getShowSuggestion(): Promise<boolean>;

        /**
         * Sets a new value for the `showSuggestion` property.
         *
         * Determines whether suggest event is fired when user types in the control.
         *
         * @param bShowSuggestion - A boolean value
         *
         * @returns Promise<void>
         */
        setShowSuggestion(bShowSuggestion: boolean): Promise<void>;
        
        /**
         * Gets the current value of the `enableTextToken` property.
         *
         * Determine whether the text value is converted into a token.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `enableTextToken`
         */
        getEnableTextToken(): Promise<boolean>;

        /**
         * Sets a new value for the `enableTextToken` property.
         *
         * Determine whether the text value is converted into a token.
         *
         * @param bEnableTextToken - A boolean value
         *
         * @returns Promise<void>
         */
        setEnableTextToken(bEnableTextToken: boolean): Promise<void>;

        /**
         * Gets content of aggregation `suggestionItems`.
         *
         * `SuggestionItems` are the items which will be shown in the suggestions list. 
         * 
         * Default value is `empty array`.
         *          
         *  @returns Promise<Item[]>
         */
        getSuggestionItems(): Promise<Item[]>;

        /**
         * Gets content of aggregation `tokens`.
         * 
         * Default value is `empty array`.
         *
         * currently displayed tokens.
         */
        getTokens(): Promise<Token[]>;

        /**
         * Focuses the current control.
         * 
         * @returns A promise that resolves when the focus is set.
         */
        focus(): Promise<void>;

        /**
         * Fires event change to attached listeners.
         * 
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {string} value - The value which will be changed.
         * @param {string} oldValue - The value before changed.
         *
         * @returns Promise<void>
         */
        fireChange(mParameters: { value?: string, oldValue?: string }): Promise<void>;

        /**
         * Fires event suggest to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {string} suggestValue - The current value which has been typed in the input.
         * 
         * @returns Promise<void>
         */
        fireSuggest(mParameters: { suggestValue?: string }): Promise<void>;

        /**
         * Fires event valueHelpRequest to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {boolean} fromSuggestions - The value set to true when the button at the end of the suggestion table is clicked.
         * 
         * @returns Promise<void>
         */
        fireValueHelpRequest(mParameters: { fromSuggestions?: boolean }): Promise<void>;

        /**
         * Fires event tokenUpdate to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event.
         * @param {string} type - Type of tokenChange event.
         * @param {object[]} addedTokens - The array of tokens that are added.
         * @param {object[]} removedTokens - The array of tokens that are removed.
         * 
         * @returns Promise<void>
         */
        fireTokenUpdate(mParameters: { type?: string, addedTokens?: object[], removedTokens?: object[] }): Promise<void>;
    }
}

declare module "sbo/m/Token" {
    import Control from "sbo/ui/core/Control";
    /**
     * @since 2602
     * 
     * Tokens are small items of information (similar to tags) that mainly serve to visualize previously selected items.
     */
    export default interface Token extends Control {
        /**
         * Gets current value of property `key`.
         *
         * key of the token.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `key`
         */
        getKey(): Promise<string>;
        /**
         * Sets current value of property `key`.
         *
         * key of the token.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setKey(sKey: string): Promise<void>;
        /**
         * Gets current value of property `text`.
         *
         * displayed text of the token.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `text`
         */
        getText(): Promise<string>;
        /**
         * Sets current value of property `text`.
         *
         * displayed text of the token.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setText(sText: string): Promise<void>;
    }
}

declare module "sbo/m/TreeTable" {
    import Control from "sbo/ui/core/Control";
    import { SelectionMode, SelectionBehavior } from "sbo/ui/core/library";
    import { CSSSize, int } from "sbo/ui/core/SDKEnv";
    /**
     * @since 2702
     * 
     * The TreeTable control provides a comprehensive set of features to display hierarchical data.
     */
    export default interface TreeTable extends Control {
        /**
         * Gets current value of property `visible`.
         *
         * Specifies whether or not the button is visible. Invisible buttons are not rendered.
         *
         * Default value is `true`.
         *
         * @returns Value of property `visible`
         */
        getVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `visible`.
         *
         * Specifies whether or not the button is visible. Invisible buttons are not rendered.
         *
         * When called with a value of `null` or `undefined`, the default value of the property will be restored.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setVisible(bVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `title`.
         *
         * Title text for the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;

        /**
         * Sets a new value for property `title`.
         *
         * Title text for the control.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(sTitle: string): Promise<void>;

        /**
         * Gets current value of property `width`.
         *
         * Width in CSS units.
         *
         * Default value is `empty string`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<CSSSize>;

        /**
         * Sets a new value for property `width`.
         *
         * Width in CSS units.
         *
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: CSSSize): Promise<void>;

        /**
         * Gets current value of property `selectionMode`.
         *
         * Selection mode of the Table.
         *
         * This property controls whether single or multiple rows can be selected and how the selection can be extended.
         *
         * Default value is `Single`.
         *
         * @returns Value of property `selectionMode`
         */
        getSelectionMode(): Promise<SelectionMode>;

        /**
         * Sets a new value for property `selectionMode`.
         *
         * Sets the selection mode.
         *
         * @returns Promise<void>
         */
        setSelectionMode(selectionMode: SelectionMode): Promise<void>;

        /**
         * Gets current value of property `columnHeaderVisible`.
         *
         * Flag whether the column header is visible or not.
         *
         * Default value is `true`.
         *
         * @returns Value of property `columnHeaderVisible`
         */
        getColumnHeaderVisible(): Promise<boolean>;

        /**
         * Sets a new value for property `columnHeaderVisible`.
         *
         * Flag whether the column header is visible or not.
         *
         * @returns Promise<void>
         */
        setColumnHeaderVisible(bColumnHeaderVisible: boolean): Promise<void>;

        /**
         * Gets current value of property `enableSelectAll`.
         *
         * Specifies if a select all button should be displayed in the top left corner. This button is only displayed if the row selector is visible and the selection mode is set to any kind of multi selection.
         *
         * Default value is `true`.
         *
         * @returns Value of property `enableSelectAll`
         */
        getEnableSelectAll(): Promise<boolean>;

        /**
         * Sets a new value for property `enableSelectAll`.
         *
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEnableSelectAll(bEnableSelectAll: boolean): Promise<void>;

        /**
         * Gets current value of property `selectionBehavior`.
         *
         * Selection behavior of the Table. This property defines whether the row selector is displayed and whether the row, the row selector or both can be clicked to select a row.
         *
         * Default value is `Row`.
         *
         * @returns Value of property `selectionBehavior`
         */
        getSelectionBehavior(): Promise<SelectionBehavior>;

        /**
         * Sets a new value for property `selectionBehavior`.
         *
         * Selection behavior of the Table.
         *
         * @returns Promise<void>
         */
        setSelectionBehavior(sSelectionBehavior: SelectionBehavior): Promise<void>;

        /**
         * Gets current value of property `firstVisibleRow`.
         *
         * Defines first visible row.
         *
         * Default value is `0`.
         *
         * @returns Value of property `firstVisibleRow`
         */
        getFirstVisibleRow(): Promise<int>;

        /**
         * Sets a new value of property `firstVisibleRow`.
         *
         * Defines first visible row.
         *
         * Default value is `0`.
         *
         * @returns Promise<void>
         */
        setFirstVisibleRow(iFirstVisibleRow: int): Promise<void>;

        /**
         * Focuses the current control.
         * 
         * @returns A promise that resolves when the focus is set.
         */
        focus(): Promise<void>;

        /**
         * Gets contents of the selected rows.
         *
         * @returns The contents of the selected rows
         */
        getSelectedRowData(): Promise<any[]>;

        /**
         * Removes complete selection.
         */
        clearSelection(): Promise<void>;

        /**
         * Zero-based indices of selected items, wrapped in an array. An empty array means "no selection".
         *
         * @returns Selected indices
         */
        getSelectedIndices(): Promise<int[]>;

        /**
         * Sets the selected index. The previous selection is removed.
         *
         * @param {int} iSelectedIndex - New value for property selectedIndex
         */
        setSelectedIndex(iSelectedIndex?: int): Promise<void>;

        /**
         * Adds the given selection interval to the selection. In case of single selection, only iIndexTo is added to the selection.
         *
         * @param {int} iIndexFrom - The index from which the selection starts
         * @param {int} iIndexTo - The index up to which to select
         */
        addSelectionInterval(iIndexFrom?: int, iIndexTo?: int): Promise<void>;

        /**
         * Removes the given selection interval from the selection. In case of single selection, only iIndexTo is removed from the selection.
         *
         * @param {int} iIndexFrom - The index from which the selection should start
         * @param {int} iIndexTo - The index up to which to deselect
         */
        removeSelectionInterval(iIndexFrom?: int, iIndexTo?: int): Promise<void>;

        /**
         * Get of binding data.
         *
         * @param {int} iRowIndex - The index of row
         */
        getRowData(iRowIndex?: int): Promise<any>;

        /**
         * Set a binding data for the given selection row.
         *
         * @param {object} oRow - The binding data to set
         * @param {int} iIndex - A index of the selection row
         */
        setRowData(oRow?: object, iIndex?: int): Promise<void>;

        /**
         * Selects all available nodes/rows. All rows/tree nodes that are locally stored on the client and that are part of the currently visible tree are selected. 
         *
         * @returns Promise<void>
         */
        selectAll(): Promise<void>;

        /**
         * Expands one row.
         *
         * @param {int} iRowIndex - A single index of the rows to be expanded
         */
        expand(iRowIndex?: int): Promise<void>;

        /**
         * Expands all nodes starting from the root level to the given level 'iLevel'.
         *
         * @param {int} iRowLevel - the level to which the trees shall be expanded
         */
        expandToLevel(iRowLevel?: int): Promise<void>;

        /**
         * Checks whether the row is expanded or collapsed.
         *
         * @param {int} iRowIndex - The index of the row to be checked
         *
         * @returns true if the row is expanded, false if it is collapsed
         */
        isExpanded(iRowIndex?: int): Promise<boolean>;

        /**
         * Collapses one or more rows.
         *
         * @param {int} iRowIndex - A single index of the rows to be collapsed
         */
        collapse(iRowIndex?: int): Promise<void>;

        /**
         * Collapses all nodes.
         *
         * @returns Promise<void>
         */
        collapseAll(): Promise<void>;

        /**
         * Removes the given selection row from the aggregation rows.
         *
         * @param {object} removePath - the binding path for the removed row
         */
        removeSelectedRows(removePath?: object): Promise<void>;

        /**
         * Inserts a row into the aggregation rows.
         *
         * @param {object} oRow - The row to insert; if empty, nothing is inserted
         * @param {int} iIndex - The 0-based index the row should be inserted at
         * @param {boolean} isAfter - The new row is inserted before or after the current row. If set to `true`, the new row will insert after the current row.
         */
        insertRow(oRow?: object, iIndex?: int, isAfter?: boolean): Promise<void>;

        /**
         * Clear sorting in the treetable columns.
         */
        resetSort(): Promise<void>;

        /**
         * Fires event rowSelectionChange to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event
         * @param {int} rowIndex - row index which has been clicked so that the selection has been changed (either selected or deselected)
         * @param {Array<int>} rowIndices - array of row indices which selection has been changed (either selected or deselected)
         * @param {boolean} selectAll - indicator if "select all" function is used to select rows
         * @param {boolean} userInteraction - indicates that the event was fired due to an explicit user interaction like clicking the row header or using the keyboard (SPACE or ENTER) to select a row or a range of rows.
         * @param {Array<object>} values - binding context of the row which has been clicked so that selection has been changed
         * @returns Promise<void>
         */
        fireRowSelectionChange(mParameters: { rowIndex?: int, rowIndices?: int[], selectAll?: boolean, userInteraction?: boolean, values?: object[] }): Promise<void>;

        /**
         * Fires event firstVisibleRowChanged to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event
         * @param {int} firstVisibleRow - First visible row
         * @returns Promise<void>
         */
        fireFirstVisibleRowChanged(mParameters: { firstVisibleRow?: int }): Promise<void>;

        /**
         * Fires event sort to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event
         * @param {object} column - The column for which the sorting is changed
         * @param {string} sortOrder - The new sort order
         * @param {boolean} columnAdded - Indicates that the column is added to the list of sorted columns
         * @returns Promise<void>
         */
        fireSort(mParameters: { column?: object, sortOrder?: string, columnAdded?: boolean }): Promise<void>;

        /**
         * Fires event toggleOpenState to attached listeners.
         *
         * @param {object} mParameters - Parameters to pass along with the event
         * @param {int} rowIndex - Index of the expanded/collapsed row
         * @param {boolean} expanded - Flag that indicates whether the row has been expanded or collapsed
         * @returns Promise<void>
         */
        fireToggleOpenState(mParameters: { rowIndex?: int, expanded?: boolean }): Promise<void>;
    }
}