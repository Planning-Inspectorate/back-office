// Multipurpose Definitions (used in multiple components)
/**
 * @typedef TextProperty
 * Use for Text
 * @type {object}
 * @property {string} text Text to use
 *
 * @typedef HtmlProperty
 * Use for HTML. Make sure to sanitise when using HTML.
 * @type {object}
 * @property {string} html Text to use
 *
 * @typedef SharedLegendProperties
 * @type {object}
 * @property {string} [classes]
 * @property {boolean} [isPageHeading]
 *
 * @typedef LegendProperties
 * @type {SharedLegendProperties & TextProperty | SharedLegendProperties & HtmlProperty}
 *
 * @typedef SharedHintProperties
 * @type {object}
 * @property {string} [id] Optional ID attribute to the span tag
 * @property {string} [classes] Classes to add to the span tag.
 *
 * @typedef SharedErrorMessageProperties
 * - Follow the validation pattern and show an error message when there is a validation error. In the error message explain what went wrong and how to fix it.
 * - https://design-system.service.gov.uk/components/error-message/
 * @type {object}
 * @property {string} [id]	ID attribute to add to the error message span tag.
 * @property {string} [classes]	Classes to add to the error message span tag.
 * @property {string} [visuallyHiddenText] A visually hidden prefix used before the error message. Defaults to 'Error'.
 */

/**
 * @typedef FieldsetProperties
 * - Use the fieldset component when you need to show a relationship between multiple form inputs
 * - Documentation: https://design-system.service.gov.uk/components/fieldset/
 * @type {object}
 * @property {string} [describedBy] One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {LegendProperties} legend Used to display text
 * @property {string} [classes]	Classes to add to the fieldset container. https://design-system.service.gov.uk/styles
 * @property {string} [role] Optional ARIA role attribute. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
 */

/**
 * @typedef AccordionProperties
 * ⚠️ Experimental
 * - The accordion component lets users show and hide sections of related content on a page.
 * - Documentation: https://design-system.service.gov.uk/components/accordion/
 * @type {object}
 * @property {string} id Must be unique across the domain of your service if rememberExpanded is true (as the expanded state of individual instances of the component persists across page loads using sessionStorage).
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel] Heading level, from 1 to 6. Default is 2.
 * @property {string} [classes]	Classes to add to the fieldset container. https://design-system.service.gov.uk/styles
 * @property {boolean} [rememberExpanded] Whether the expanded/collapsed state of the accordion should be saved when a user leaves the page and restored when they return. Default is true.
 * @property {string} [hideAllSectionsText] The text content of the 'Hide all sections' button at the top of the accordion when all sections are expanded.
 * @property {string} [hideSectionText] The text content of the 'Hide' button within each section of the accordion, which is visible when the section is expanded.
 * @property {string} [hideSectionAriaLabelText] Text made available to assistive technologies, like screen-readers, as the final part of the toggle's accessible name when the section is expanded. Defaults to 'Hide this section'.
 * @property {string} [showAllSectionsText]	The text content of the 'Show all sections' button at the top of the accordion when at least one section is collapsed.
 * @property {string} [showSectionText]	The text content of the 'Show' button within each section of the accordion, which is visible when the section is collapsed.
 * @property {string} [showSectionAriaLabelText] Text made available to assistive technologies, like screen-readers, as the final part of the toggle's accessible name when the section is collapsed. Defaults to 'Show this section'.
 * @property {AccordionItem[]} items An array of sections within the accordion.
 *
 * @typedef AccordionItem
 * @type {object}
 * @property {TextProperty | HtmlProperty} heading The title of each section.
 * @property {TextProperty | HtmlProperty} [summary] Text content for summary line.
 * @property {TextProperty | HtmlProperty} content The HTML content of each section, which is hidden when the section is closed.
 * @property {boolean} [expanded] Sets whether the section should be expanded when the page loads for the first time. Defaults to false.
 *
 */

/**
 * @typedef BackLinkProperties
 * - Use the back link component to help users go back to the previous page in a multi-page transaction.
 * - Documentation: https://design-system.service.gov.uk/components/back-link/
 * @type {object}
 * @property {string} [text] Text to use within the back link component. If html is provided, the text option will be ignored. Defaults to 'Back'.
 * @property {string} [html] HTML to use within the back link component. If html is provided, the text option will be ignored. Defaults to 'Back'.
 * @property {string} href The value of the link's href attribute.
 * @property {string} classes Classes to add to the anchor tag.
 */

