# Wiki Index

_Last updated: 2026-08-23 — 89 pages total_

## Sources (21)
- [[01-overview]] — Intro, scope, overlay mechanism (before/after/on/move), extension namespace, ES8 constraint
- [[02-sdkenv]] — SDKEnv (oEnv): ActiveView, showMessageBox, showToastMessage, open, getService, newDialog, refresh (FP2508), authenticateExternalService (FP2602), FP2608 view methods
- [[03a-controls-intro]] — Control object model: Properties/Aggregations/Events/Methods; implicit getter/setter convention; silent no-op on read-only setters
- [[03b-controls-button]] — Button (FP2405), MenuButton (FP2502), SegmentedButton (FP2502)
- [[03c-controls-text-input]] — Input (FP2405), TextArea (FP2502), MultiInput (FP2602), StaticText (FP2405)
- [[03d-controls-boolean]] — CheckBox (FP2405), RadioButton (FP2502), RadioButtonGroup (FP2502)
- [[03e-controls-picker]] — ComboBox (FP2405), MultiComboBox (FP2602), ChooseFromList (FP2508), FileUploader (FP2508)
- [[03f-controls-datetime]] — DatePicker (FP2502), TimePicker (FP2502)
- [[03g-controls-display]] — ObjectStatus (FP2502), ObjectNumber (FP2502), ProgressIndicator (FP2502), MessageStrip (FP2502), Image (FP2502)
- [[03h-controls-layout]] — Section (FP2405), HBox (FP2502)
- [[03i-controls-container]] — Form (FP2502, Simple Dialog only), Dialog (FP2502 Simple / FP2508 Complex)
- [[03j-controls-table]] — Grid (FP2405)
- [[04-data-binding]] — JSON model, Resource model, $viewStatus, property/aggregation/expression/i18n binding, formatters
- [[05-event-flow]] — Event trigger, setValue auto-fire gotcha, unified handler signature, before/after hooks, lifecycle hooks
- [[06a-types-enums]] — All 22 b1.sdk enumerations; int type; 3 Grid sub-namespace enums; PopupDock FP2605 breaking change
- [[06b-types-aggregations]] — 10 aggregation types (Item, SubSection, Group, Row, Column, LightBoxItem, MenuItem, SegmentedButtonItem, FormContainer, Token); Event type with preventDefault()
- [[07-security]] — Sandbox restrictions, allowedServiceLayerAPIs (full/readOnly), allowedExternalURLs (OAuth2 clientID), * wildcard warning, CSRF protection
- [[08-samples]] — 7 samples: HelloWorld 1&2, UDF, Grid, SalesAssist (preventDefault source), Dialog (open/close/return), ExternalServiceAuth
- [[09-inspector]] — Web Client Inspector browser extension; locates controls and GUIDs in dev mode (SAP internal GitHub)
- [[10-appendix]] — 150 supported views (FP2405: 64, FP2502: 24, FP2508: 12, FP2602: 19, FP2608: 31); List+Detail pairs
- [[11-view-link-api]] — ViewLinkService full endpoint catalog: Object View APIs (Variants, List URL, Detail URL, Drafts, Configuration), Analytics APIs, system object names (~100 values)

