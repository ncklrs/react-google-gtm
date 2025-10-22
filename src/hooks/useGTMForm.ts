// src/hooks/useGTMForm.ts
import { useCallback } from "react";
import { useGTMContext } from "../context/GTMContext";

export interface GTMFormHandlers {
  onSubmit: (event: React.FormEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: (event: React.FocusEvent) => void;
  onBlur: (event: React.FocusEvent) => void;
}

export interface UseGTMFormOptions {
  formId: string;
  trackChange?: boolean;
  trackFocus?: boolean;
  trackBlur?: boolean;
  onSubmitCallback?: (event: React.FormEvent) => void;
  onChangeCallback?: (event: React.ChangeEvent) => void;
}

/**
 * Hook to track form interactions
 *
 * @param options - Configuration options
 * @returns Form event handlers
 *
 * @example
 * ```tsx
 * const { onSubmit, onChange } = useGTMForm({
 *   formId: 'contact_form',
 *   trackChange: true
 * });
 *
 * return (
 *   <form onSubmit={onSubmit}>
 *     <input onChange={onChange} />
 *     <button type="submit">Submit</button>
 *   </form>
 * );
 * ```
 */
export const useGTMForm = (options: UseGTMFormOptions): GTMFormHandlers => {
  const { sendEvent } = useGTMContext();
  const {
    formId,
    trackChange = false,
    trackFocus = false,
    trackBlur = false,
    onSubmitCallback,
    onChangeCallback,
  } = options;

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      sendEvent({
        event: "form_submission",
        form_id: formId,
      });

      if (onSubmitCallback) {
        onSubmitCallback(event);
      }
    },
    [sendEvent, formId, onSubmitCallback]
  );

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (trackChange) {
        const target = event.target;
        sendEvent({
          event: "form_field_change",
          form_id: formId,
          field_name: target.name || target.id,
          field_type: target.type,
        });
      }

      if (onChangeCallback) {
        onChangeCallback(event);
      }
    },
    [sendEvent, formId, trackChange, onChangeCallback]
  );

  const onFocus = useCallback(
    (event: React.FocusEvent) => {
      if (trackFocus) {
        const target = event.target as HTMLInputElement;
        sendEvent({
          event: "form_field_focus",
          form_id: formId,
          field_name: target.name || target.id,
        });
      }
    },
    [sendEvent, formId, trackFocus]
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      if (trackBlur) {
        const target = event.target as HTMLInputElement;
        sendEvent({
          event: "form_field_blur",
          form_id: formId,
          field_name: target.name || target.id,
        });
      }
    },
    [sendEvent, formId, trackBlur]
  );

  return {
    onSubmit,
    onChange,
    onFocus,
    onBlur,
  };
};