/**
 * @typedef BreadcrumbsProperties
 * - The breadcrumbs component helps users to understand where they are within a website’s structure and move between levels.
 * - Documentation: https://design-system.service.gov.uk/components/breadcrumbs/
 * @type {object}
 * @property {BreadcrumbsItemProperties[]} items Array of breadcrumbs item objects. See See https://design-system.service.gov.uk/components/breadcrumbs/#options-breadcrumbs-example--items
 * @property {string} [classes] Classes to add to the breadcrumbs container.
 * @property {boolean} [collapseOnMobile] When true, the breadcrumbs will collapse to the first and last item only on tablet breakpoint and below.
 *
 * @typedef SharedBreadcrumbsItem
 * @type {object}
 * @property {string} [href] Link for the breadcrumbs item. If not specified, breadcrumbs item is a normal list item.
 *
 * @typedef BreadcrumbsItemProperties
 * @type {SharedBreadcrumbsItem & TextProperty | SharedBreadcrumbsItem & HtmlProperty}
 *
 */

/**
 * @typedef ButtonProperties
 * - Use the button component to help users carry out an action like starting an application or saving their information.
 * - Documentation: https://design-system.service.gov.uk/components/button/
 * @type {SharedButtonProperties & TextProperty | SharedButtonProperties & HtmlProperty}
 *
 * @typedef SharedButtonProperties
 * @type {object}
 * @property {string} [name] Name for the input or button.
 * @property {'button' | 'submit' | 'reset'} [type] Type of input or button – button, submit or reset. Defaults to submit.
 * @property {string} [value] Value for the button tag.
 * @property {boolean} [disabled] 	Whether the button should be disabled. Disabled and aria-disabled attributes will be set automatically.
 * @property {string} [href] The URL that the button should link to.
 * @property {string} [classes] Classes to add to the button component.
 * @property {boolean} [preventDoubleClick] Prevent accidental double clicks on submit buttons from submitting forms multiple times
 * @property {boolean} [isStartButton] 	Use for the main call to action on your service's start page. https://design-system.service.gov.uk/patterns/start-using-a-service/
 * @property {string} id The ID of the button.
 */

/**
 * @typedef CharacterCountProperties
 * - Help users know how much text they can enter when there is a limit on the number of characters
 * - Documentation: https://design-system.service.gov.uk/components/character-count/
 * @type {SharedCharacterCountProperties & MaxlengthProperty | SharedCharacterCountProperties & MaxwordsProperty}
 *
 * @typedef SharedCharacterCountProperties
 * @type {object}
 * @property {string} id The ID of the textarea.
 * @property {string} name The name of the textarea, which is submitted with the form data.
 * @property {number} [rows] Optional number of textarea rows (default is 5 rows).
 * @property {string} [value] Optional initial value of the textarea.
 * @property {number} [threshold] The percentage value of the limit at which point the count message is displayed. If this attribute is set, the count message will be hidden by default.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} label
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty } hint
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup]
 * @property {string} [classes] Classes to add to textarea.
 * @property {boolean} [spellcheck] Optional field to enable or disable the spellcheck attribute on the character count.
 * @property {CountMessageProperties} [countMessage]
 * @property {string} [textareaDescriptionText]	Message made available to assistive technologies to describe that the component accepts only a limited amount of content. It is visible on the page when JavaScript is unavailable. The component will replace the %{count} placeholder with the value of the maxlength or maxwords parameter.
 * @property {LimitTextProperties} [charactersUnderLimitText] Message displayed when the number of characters is under the configured maximum, maxlength. This message is displayed visually and through assistive technologies. The component will replace the %{count} placeholder with the number of remaining characters. This is a pluralised list of messages. See https://frontend.design-system.service.gov.uk/localise-govuk-frontend/#understanding-pluralisation-rules
 * @property {string} [charactersAtLimitText] Message displayed when the number of characters reaches the configured maximum, maxlength. This message is displayed visually and through assistive technologies.
 * @property {LimitTextProperties} [charactersOverLimitText] Message displayed when the number of characters is over the configured maximum, maxlength. This message is displayed visually and through assistive technologies. The component will replace the %{count} placeholder with the number of characters above the maximum. This is a pluralised list of messages. See https://frontend.design-system.service.gov.uk/localise-govuk-frontend/#understanding-pluralisation-rules
 * @property {LimitTextProperties} [wordsUnderLimitText] Message displayed when the number of words is under the configured maximum, maxwords. This message is displayed visually and through assistive technologies. The component will replace the %{count} placeholder with the number of remaining words. This is a pluralised list of messages. See https://frontend.design-system.service.gov.uk/localise-govuk-frontend/#understanding-pluralisation-rules
 * @property {string} [wordsAtLimitText] Message displayed when the number of words reaches the configured maximum, maxwords. This message is displayed visually and through assistive technologies.
 * @property {LimitTextProperties} [wordsOverLimitText] Message displayed when the number of words is over the configured maximum, maxwords. This message is displayed visually and through assistive technologies. The component will replace the %{count} placeholder with the number of characters above the maximum. This is a pluralised list of messages. See https://frontend.design-system.service.gov.uk/localise-govuk-frontend/#understanding-pluralisation-rules
 *
 * @typedef MaxlengthProperty
 * Use to set maximum characters
 * @type {object}
 * @property {number} maxlength The maximum number of characters.
 *
 * @typedef MaxwordsProperty
 * Use to set maximum words
 * @type {object}
 * @property {number} maxwords The maximum number of words.
 *
 * @typedef SharedLabelProperties
 * @type {object}
 * @property {boolean} [isPageHeading] Whether the label also acts as the heading for the page.
 * @property {string} [classes] Classes to add to the label tag.
 *
 * @typedef LimitTextProperties
 * @type {object}
 * @property {string} other
 * @property {string} [one]
 * @property {string} [two]
 * @property {string} [few]
 * @property {string} [many]
 *
 * @typedef CountMessageProperties
 * @type {object}
 * @property {string} [classes]	Classes to add to the count message.
 *
 * @typedef FormGroupProperties
 * @type {object}
 * @property {string} [classes] Classes to add to the form group (for example to show error state for the whole group).
 */