## Controls (26)
- [[b1sdk-button]] — Clickable action trigger; text/icon/buttonType; focus() FP2502; firePress() FP2508
- [[b1sdk-menubutton]] — Dropdown menu button; Regular/Split modes; uses `type` (not `buttonType`); items inline in JSON
- [[b1sdk-segmentedbutton]] — Horizontal multi-segment selector; hideLabel ReadOnly; fireSelectionChange has nested param shape
- [[b1sdk-input]] — Single-line text/numeric input; editable≠enabled; hideLabel ReadOnly; textAlign default depends on inputType
- [[b1sdk-textarea]] — Multi-line input; wrapping is an enum (not boolean); growing conflicts with height; CSS dims win over char dims
- [[b1sdk-multiinput]] — Token-based multi-value input; tokens NOT auto-synced to model in TwoWay binding (FP2602)
- [[b1sdk-statictext]] — Display-only text; HTML escaped; wrapping is boolean (not enum); no events
- [[b1sdk-checkbox]] — Boolean toggle; selected is writable; hideLabel ReadOnly; fireSelect FP2508
- [[b1sdk-radiobutton]] — Single radio button; selected is ReadOnly (critical!); groupName for standalone grouping
- [[b1sdk-radiobuttongroup]] — Wrapper for RadioButton items[]; selectedIndex handles selection; data binding FP2508 only
- [[b1sdk-combobox]] — Single-select dropdown with filter; selectedKey; getSelectedText(); loadItems event
- [[b1sdk-multicombobox]] — Multi-select dropdown; selectedKeys string[]; items aggregation binding NOT supported (FP2602)
- [[b1sdk-choosefromlist]] — B1 table picker; linkTo and filter are mandatory/ReadOnly; allowed table list is versioned (FP2508)
- [[b1sdk-fileuploader]] — File upload control; value ReadOnly; typeMissmatch double-s; upload()/clear()/checkFileReadable() (FP2508)
- [[b1sdk-datepicker]] — Date input; valueFormat ReadOnly (default yyyyMMdd); displayFormat writable; minDate/maxDate are JS Date objects (FP2502)
- [[b1sdk-timepicker]] — Time input; valueFormat ReadOnly (default HHmm); displayFormat default HH:mm; no min/max (FP2502)
- [[b1sdk-objectstatus]] — Status text+icon; state accepts ValueState OR IndicationColor; inverted flips colour to background (FP2502)
- [[b1sdk-objectnumber]] — Number+unit display; active default false; emphasized default true; no events (FP2502)
- [[b1sdk-progressindicator]] — Progress bar; percentValue and displayValue are independent; displayOnly blocks focus (FP2502)
- [[b1sdk-messagestrip]] — Inline message banner; visible defaults to FALSE; close() action method; fireClose FP2508 (FP2502)
- [[b1sdk-image]] — Image with optional lightbox; imageContent holds LightBoxItem[]; CSP required for external src (FP2502)
- [[b1sdk-section]] — Top-level object page container; hierarchy Section→SubSection→Group→items; getSubSections() FP2608; layout-only before FP2608 (FP2405)
- [[b1sdk-hbox]] — Horizontal flex container; items[] holds mixed controls; child GUIDs are view-registered (FP2502)
- [[b1sdk-form]] — Responsive grid layout; NOT standalone — only inside Simple Dialog content[]; leftLabel/gridLayoutData ReadOnly (FP2502)
- [[b1sdk-dialog]] — Modal popup; type/controller ReadOnly+mandatory; open() returns close() data; 5-step setup; Simple FP2502 / Complex FP2508
- [[b1sdk-grid]] — Data table; rowsData ReadOnly+mandatory; getSelectedIndices≠getAllSelectedIndices; row cells via Row(i).ControlType() NOT oView (FP2405)

## Concepts (9)
- [[overlay-mechanism]] — GUID-based positional patching of views via *.layout.json overlay files
- [[extension-namespace]] — Two-level namespace: b1.sdk (controls/types) and provider+app+module (extension isolation)
- [[ui-extension-architecture]] — b1.sdk wraps UI5; ES8-only; subset exposure model; grows each feature pack
- [[sdk-env]] — SDKEnv (oEnv): central runtime object; ActiveView, service access, dialogs, UI feedback; all async
- [[service-api]] — Three service clients (ServiceLayer, ViewLinkService, ExternalService) and the Response interface
- [[control-object-model]] — Four pillars (Properties/Aggregations/Events/Methods); implicit getter/setter; silent no-op on read-only setters
- [[data-binding]] — JSON model, Resource model, $viewStatus, @@-prefix convention, four binding types, formatters
- [[event-flow]] — Unified handler signature, setValue auto-fires change event (loop risk), before/after hooks, Event.preventDefault(), onInit/onDataLoad/onExit lifecycle
- [[security]] — Sandbox (no DOM/window/cookies/sessionStorage), allowedServiceLayerAPIs, allowedExternalURLs, OAuth2 clientID, CSRF auto-protection

