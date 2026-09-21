/**
 * On-demand resolver for `unplugin-vue-components`.
 *
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { SimpleUIResolver } from '@kundancool/simple-ui/resolver'
 *
 * export default {
 *     plugins: [Components({ resolvers: [SimpleUIResolver()] })],
 * }
 * ```
 *
 * `<s-input>` in a template then auto-imports the component. Import the
 * stylesheet once in your entry: `@kundancool/simple-ui/dist/simple-ui.css`.
 */

const COMPONENTS = [
    'SAccordion',
    'SAlert',
    'SAvatar',
    'SBadge',
    'SBlogCard',
    'SDescriptions',
    'SEmpty',
    'SProgress',
    'SRating',
    'SSegmented',
    'STimeline',
    'SToc',
    'SAnsiRenderer',
    'SAuthLayout',
    'SBarChart',
    'SBreadcrumb',
    'SButton',
    'SCarousel',
    'SCta',
    'SCard',
    'SCheckbox',
    'SCodeViewer',
    'SConfirmByNameDialog',
    'SConfirmDialog',
    'SCopy',
    'SDataTable',
    'SDataTableColumn',
    'SDatePicker',
    'SDateRangePicker',
    'SDialog',
    'SDoughnutChart',
    'SDropdownMenu',
    'SFeature',
    'SFilter',
    'SForm',
    'SFormItem',
    'SFooter',
    'SHoverPopover',
    'SGallery',
    'SIcon',
    'SInput',
    'SLightbox',
    'SLayout',
    'SLineChart',
    'SMarquee',
    'SMultiSelect',
    'SNewsletter',
    'SNumberInput',
    'SPageHeader',
    'SPagination',
    'SRelativeTime',
    'SSelect',
    'SSearchPalette',
    'SSpinner',
    'SSectionHeading',
    'SSidebar',
    'SSidebarMenu',
    'SSkeleton',
    'SStatCard',
    'SSteps',
    'SSwitch',
    'STabs',
    'STag',
    'STestimonial',
    'SToast',
    'SToastContainer',
]

function kebab(name) {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export interface SimpleUIResolverOptions {
    /** Import path prefix. Defaults to the published package name. */
    packageName?: string
}

export function SimpleUIResolver(options: SimpleUIResolverOptions = {}) {
    const pkg = options.packageName ?? '@kundancool/simple-ui'
    return {
        type: 'component',
        resolve: (name) => {
            const hit = COMPONENTS.find((c) => c === name || kebab(c) === name.toLowerCase())
            if (!hit) {
                return undefined
            }
            return { name: hit, from: pkg }
        },
    }
}

export default SimpleUIResolver
