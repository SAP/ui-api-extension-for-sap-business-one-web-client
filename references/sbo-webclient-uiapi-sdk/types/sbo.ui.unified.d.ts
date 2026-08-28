declare module "sbo/ui/unified/FileUploader" {
    import Control from "sbo/ui/core/Control";
    import { ValueState } from "sbo/ui/core/library";

    /**
     * @since 2508
     * 
     * FileUploader control allows users to upload files from their local file system.
     */
    export default interface FileUploader extends Control {
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
         * Gets current value of property `additionalData`.
         *
         * Additional data to be sent to the back end service.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `additionalData`
         */
        getAdditionalData(): Promise<string>;

        /**
         * Sets a new value for property `additionalData`.
         *
         * Additional data to be sent to the back end service.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setAdditionalData(sAdditionalData: string): Promise<void>;

        /**
         * Gets current value of property `buttonOnly`.
         *
         * Determines if the FileUploader is rendered as Button only.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `buttonOnly`
         */
        getButtonOnly(): Promise<boolean>;

        /**
         * Sets a new value for property `buttonOnly`.
         *
         * Determines if the FileUploader is rendered as Button only.
         * 
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setButtonOnly(bButtonOnly: boolean): Promise<void>;

        /**
         * Gets current value of property `buttonText`.
         *
         * Defines the text shown for the button.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `buttonText`
         */
        getButtonText(): Promise<string>;

        /**
         * Sets a new value for property `buttonText`.
         *
         * Defines the text shown for the button.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setButtonText(sButtonText: string): Promise<void>;

        /**
         * Gets current value of property `icon`.
         *
         * Icon to be displayed as graphical element within the button.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `icon`
         */
        getIcon(): Promise<string>;

        /**
         * Sets a new value for property `icon`.
         *
         * Icon to be displayed as graphical element within the button.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setIcon(sIcon: string): Promise<void>;

        /**
         * Gets current value of property `directory`.
         *
         * Allows users to upload all files from a given directory and its corresponding subdirectories.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `directory`
         */
        getDirectory(): Promise<boolean>;

        /**
         * Sets a new value for property `directory`.
         *
         * Allows users to upload all files from a given directory and its corresponding subdirectories.
         * 
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setDirectory(bDirectory: boolean): Promise<void>;

        /**
         * Gets current value of property `uploadUrl`.
         *
         * URL where the uploaded files should be sent to.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `uploadUrl`
         */
        getUploadUrl(): Promise<string>;

        /**
         * Sets a new value for property `uploadUrl`.
         *
         * URL where the uploaded files should be sent to.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setUploadUrl(sUploadUrl: string): Promise<void>;

        /**
         * Gets current value of property `name`.
         *
         * Unique control name for identification on the server side after sending data to the server.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `name`
         */
        getName(): Promise<string>;

        /**
         * Sets a new value for property `name`.
         *
         * Unique control name for identification on the server side after sending data to the server.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setName(sName: string): Promise<void>;

        /**
         * Gets current value of property `value`.
         *
         * Value of the path for file upload.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `value`
         */
        getValue(): Promise<string>;

        /**
         * Gets current value of property `width`.
         *
         * Width of the control in CSS units.
         * 
         * Default value is `100%`.
         *
         * @returns Value of property `width`
         */
        getWidth(): Promise<string>;

        /**
         * Sets a new value for property `width`.
         *
         * Width of the control in CSS units.
         * 
         * Default value is `100%`.
         *
         * @returns Promise<void>
         */
        setWidth(sWidth: string): Promise<void>;

        /**
         * Gets current value of property `style`.
         *
         * Style of the button, values "Transparent", "Accept", "Reject", or "Emphasized" are allowed.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `style`
         */
        getStyle(): Promise<string>;

        /**
         * Sets a new value for property `style`.
         *
         * Style of the button, values "Transparent", "Accept", "Reject", or "Emphasized" are allowed.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setStyle(sStyle: string): Promise<void>;

        /**
         * Gets current value of property `fileType`.
         *
         * File types allowed for upload.
         * 
         * Default value is `[]`.
         *
         * @returns Value of property `fileType`
         */
        getFileType(): Promise<string[]>;

        /**
         * Sets a new value for property `fileType`.
         *
         * File types allowed for upload.
         * 
         * Default value is `[]`.
         *
         * @returns Promise<void>
         */
        setFileType(aFileType: string[]): Promise<void>;

        /**
         * Gets current value of property `uploadOnChange`.
         *
         * Determines if upload immediately starts after file selection.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `uploadOnChange`
         */
        getUploadOnChange(): Promise<boolean>;

        /**
         * Sets a new value for property `uploadOnChange`.
         *
         * Determines if upload immediately starts after file selection.
         * 
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setUploadOnChange(bUploadOnChange: boolean): Promise<void>;

        /**
         * Gets current value of property `sendXHR`.
         *
         * Determines whether the request will be sent as XHR request instead of a form submit.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `sendXHR`
         */
        getSendXHR(): Promise<boolean>;

        /**
         * Sets a new value for property `sendXHR`.
         *
         * Determines whether the request will be sent as XHR request instead of a form submit.
         * 
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setSendXHR(bSendXHR: boolean): Promise<void>;

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
         * Gets current value of property `multiple`.
         *
         * Allows multiple files to be chosen and uploaded from the same folder.
         * 
         * Default value is `false`.
         *
         * @returns Value of property `multiple`
         */
        getMultiple(): Promise<boolean>;

        /**
         * Sets a new value for property `multiple`.
         *
         * Allows multiple files to be chosen and uploaded from the same folder.
         * 
         * Default value is `false`.
         *
         * @returns Promise<void>
         */
        setMultiple(bMultiple: boolean): Promise<void>;

        /**
         * Gets current value of property `placeholder`.
         *
         * Placeholder for the text field.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `placeholder`
         */
        getPlaceholder(): Promise<string>;

        /**
         * Sets a new value for property `placeholder`.
         *
         * Placeholder for the text field.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setPlaceholder(sPlaceholder: string): Promise<void>;

        /**
         * Gets current value of property `editable`.
         *
         * Determine whether the control is editable, it's visible when editable.
         * 
         * Default value is `true`.
         *
         * @returns Value of property `editable`
         */
        getEditable(): Promise<boolean>;

        /**
         * Sets a new value for property `editable`.
         *
         * Determine whether the control is editable, it's visible when editable.
         * 
         * Default value is `true`.
         *
         * @returns Promise<void>
         */
        setEditable(bEditable: boolean): Promise<void>;

        /**
         * Gets current value of property `valueState`.
         *
         * Marker for the correctness of the current value.
         * 
         * Default value is `None`.
         *
         * @returns Value of property `valueState`
         */
        getValueState(): Promise<ValueState>;

        /**
         * Sets a new value for property `valueState`.
         *
         * Marker for the correctness of the current value.
         * 
         * Default value is `None`.
         *
         * @returns Promise<void>
         */
        setValueState(sValueState: ValueState): Promise<void>;

        /**
         * Gets current value of property `valueStateText`.
         *
         * An additional text show around for valueState.
         * 
         * Default value is `empty string`.
         *
         * @returns Value of property `valueStateText`
         */
        getValueStateText(): Promise<string>;

        /**
         * Sets a new value for property `valueStateText`.
         *
         * An additional text show around for valueState.
         * 
         * Default value is `empty string`.
         *
         * @returns Promise<void>
         */
        setValueStateText(sValueStateText: string): Promise<void>;

        /**
         * Sets the focus to the control.
         * 
         * @returns Promise<void>
         */
        focus(): Promise<void>;

        /**
         * Starts the upload (as defined by uploadUrl).
         * 
         * @returns Promise<void>
         */
        upload(): Promise<void>;

        /**
         * Checks if the chosen file is readable.
         * 
         * @returns Promise<void>
         */
        checkFileReadable(): Promise<void>;

        /**
         * Clears the content of the FileUploader.
         * 
         * @returns Promise<void>
         */
        clear(): Promise<void>;

        /**
         * Fires event uploadStart to attached listeners.
         * 
		 * @param {object} mParameters - Parameters to pass along with the event
         * @param {string} fileName - The name of a file to be uploaded
         * @param {Array<object>} requestHeaders - Http-Request-Headers
         * @returns Promise<void>
         */
        fireUploadStart(mParameters: { fileName?: string, requestHeaders?: Array<object> }): Promise<void>;

        /**
         * Fires event uploadComplete to attached listeners.
         * 
		 * @param {object} mParameters - Parameters to pass along with the event
         * @param {string} fileName - The name of a file to be uploaded
         * @param {string} response - Response message which comes from the server
         * @param {string} readyStateXHR - ReadyState of the XHR request
         * @param {number} status - Status of the XHR request
         * @param {string} responseRaw - Http-Response which comes from the server
         * @param {object} headers - Http-Response-Headers which come from the server
         * @param {Array<object>} requestHeaders - Http-Request-Headers
         * @returns Promise<void>
         */
        fireUploadComplete(mParameters: { fileName?: string, response?: string, readyStateXHR?: string, status?: number, responseRaw?: string, headers?: object, requestHeaders?: Array<object> }): Promise<void>;

        /**
         * Fires event typeMissmatch to attached listeners.
         * 
		 * @param {object} mParameters - Parameters to pass along with the event
         * @param {string} fileName - The name of a file to be uploaded
         * @param {string} fileType - The file ending of a file to be uploaded
         * @param {string} mimeType - The MIME type of a file to be uploaded
         * @returns Promise<void>
         */
        fireTypeMissmatch(mParameters: { fileName?: string, fileType?: string, mimeType?: string }): Promise<void>;

        /**
         * Fires event change to attached listeners.
         * 
		 * @param {object} mParameters - Parameters to pass along with the event
         * @param {string} newValue - New file path value
         * @param {Array<object>} files - Files
         * @returns Promise<void>
         */
        fireChange(mParameters: { newValue?: string, files?: Array<object> }): Promise<void>;
    }
}