## Types (33)
- [[enum-buttontype]] — b1.sdk.ButtonType: Accept/Back/Default/Emphasized/Ghost/Reject/Transparent/Unstyled/Up (FP2405)
- [[enum-valuestate]] — b1.sdk.ValueState: Error/Information/Success/Warning/None (FP2405)
- [[enum-inputtype]] — b1.sdk.InputType: String/Integer/Price/Sum/Tax/Quantity/Rate/Unit/Measure/Percent/Hour (FP2405)
- [[enum-textdirection]] — b1.sdk.TextDirection: Inherit/LTR/RTL (FP2405)
- [[enum-textalign]] — b1.sdk.TextAlign: Begin/End/Left/Right/Center/Initial (FP2405)
- [[enum-wrappingtype]] — b1.sdk.WrappingType: Hyphenated/Normal — text hyphenation (FP2405)
- [[enum-messageboxaction]] — b1.sdk.MessageBoxAction: Ok/Cancel/Yes/No/Abort/Retry/Ignore/Close/Delete (FP2405)
- [[enum-messageboxtype]] — b1.sdk.MessageBoxType: None/Error/Success/Warning/Information/Confirm (FP2405)
- [[enum-horizontalalign]] — b1.sdk.HorizontalAlign: Begin/Center/End/Left/Right — Column hAlign (FP2405)
- [[enum-selectionmode]] — b1.sdk.Grid.SelectionMode: Multiple/Single/None — default Multiple (FP2405)
- [[enum-selectionbehavior-grid]] — b1.sdk.Grid.SelectionBehavior: Row/RowOnly/RowSelector — default RowSelector (FP2405)
- [[enum-modelfilteroperator]] — b1.sdk.Grid.ModelFilterOperator: EQ/NE/GT/GE/LT/LE/BT/NB/Contains/StartsWith/EndsWith/… (FP2405)
- [[enum-flexalignitems]] — b1.sdk.FlexAlignItems: Baseline/Center/End/Inherit/Start/Stretch (FP2502)
- [[enum-flexdirection]] — b1.sdk.FlexDirection: Column/ColumnReverse/Inherit/Row/RowReverse (FP2502)
- [[enum-flexjustifycontent]] — b1.sdk.FlexJustifyContent: Center/End/Inherit/SpaceAround/SpaceBetween/Start (FP2502)
- [[enum-wrapping]] — b1.sdk.Wrapping: Hard/None/Off/Soft — TextArea wrapping (FP2502)
- [[enum-messagetype]] — b1.sdk.MessageType: Error/Information/None/Success/Warning — MessageStrip type (FP2502)
- [[enum-emptyindicatormode]] — b1.sdk.EmptyIndicatorMode: Auto/Off/On (FP2502)
- [[enum-calendartype]] — b1.sdk.CalendarType: Buddhist/Gregorian/Islamic/Japanese/Persian (FP2502)
- [[enum-popupdock]] — b1.sdk.PopupDock: 15 dock positions; FP2605 breaking change in descriptions (FP2502)
- [[enum-pagemode]] — b1.sdk.PageMode: addMode/editMode/viewMode — mirrors $viewStatus (FP2502)
- [[enum-indicationcolor]] — b1.sdk.IndicationColor: Indication01–Indication20 — alternate to ValueState on ObjectStatus (FP2502)
- [[enum-menubuttonmode]] — b1.sdk.MenuButtonMode: Regular/Split — MenuButton buttonMode (FP2502)
- [[type-item]] — b1.sdk.Item: key (mandatory), text, enabled, additionalText — ComboBox/MultiComboBox items (FP2405)
- [[type-subsection]] — b1.sdk.SubSection: guid, visible, text, groups[] — second level of Section hierarchy (FP2405)
- [[type-group]] — b1.sdk.Group: guid, visible, text, align, items[], width (6 or 12 only) (FP2405)
- [[type-row]] — b1.sdk.Row: getIndex(), Input(guid), focus() FP2502 — Grid row accessor (FP2405)
- [[type-column]] — b1.sdk.Column: guid, text, width, hAlign, sortProperty, filterProperty, filtered (ReadOnly) — Grid column (FP2405)
- [[type-lightboxitem]] — b1.sdk.LightBoxItem: guid, imageSrc (mandatory), alt, subtitle, title — Image lightbox (FP2502)
- [[type-menuitem]] — b1.sdk.MenuItem: guid, key, text, icon, startsSection, press event, firePress FP2508 (FP2502)
- [[type-segmentedbuttonitem]] — b1.sdk.SegmentedButtonItem: guid, key, text, icon, press event — supports aggregation binding (FP2502)
- [[type-formcontainer]] — b1.sdk.FormContainer: guid, title, visible, items[] — grouping unit inside Form (FP2502)
- [[type-token]] — b1.sdk.Token: guid, key, text — MultiInput token; no events or methods (FP2602)

## Analyses (0)

_No analyses filed yet._