/**
 * @typedef checkboxProperties
 * - Let users select one or more options by using the checkboxes component.
 * - Documentation: https://design-system.service.gov.uk/components/checkboxes/
 * @type {object}
 * @property {string} [describedBy]	One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 * @property {FieldsetProperties} [fieldset] Options for the fieldset component (for example legend). See: https://design-system.service.gov.uk/components/fieldset/
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component (for example text).
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup]
 * @property {string} [idPrefix] String to prefix id for each checkbox item if no id is specified on each item. If not passed, fall back to using the name option instead.
 * @property {string} name Name attribute for all checkbox items.
 * @property {CheckboxItemsProperties[]} items
 */
/**
 * @typedef CheckboxItemsProperties
 * Documentation: https://design-system.service.gov.uk/components/checkboxes/#options-checkboxes-example--items
 * @type {SharedCheckboxItemsProperties & TextProperty | SharedCheckboxItemsProperties & HtmlProperty}
 */
/**
 * @typedef SharedCheckboxItemsProperties
 * @type {object}
 * @property {string} [id] 	Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 * @property {string} [name] Specific name for the checkbox item. If omitted, then component global name string will be applied.
 * @property {string} value Value for the checkbox input.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} [label] 	Provide attributes and classes to each checkbox item label. See: https://design-system.service.gov.uk/components/checkboxes/#options-checkboxes-example--label
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Provide hint to each checkbox item.
 * @property {string} [divider] Divider text to separate checkbox items, for example the text 'or'.
 * @property {boolean} [checked] Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 * @property {ConditionalProperties} [conditional] 	Provide additional content to reveal when the checkbox is checked.
 * @property {string} [behaviour] If set to exclusive, implements a 'None of these' type behaviour via JavaScript when checkboxes are clicked.
 * @property {boolean} [disabled] If true, checkbox will be disabled.
 *
 * @typedef ConditionalProperties
 * @type {object}
 * @property {string} html The HTML to reveal when the checkbox is checked
 */

