declare module "sbo/ui/layout/form/FormContainer" {
    import Control from "sbo/ui/core/Control";
    import Button from "sbo/m/Button";
    import CheckBox from "sbo/m/CheckBox";
    import Input from "sbo/m/Input";
    import ComboBox from "sbo/m/ComboBox";
    import StaticText from "sbo/m/StaticText";
    import MessageStrip from "sbo/m/MessageStrip";
    import HBox from "sbo/m/HBox";
    import DatePicker from "sbo/m/DatePicker";
    import TimePicker from "sbo/m/TimePicker";
    import ObjectStatus from "sbo/m/ObjectStatus";
    import MenuButton from "sbo/m/MenuButton";
    import Image from "sbo/m/Image";
    import TextArea from "sbo/m/TextArea";
    import RadioButton from "sbo/m/RadioButton";
    import RadioButtonGroup from "sbo/m/RadioButtonGroup";
    import ObjectNumber from "sbo/m/ObjectNumber";
    import ProgressIndicator from "sbo/m/ProgressIndicator";
    import SegmentedButton from "sbo/m/SegmentedButton";
    import MultiComboBox from "sbo/m/MultiComboBox";
    import MultiInput from "sbo/m/MultiInput";
    import TreeTable from "sbo/m/TreeTable";

    /**
     * @since 2502
     * 
     * A FormContainer represents a group inside a Form. The rendering of the FormContainer is done by the gridLayoutData assigned to the Form.
     */
    export default interface FormContainer extends Control {
        /**
         * Gets current value of property `title`.
         *
         * Title of the FormContainer.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;

        /**
         * Sets a new value for property `title`.
         *
         * Title of the FormContainer.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(sTitle: string): Promise<void>;

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
         * Gets content of aggregation `items`.
         *
         * Items contained within this container.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<Control[]>
         */
        getItems(): Promise<(Button | CheckBox | Input | ComboBox | StaticText | MessageStrip | HBox | DatePicker | TimePicker | ObjectStatus | MenuButton | Image | TextArea | RadioButton | RadioButtonGroup | ObjectNumber | ProgressIndicator | SegmentedButton | MultiComboBox | MultiInput | TreeTable)[]>;
    }
}

declare module "sbo/ui/layout/form/Form" {
    import Control from "sbo/ui/core/Control";
    import { int } from "sbo/ui/core/SDKEnv";
    import FormContainer from "sbo/ui/layout/form/FormContainer";

    /**
     * @since 2502
     * 
     * A Form control arranges labels and fields (like input fields) into groups and rows.
     */
    export default interface Form extends Control {
        /**
         * Gets current value of property `title`.
         *
         * Title of the Form.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `title`
         */
        getTitle(): Promise<string>;

        /**
         * Sets a new value for property `title`.
         *
         * Title of the Form.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setTitle(sTitle: string): Promise<void>;

        /**
         * Gets current value of property `leftLabel`.
         *
         * Determine whether labels inside the Form is left aligned.
         *
         * Default value is `true`.
         *
         * @returns Value of property `leftLabel`
         */
        getLeftLabel(): Promise<boolean>;

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
         * Gets current value of property `gridLayoutData`.
         *
         * The form responsive grid layout data.
         *
         * @returns Value of property `gridLayoutData`
         */
        getGridLayoutData(): Promise<{
            adjustLabelSpan?: boolean; //the usage of `labelSpanL` and `labelSpanM` are dependent on the number of `FormContainers` in one row or the `Form` size
            breakpointM?: int, //Breakpoint (in pixel) between Small size and Medium size           
            breakpointL?: int; //Breakpoint (in pixel) between Medium size and Large size
            breakpointXL?: int, //Breakpoint (in pixel) between large size and extra large (XL) size
            columnsM?: int;  // Number of columns for medium size            
            columnsL?: int;  // Number of columns for large size            
            columnsXL?: int; // Number of columns for extra large size
            emptySpanS?: int;  // Number of grid cells that are empty at the end of each line on small size              
            emptySpanM?: int;  // Number of grid cells that are empty at the end of each line on medium size            
            emptySpanL?: int;  // Number of grid cells that are empty at the end of each line on large size
            emptySpanXL?: int; // Number of grid cells that are empty at the end of each line on extra large size
            labelSpanS?: int;  // Default span for labels in small size
            labelSpanM?: int;  // Default span for labels in medium size                        
            labelSpanL?: int;  // Default span for labels in large size
            labelSpanXL?: int; // Default span for labels in extra large size
            singleContainerFullSize?: boolean; //If the `Form` contains only one single `FormContainer` and this property is set, the `FormContainer` is displayed using the full size of the `Form                       
        }>;

        /**
         * Gets content of aggregation `formContainers`.
         *
         * Containers with the content of the form. A FormContainer represents a group inside the Form.
         * 
         * Default value is `empty array`.
         *
         * @returns Promise<FormContainer[]>
         */
        getFormContainers(): Promise<FormContainer[]>;
    }
}
