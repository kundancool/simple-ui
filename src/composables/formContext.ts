import { computed, inject, provide, ref, type ComputedRef, type Ref } from 'vue'

/**
 * Shared form context (spec §2.3).
 *
 * Inputs inherit `size` from the enclosing form item so a form row stays on one
 * scale without repeating the prop, and `scrollToFirstError()` can bring the
 * first invalid field into view after a server round-trip.
 */
export type FormSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type LabelPosition = 'top' | 'left'

export interface FormItemHandle {
    element: () => HTMLElement | null
    hasError: () => boolean
}

export interface FormContext {
    labelPosition: Ref<LabelPosition>
    labelWidth: Ref<string>
    size: Ref<FormSize | undefined>
    disabled: Ref<boolean>
    registerItem: (item: FormItemHandle) => () => void
    scrollToFirstError: () => void
}

export interface FormItemContext {
    /** id shared by the label's `for` and the control's `id`. */
    inputId: string
    size: ComputedRef<FormSize>
    disabled: ComputedRef<boolean>
    hasError: ComputedRef<boolean>
}

export const FORM_CONTEXT = 's-form'
export const FORM_ITEM_CONTEXT = 's-form-item'
export const DEFAULT_FORM_SIZE: FormSize = 'md'

export function provideFormContext(context: FormContext): void {
    provide(FORM_CONTEXT, context)
}

export function useFormContext(): FormContext | null {
    return inject<FormContext | null>(FORM_CONTEXT, null)
}

export function provideFormItemContext(context: FormItemContext): void {
    provide(FORM_ITEM_CONTEXT, context)
}

export function useFormItemContext(): FormItemContext | null {
    return inject<FormItemContext | null>(FORM_ITEM_CONTEXT, null)
}

/**
 * Resolve a control's size: its own prop wins, then the form item, then the
 * form default.
 */
export function useFieldSize(own: Ref<string | undefined> | ComputedRef<string | undefined>) {
    const item = useFormItemContext()
    return computed<FormSize>(() => (own.value as FormSize) ?? item?.size.value ?? DEFAULT_FORM_SIZE)
}

export function useFieldDisabled(own: Ref<boolean> | ComputedRef<boolean>) {
    const item = useFormItemContext()
    return computed(() => own.value || (item?.disabled.value ?? false))
}

/**
 * The id a control should use. Inside a form item it is the item's id so the
 * surrounding `<label for>` points at the control; otherwise a fresh one.
 */
export function useFieldId(fallback: () => string) {
    const item = useFormItemContext()
    const own = ref('')
    return computed(() => item?.inputId ?? (own.value || (own.value = fallback())))
}