/**
 * @typedef CookieBannerProperties
 * ⚠️ Experimental
 * - Allow users to accept or reject cookies which are not essential to making your service work.
 * - Documentation: https://design-system.service.gov.uk/components/cookie-banner/
 * @type {object}
 * @property {string} [ariaLabel] The text for the aria-label which labels the cookie banner region. This region applies to all messages that the cookie banner includes. For example, the cookie message and the confirmation message. Defaults to 'Cookie banner'.
 * @property {boolean} [hidden] Defaults to false. If you set this option to true, the whole cookie banner is hidden, including all messages within the banner. You can use hidden for client-side implementations where the cookie banner HTML is present, but hidden until the cookie banner is shown using JavaScript.
 * @property {string} [classes] The additional classes that you want to add to the cookie banner.
 * @property {MessagesProperties[]} messages
 *
 * @typedef MessagesProperties
 * @type {SharedMessagesProperties & HeadingTextProperty & TextProperty | SharedMessagesProperties & HeadingHtmlProperty & HtmlProperty}
 *
 * @typedef SharedMessagesProperties
 * @type {object}
 * @property {ActionProperties[]} [actions] The buttons and links that you want to display in the message. actions defaults to button unless you set href, which renders the action as a link.
 * @property {boolean} [hidden] Defaults to false. If you set it to true, the message is hidden. You can use hidden for client-side implementations where the confirmation message HTML is present, but hidden on the page.
 * @property {string} [role] Set role to alert on confirmation messages to allow assistive tech to automatically read the message. You will also need to move focus to the confirmation message using JavaScript you have written yourself
 * @property {string} [classes] The additional classes that you want to add to the message.
 *
 * @typedef ActionProperties
 * @type {object}
 * @property {string} text The button or link text.
 * @property {string} [type] The type of button. You can set button or submit. Set button and href to render a link styled as a button. If you set href, it overrides submit.
 * @property {string} [href] The href for a link. Set button and href to render a link styled as a button.
 * @property {string} [name] The name attribute for the button. Does not apply if you set href, which makes a link.
 * @property {string} [value] The value attribute for the button. Does not apply if you set href, which makes a link.
 * @property {string} [classes] The additional classes that you want to add to the button or link.
 *
 * @typedef HeadingTextProperty
 * @type {object}
 * @property {string} headingText The heading text that displays in the message. You can use any string with this option.
 *
 * @typedef HeadingHtmlProperty
 * @type {object}
 * @property {string} headingHtml The heading html that displays in the message. You can use any string with this option.
 */

/**
 * @typedef DateInputProperties
 * - Use the date input component to help users enter a memorable date or one they can easily look up.
 * - Documentation: https://design-system.service.gov.uk/components/date-input/
 * @type {object}
 * @property {string} id This is used for the main component and to compose the ID attribute for each item.
 * @property {string} [namePrefix] Optional prefix. This is used to prefix each item.name using -.
 * @property {DateInputItem[]} [items] 	An array of input objects with name, value and classes.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper.
 * @property {FieldsetProperties} [fieldset] Options for the fieldset component (for example legend).
 * @property {string} [classes] Classes to add to the date-input container.
 *
 * @typedef DateInputItem
 * @type {object}
 * @property {string} [id] Item-specific ID. If provided, it will be used instead of the generated ID.
 * @property {string} name Item-specific name attribute.
 * @property {string} [label] Item-specific label text. If provided, this will be used instead of name for item label text.
 * @property {string} [value] If provided, it will be used as the initial value of the input.
 * @property {string} [autocomplete] Attribute to identify input purpose, for instance bday-day. See https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill for full list of attributes that can be used.
 * @property {string} [pattern] Attribute to provide a regular expression pattern, used to match allowed character combinations for the input value.
 * @property {string} [classes] Classes to add to date input item.
 */

/**
 * @typedef DetailsProperties
 * - Make a page easier to scan by letting users reveal more detailed information only if they need it.
 * - Documentation: https://design-system.service.gov.uk/components/details/
 * @type {SharedDetailsProperties & SummaryTextProperty & TextProperty | SharedDetailsProperties & SummaryTextProperty & HtmlProperty | SharedDetailsProperties & SummaryHtmlProperty & HtmlProperty }
 *
 * @typedef SharedDetailsProperties
 * @type {object}
 * @property {string} [id] ID to add to the details element.
 * @property {boolean} [open] If true, details element will be expanded.
 * @property {string} [classes] Classes to add to the <details> element.
 *
 * @typedef SummaryTextProperty
 * @type {object}
 * @property {string} summaryText Text to use within the summary element (the visible part of the details element).
 *
 * @typedef SummaryHtmlProperty
 * @type {object}
 * @property {string} summaryHtml Html to use within the summary element (the visible part of the details element).
 */

/**
 * @typedef ErrorSummaryProperties
 * - Use this component at the top of a page to summarise any errors a user has made.
 * - When a user makes an error, you must show both an error summary and an error message next to each answer that contains an error.
 * - Documentation: https://design-system.service.gov.uk/components/error-summary/
 * @type {SharedErrorSummaryProperties & TitleTextProperty & DescriptionTextProperty | SharedErrorSummaryProperties & TitleHtmlProperty & DescriptionHtmlProperty}
 *
 * @typedef SharedErrorSummaryProperties
 * @type {object}
 * @property {ErrorItemProperties[]} errorList The list of errors to include in the summary
 * @property {boolean} [disableAutoFocus] Prevent moving focus to the error summary when the page loads.
 * @property {string} [classes] Classes to add to the error-summary container.
 *
 * @typedef ErrorItemProperties
 * @type {SharedErrorItemProperty & TextProperty | SharedErrorItemProperty & HtmlProperty}
 *
 * @typedef SharedErrorItemProperty
 * @type {object}
 * @property {string} [href] Href attribute for the error link item. If provided item will be an anchor.
 *
 * @typedef TitleTextProperty
 * @type {object}
 * @property {string} titleText Text to use for the heading of the error summary block.
 *
 * @typedef TitleHtmlProperty
 * @type {object}
 * @property {string} titleHtml HTML to use for the heading of the error summary block.
 *
 * @typedef DescriptionTextProperty
 * @type {object}
 * @property {string} descriptionText Text to use for the description of the errors.
 *
 * @typedef DescriptionHtmlProperty
 * @type {object}
 * @property {string} descriptionHtml HTML to use for the description of the errors.
 */

/**
 * @typedef ExitThisPageProperties
 * ⚠️ Experimental
 * - Give users a way to quickly and safely exit a service, website or application.
 * - Documentation: https://design-system.service.gov.uk/components/exit-this-page/
 * @type {SharedExitThisPageProperties & TextProperty | SharedExitThisPageProperties & HtmlProperty}
 *
 * @typedef SharedExitThisPageProperties
 * @type {object}
 * @property {string} [redirectUrl] URL to redirect the current tab to. Defaults to https://www.bbc.co.uk/weather.
 * @property {string} [id] ID attribute to add to the exit this page container.
 * @property {string} [classes] Classes to add to the exit this page container.
 * @property {string} [activatedText] Text announced by screen readers when Exit this Page has been activated via the keyboard shortcut. Defaults to 'Exiting page.'
 * @property {string} [timedOutText] Text announced by screen readers when the keyboard shortcut has timed out without successful activation. Defaults to 'Exit this page expired.'
 * @property {string} [pressTwoMoreTimesText] Text announced by screen readers when the user must press Shift two more times to activate the button. Defaults to 'Shift, press 2 more times to exit.'
 * @property {string} [pressOneMoreTimeText] Text announced by screen readers when the user must press Shift one more time to activate the button. Defaults to 'Shift, press 1 more time to exit.'
 *
 */

/**
 * @typedef FileUploadProperties
 * - Help users select and upload a file.
 * - Documentation: https://design-system.service.gov.uk/components/file-upload/
 * @type {object}
 * @property {string} name The name of the input, which is submitted with the form data.
 * @property {string} id The ID of the input.
 * @property {string} [value] Optional initial value of the input.
 * @property {boolean} [disabled] If true, file input will be disabled.
 * @property {string} [describedBy] One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} label Options for the label component.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper
 * @property {string} [classes] Classes to add to the file upload component.
 */

/**
 * @typedef InsetTextProperties
 * - Documentation: https://design-system.service.gov.uk/components/inset-text/
 * @type {SharedInsetTextProperties & TextProperty | SharedInsetTextProperties & HtmlProperty}
 *
 * @typedef SharedInsetTextProperties
 * @type {object}
 * @property {string} [id] ID attribute to add to the inset text container.
 * @property {string} [classes] Classes to add to the inset text container.
 */

/**
 * @typedef NotificationBannerProperties
 * ⚠️ Experimental
 * - Use a notification banner to tell the user about something they need to know about, but that’s not directly related to the page content.
 * - Documentation: https://design-system.service.gov.uk/components/notification-banner/
 * @type {SharedNotificationBannerProperties & TitleTextProperty & TextProperty | SharedNotificationBannerProperties & TitleHtmlProperty & HtmlProperty}
 *
 * @typedef SharedNotificationBannerProperties
 * @type {object}
 * @property {1 | 2 | 3 | 4 | 5 | 6} [titleHeadingLevel] Sets heading level for the title only. You can only use values between 1 and 6 with this option. The default is 2.
 * @property {string} [type] The type of notification to render. You can use only the success or null values with this option. If you set type to success, the notification banner sets role to alert. JavaScript then moves the keyboard focus to the notification banner when the page loads. If you do not set type, the notification banner sets role to region.
 * @property {string} [role] Overrides the value of the role attribute for the notification banner. Defaults to region. If you set type to success, role defaults to alert.
 * @property {string} [titleId] The id for the banner title, and the aria-labelledby attribute in the banner. Defaults to govuk-notification-banner-title.
 * @property {boolean} [disabledAutoFocus] If you set type to success, or role to alert, JavaScript moves the keyboard focus to the notification banner when the page loads. To disable this behaviour, set disableAutoFocus to true.
 * @property {string} [classes] The classes that you want to add to the notification banner.
 */

/**
 * @typedef PaginationProperties
 * - Help users navigate forwards and backwards through a series of pages.
 * - Documentation: https://design-system.service.gov.uk/components/pagination
 * @type {object}
 * @property {PaginationItemProperties[]} [items] The array of link objects.
 * @property {PaginationNavigationProperties} [previous] A link to the previous page, if there is a previous page.
 * @property {PaginationNavigationProperties} [next] A link to the next page, if there is a next page.
 * @property {string} [landmarkLabel] The label for the navigation landmark that wraps the pagination. Defaults to 'results'.
 * @property {string} [classes] The classes you want to add to the pagination nav parent.
 *
 * @typedef PaginationItemProperties
 * @type {object}
 * @property {string} [number] The pagination item text - usually a page number.
 * @property {string} [visuallyHiddenText] The visually hidden label (for the pagination item) which will be applied to an aria-label and announced by screen readers on the pagination item link. Should include page number.
 * @property {string} href The link's URL.
 * @property {boolean} [current] Set to true to indicate the current page the user is on.
 * @property {boolean} [ellipsis] Use this option if you want to specify an ellipsis at a given point between numbers. If you set this option as true, any other options for the item are ignored.
 *
 * @typedef PaginationNavigationProperties
 * @type {object}
 * @property {string} [text] The link text. Defaults to 'Previous page' or 'Next page', where 'page' is visually hidden.
 * @property {string} [labelText] The optional label that goes underneath the link, providing further context for the user about where the link goes.
 * @property {string} href The URL
 */

/**
 * @typedef PanelProperties
 * - The panel component is a visible container used on confirmation or results pages to highlight important content.
 * - Documentation: https://design-system.service.gov.uk/components/panel/
 * @type {SharedPanelProperties & TitleTextProperty & TextProperty | SharedPanelProperties & TitleHtmlProperty & HtmlProperty}
 *
 * @typedef SharedPanelProperties
 * @type {object}
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel] Heading level, from 1 to 6. Default is 1.
 * @property {string} [classes] Classes to add to the panel container.
 */

/**
 * @typedef RadioProperties
 * - Use the radios component when users can only select one option from a list.
 * - Documentation: https://design-system.service.gov.uk/components/radios/
 * @type {object}
 * @property {FieldsetProperties} [fieldset] Options for the fieldset component (for example legend).
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper.
 * @property {string} [idPrefix] String to prefix ID for each radio item if no ID is specified on each item. If idPrefix is not passed, fallback to using the name attribute instead.
 * @property {string} name Name attribute for each radio item.
 * @property {RadioItem[]} items Array of radio items objects.
 * @property {string} [value] The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 * @property {string} [classes] Classes to add to the radio container.
 *
 * @typedef RadioItem
 * @type {SharedRadioItemProperties & (TextRadioProperty | DividerProperty) | SharedRadioItemProperties & (HtmlRadioProperty | DividerProperty)}
 *
 * @typedef SharedRadioItemProperties
 * @type {object}
 * @property {string} [id] Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} [label] Provide attributes and classes to each radio item label.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Provide hint to each radio item.
 * @property {boolean} [checked] Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 * @property {ConditionalProperties} [conditional] Provide additional content to reveal when the radio is checked.
 * @property {boolean} [disabled] If true, radio will be disabled.
 *
 * @typedef TextRadioProperty
 * @type {object}
 * @property {string} text
 * @property {string} value
 *
 * @typedef HtmlRadioProperty
 * @type {object}
 * @property {string} html
 * @property {string} value
 *
 * @typedef DividerProperty
 * @property {string} divider Divider text to separate radio items, for example the text 'or'.
 */

/**
 * @typedef SelectProperties
 * - The select component should only be used as a last resort in public-facing services because research shows that some users find selects very difficult to use.
 * - Documentation: https://design-system.service.gov.uk/components/select/
 * @type {object}
 * @property {string} id ID for each select box.
 * @property {string} name Name property for the select.
 * @property {SelectItemProperties[]} items Array of option items for the select.
 * @property {string} [value] Value for the option which should be selected. Use this as an alternative to setting the selected option on each individual item.
 * @property {boolean} [disabled] If true, select box will be disabled. Use the disabled option on each individual item to only disable certain options.
 * @property {string} [describedBy] One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} [label] Label text or HTML by specifying value for either text or html keys.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper.
 *
 * @typedef SelectItemProperties
 * @type {object}
 * @property {string} [value] Value for the option item. Defaults to an empty string.
 * @property {string} text Text for the option item.
 * @property {boolean} [selected] Whether the option should be selected when the page loads. Takes precedence over the top-level value option.
 * @property {boolean} [disabled] Sets the option item as disabled.
 *
 */

/**
 * @typedef SkipLinkProperties
 * - Use the skip link component to help keyboard-only users skip to the main content on a page.
 * - Documentation: https://design-system.service.gov.uk/components/skip-link/
 * @type {SharedSkipLinkProperties & TextProperty | SharedSkipLinkProperties & HtmlProperty}
 *
 * @typedef SharedSkipLinkProperties
 * @type {object}
 * @property {string} [href] The value of the skip link’s href attribute. Defaults to #content if you do not provide a value.
 * @property {string} [classes] Classes to add to the skip link.
 */

/**
 * @typedef SummaryListProperties
 * @type {object}
 * @property {SummaryListRowProperties[]} rows Array of row item objects
 * @property {CardProperties} [card] Options for the summary card. If any of these options are present, a summary card will wrap around the summary list.
 * @property {string} [classes] Classes to add to the container.
 *
 * @typedef SummaryListRowProperties
 * @type {object}
 * @property {string} [classes] Classes to add to the row div.
 * @property {TextProperty & ClassesProperty | HtmlProperty & ClassesProperty} key Text/Html to use within the each key.
 * @property {TextProperty & ClassesProperty | HtmlProperty & ClassesProperty} value Text/Html to use within the each value.
 * @property {{items: ActionItemProperties[]}} [actions]
 *
 * @typedef ClassesProperty
 * @type {object}
 * @property {string} [classes] Classes to add
 *
 * @typedef ActionItemProperties
 * @type {SharedActionItemProperties & TextProperty | SharedActionItemProperties & HtmlProperty}
 *
 * @typedef SharedActionItemProperties
 * @type {object}
 * @property {string} href The value of the link's href attribute for an action item.
 * @property {string} [visuallyHiddenText] Actions rely on context from the surrounding content so may require additional accessible text. Text supplied to this option is appended to the end. Use html for more complicated scenarios.
 * @property {string} [classes] Classes to add to the action item.
 *
 * @typedef CardProperties
 * @type {object}
 * @property {SummaryCardTitleProperties} [title] Data for the summary card header.
 * @property {SummaryCardActionProperty} [actions] Data for the summary card actions
 * @property {string} [classes] Classes to add to the container.
 *
 * @typedef SummaryCardTitleProperties
 * @type {object}
 * @property {string} [text] Text to use within the each title. If html is provided, the text option will be ignored.
 * @property {string} [html] Text to use within the each title. If html is provided, the text option will be ignored.
 * @property {1|2|3|4|5|6} [headingLevel] Heading level, from 1 to 6. Default is 2.
 * @property {string} [classes] Classes to add to the title wrapper.
 *
 * @typedef SummaryCardActionProperty
 * @type {object}
 * @property {ActionItemProperties[]} items Array of action item objects.
 * @property {string} [classes] Classes to add to the actions wrapper.
 *
 */

/**
 * @typedef TableProperties
 * - Use the table component to make information easier to compare and scan for users.
 * - Documentation: https://design-system.service.gov.uk/components/table/
 * @type {object}
 * @property {TableRowProperties[]} rows Array of table rows and cells.
 * @property {TableHeadProperties[]} head Array of table head cells.
 * @property {string} [caption] Caption text
 * @property {string} [captionClasses] Classes for caption text size. Classes should correspond to the available typography heading classes.
 * @property {boolean} [firstCellIsHeader] If set to true, first cell in table row will be a TH instead of a TD.
 * @property {string} [classes] Classes to add to the table container.
 *
 * @typedef TableRowProperties
 * @type {SharedTableRowProperties & TextProperty | SharedTableRowProperties & HtmlProperty}
 *
 * @typedef SharedTableRowProperties
 * @type {object}
 * @property {string} [format] Specify format of a cell. Currently we only use "numeric".
 * @property {string} [classes] Classes to add to the table row cell.
 * @property {number} [colspan] Specify how many columns a cell extends.
 * @property {number} [rowspan] Specify how many rows a cell extends.
 *
 * @typedef TableHeadProperties
 * @type {SharedTableHeadProperties & TextProperty | SharedTableHeadProperties & HtmlProperty}
 *
 * @typedef SharedTableHeadProperties
 * @type {object}
 * @property {string} [format] Specify format of a cell. Currently we only use "numeric".
 * @property {string} [classes] Classes to add to the table head cell.
 * @property {number} [colspan] Specify how many columns a cell extends.
 * @property {number} [rowspan] Specify how many rows a cell extends.
 *
 */

/**
 * @typedef TabsProperties
 * ⚠️ Experimental
 * - The tabs component lets users navigate between related sections of content, displaying one section at a time.
 * - Documentation: https://design-system.service.gov.uk/components/tabs/
 * @type {object}
 * @property {string} [id] This is used for the main component and to compose the ID attribute for each item.
 * @property {string} [idPrefix] String to prefix id for each tab item if no id is specified on each item.
 * @property {string} [title] Title for the tabs table of contents.
 * @property {TabsItemProperties[]} items Array of tab items.
 * @property {string} [classes] Classes to add to the tabs component.
 *
 * @typedef TabsItemProperties
 * @type {object}
 * @property {string} id Specific ID attribute for the tab item. If omitted, then idPrefix string is required instead.
 * @property {string} label The text label of a tab item.
 * @property {TabItemPanelProperties} panel Content for the panel
 *
 * @typedef TabItemPanelProperties
 * @type {TextProperty | HtmlProperty}
 */

/**
 * @typedef TagProperties
 * - Use the tag component to show users the status of something.
 * - Documentation: https://design-system.service.gov.uk/components/tag/
 * @type {SharedTagProperties & TextProperty | SharedTagProperties & HtmlProperty}
 *
 * @typedef SharedTagProperties
 * @type {object}
 * @property {string} [classes]
 */

/**
 * @typedef TextInputProperties
 * - Use the text input component when you need to let users enter text that’s no longer than a single line, such as their name or phone number.
 * - Documentation: https://design-system.service.gov.uk/components/text-input/
 * @type {object}
 * @property {string} [id] The ID of the input.
 * @property {string} name The name of the input, which is submitted with the form data.
 * @property {string} [type] Type of input control to render, for example, a password input control. Defaults to text.
 * @property {string} [inputmode] https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
 * @property {string} [value] Optional initial value of the input.
 * @property {boolean} [disabled] If true, input will be disabled.
 * @property {string} [describedBy] One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} [label] Options for the label component.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {TextProperty & ClassesProperty | HtmlProperty & ClassesProperty} [prefix] Options for the prefix element.
 * @property {TextProperty & ClassesProperty | HtmlProperty & ClassesProperty} [suffix] Options for the suffix element.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper.
 * @property {string} [classes] Classes to add to the input.
 * @property {string} [autocomplete] Attribute to identify input purpose, for instance "postal-code" or "username". See autofill for full list of attributes that can be used.
 * @property {string} [pattern] Attribute to provide a regular expression pattern, used to match allowed character combinations for the input value.
 * @property {boolean} [spellcheck] Optional field to enable or disable the spellcheck attribute on the input.
 */

/**
 * @typedef TextAreaProperties
 * - Use the textarea component when you need to let users enter an amount of text that’s longer than a single line.
 * - Documentation: https://design-system.service.gov.uk/components/textarea/
 * @type {object}
 * @property {string} id The ID of the textarea.
 * @property {string} name The name of the textarea, which is submitted with the form data.
 * @property {boolean} [spellcheck] Optional field to enable or disable the spellcheck attribute on the textarea.
 * @property {string} [rows] Optional number of textarea rows (default is 5 rows).
 * @property {string} [value] Optional initial value of the textarea.
 * @property {boolean} [disabled] If true, textarea will be disabled.
 * @property {string} [describedBy] One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 * @property {SharedLabelProperties & TextProperty | SharedLabelProperties & HtmlProperty} label Options for the label component.
 * @property {SharedHintProperties & TextProperty | SharedHintProperties & HtmlProperty} [hint] Options for the hint component.
 * @property {SharedErrorMessageProperties & TextProperty | SharedErrorMessageProperties & HtmlProperty} [errorMessage] Options for the error message component. The error message component will not display if you use a falsy value for errorMessage, for example false or null.
 * @property {FormGroupProperties} [formGroup] Options for the form-group wrapper.
 * @property {string} [classes] Classes to add to the textarea.
 * @property {string} [autocomplete] Attribute to identify input purpose, for example postal-code or username. See autofill for full list of attributes that can be used.
 *
 */

/**
 * @typedef WarningTextProperties
 * - Use the warning text component when you need to warn users about something important, such as legal consequences of an action, or lack of action, that they might take.
 * - Documentation: https://design-system.service.gov.uk/components/warning-text/
 * @type {SharedWarningTextProperties & TextProperty | SharedWarningTextProperties & HtmlProperty}
 *
 * @typedef SharedWarningTextProperties
 * @type {object}
 * @property {string} [iconFallbackText] The fallback text for the icon. Defaults to 'Warning'
 * @property {string} [classes] Classes to add to the warning text.
 */
